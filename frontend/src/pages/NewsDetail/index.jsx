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
  Layers,
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
      let brandName = "Pacific";
      try {
        const saved = localStorage.getItem("pacific_system_settings");
        if (saved) brandName = JSON.parse(saved)?.general?.websiteName || brandName;
      } catch (_) {}
      setPageMeta(
        `${article.title} | ${t("news.pageTitle")} - ${brandName}`,
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
      <div className="min-h-screen text-white flex flex-col justify-between relative selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 relative z-10 pt-24 pb-20 max-w-4xl mx-auto px-4 w-full">
          {/* Skeleton Breadcrumbs */}
          <div className="w-48 h-4 liquid-glass-subtle rounded mb-6 animate-pulse" />
          {/* Skeleton Title */}
          <div className="space-y-3 mb-6 animate-pulse">
            <div className="w-full h-10 bg-white/15 rounded-xl" />
            <div className="w-2/3 h-10 bg-white/15 rounded-xl" />
          </div>
          {/* Skeleton Meta Bar */}
          <div className="w-full h-10 liquid-glass-subtle rounded-xl mb-6 animate-pulse" />
          {/* Skeleton Cover Image */}
          <div className="w-full h-[380px] md:h-[460px] liquid-glass-subtle rounded-3xl mb-8 animate-pulse" />
          {/* Skeleton Content Paragraphs */}
          <div className="space-y-4 animate-pulse">
            <div className="w-full h-4 liquid-glass-subtle rounded" />
            <div className="w-5/6 h-4 liquid-glass-subtle rounded" />
            <div className="w-4/5 h-4 liquid-glass-subtle rounded" />
            <div className="w-full h-4 liquid-glass-subtle rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Trạng thái Không tìm thấy bài viết (404)
  if (errorType === "not_found" || (!isLoading && !article && !errorType)) {
    return (
      <div className="min-h-screen text-[#0f172a] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md p-8 rounded-3xl bg-white/[0.03] border border-[#0f172a]/10 backdrop-blur-xl">
            <h1 className="text-2xl font-bold mb-2">{t("news.notFoundTitle")}</h1>
            <p className="text-sm text-[#475569] mb-6">{t("news.notFoundDesc")}</p>
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
      <div className="min-h-screen text-[#0f172a] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md p-8 rounded-3xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-rose-700 mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-xl font-bold mb-2">Không thể tải bài viết</h1>
            <p className="text-xs text-[#334155] mb-6">
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
                className="px-5 py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/90 text-[#0f172a] font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
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
    <div className="min-h-screen text-[#0f172a] flex flex-col justify-between relative overflow-x-clip selection:bg-sky-500/20">
      {/* Subtle Ambient Light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.14)_0%,rgba(6,182,212,0.05)_35%,transparent_70%)] pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10 pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4">
          {/* Breadcrumbs & Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
            <div className="flex items-center gap-2 text-[#475569]">
              <Link to="/" className="hover:text-[#0284c7] transition-colors">
                {t("news.home")}
              </Link>
              <ChevronRight size={12} />
              <Link to="/news" className="hover:text-[#0284c7] transition-colors">
                {t("news.pageTitle")}
              </Link>
              <ChevronRight size={12} />
              <span className="text-[#0284c7] font-semibold truncate max-w-[200px]">
                {getCategoryLabel(t, categorySlug) || article.category?.name}
              </span>
            </div>

            <button
              onClick={() => navigate("/news")}
              className="inline-flex items-center gap-1.5 text-[#334155] hover:text-[#0284c7] font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t("news.backToNews")}</span>
            </button>
          </div>

          {/* Article Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] font-heading leading-tight tracking-tight mb-5">
            {article.title}
          </h1>

          {/* Article Metadata & Sharing Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-y border-[#0f172a]/10 text-xs text-[#334155]">
            <div className="flex flex-wrap items-center gap-4">
              {isExternal ? (
                <span className="font-medium text-[#334155] flex items-center gap-1.5">
                  <span className="text-[#475569]">{t("news.sourceRef") || "Nguồn tham khảo:"}</span>
                  <a
                    href={article.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0284c7] hover:text-[#0284c7] font-bold underline underline-offset-4 decoration-cyan-400/40 hover:decoration-cyan-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>{article.source?.name || article.external_url}</span>
                    <ExternalLink size={12} className="shrink-0 text-[#0284c7]" />
                  </a>
                </span>
              ) : (
                <span className="font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-[#0f172a] font-bold text-[11px] shadow-md">
                    {getArticleByline(article)?.charAt(0)}
                  </span>
                  <span>{getArticleByline(article)}</span>
                </span>
              )}
              <span className="text-[#475569]">•</span>
              <span>{formatFullDate(article.published_at, language)}</span>
              <span className="text-[#475569]">•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-[#0284c7]" />
                {formatViews(article.view_count, language)} {t("news.views")}
              </span>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-subtle hover:bg-sky-600/10 border border-[#0f172a]/10 hover:border-sky-600/25 text-[#334155] hover:text-[#0284c7] font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              {copiedId === "share-btn" ? (
                <>
                  <Check size={14} className="text-emerald-700" />
                  <span className="text-emerald-700">{t("news.copied")}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-[#0284c7]" />
                  <span>{t("news.share")}</span>
                </>
              )}
            </button>
          </div>

          {/* Excerpt / Lead Paragraph */}
          {article.excerpt && (
            <p className="text-base sm:text-lg text-[#1e293b] font-medium leading-relaxed mb-6 italic border-l-4 border-[#0284c7] pl-4 py-1">
              {article.excerpt}
            </p>
          )}

          {/* Fun Fact Metric Callout */}
          {article.stat_val && (
            <div className="mb-8 p-5 rounded-2xl liquid-glass-strong flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
              <div className="space-y-1.5 text-center sm:text-left">
                {article.badge && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-600/12 text-[#0284c7] border border-sky-600/25">
                    {article.badge}
                  </span>
                )}
                <h3 className="text-sm font-semibold text-[#334155]">
                  Thông số ấn tượng từ chuyên mục &ldquo;Có thể bạn chưa biết&rdquo;
                </h3>
              </div>
              <div className="px-6 py-3.5 rounded-2xl bg-white/85 border border-[#0f172a]/10 text-center w-full sm:w-auto sm:min-w-[200px] shrink-0">
                <p className="text-2xl sm:text-3xl font-bold text-[#0284c7] font-heading">
                  {article.stat_val}
                </p>
                {article.stat_title && (
                  <p className="text-xs text-[#475569] font-semibold tracking-wider mt-1">
                    {article.stat_title}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cover Image with Caption */}
          <figure className="mb-8">
            <div className="relative rounded-2xl overflow-hidden border border-[#0f172a]/10 shadow-md bg-white/60">
              <img
                src={article.cover_url}
                alt={article.cover_caption || article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[480px] object-cover"
              />
            </div>
            {article.cover_caption && (
              <figcaption className="text-center text-xs sm:text-sm text-[#334155] mt-3 px-3 italic leading-relaxed">
                {article.cover_caption}
              </figcaption>
            )}
          </figure>

          {/* Article Body Content */}
          {article.content ? (
            /* Rich HTML Content */
            <div
              className="news-content-body prose prose-slate max-w-none text-[#1e293b] text-sm sm:text-base md:text-lg leading-relaxed space-y-5 mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            /* Clean Excerpt Body for External Articles */
            <div className="text-[#1e293b] text-sm sm:text-base md:text-lg leading-relaxed mb-12 space-y-4">
              <p>{article.excerpt}</p>
            </div>
          )}

          {/* Article Gallery (Bộ sưu tập ảnh) */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="mb-12 space-y-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#0284c7]" />
                <h3 className="text-lg font-bold text-[#0f172a] font-heading">
                  Bộ sưu tập ảnh ({article.gallery.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {article.gallery.map((imgUrl, idx) => (
                  <a
                    key={`${imgUrl}-${idx}`}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-2xl overflow-hidden border border-[#0f172a]/10 aspect-video group liquid-glass-strong shadow-md block cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={`Ảnh minh họa ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#0f172a] text-xs font-semibold gap-1.5">
                      <ExternalLink size={16} />
                      <span>Xem kích thước gốc</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* External Article Callout */}
          {isExternal && article.external_url && (
            <div className="p-5 sm:p-6 rounded-2xl liquid-glass-strong flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div className="text-center sm:text-left">
                <h3 className="text-base font-bold text-[#0f172a] mb-1">
                  Đọc toàn bộ bài viết trên trang gốc
                </h3>
                <p className="text-xs text-[#334155]">
                  Bài viết này được tổng hợp và dẫn nguồn từ {article.source?.name || "báo chí đối tác"}.
                </p>
              </div>
              <a
                href={article.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                <span>{t("news.readOriginal") || "Đọc bài gốc"}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Social Share Footer Callout */}
          <div className="p-5 sm:p-6 rounded-2xl liquid-glass flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-[#0f172a] mb-0.5">
                Chia sẻ câu chuyện đại dương này
              </h3>
              <p className="text-xs text-[#475569]">
                Lan tỏa tri thức để bảo tồn và gìn giữ đại dương xanh cùng Pacific.
              </p>
            </div>
            <button
              onClick={handleShare}
              className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
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
            <section className="pt-8 border-t border-[#0f172a]/10">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading">
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
