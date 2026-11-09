import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { fetchSpeciesList } from "../../services/speciesApi";
import { FishHidden } from "../../assets/Images";
import * as Icons from "../../assets/Icons";

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
              categoryEn: s.group?.name || "Marine Life",
              statusVi: s.vietnamRedListStatus || "Ít quan tâm",
              statusEn: s.vietnamRedListStatus || "Least Concern",
              statusType,
              nameVi: s.commonName,
              nameEn: s.commonName,
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
            {t("searchPage.featuredTitle")}
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <MoveHorizontal size={13} className="text-sky-400" />
            {language === "en" ? "Drag to scroll" : "Kéo chuột để cuộn"}
          </span>
        </div>

        {/* Nút điều hướng Trái / Phải */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-xl border transition-all ${
              canScrollLeft
                ? "bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-sky-400/60 shadow-sm cursor-pointer active:scale-95"
                : "bg-white/5 text-white/25 border-white/5 cursor-not-allowed opacity-40"
            }`}
            aria-label="Previous species"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-xl border transition-all ${
              canScrollRight
                ? "bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-sky-400/60 shadow-sm cursor-pointer active:scale-95"
                : "bg-white/5 text-white/25 border-white/5 cursor-not-allowed opacity-40"
            }`}
            aria-label="Next species"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll với tính năng kéo chuột (Mouse Drag to Scroll) */}
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
          const categoryName = language === "en" ? s.categoryEn : s.categoryVi;
          const statusName = language === "en" ? s.statusEn : s.statusVi;
          const name = language === "en" ? s.nameEn : s.nameVi;
          const desc = language === "en" ? s.descEn : s.descVi;

          return (
            <div
              key={s.id}
              className="flex-shrink-0 w-56 bg-[#183c66] hover:bg-[#1f4a7d] border border-white/15 hover:border-sky-400/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group shadow-sm hover:shadow-lg hover:shadow-sky-950/40 hover:-translate-y-1.5 relative hover:z-10 select-none"
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
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[10px] font-semibold leading-tight truncate max-w-[90px]">
                  {categoryName}
                </span>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold leading-tight ${
                    s.statusType === "danger"
                      ? "bg-rose-500/20 border border-rose-400/40 text-rose-300"
                      : s.statusType === "warning"
                        ? "bg-amber-500/20 border border-amber-400/40 text-amber-300"
                        : "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300"
                  }`}
                >
                  {statusName}
                </span>
              </div>

              {/* Image */}
              <div className="w-full h-32 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-[#112d4e] border border-white/10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
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
                  className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-400 relative z-10 select-none pointer-events-none"
                />
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-bold text-white font-heading group-hover:text-sky-300 transition-colors mb-0.5 line-clamp-1">
                  {name}
                </h3>
                <p className="text-[10px] text-slate-400 italic mb-2 line-clamp-1">
                  {s.sciName}
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed line-clamp-2 mb-3">
                  {desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-white/8 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Icons.Anchor className="w-3.5 h-3.5 text-blue-400" /> {s.depth}
                </span>
                <span className="text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">
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
