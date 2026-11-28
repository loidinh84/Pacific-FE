import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { fetchSpeciesList } from "../../services/speciesApi";
import { FishHidden } from "../../assets/Images";
import * as Icons from "../../assets/Icons";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

export function FeaturedSpeciesSlider({ initialSpecies = null }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [featuredList, setFeaturedList] = useState(() => {
    if (initialSpecies && Array.isArray(initialSpecies) && initialSpecies.length > 0) {
      return initialSpecies;
    }
    return SEARCH_SPECIES_CATALOG.filter((s) => s.isFeatured);
  });

  const sliderRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Kiểm tra vị trí thanh cuộn để bật/tắt nút điều hướng
  const checkScrollability = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const el = sliderRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability, { passive: true });
      window.addEventListener("resize", checkScrollability);
      return () => {
        el.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [featuredList]);

  // Cuộn trái / phải bằng nút bấm
  const scrollByAmount = (direction) => {
    if (!sliderRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Xử lý kéo thả chuột (Mouse Drag-to-Scroll)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.35;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasMovedRef.current = false;
    }, 80);
  };

  const handleMouseLeave = () => {
    if (isDownRef.current) {
      isDownRef.current = false;
      setTimeout(() => {
        setIsDragging(false);
        hasMovedRef.current = false;
      }, 80);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchSpeciesList({ sortBy: "views", limit: 8 })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
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
              categoryVi: s.group?.name || "Sinh vật biển",
              categoryEn: getLocalizedCategory(s.group?.name, "en"),
              statusVi: s.vietnamRedListStatus || "Ít quan tâm",
              statusEn: s.vietnamRedListStatus || "Least Concern",
              statusType,
              nameVi: s.commonName,
              nameEn: getLocalizedSpeciesName(s, "en"),
              sciName: s.scientificName,
              descVi: s.description || `Sinh vật phân bố tại vùng biển ${s.eastSeaZone || "Biển Đông"}.`,
              descEn: s.description || `Species found in ${s.eastSeaZone || "East Sea"}.`,
              image: s.image,
              depth:
                s.depthMin != null || s.depthMax != null
                  ? `${s.depthMin || 0} - ${s.depthMax || 100}m`
                  : "0 - 100m",
            };
          });
          setFeaturedList(mapped);
        }
      })
      .catch(() => {
        // Fallback giữ nguyên mock
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      {/* Header với Tiêu đề & Nút cuộn Trái / Phải */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading">
          {t("searchPage.featuredTitle")}
        </h2>

        {/* Nút điều hướng Trái / Phải */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-xl transition-colors ${
              canScrollLeft
                ? "liquid-glass-subtle text-[#0f172a] hover:bg-white hover:text-[#0284c7] cursor-pointer"
                : "bg-white/30 text-[#475569]/40 border border-white/40 cursor-not-allowed"
            }`}
            aria-label="Previous species"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-xl transition-colors ${
              canScrollRight
                ? "liquid-glass-subtle text-[#0f172a] hover:bg-white hover:text-[#0284c7] cursor-pointer"
                : "bg-white/30 text-[#475569]/40 border border-white/40 cursor-not-allowed"
            }`}
            aria-label="Next species"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-4 overflow-x-auto pt-3 pb-4 -my-2 px-1 scrollbar-none select-none touch-pan-x ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none", scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {featuredList.map((s) => {
          const categoryName = getLocalizedCategory(s.categoryVi || s.categoryEn, language);
          const statusName = language === "en" ? s.statusEn : s.statusVi;
          const name = getLocalizedSpeciesName(s, language);
          const desc = language === "en" ? (s.descEn || s.descVi) : s.descVi;

          return (
            <div
              key={s.id}
              className="flex-shrink-0 w-64 liquid-glass liquid-glass-interactive rounded-2xl p-4 flex flex-col justify-between group select-none cursor-pointer"
              onClick={(e) => {
                if (hasMovedRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                navigate(`/species/${s.slug || s.id}`);
              }}
            >
              {/* Header Tags */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-900/6 border border-slate-900/12 text-[#1e293b] text-[10px] font-medium leading-tight truncate">
                  {categoryName}
                </span>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium leading-tight ${
                    s.statusType === "danger"
                      ? "bg-rose-500/12 border border-rose-500/25 text-rose-700"
                      : s.statusType === "warning"
                        ? "bg-amber-500/12 border border-amber-500/25 text-amber-800"
                        : "bg-emerald-500/12 border border-emerald-500/25 text-emerald-700"
                  }`}
                >
                  {statusName}
                </span>
              </div>

              {/* Image */}
              <div className="w-full h-36 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-gradient-to-br from-sky-100/55 via-white/55 to-cyan-100/45 border border-white/85 pointer-events-none">
                <img
                  src={s.image || FishHidden}
                  alt={name}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FishHidden;
                  }}
                  className={
                    typeof s.image === "string" &&
                    (s.image.startsWith("http") || s.image.endsWith(".jpg") || s.image.endsWith(".webp"))
                      ? "w-full h-full object-cover relative z-10 select-none pointer-events-none"
                      : "w-full h-full object-contain p-3 drop-shadow-[0_6px_12px_rgba(15,23,42,0.16)] relative z-10 select-none pointer-events-none"
                  }
                />
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-bold text-[#0f172a] font-heading group-hover:text-[#0284c7] transition-colors mb-0.5 line-clamp-1">
                  {name}
                </h3>
                <p className="text-[11px] text-[#475569] italic mb-2 line-clamp-1 font-mono">
                  {s.sciName}
                </p>
                <p className="text-xs text-[#334155] leading-relaxed line-clamp-2 mb-3">
                  {desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-[#0f172a]/8 flex items-center justify-between text-[11px] text-[#475569]">
                <span className="flex items-center gap-1.5 font-mono tabular-nums">
                  <Icons.Anchor className="w-3.5 h-3.5 text-[#0284c7]" /> {s.depth}
                </span>
                <span className="text-[#0284c7] font-medium group-hover:text-[#0369a1] transition-colors">
                  {t("searchPage.btnDetail")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
