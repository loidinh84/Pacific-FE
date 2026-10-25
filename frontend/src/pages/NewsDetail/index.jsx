import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { NEWS_ARTICLES } from "../../mocks/newsMock";
import { NewsCard } from "../News/NewsCard";
import { useLanguage } from "../../hooks/useLanguage";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import {
  getCategoryStyle,
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
} from "lucide-react";

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { copiedId, copy } = useCopyToClipboard();

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Find article
  const article = useMemo(() => {
    return (
      NEWS_ARTICLES.find((a) => a.slug === slug || String(a.id) === slug) || null
    );
  }, [slug]);

  // Related articles (same category or others, max 3)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return NEWS_ARTICLES.filter((a) => a.id !== article.id)
      .sort((a, b) => {
        const sameCatA = a.category?.slug === article.category?.slug ? 1 : 0;
        const sameCatB = b.category?.slug === article.category?.slug ? 1 : 0;
        return sameCatB - sameCatA;
      })
      .slice(0, 3);
  }, [article]);

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

  if (!article) {
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

  const isExternal = article.source_type === "external";
  const categorySlug = article.category?.slug;

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
                {getCategoryLabel(t, categorySlug)}
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

          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/10">
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full h-[320px] sm:h-[420px] md:h-[480px] object-cover"
            />
          </div>

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
