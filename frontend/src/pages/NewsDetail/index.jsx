import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { NewsCard } from "../News/NewsCard";
import { fetchNewsDetail } from "../../services/newsApi";
import { useLanguage } from "../../hooks/useLanguage";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import {
  getCategoryLabel,
  formatFullDate,
  formatViews,
  getArticleByline,
  setPageMeta,
} from "../News/newsUtils";
import {
  ArrowLeft,
  Eye,
  Share2,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { copiedId, copy } = useCopyToClipboard();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState(null); // 'not_found' | 'server_error' | null

  // Tải chi tiết bài viết theo slug
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadArticle = async () => {
      try {
        setIsLoading(true);
        setErrorType(null);
        const data = await fetchNewsDetail(slug);
        if (isMounted) {
          setArticle(data);
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 404) {
            setErrorType("not_found");
          } else {
            setErrorType("server_error");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      loadArticle();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // SEO Title & Meta
  useEffect(() => {
    if (article) {
      setPageMeta(
        `${article.title} | ${t("news.pageTitle")} Pacific`,
        article.excerpt || t("news.metaDescription")
      );
    }
  }, [article, t]);

  const handleShare = (e) => {
    const currentUrl = window.location.href;
    copy("share-btn", currentUrl, e);
  };

  // 1. Trạng thái Đang tải (Skeleton)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between relative selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-20 max-w-4xl mx-auto px-4 w-full">
          {/* Skeleton Breadcrumbs */}
          <div className="w-48 h-4 bg-white/10 rounded mb-6 animate-pulse" />
          {/* Skeleton Title */}
          <div className="space-y-3 mb-6 animate-pulse">
            <div className="w-full h-10 bg-white/15 rounded-xl" />
            <div className="w-2/3 h-10 bg-white/15 rounded-xl" />
          </div>
          {/* Skeleton Meta Bar */}
          <div className="w-full h-10 bg-white/5 rounded-xl mb-6 animate-pulse" />
          {/* Skeleton Cover Image */}
          <div className="w-full h-[380px] md:h-[460px] bg-white/10 rounded-3xl mb-8 animate-pulse" />
          {/* Skeleton Content Paragraphs */}
          <div className="space-y-4 animate-pulse">
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-5/6 h-4 bg-white/10 rounded" />
            <div className="w-4/5 h-4 bg-white/10 rounded" />
            <div className="w-full h-4 bg-white/10 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Trạng thái Không tìm thấy bài viết (404)
  if (errorType === "not_found" || (!isLoading && !article && !errorType)) {
    return (
      <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <h1 className="text-2xl font-bold mb-2">{t("news.notFoundTitle")}</h1>
            <p className="text-sm text-slate-400 mb-6">{t("news.notFoundDesc")}</p>
            <button
              onClick={() => navigate("/news")}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t("news.backToNews")}</span>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Trạng thái Lỗi máy chủ
  if (errorType === "server_error") {
    return (
      <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md p-8 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-xl font-bold mb-2">Không thể tải bài viết</h1>
            <p className="text-xs text-slate-300 mb-6">
              Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng thử lại.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Tải lại</span>
              </button>
              <button
                onClick={() => navigate("/news")}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Về trang tin tức</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isExternal = article.source_type === "external";
  const categorySlug = article.category?.slug;
  const relatedArticles = article.related_articles || [];

  return (
    <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between relative selection:bg-cyan-500 selection:text-black">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.2)_0%,rgba(6,182,212,0.08)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-400/10 blur-[160px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10 pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4">
          {/* Breadcrumbs & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Link to="/" className="hover:text-cyan-300 transition-colors">
                {t("news.home")}
              </Link>
              <ChevronRight size={12} />
              <Link to="/news" className="hover:text-cyan-300 transition-colors">
                {t("news.pageTitle")}
              </Link>
              <ChevronRight size={12} />
              <span className="text-cyan-300 font-semibold truncate max-w-[200px]">
                {getCategoryLabel(t, categorySlug) || article.category?.name}
              </span>
            </div>

            <button
              onClick={() => navigate("/news")}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t("news.backToNews")}</span>
            </button>
          </div>

          {/* Article Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading leading-tight tracking-tight mb-5">
            {article.title}
          </h1>

          {/* Article Metadata & Sharing Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-y border-white/10 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
              {isExternal ? (
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="text-slate-400">{t("news.sourceRef") || "Nguồn tham khảo:"}</span>
                  <a
                    href={article.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 decoration-cyan-400/40 hover:decoration-cyan-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{article.source?.name || article.external_url}</span>
                    <ExternalLink size={12} className="shrink-0 text-cyan-400/80" />
                  </a>
                </span>
              ) : (
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-[11px] shadow-md">
                    {getArticleByline(article)?.charAt(0)}
                  </span>
                  <span>{getArticleByline(article)}</span>
                </span>
              )}
              <span className="text-white/30">•</span>
              <span>{formatFullDate(article.published_at, language)}</span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-cyan-400" />
                {formatViews(article.view_count, language)} {t("news.views")}
              </span>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-cyan-200 font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              {copiedId === "share-btn" ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-300">{t("news.copied")}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-cyan-400" />
                  <span>{t("news.share")}</span>
                </>
              )}
            </button>
          </div>

          {/* Excerpt / Lead Paragraph */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-cyan-100 font-medium leading-relaxed mb-6 italic border-l-4 border-cyan-400 pl-4 py-1">
              {article.excerpt}
            </p>
          )}

          {/* Cover Image with Caption */}
          <figure className="mb-8">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/30">
              <img
                src={article.cover_url}
                alt={article.cover_caption || article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[520px] object-cover"
              />
            </div>
            {article.cover_caption && (
              <figcaption className="text-center text-xs sm:text-sm text-slate-300/85 mt-3 px-3 italic leading-relaxed">
                {article.cover_caption}
              </figcaption>
            )}
          </figure>

          {/* Article Body Content */}
          {article.content ? (
            /* Rich HTML Content */
            <div
              className="news-content-body prose prose-invert max-w-none text-slate-200 text-base md:text-lg leading-relaxed space-y-6 mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            /* Clean Excerpt Body for External Articles */
            <div className="text-slate-200 text-base md:text-lg leading-relaxed mb-12 space-y-4">
              <p>{article.excerpt}</p>
            </div>
          )}

          {/* External Article Callout */}
          {isExternal && article.external_url && (
            <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Đọc toàn bộ bài viết trên trang gốc
                </h3>
                <p className="text-xs text-slate-300">
                  Bài viết này được tổng hợp và dẫn nguồn từ {article.source?.name || "báo chí đối tác"}.
                </p>
              </div>
              <a
                href={article.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
              >
                <span>{t("news.readOriginal") || "Đọc bài gốc"}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Social Share Footer Callout */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-white mb-0.5">
                Chia sẻ câu chuyện đại dương này
              </h3>
              <p className="text-xs text-slate-400">
                Lan tỏa tri thức để bảo tồn và gìn giữ đại dương xanh cùng Pacific.
              </p>
            </div>
            <button
              onClick={handleShare}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              {copiedId === "share-btn" ? (
                <>
                  <Check size={14} />
                  <span>{t("news.copied")}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>{t("news.copyLink")}</span>
                </>
              )}
            </button>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="pt-8 border-t border-white/10">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white font-heading">
                  {t("news.relatedTitle")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedArticles.map((rel) => (
                  <NewsCard key={rel.id} article={rel} />
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
