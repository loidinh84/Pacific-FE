import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function NewsHero({ searchTerm, setSearchTerm, onSearchSubmit }) {
  const { t } = useLanguage();

  return (
    <div
      id="news-hero"
      className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4"
    >
      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-white font-heading tracking-tight mb-4">
        {t("news.heroTitle")}
      </h1>

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
            className="absolute right-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer active:translate-y-0.5 shadow-sm"
          >
            {t("searchPage.btnSearch") || "Tìm kiếm"}
          </button>
        </div>
      </form>
    </div>
  );
}
