import { useState, useMemo } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SearchHeroHeader } from "./SearchHeroHeader";
import { SearchFilterBar } from "./SearchFilterBar";
import { FeaturedSpeciesSlider } from "./FeaturedSpeciesSlider";
import { SearchGridList } from "./SearchGridList";
import { OceanFunFacts } from "./OceanFunFacts";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";
import { searchSemantic } from "../../services/ecosystemApi";

export default function Search() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("az");

  // State cho Tìm kiếm Ngữ nghĩa Tri thức Sinh thái
  const [semanticResults, setSemanticResults] = useState(null);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semanticQuery, setSemanticQuery] = useState("");

  /* Real-time Filter & Sort Logic */
  const filteredSpecies = useMemo(() => {
    return SEARCH_SPECIES_CATALOG.filter((s) => {
      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchNameVi = s.nameVi.toLowerCase().includes(term);
      const matchNameEn = s.nameEn.toLowerCase().includes(term);
      const matchSciName = s.sciName.toLowerCase().includes(term);
      const matchDescVi = s.descVi.toLowerCase().includes(term);
      const matchSearch =
        !term || matchNameVi || matchNameEn || matchSciName || matchDescVi;

      // Category filter
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
        return a.depth.localeCompare(b.depth);
      }
      if (sortBy === "status") {
        return a.statusType.localeCompare(b.statusType);
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, sortBy, language]);

  // Khi có kết quả tìm kiếm ngữ nghĩa, chuyển hóa trực tiếp vào danh sách sinh vật chính
  const displayedSpecies = useMemo(() => {
    if (
      semanticResults &&
      semanticResults.data &&
      semanticResults.data.length > 0
    ) {
      const statusMap = {
        CR: { vi: "Cực kỳ nguy cấp", en: "Critically Endangered", type: "danger" },
        EN: { vi: "Nguy cấp", en: "Endangered", type: "danger" },
        VU: { vi: "Sắp nguy cấp", en: "Vulnerable", type: "warning" },
        NT: { vi: "Gần bị đe dọa", en: "Near Threatened", type: "warning" },
        LC: { vi: "Ít quan tâm", en: "Least Concern", type: "safe" },
        DD: { vi: "Thiếu dữ liệu", en: "Data Deficient", type: "safe" },
        NE: { vi: "Chưa đánh giá", en: "Not Evaluated", type: "safe" },
      };

      return semanticResults.data.map((item) => {
        // Đối chiếu dữ liệu tìm kiếm với danh mục sinh vật
        const itemClean = (item.commonName || "").toLowerCase().trim();
        const sciClean = (item.scientificName || "").toLowerCase().trim();

        const matchedCatalog = SEARCH_SPECIES_CATALOG.find((c) => {
          if (c.id === item.id || c.slug === item.slug) return true;
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
          categoryVi;

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
          nameEn: matchedCatalog?.nameEn || item.commonName,
          sciName: matchedCatalog?.sciName || item.scientificName,
          categoryVi,
          categoryEn,
          statusVi: statusInfo.vi,
          statusEn: statusInfo.en,
          statusType: statusInfo.type,
          descVi: realDescVi,
          descEn: realDescEn,
          image: matchedCatalog?.image || item.image,
          depth: matchedCatalog?.depth || item.depth || "0 - 200m",
        };
      });
    }
    return filteredSpecies;
  }, [semanticResults, filteredSpecies]);

  const executeSemanticSearch = async (queryText) => {
    const q = (queryText || searchTerm || "").trim();
    if (!q || q.length < 2) {
      setSemanticResults(null);
      setSemanticQuery("");
      return;
    }

    setSemanticLoading(true);
    setSemanticQuery(q);
    try {
      const res = await searchSemantic(q);
      if (res && res.success && res.data && res.data.length > 0) {
        setSemanticResults(res);
        setTimeout(() => {
          document
            .getElementById("search-results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        setSemanticResults(null);
      }
    } catch (e) {
      console.warn("Lỗi semantic search:", e);
      setSemanticResults(null);
    } finally {
      setSemanticLoading(false);
    }
  };

  const handleSearchSubmit = (e, overrideTerm) => {
    if (e && e.preventDefault) e.preventDefault();
    const term = overrideTerm || searchTerm;
    executeSemanticSearch(term);
  };

  const handleSearchTermChange = (val) => {
    setSearchTerm(val);

    if (val.length < searchTerm.length && val.length < 2) {
      setSemanticResults(null);
      setSemanticQuery("");
    }
  };

  const handleClearSemantic = () => {
    setSemanticResults(null);
    setSemanticQuery("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Sunbeams */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.2)_0%,rgba(6,182,212,0.08)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/10 blur-[140px] pointer-events-none animate-pulse-glow" />

      <Navbar />

      <main className="flex-1 relative z-10 pb-16">
        <SearchHeroHeader
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          onSearchSubmit={handleSearchSubmit}
        />

        <SearchFilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <FeaturedSpeciesSlider />

        {/* ── DANH SÁCH SINH VẬT ĐÃ HỢP NHẤT TÌM KIẾM NGỮ NGHĨA ── */}
        <SearchGridList
          key={`${selectedCategory}|${sortBy}|${semanticQuery}`}
          speciesList={displayedSpecies}
          semanticQuery={semanticQuery}
          onClearSemantic={handleClearSemantic}
          loading={semanticLoading}
        />

        <OceanFunFacts />
      </main>

      <Footer />
    </div>
  );
}
