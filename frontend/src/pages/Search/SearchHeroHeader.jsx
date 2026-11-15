import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { LightbulbIcon } from "../../assets/Icons";

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4">
      {/* Title - prominent and sharp */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight mb-3">
        {t("searchPage.heroTitle")}
      </h1>

      {/* Description - legible and clear */}
      <p className="text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto mb-7 font-medium leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      {/* Main Search Input Form */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-6"
      >
        <div className="relative flex items-center">
          <Search
            size={22}
            className="absolute left-4 text-cyan-300/60 pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPage.searchPlaceholder")}
            className="w-full py-4 pl-12 pr-36 bg-[#0a203c]/70 border border-cyan-500/30 rounded-2xl text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-[#0c274a]/90 backdrop-blur-xl transition-all shadow-xl shadow-cyan-950/40"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer active:translate-y-0.5 shadow-md shadow-cyan-900/40"
          >
            {t("searchPage.btnSearch")}
          </button>
        </div>

        {/* Smart Question Suggestions Chips with SVG Lightbulb */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-amber-300 font-semibold flex items-center gap-1.5 mr-1 text-xs md:text-sm">
            <LightbulbIcon className="w-4 h-4 text-amber-400 stroke-current" />
            <span>{isEn ? "Smart prompts:" : "Gợi ý truy vấn:"}</span>
          </span>
          {[
            "Thiên địch của sao biển gai",
            "Cộng sinh với hải quỳ",
            "Cực kỳ nguy cấp ở Côn Đảo",
            "Loài ăn cỏ biển Biển Đông",
            "Sinh vật tạo nơi cư trú",
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setSearchTerm(chip);
                if (onSearchSubmit) {
                  setTimeout(() => onSearchSubmit({ preventDefault: () => {} }, chip), 10);
                }
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
