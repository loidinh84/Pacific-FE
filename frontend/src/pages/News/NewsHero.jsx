import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function NewsHero({ searchTerm, setSearchTerm, onSearchSubmit }) {
  const { t } = useLanguage();

  return (
    <div
      id="news-hero"
      className="text-center max-w-4xl mx-auto pt-22 pb-6 sm:pt-24 sm:pb-8 md:pt-28 px-4"
    >
      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] font-heading tracking-tight mb-4">
        {t("news.heroTitle")}
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-4 sm:mb-6"
      >
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 sm:left-4 z-10 text-[#475569] pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("news.searchPlaceholder")}
            className="w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-24 sm:pr-32 liquid-glass-strong rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-sky-500/15 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 z-10 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            {t("searchPage.btnSearch") || "Tìm kiếm"}
          </button>
        </div>
      </form>
    </div>
  );
}
