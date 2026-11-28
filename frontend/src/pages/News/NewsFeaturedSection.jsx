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
        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading tracking-tight">
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
              className="group relative flex flex-col justify-end min-h-[420px] h-full rounded-3xl overflow-hidden p-6 md:p-8 border border-[#0f172a]/10 hover:border-sky-600/25 transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={mainFeatured.cover_url}
                alt={mainFeatured.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle top-to-bottom light framing */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/45 via-transparent to-transparent" />

              {/* Category Badge on Top Left */}
              <div className="absolute top-5 left-5 z-10">
                <span
                  className={`px-3 py-1 rounded-full border backdrop-blur-md text-xs font-semibold ${getCategoryStyle(
                    mainFeatured.category?.slug
                  )}`}
                >
                  {getCategoryLabel(t, mainFeatured.category?.slug)}
                </span>
              </div>

              {/* Bottom Liquid Glass Content Panel */}
              <div className="relative z-10 space-y-2.5 liquid-glass-strong rounded-2xl p-5">
                <p className="text-xs font-medium text-[#0284c7] flex items-center gap-2">
                  <span>{getArticleByline(mainFeatured)}</span>
                  <span className="text-[#475569]">•</span>
                  <span>{formatNewsDate(mainFeatured.published_at, language)}</span>
                </p>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] font-heading leading-tight group-hover:text-[#0284c7] transition-colors">
                  {mainFeatured.title}
                </h3>

                <p className="text-sm text-[#334155] line-clamp-2 leading-relaxed">
                  {mainFeatured.excerpt}
                </p>

                <div className="pt-2.5 flex items-center justify-between text-xs text-[#475569] border-t border-[#0f172a]/10">
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Eye size={14} className="text-[#0284c7]" />
                    {formatViews(mainFeatured.view_count, language)} {t("news.views")}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[#0284c7] font-semibold">
                    <span>{t("news.readMore")}</span>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Bài viết nổi bật phụ */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-4">
          {subFeatured.map((art) => (
            <NewsCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
