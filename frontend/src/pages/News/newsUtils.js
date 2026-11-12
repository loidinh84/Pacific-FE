/**
 * newsUtils.js — Các hàm tiện ích dùng chung cho trang Tin tức & Chi tiết tin
 */

/** Màu sắc theo chuyên mục */
export const CATEGORY_STYLES = {
  conservation: "bg-emerald-950/85 border-emerald-400/50 text-emerald-300 shadow-sm",
  discovery: "bg-sky-950/85 border-sky-400/50 text-sky-300 shadow-sm",
  "east-sea": "bg-cyan-950/85 border-cyan-400/50 text-cyan-300 shadow-sm",
  "fun-facts": "bg-amber-950/85 border-amber-400/50 text-amber-300 shadow-sm",
  events: "bg-orange-950/85 border-orange-400/50 text-orange-300 shadow-sm",
  research: "bg-fuchsia-950/85 border-fuchsia-400/50 text-fuchsia-300 shadow-sm",
};

export const getCategoryStyle = (slug) =>
  CATEGORY_STYLES[slug] || "bg-slate-900/85 border-white/25 text-white/90 shadow-sm";

/** Lấy tên chuyên mục đã dịch theo ngôn ngữ hiện tại */
export const getCategoryLabel = (t, slug) =>
  slug ? t(`news.categories.${slug}`, slug) : "";

/**
 * Định dạng ngày đăng:
 *  - Dưới 7 ngày  → "2 ngày trước" / "3 hours ago"
 *  - Cũ hơn       → "20 thg 10, 2026" / "Oct 20, 2026"
 */
export function formatNewsDate(dateString, language = "vi") {
  if (!dateString) return "";
  const date = new Date(dateString);
  const locale = language === "en" ? "en-US" : "vi-VN";
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.round(diffMs / 3_600_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffHours >= 0 && diffHours < 1) {
    return rtf.format(-Math.max(1, Math.round(diffMs / 60_000)), "minute");
  }
  if (diffHours >= 0 && diffHours < 24) return rtf.format(-diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (diffDays >= 0 && diffDays < 7) return rtf.format(-diffDays, "day");

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Ngày đầy đủ cho trang chi tiết, ví dụ: "Thứ Bảy, 24 tháng 10, 2026" */
export function formatFullDate(dateString, language = "vi") {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(
    language === "en" ? "en-US" : "vi-VN",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );
}

/** Ước tính thời gian đọc theo số từ */
export function estimateReadingMinutes(article) {
  const raw = article?.content || article?.excerpt || "";
  const text = raw.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Rút gọn số lượt xem: 3842 → "3,8K" */
export function formatViews(count = 0, language = "vi") {
  return new Intl.NumberFormat(language === "en" ? "en-US" : "vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(count) || 0);
}

/** Tên hiển thị của người/nguồn đăng bài */
export const getArticleByline = (article) =>
  article?.source_type === "external"
    ? article?.source?.name
    : article?.author?.full_name || "Pacific";

/** Cập nhật tiêu đề trang và thẻ meta */
export function setPageMeta(title, description) {
  if (title) document.title = title;
  if (description === undefined) return;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", description);
}
