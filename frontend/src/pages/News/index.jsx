import { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { NewsHero } from "./NewsHero";
import { NewsFeaturedSection } from "./NewsFeaturedSection";
import { NewsFilterBar } from "./NewsFilterBar";
import { NewsCard } from "./NewsCard";
import { NEWS_ARTICLES, NEWS_CATEGORIES } from "../../mocks/newsMock";
import { useLanguage } from "../../hooks/useLanguage";
import { setPageMeta } from "./newsUtils";
import { Sparkles, RefreshCw, Newspaper } from "lucide-react";

export default function News() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'popular'
  const [visibleCount, setVisibleCount] = useState(6);

  // Set Page SEO Title & Meta
  useEffect(() => {
    setPageMeta(
      `${t("news.pageTitle")} | Pacific`,
      t("news.metaDescription")
    );
  }, [t, language]);

  // Bài viết nổi bật
  const featuredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((a) => a.is_featured);
  }, []);

  // Filtered & Sorted Articles for the Catalog Grid
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter((article) => {
      // 1. Search filter
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        article.title.toLowerCase().includes(term) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(term));

      // 2. Category filter
      const matchCategory =
        !selectedCategory || article.category?.slug === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === "popular") {
        return (b.view_count || 0) - (a.view_count || 0);
      }
      // default: newest
      return new Date(b.published_at) - new Date(a.published_at);
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setVisibleCount(6);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Sunbeams & Ocean Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.22)_0%,rgba(6,182,212,0.08)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/10 blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-cyan-400/10 blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10 pb-20">
        {/* 1. Hero Header */}
        <NewsHero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Bài viết nổi bật */}
        {!searchTerm && (
          <NewsFeaturedSection featuredArticles={featuredArticles} />
        )}

        {/* 3. Filter Bar */}
        <NewsFilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            setVisibleCount(6);
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* 4. Latest News Grid Section */}
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white font-heading tracking-tight">
              {t("news.latestTitle")}
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 mx-auto mb-4">
                <Newspaper size={30} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t("news.noResults")}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để xem bài viết khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>{t("news.clearFilters")}</span>
              </button>
            </div>
          ) : (
            <>
              {/* 3 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {displayedArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-500/40 text-cyan-200 hover:text-white font-bold text-sm tracking-wide transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>{t("news.loadMore")}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
