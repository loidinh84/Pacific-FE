import { useRef, useState, useEffect } from "react";
import { ArrowUpDown, ShieldAlert, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CATEGORIES_DATA } from "../../mocks/speciesMock";

export function SearchFilterBar({ selectedCategory, setSelectedCategory, sortBy, setSortBy }) {
  const { language, t } = useLanguage();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, []);

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
        
        {/* ROW 1: Category Filter Bar - Smart Conditional Scroll Buttons */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-white/70 font-semibold whitespace-nowrap min-w-[70px]">
            {t("searchPage.filterLabel")}
          </span>

          {/* Left Arrow Button - Only visible if can scroll left */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="p-1 rounded-full bg-pacific-blue-bright/20 hover:bg-pacific-blue-bright/40 border border-pacific-blue-bright/40 text-pacific-blue-light hover:text-white transition-all cursor-pointer shrink-0 animate-in fade-in duration-200"
              title="Lướt sang trái"
            >
              <ChevronLeft size={14} />
            </button>
          )}

          {/* Horizontal Scrollable Categories Container */}
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none flex-1 py-1 px-0.5 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* "All" Tab */}
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                selectedCategory === ""
                  ? "bg-blue-700 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {t("searchPage.allCategory")}
            </button>

            {/* Dynamic Categories */}
            {CATEGORIES_DATA.filter((c) => c.value !== "").map((c) => {
              const isSelected = selectedCategory === c.value;
              const label = language === "en" ? c.labelEn : c.labelVi;

              return (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-blue-700 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button - Only visible if can scroll right */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="p-1 rounded-full bg-pacific-blue-bright/20 hover:bg-pacific-blue-bright/40 border border-pacific-blue-bright/40 text-pacific-blue-light hover:text-white transition-all cursor-pointer shrink-0 animate-in fade-in duration-200"
              title="Lướt sang phải"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* ROW 2: Sort By Controls - Parallel Second Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-white/70 font-semibold whitespace-nowrap min-w-[70px]">
            {t("searchPage.sortLabel")}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSortBy("az")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
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
