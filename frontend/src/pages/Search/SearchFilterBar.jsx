import { useRef, useState, useEffect } from "react";
import { ArrowUpDown, ShieldAlert, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CATEGORIES_DATA } from "../../mocks/speciesMock";
import { fetchSpeciesGroups } from "../../services/speciesApi";
import { getLocalizedCategory } from "../../utils/speciesFormatters";

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
          const apiCats = res.data.map((g) => {
            const matchedMock = CATEGORIES_DATA.find(
              (c) => c.value === g.slug || c.value === g.id
            );
            return {
              value: g.slug || g.id,
              labelVi: g.name,
              labelEn: matchedMock?.labelEn || getLocalizedCategory(g.name, "en"),
            };
          });
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
      <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl liquid-glass">
        {/* ROW 1: Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full">
          <span className="text-sm text-[#334155] font-medium whitespace-nowrap min-w-[70px]">
            {t("searchPage.filterLabel")}
          </span>

          <div className="relative flex-1 flex items-center min-w-0">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="hidden sm:flex absolute left-0 z-10 p-1.5 rounded-full liquid-glass-strong text-[#0f172a] hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
                title="Lướt sang trái"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={checkScrollState}
              className="flex items-center gap-2 overflow-x-auto sm:flex-wrap whitespace-nowrap sm:whitespace-normal scrollbar-none flex-1 py-0.5 px-0.5 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === ""
                    ? "bg-[#0284c7] text-white shadow-sm"
                    : "bg-white/65 text-[#334155] hover:bg-white hover:text-[#0f172a] border border-[#0f172a]/10"
                }`}
              >
                {t("searchPage.allCategory")}
              </button>

              {categories.map((c) => {
                const isSelected = selectedCategory === c.value;
                const rawLabel = language === "en" ? c.labelEn : c.labelVi;
                const shortLabel = getCategoryShortLabel(rawLabel, language);

                return (
                  <button
                    key={c.value}
                    onClick={() => setSelectedCategory(c.value)}
                    title={rawLabel}
                    className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#0284c7] text-white shadow-sm"
                        : "bg-white/65 text-[#334155] hover:bg-white hover:text-[#0f172a] border border-[#0f172a]/10"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="hidden sm:flex absolute right-0 z-10 p-1.5 rounded-full liquid-glass-strong text-[#0f172a] hover:text-[#0284c7] transition-colors cursor-pointer shrink-0"
                title="Lướt sang phải"
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Sort By Controls */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-[#0f172a]/8">
          <span className="text-sm text-[#334155] font-medium whitespace-nowrap min-w-[70px]">
            {t("searchPage.sortLabel")}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSortBy("az")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                sortBy === "az"
                  ? "bg-sky-600/12 border border-[#0284c7]/30 text-[#0284c7]"
                  : "bg-white/65 text-[#334155] hover:bg-white hover:text-[#0f172a] border border-[#0f172a]/10"
              }`}
            >
              <ArrowUpDown size={13} />
              {t("searchPage.sortAZ")}
            </button>

            <button
              onClick={() => setSortBy("depth")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                sortBy === "depth"
                  ? "bg-sky-600/12 border border-[#0284c7]/30 text-[#0284c7]"
                  : "bg-white/65 text-[#334155] hover:bg-white hover:text-[#0f172a] border border-[#0f172a]/10"
              }`}
            >
              <Waves size={13} />
              {t("searchPage.sortDepth")}
            </button>

            <button
              onClick={() => setSortBy("status")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                sortBy === "status"
                  ? "bg-sky-600/12 border border-[#0284c7]/30 text-[#0284c7]"
                  : "bg-white/65 text-[#334155] hover:bg-white hover:text-[#0f172a] border border-[#0f172a]/10"
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
