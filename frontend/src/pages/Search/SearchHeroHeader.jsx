import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const SUGGESTIONS = [
  { vi: "Sinh vật phát sáng ở biển sâu", en: "Bioluminescent deep sea fish" },
  { vi: "Con cá nào to nhất đại dương", en: "Largest fish in the ocean" },
  { vi: "Thiên địch của sao biển gai", en: "Crown-of-thorns predators" },
  { vi: "Loài nào giống trong phim đi tìm Nemo", en: "Fish from Finding Nemo" },
  { vi: "Loài ăn cỏ biển ở Côn Đảo", en: "Seagrass grazers in Con Dao" },
  { vi: "Động vật có vú biết hát", en: "Singing marine mammals" },
];

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-24 pb-4 md:pt-28 md:pb-6 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] font-heading tracking-tight mb-2">
        {t("searchPage.heroTitle")}
      </h1>

      <p className="text-xs sm:text-sm text-[#334155] max-w-xl mx-auto mb-6 font-normal leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-4"
      >
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-[#475569] pointer-events-none z-10"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPage.searchPlaceholder")}
            className="w-full py-3.5 pl-11 pr-32 liquid-glass-strong rounded-xl text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-sky-500/15 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            {t("searchPage.btnSearch")}
          </button>
        </div>

        {/* Static realistic suggestion chips */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3">
          <span className="text-xs text-[#475569] font-normal select-none shrink-0 mr-1">
            {isEn ? "Suggestions:" : "Gợi ý:"}
          </span>
          {SUGGESTIONS.map((item, idx) => {
            const text = isEn ? item.en : item.vi;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchTerm(text);
                  if (onSearchSubmit) {
                    setTimeout(() => onSearchSubmit({ preventDefault: () => {} }, text), 10);
                  }
                }}
                className="px-2.5 py-1 rounded-full liquid-glass-subtle hover:bg-white text-[#334155] hover:text-[#0284c7] text-xs font-medium transition-colors cursor-pointer"
              >
                {text}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
