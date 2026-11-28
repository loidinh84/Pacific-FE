import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { NewsHero } from "./NewsHero";
import { NewsFeaturedSection } from "./NewsFeaturedSection";
import { NewsFilterBar } from "./NewsFilterBar";
import { NewsCard } from "./NewsCard";
import {
  fetchNews,
  fetchFeaturedNews,
  fetchNewsCategories,
} from "../../services/newsApi";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeMessage } from "../../utils/errorTranslator";
import { setPageMeta } from "./newsUtils";
import { RefreshCw, Newspaper, AlertCircle, Loader2 } from "lucide-react";

export default function News() {
  const { t, language } = useLanguage();

  // Filters & Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'popular'

  // Data states
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  // Loading & Error states
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Set Page SEO Title & Meta
  useEffect(() => {
    let brandName = "Pacific";
    try {
      const saved = localStorage.getItem("pacific_system_settings");
      if (saved) brandName = JSON.parse(saved)?.general?.websiteName || brandName;
    } catch (_) {}
    setPageMeta(
      `${t("news.pageTitle")} | ${brandName}`,
      t("news.metaDescription")
    );
  }, [t, language]);

  // 1. Tải danh mục và bài viết nổi bật
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      setIsLoadingFeatured(true);

      const [catsData, featData] = await Promise.all([
        fetchNewsCategories().catch(() => []),
        fetchFeaturedNews(4).catch(() => []),
      ]);

      setCategories(catsData);
      setFeaturedArticles(featData);
    } catch (err) {
      console.error("Lỗi khi tải danh mục hoặc tin nổi bật:", err);
    } finally {
      setIsLoadingCategories(false);
      setIsLoadingFeatured(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Tải danh sách bài viết theo bộ lọc
  const loadArticles = useCallback(
    async (pageToLoad = 1, append = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoadingArticles(true);
          setError(null);
        }

        const res = await fetchNews({
          page: pageToLoad,
          limit: 6,
          category: selectedCategory || undefined,
          search: submittedSearch.trim() || undefined,
          sort: sortBy,
        });

        if (append) {
          setArticles((prev) => [...prev, ...res.articles]);
        } else {
          setArticles(res.articles);
        }

        setPagination(res.pagination);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        if (!append) {
          setError(
            localizeMessage(
              err,
              language,
              language === "en"
                ? "Unable to connect to the server. Please check your network connection."
                : "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng."
            )
          );
        }
      } finally {
        setIsLoadingArticles(false);
        setIsLoadingMore(false);
      }
    },
    [selectedCategory, submittedSearch, sortBy]
  );

  // Tải lại bài viết khi bộ lọc thay đổi
  useEffect(() => {
    loadArticles(1, false);
  }, [loadArticles]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmittedSearch(searchTerm);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSubmittedSearch("");
    setSelectedCategory("");
    setSortBy("newest");
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !isLoadingMore) {
      loadArticles(pagination.page + 1, true);
    }
  };

  const hasMore = pagination.page < pagination.totalPages;

  return (
    <div className="min-h-screen text-[#0f172a] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 relative z-10 pb-20">
        {/* 1. Hero Header */}
        <NewsHero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* 2. Bài viết nổi bật (chỉ hiện khi không tìm kiếm) */}
        {!submittedSearch && (
          <>
            {isLoadingFeatured ? (
              <div className="max-w-6xl mx-auto px-4 mb-16 animate-pulse">
                <div className="w-48 h-7 liquid-glass-subtle rounded-lg mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 h-[420px] rounded-3xl liquid-glass-subtle border border-[#0f172a]/10" />
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 rounded-2xl liquid-glass-subtle border border-[#0f172a]/10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NewsFeaturedSection featuredArticles={featuredArticles} />
            )}
          </>
        )}

        {/* 3. Filter Bar */}
        <NewsFilterBar
          categories={categories}
          isLoading={isLoadingCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* 4. Latest News Grid Section */}
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading tracking-tight">
              {t("news.latestTitle")}
            </h2>
          </div>

          {/* Trạng thái lỗi */}
          {error && !isLoadingArticles && (
            <div className="text-center py-16 px-4 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-md max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-rose-700 mx-auto mb-4">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Không thể tải dữ liệu tin tức
              </h3>
              <p className="text-xs text-[#334155] mb-6">{error}</p>
              <button
                onClick={() => {
                  loadInitialData();
                  loadArticles(1, false);
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600/10 hover:bg-cyan-500/30 text-[#0284c7] border border-sky-600/25 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          {/* Trạng thái đang tải (Skeleton Grid) */}
          {isLoadingArticles && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden liquid-glass-strong border border-[#0f172a]/10 animate-pulse flex flex-col h-[380px]"
                >
                  <div className="h-52 liquid-glass-subtle" />
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div className="w-24 h-3 bg-slate-200/70 rounded" />
                    <div className="w-full h-5 bg-slate-200/80 rounded" />
                    <div className="w-3/4 h-5 bg-slate-200/80 rounded" />
                    <div className="w-full h-3 bg-slate-200/70 rounded mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trạng thái không có kết quả */}
          {!isLoadingArticles && !error && articles.length === 0 && (
            <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-[#0f172a]/10 backdrop-blur-md max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-sky-600/10 border border-sky-600/25 flex items-center justify-center text-[#0284c7] mx-auto mb-4">
                <Newspaper size={30} />
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                {t("news.noResults")}
              </h3>
              <p className="text-xs text-[#475569] mb-6">
                Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để xem bài viết khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-sky-600/10 hover:bg-cyan-500/30 text-[#0284c7] border border-sky-600/25 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>{t("news.clearFilters")}</span>
              </button>
            </div>
          )}

          {/* Danh sách bài viết */}
          {!isLoadingArticles && !error && articles.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {/* Nút Xem thêm */}
              {hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 rounded-xl liquid-glass-strong hover:bg-white border border-[#0284c7]/30 text-[#0284c7] hover:text-[#0369a1] font-semibold text-sm transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Đang tải thêm...</span>
                      </>
                    ) : (
                      <span>{t("news.loadMore")}</span>
                    )}
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
