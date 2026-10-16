import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t } = useLanguage();

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-white font-heading tracking-tight mb-1">
        {t("searchPage.heroTitle")}
      </h1>

      {/* Description */}
      <p className="text-sm md:text-sm text-pacific-blue-pale/80 max-w-2xl mx-auto mb-5 font-medium leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      {/* Main Search Input Form */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-6"
      >
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-4 text-white/40 pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPage.searchPlaceholder")}
            className="w-full py-3.5 pl-5 pr-32 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-pacific-blue-bright focus:bg-white/15 backdrop-blur-xl transition-all hover:shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-blue-600 hover:bg-pacific-blue-bright/80 text-white rounded-lg text-xs font-bold transition-all cursor-pointer active:translate-y-0.5"
          >
            {t("searchPage.btnSearch")}
          </button>
        </div>

        {/* Smart Question Suggestions Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
          <span className="text-cyan-400 font-semibold flex items-center gap-1 mr-1">
            <span>💡 Thử hỏi:</span>
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
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-[11px] transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </form>

      {/* 4 Quick Stats Bar - Compact & Sleek */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-3 border-t border-white/10">
        <div className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-lg md:text-xl font-bold text-pacific-cyan font-heading">
            {t("searchPage.quickStat1")}
          </p>
          <p className="text-sm text-gray-200 mt-0.5 tracking-wider font-semibold">
            {t("searchPage.quickStat1Title")}
          </p>
        </div>
        <div className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-lg md:text-xl font-bold text-pacific-cyan font-heading">
            {t("searchPage.quickStat2")}
          </p>
          <p className="text-sm text-gray-200 mt-0.5 tracking-wider font-semibold">
            {t("searchPage.quickStat2Title")}
          </p>
        </div>
        <div className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-lg md:text-xl font-black text-pacific-cyan font-heading">
            {t("searchPage.quickStat3")}
          </p>
          <p className="text-sm text-gray-200 mt-0.5 tracking-wider font-semibold">
            {t("searchPage.quickStat3Title")}
          </p>
        </div>
        <div className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-lg md:text-xl font-black text-pacific-cyan font-heading">
            {t("searchPage.quickStat4")}
          </p>
          <p className="text-sm text-gray-200 mt-0.5 tracking-wider font-semibold">
            {t("searchPage.quickStat4Title")}
          </p>
        </div>
      </div>
    </div>
  );
}
