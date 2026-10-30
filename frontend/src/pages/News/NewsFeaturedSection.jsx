import { Link } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { NewsCard } from "./NewsCard";
import {
  getCategoryStyle,
  getCategoryLabel,
  formatNewsDate,
  formatViews,
  getArticleByline,
} from "./newsUtils";

export function NewsFeaturedSection({ featuredArticles = [] }) {
  const { t, language } = useLanguage();

  if (!featuredArticles.length) return null;

  const [mainFeatured, ...subFeatured] = featuredArticles;

  return (
    <section className="max-w-6xl mx-auto px-4 mb-16">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white font-heading tracking-tight">
          {t("news.featuredTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bài viết nổi bật chính */}
        {mainFeatured && (
          <div className="lg:col-span-7">
            <Link
              to={`/news/${mainFeatured.slug}`}
              id={`featured-main-${mainFeatured.id}`}
              className="group relative flex flex-col justify-end min-h-[420px] h-full rounded-3xl overflow-hidden p-6 md:p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={mainFeatured.cover_url}
                alt={mainFeatured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Deep ocean gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081326] via-[#081326]/60 to-transparent" />
              <div className="absolute inset-0 bg-cyan-950/20 group-hover:bg-transparent transition-colors duration-500" />

              {/* Category Badge on Top Left */}
              <div className="absolute top-5 left-5 z-10">
                <span
                  className={`px-3 py-1 rounded-full border backdrop-blur-md text-xs font-bold ${getCategoryStyle(
                    mainFeatured.category?.slug
                  )}`}
                >
                  {getCategoryLabel(t, mainFeatured.category?.slug)}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 space-y-3">
                <p className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                  <span>{getArticleByline(mainFeatured)}</span>
                  <span className="text-white/40">•</span>
                  <span>{formatNewsDate(mainFeatured.published_at, language)}</span>
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight group-hover:text-cyan-200 transition-colors">
                  {mainFeatured.title}
                </h3>

                <p className="text-sm md:text-base text-slate-200/90 line-clamp-3 leading-relaxed">
                  {mainFeatured.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-300 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-cyan-400" />
                    {formatViews(mainFeatured.view_count, language)} {t("news.views")}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-cyan-300 font-bold group-hover:translate-x-1 transition-transform">
                    <span>{t("news.readMore")}</span>
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Bài viết nổi bật phụ */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {subFeatured.map((art) => (
            <NewsCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
