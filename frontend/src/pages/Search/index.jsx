import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigationType } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SearchHeroHeader } from "./SearchHeroHeader";
import { SearchFilterBar } from "./SearchFilterBar";
import { FeaturedSpeciesSlider } from "./FeaturedSpeciesSlider";
import { SearchGridList } from "./SearchGridList";
import { OceanFunFacts } from "./OceanFunFacts";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";
import { searchSemantic, searchSpeciesByImage } from "../../services/ecosystemApi";
import { fetchSpeciesList } from "../../services/speciesApi";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

const STATUS_RANK = {
  CR: 1,
  EN: 2,
  VU: 3,
  NT: 4,
  LC: 5,
  DD: 6,
  NE: 7,
};

// Trích xuất độ sâu tối đa (mét) để sắp xếp số học chuẩn xác từ vùng cạn đến biển sâu
const parseDepthMax = (item) => {
  if (item?.depthMax != null && !isNaN(Number(item.depthMax))) {
    return Number(item.depthMax);
  }
  const match = String(item?.depth || "").match(/(\d+)\s*m/g);
  if (match && match.length > 0) {
    const last = match[match.length - 1].replace(/\D/g, "");
    return Number(last) || 0;
  }
  return 0;
};

// Đánh giá thứ bậc Sách Đỏ: Cực kỳ nguy cấp (CR) -> Nguy cấp (EN) -> Sắp nguy cấp (VU) -> Ít lo ngại (LC)
const getStatusRank = (item) => {
  const code = item?.vietnamRedListStatus || item?.conservationStatus || item?.redList || "";
  if (STATUS_RANK[code]) return STATUS_RANK[code];
  if (item?.statusType === "danger") return 1;
  if (item?.statusType === "warning") return 3;
  return 5;
};

