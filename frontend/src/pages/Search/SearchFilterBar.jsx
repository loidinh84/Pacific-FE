import { useRef, useState, useEffect } from "react";
import { ArrowUpDown, ShieldAlert, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CATEGORIES_DATA } from "../../mocks/speciesMock";
import { fetchSpeciesGroups } from "../../services/speciesApi";

// Rút gọn nhãn danh mục để thanh lọc gọn gàng, thoáng đãng và không bị tràn
const getCategoryShortLabel = (label, lang) => {
  if (!label) return "";
  const viMap = {
    "Động vật có vú biển": "Động vật có vú",
    "Bò sát biển": "Bò sát",
    "Thân mềm & Không xương sống": "Thân mềm",
    "San hô & Thực vật biển": "San hô & TV biển",
    "Sinh vật biển sâu & Phát quang": "Biển sâu & Phát quang",
  };
  const enMap = {
    "Marine Mammals": "Mammals",
    "Marine Reptiles": "Reptiles",
    "Mollusks & Invertebrates": "Mollusks",
    "Corals & Marine Plants": "Corals & Plants",
    "Deep Sea & Bioluminescent": "Deep Sea",
  };
  if (lang === "en") return enMap[label] || label;
  return viMap[label] || label;
};

export function SearchFilterBar({ selectedCategory, setSelectedCategory, sortBy, setSortBy }) {
  const { language, t } = useLanguage();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES_DATA.filter((c) => c.value !== ""));

  useEffect(() => {
    let isMounted = true;
    fetchSpeciesGroups()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const apiCats = res.data.map((g) => ({
            value: g.slug || g.id,
            labelVi: g.name,
            labelEn: g.name,
          }));
          setCategories(apiCats);
        }
      })
      .catch(() => {
        // Fallback giữ nguyên CATEGORIES_DATA
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const checkScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [categories]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <div className="flex flex-col gap-4 pb-6 border-b border-white/10">
        
        {/* ROW 1: Category Filter Bar - Responsive Wrap trên Desktop & Scroll trên Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full">
          <span className="text-sm text-white/70 font-semibold whitespace-nowrap min-w-[70px]">
            {t("searchPage.filterLabel")}
          </span>

          <div className="relative flex-1 flex items-center min-w-0">
            {/* Left Scroll Button cho màn hình hẹp */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="hidden sm:flex absolute left-0 z-10 p-1.5 rounded-full bg-[#0a203c]/90 hover:bg-pacific-blue-bright/40 border border-pacific-blue-bright/40 text-pacific-blue-light hover:text-white transition-all cursor-pointer shrink-0 shadow-lg"
                title="Lướt sang trái"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            {/* Danh sách danh mục: tự động xuống dòng trên màn hình lớn để không bao giờ bị cắt chữ */}
            <div
              ref={scrollRef}
              onScroll={checkScrollState}
              className="flex items-center gap-2 overflow-x-auto sm:flex-wrap whitespace-nowrap sm:whitespace-normal scrollbar-none flex-1 py-1 px-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* "Tất cả" Tab */}
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {t("searchPage.allCategory")}
              </button>

              {/* Dynamic Categories */}
              {categories.map((c) => {
                const isSelected = selectedCategory === c.value;
                const rawLabel = language === "en" ? c.labelEn : c.labelVi;
                const shortLabel = getCategoryShortLabel(rawLabel, language);

                return (
                  <button
                    key={c.value}
                    onClick={() => setSelectedCategory(c.value)}
                    title={rawLabel}
                    className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button cho màn hình hẹp */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="hidden sm:flex absolute right-0 z-10 p-1.5 rounded-full bg-[#0a203c]/90 hover:bg-pacific-blue-bright/40 border border-pacific-blue-bright/40 text-pacific-blue-light hover:text-white transition-all cursor-pointer shrink-0 shadow-lg"
                title="Lướt sang phải"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Sort By Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-white/70 font-semibold whitespace-nowrap min-w-[70px]">
            {t("searchPage.sortLabel")}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSortBy("az")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                sortBy === "az"
                  ? "bg-pacific-blue-bright/20 border border-pacific-blue-bright text-pacific-blue-light shadow-sm"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              <ArrowUpDown size={13} />
              {t("searchPage.sortAZ")}
            </button>

            <button
              onClick={() => setSortBy("depth")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                sortBy === "depth"
                  ? "bg-pacific-blue-bright/20 border border-pacific-blue-bright text-pacific-blue-light shadow-sm"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              <Waves size={13} />
              {t("searchPage.sortDepth")}
            </button>

            <button
              onClick={() => setSortBy("status")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                sortBy === "status"
                  ? "bg-pacific-blue-bright/20 border border-pacific-blue-bright text-pacific-blue-light shadow-sm"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              <ShieldAlert size={13} />
              {t("searchPage.sortStatus")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
