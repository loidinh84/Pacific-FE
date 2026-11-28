import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  getCategoryStyle,
  getCategoryLabel,
  formatNewsDate,
  formatViews,
  getArticleByline,
} from "./newsUtils";

/**
 * Thẻ hiển thị bài viết
 *
 * @param {object}  article  Dữ liệu bài viết
 * @param {"default"|"compact"} variant
 *   - default: thẻ dạng lưới
 *   - compact: thẻ dạng danh sách nhỏ
 */
export function NewsCard({ article, variant = "default", style }) {
  const { t, language } = useLanguage();
  const isExternal = article.source_type === "external";
  const categorySlug = article.category?.slug;

  if (variant === "compact") {
    return (
      <Link
        to={`/news/${article.slug}`}
        id={`news-card-compact-${article.id}`}
        style={style}
        className="group flex gap-4 p-3 rounded-2xl liquid-glass liquid-glass-interactive news-fade-up"
      >
        <div className="relative w-28 h-24 sm:w-36 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-sky-100">
          <img
            src={article.cover_url}
            alt={article.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between min-w-0 py-0.5">
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-medium mb-1.5 ${getCategoryStyle(
                categorySlug
              )}`}
            >
              {getCategoryLabel(t, categorySlug)}
            </span>
            <h3 className="text-sm font-bold text-[#0f172a] font-heading leading-snug line-clamp-2 group-hover:text-[#0284c7] transition-colors">
              {article.title}
            </h3>
          </div>
          <p className="text-[11px] text-[#475569] flex items-center gap-1.5 mt-1">
            <span className="truncate">{getArticleByline(article)}</span>
            <span className="text-[#0f172a]/20">•</span>
            <span className="shrink-0">
              {formatNewsDate(article.published_at, language)}
            </span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${article.slug}`}
      id={`news-card-${article.id}`}
      style={style}
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden liquid-glass liquid-glass-interactive news-fade-up"
    >
      {/* Ảnh bìa */}
      <div className="relative h-52 overflow-hidden bg-sky-100">
        <img
          src={article.cover_url}
          alt={article.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/35 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-full border backdrop-blur-md text-[11px] font-medium ${getCategoryStyle(
              categorySlug
            )}`}
          >
            {getCategoryLabel(t, categorySlug)}
          </span>
          {article.language === "en" && (
            <span className="px-2 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white text-[10px] font-semibold text-[#0f172a]">
              EN
            </span>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <p className="text-[11px] font-medium text-[#0284c7] mb-1.5">
          {isExternal ? (
            `${t("news.via")} ${article.source?.name}`
          ) : (
            article.author?.full_name || t("news.sourceInternal", "Ban biên tập")
          )}
        </p>
        <h3 className="text-lg font-bold text-[#0f172a] font-heading leading-snug line-clamp-2 group-hover:text-[#0284c7] transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-[#334155] leading-relaxed line-clamp-3 mb-4">
          {article.excerpt}
        </p>

        <div className="mt-auto pt-3.5 border-t border-[#0f172a]/8 flex items-center justify-between text-[11px] text-[#475569]">
          <span>{formatNewsDate(article.published_at, language)}</span>
          <span className="flex items-center gap-1 tabular-nums">
            <Eye size={12} />
            {formatViews(article.view_count, language)} {t("news.views")}
          </span>
        </div>
      </div>
    </Link>
  );
}