export default function Search() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();
  const urlQuery = searchParams.get("q") || searchParams.get("search") || "";
  const selectedCategory =
    searchParams.get("category") || searchParams.get("cat") || "";
  const rawSortParam = searchParams.get("sort");
  const sortBy = rawSortParam || "az";
  const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const lastWrittenQueryRef = useRef(urlQuery);
  const lastExecutedSemanticRef = useRef("");
  const semanticRequestIdRef = useRef(0);
  const semanticAbortRef = useRef(null);
  const shouldRestoreScrollRef = useRef(
    navigationType === "POP" && currentPage > 1,
  );

  // Dữ liệu từ API Backend
  const [apiSpecies, setApiSpecies] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // State cho Tìm kiếm Ngữ nghĩa & Tìm kiếm bằng hình ảnh
  const [semanticResults, setSemanticResults] = useState(null);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semanticQuery, setSemanticQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Đồng bộ ô tìm kiếm khi URL thay đổi từ bên ngoài (Back/Forward, Landing hoặc link trực tiếp)
  useEffect(() => {
    if (urlQuery !== lastWrittenQueryRef.current) {
      lastWrittenQueryRef.current = urlQuery;
      setSearchTerm(urlQuery);
    }
  }, [urlQuery]);

  // Tự động kích hoạt Tìm kiếm Ngữ nghĩa khi truy cập trang với ?q=... từ Landing, F5 hoặc Back
  useEffect(() => {
    const trimmed = urlQuery.trim();
    if (trimmed.length >= 2 && trimmed !== lastExecutedSemanticRef.current) {
      executeSemanticSearch(trimmed, { skipScroll: true });
    } else if (!trimmed && lastExecutedSemanticRef.current) {
      lastExecutedSemanticRef.current = "";
      setSemanticResults(null);
      setSemanticQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  // Hủy request semantic còn treo khi rời trang
  useEffect(() => {
    return () => {
      semanticAbortRef.current?.abort();
    };
  }, []);

  // Tải danh sách sinh vật nền từ API (chỉ lọc theo urlQuery đã xác nhận, tránh spam khi đang gõ Telex/VNI)
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      setApiLoading(true);
      fetchSpeciesList({
        search: urlQuery,
        category: selectedCategory,
        sortBy: sortBy,
        limit: 500,
      })
        .then((res) => {
          if (!isMounted) return;
          if (res && res.success && Array.isArray(res.data)) {
            const mapped = res.data.map((s) => {
              const redList = s.vietnamRedListStatus || s.conservationStatus || "LC";
              const statusType =
                redList === "CR" || redList === "EN"
                  ? "danger"
                  : redList === "VU" || redList === "NT"
                  ? "warning"
                  : "safe";

              return {
                id: s.id,
                slug: s.slug || s.id,
                category: s.group?.slug || s.group?.name || "",
                categoryVi: s.group?.name || "Sinh vật biển",
                categoryEn: getLocalizedCategory(s.group?.name, "en"),
                statusVi: s.vietnamRedListStatus || "Ít quan tâm",
                statusEn: s.vietnamRedListStatus || "Least Concern",
                statusType,
                nameVi: s.commonName,
                nameEn: getLocalizedSpeciesName(s, "en"),
                sciName: s.scientificName,
                descVi:
                  s.description ||
                  (s.diet ? `Tập tính ăn: ${s.diet}.` : "") ||
                  `Phân bố tự nhiên tại vùng biển ${s.eastSeaZone || "Biển Đông"}.`,
                descEn:
                  s.description ||
                  `Naturally distributed in ${s.eastSeaZone || "East Sea"}.`,
                image: s.image,
                depth:
                  s.depthMin != null || s.depthMax != null
                    ? `${s.depthMin || 0} - ${s.depthMax || 100}m`
                    : "0 - 100m",
              };
            });
            setApiSpecies(mapped);
          }
        })
        .catch(() => {
          // Giữ null để fallback sang mock dữ liệu cục bộ
        })
        .finally(() => {
          if (isMounted) setApiLoading(false);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [urlQuery, selectedCategory, sortBy]);

  /* Fallback Filter & Sort Logic khi không có API */
  const fallbackSpecies = useMemo(() => {
    return SEARCH_SPECIES_CATALOG.filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      const matchNameVi = s.nameVi.toLowerCase().includes(term);
      const matchNameEn = s.nameEn.toLowerCase().includes(term);
      const matchSciName = s.sciName.toLowerCase().includes(term);
      const matchDescVi = s.descVi.toLowerCase().includes(term);
      const matchSearch =
        !term || matchNameVi || matchNameEn || matchSciName || matchDescVi;

      const matchCategory =
        !selectedCategory || s.category === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === "az") {
        const nameA = language === "en" ? a.nameEn : a.nameVi;
        const nameB = language === "en" ? b.nameEn : b.nameVi;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "depth") {
        return parseDepthMax(a) - parseDepthMax(b);
      }
      if (sortBy === "status") {
        return getStatusRank(a) - getStatusRank(b);
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, sortBy, language]);

  const activeCatalog = apiSpecies !== null ? apiSpecies : fallbackSpecies;

  // Khi có kết quả tìm kiếm ngữ nghĩa, chuyển hóa trực tiếp vào danh sách sinh vật chính
  // Hỗ trợ đầy đủ bộ lọc Nhóm loài (selectedCategory) và Sắp xếp (sortBy)
  const displayedSpecies = useMemo(() => {
    if (semanticResults && Array.isArray(semanticResults.data)) {
      if (semanticResults.data.length === 0) {
        return [];
      }

      const statusMap = {
        CR: { vi: "Cực kỳ nguy cấp", en: "Critically Endangered", type: "danger" },
        EN: { vi: "Nguy cấp", en: "Endangered", type: "danger" },
        VU: { vi: "Sắp nguy cấp", en: "Vulnerable", type: "warning" },
        NT: { vi: "Gần bị đe dọa", en: "Near Threatened", type: "warning" },
        LC: { vi: "Ít quan tâm", en: "Least Concern", type: "safe" },
        DD: { vi: "Thiếu dữ liệu", en: "Data Deficient", type: "safe" },
        NE: { vi: "Chưa đánh giá", en: "Not Evaluated", type: "safe" },
      };

      const mappedSemantic = semanticResults.data.map((item) => {
        const itemClean = (item.commonName || "").toLowerCase().trim();
        const sciClean = (item.scientificName || "").toLowerCase().trim();

        const matchedCatalog = activeCatalog.find((c) => {
          if (String(c.id) === String(item.id) || (item.slug && c.slug === item.slug)) return true;
          const cSci = (c.sciName || "").toLowerCase();
          if (sciClean && cSci && (cSci.includes(sciClean) || sciClean.includes(cSci))) return true;
          const cName = (c.nameVi || "").toLowerCase();
          if (itemClean && cName && (cName.includes(itemClean) || itemClean.includes(cName))) return true;
          return false;
        });

        const statusInfo = statusMap[item.redList] || {
          vi: matchedCatalog?.statusVi || "Ít quan tâm",
          en: matchedCatalog?.statusEn || "Least Concern",
          type: matchedCatalog?.statusType || "safe",
        };

        const categoryVi =
          matchedCatalog?.categoryVi ||
          item.groupName?.replace(/\(.*?\)/g, "").trim() ||
          "Cá biển";

        const categoryEn =
          matchedCatalog?.categoryEn ||
          getLocalizedCategory(categoryVi, "en");

        const categorySlug = item.groupSlug || matchedCatalog?.category || "";

        const realDescVi =
          matchedCatalog?.descVi ||
          item.description ||
          (item.diet ? `Tập tính ăn: ${item.diet}.` : "") ||
          `Phân bố tự nhiên tại vùng biển ${item.zone || "Biển Đông"}.`;

        const realDescEn =
          matchedCatalog?.descEn ||
          item.description ||
          `Naturally distributed in ${item.zone || "East Sea"}.`;

        return {
          id: matchedCatalog?.id || item.id,
          slug: item.slug || matchedCatalog?.slug || item.id,
          nameVi: matchedCatalog?.nameVi || item.commonName,
          nameEn: matchedCatalog?.nameEn || getLocalizedSpeciesName(item, "en"),
          sciName: matchedCatalog?.sciName || item.scientificName,
          category: categorySlug,
          categoryVi,
          categoryEn,
          statusVi: statusInfo.vi,
          statusEn: statusInfo.en,
          statusType: statusInfo.type,
          descVi: realDescVi,
          descEn: realDescEn,
          image: matchedCatalog?.image || item.image,
          depth: matchedCatalog?.depth || item.depth || "0 - 200m",
          depthMax: item.depthMax ?? matchedCatalog?.depthMax,
          vietnamRedListStatus: item.redList || matchedCatalog?.vietnamRedListStatus,
          role: item.role,
          semanticReason: item.semanticReason,
          matchScore: item.matchScore,
        };
      });

      const filteredByCategory = selectedCategory
        ? mappedSemantic.filter((item) => {
            const target = selectedCategory.toLowerCase();
            return (
              (item.category || "").toLowerCase() === target ||
              (item.categoryVi || "").toLowerCase().includes(target)
            );
          })
        : mappedSemantic;

      // Giữ nguyên thứ tự xếp hạng Hybrid RRF trừ khi người dùng chủ động chọn tiêu chí sắp xếp trên URL
      if (!rawSortParam) {
        return filteredByCategory;
      }

      return [...filteredByCategory].sort((a, b) => {
        if (sortBy === "az") {
          const nameA = language === "en" ? a.nameEn : a.nameVi;
          const nameB = language === "en" ? b.nameEn : b.nameVi;
          return nameA.localeCompare(nameB);
        }
        if (sortBy === "depth") {
          return parseDepthMax(a) - parseDepthMax(b);
        }
        if (sortBy === "status") {
          return getStatusRank(a) - getStatusRank(b);
        }
        return 0;
      });
    }
    return activeCatalog;
  }, [semanticResults, activeCatalog, selectedCategory, sortBy, rawSortParam, language]);

  const executeSemanticSearch = async (queryText, options = {}) => {
    const q = (queryText ?? searchTerm ?? "").trim();
    setImagePreview(null);

    // Hủy mọi truy vấn cũ đang bay để tránh ghi đè kết quả chập chờn
    if (semanticAbortRef.current) {
      semanticAbortRef.current.abort();
      semanticAbortRef.current = null;
    }

    if (!q || q.length < 2) {
      lastExecutedSemanticRef.current = "";
      setSemanticResults(null);
      setSemanticQuery("");
      setSemanticLoading(false);
      return;
    }

    const requestId = ++semanticRequestIdRef.current;
    const controller = new AbortController();
    semanticAbortRef.current = controller;

    lastExecutedSemanticRef.current = q;
    setSemanticLoading(true);
    setSemanticQuery(q);
    try {
      const res = await searchSemantic(q, controller.signal);
      if (res?.canceled || requestId !== semanticRequestIdRef.current) {
        return;
      }
      if (res && res.success) {
        setSemanticResults(res);
        if (!options.skipScroll && res.data && res.data.length > 0) {
          setTimeout(() => {
            document
              .getElementById("search-results")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      } else {
        setSemanticResults(null);
      }
    } catch (e) {
      if (requestId !== semanticRequestIdRef.current) return;
      console.warn("Lỗi semantic search:", e);
      setSemanticResults(null);
    } finally {
      if (requestId === semanticRequestIdRef.current) {
        setSemanticLoading(false);
      }
    }
  };

  const handleImageSearch = async ({ previewUrl, imageBase64, mimeType }) => {
    setImagePreview(previewUrl);
    setImageLoading(true);
    setSemanticLoading(true);
    setSemanticQuery("");
    setSearchTerm("");
    lastWrittenQueryRef.current = "";
    lastExecutedSemanticRef.current = "";
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: true },
    );

    try {
      const res = await searchSpeciesByImage({ imageBase64, mimeType });
      if (res && res.success) {
        setSemanticResults(res);
        setSemanticQuery(res.visualMatch?.speciesNameVi || res.query || "");
        setTimeout(() => {
          document
            .getElementById("search-results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setSemanticResults({
          success: true,
          outOfDomain: true,
          message: res?.message || "Không thể nhận diện hình ảnh lúc này.",
          data: [],
          suggestions: [],
        });
      }
    } catch (e) {
      console.warn("Lỗi tìm kiếm bằng hình ảnh:", e);
      setSemanticResults(null);
    } finally {
      setImageLoading(false);
      setSemanticLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newPage > 1) next.set("page", String(newPage));
        else next.delete("page");
        return next;
      },
      { replace: false },
    );
  };

  const handleCategoryChange = (cat) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("cat");
        if (cat) next.set("category", cat);
        else next.delete("category");
        next.delete("page");
        return next;
      },
      { replace: false },
    );
  };

  const handleSortChange = (sort) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (sort && sort !== "az") next.set("sort", sort);
        else next.delete("sort");
        next.delete("page");
        return next;
      },
      { replace: false },
    );
  };

  useEffect(() => {
    if (shouldRestoreScrollRef.current && !apiLoading && apiSpecies !== null) {
      shouldRestoreScrollRef.current = false;
      const timer = setTimeout(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [apiLoading, apiSpecies]);

  const handleSearchSubmit = (e, overrideTerm) => {
    if (e && e.preventDefault) e.preventDefault();
    const term = (overrideTerm ?? searchTerm).trim();
    lastWrittenQueryRef.current = term;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("search");
        if (term) next.set("q", term);
        else next.delete("q");
        next.delete("page");
        return next;
      },
      { replace: false },
    );
    executeSemanticSearch(term);
  };

  // Chỉ cập nhật state cục bộ khi đang gõ — tuyệt đối không đổi URL mỗi phím để bộ gõ tiếng Việt (Telex/VNI) luôn mượt
  const handleSearchTermChange = (val) => {
    setSearchTerm(val);
    if (val.trim() === "" && (semanticQuery || urlQuery)) {
      semanticAbortRef.current?.abort();
      lastExecutedSemanticRef.current = "";
      lastWrittenQueryRef.current = "";
      setSemanticResults(null);
      setSemanticQuery("");
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("q");
          next.delete("search");
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }
  };

  const handleClearSemantic = () => {
    lastExecutedSemanticRef.current = "";
    setSemanticResults(null);
    setSemanticQuery("");
    setImagePreview(null);
    setSearchTerm("");
    lastWrittenQueryRef.current = "";
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: false },
    );
  };

  const handleSuggestionSelect = (suggestionText) => {
    setImagePreview(null);
    setSearchTerm(suggestionText);
    handleSearchSubmit(null, suggestionText);
  };

  return (
    <div className="min-h-screen text-[#0f172a] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 relative z-10 pb-16">
        <SearchHeroHeader
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          onSearchSubmit={handleSearchSubmit}
          onImageSearch={handleImageSearch}
          imagePreview={imagePreview}
          onClearImage={handleClearSemantic}
          imageLoading={imageLoading}
        />

        <SearchFilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          sortBy={sortBy}
          setSortBy={handleSortChange}
        />

        {/* Chỉ hiển thị slider sinh vật tiêu biểu khi người dùng chưa nhập từ khóa hoặc ảnh tìm kiếm */}
        {!searchTerm && !urlQuery && !semanticQuery && !imagePreview && <FeaturedSpeciesSlider />}

        {/* ── DANH SÁCH SINH VẬT ĐÃ HỢP NHẤT TÌM KIẾM NGỮ NGHĨA ── */}
        <SearchGridList
          key={`${selectedCategory}|${sortBy}|${semanticQuery}|${imagePreview ? "img" : "txt"}`}
          speciesList={displayedSpecies}
          semanticQuery={semanticQuery}
          semanticMeta={semanticResults}
          imagePreview={imagePreview}
          onSuggestionClick={handleSuggestionSelect}
          onClearSemantic={handleClearSemantic}
          loading={semanticLoading || (apiLoading && apiSpecies === null)}
          loadingText={
            imageLoading
              ? language === "en"
                ? "Identifying marine species from uploaded photo..."
                : "Đang nhận diện đặc điểm sinh vật từ hình ảnh..."
              : undefined
          }
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <OceanFunFacts />
      </main>

      <Footer />
    </div>
  );
}
