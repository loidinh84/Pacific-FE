import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function NewsHero({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t } = useLanguage();

  return (
    <div id="news-hero" className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4">
      {/* Badge */}
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md">
          <span className="text-xs md:text-sm font-semibold tracking-wide text-cyan-200">
            {t("news.heroBadge")}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight mb-4">
        {t("news.heroTitle")}
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
        {t("news.heroDesc")}
      </p>

      {/* Search Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-8"
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
            placeholder={t("news.searchPlaceholder")}
            className="w-full py-4 pl-12 pr-32 bg-[#0a203c]/70 border border-cyan-500/30 rounded-2xl text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-[#0c274a]/90 backdrop-blur-xl transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer active:translate-y-0.5"
          >
            {t("searchPage.btnSearch") || "Tìm kiếm"}
          </button>
        </div>
      </form>
    </div>
  );
}
