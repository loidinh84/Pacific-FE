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
      <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#0f172a] font-heading tracking-tight mb-4">
        {t("news.heroTitle")}
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-8"
      >
        <div className="relative flex items-center">
          <Search
            size={20}
            className="absolute left-4 z-10 text-[#475569] pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("news.searchPlaceholder")}
            className="w-full py-4 pl-12 pr-32 liquid-glass-strong rounded-2xl text-base text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-sky-500/15 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 z-10 px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            {t("searchPage.btnSearch") || "Tìm kiếm"}
          </button>
        </div>
      </form>
    </div>
  );
}
