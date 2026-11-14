import {
  X,
  Calendar,
  Eye,
  Sparkles,
  ExternalLink,
  Pencil,
  Tag,
  Newspaper,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";

const formatDate = (dateStr) => {
  if (!dateStr) return "Chưa cập nhật";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NewsDetailModal({
  isOpen,
  onClose,
  article,
  onEdit,
}) {
  const { isDark } = useTheme();

  if (!isOpen || !article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl transition-all my-8 overflow-hidden flex flex-col max-h-[90vh] ${
          isDark
            ? "bg-[#112d4e] border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header Modal - Gọn gàng, không có tiêu đề phụ */}
        <div
          className={`flex items-start justify-between gap-4 px-6 py-4 border-b shrink-0 ${
            isDark ? "border-white/10 bg-[#0f2744]" : "border-slate-100 bg-slate-50"
          }`}
        >
          <div className="space-y-1.5 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              {article.category?.name && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-400/30">
                  {article.category.name}
                </span>
              )}
              {article.status === "published" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
                  <CheckCircle2 size={12} />
                  <span>Đã xuất bản</span>
                </span>
              )}
              {article.status === "draft" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-400/30">
                  <Clock size={12} />
                  <span>Bản nháp</span>
                </span>
              )}
              {article.status === "archived" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-400 border border-slate-400/30">
                  <Archive size={12} />
                  <span>Lưu trữ</span>
                </span>
              )}
              {article.is_featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Nổi bật</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold font-heading line-clamp-2">
              {article.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              isDark
                ? "hover:bg-white/10 text-slate-300"
                : "hover:bg-slate-200 text-slate-500"
            }`}
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung chi tiết bài đăng */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Ảnh bìa */}
          {article.cover_url ? (
            <div className="space-y-1.5">
              <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                <img
                  src={article.cover_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.cover_caption && (
                <p className="text-xs italic text-slate-400 text-center">
                  {article.cover_caption}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Newspaper size={32} className="opacity-40" />
              <span className="text-xs">Bài viết chưa có ảnh bìa</span>
            </div>
          )}

          {/* Khối thông số ấn tượng (dành cho bài Có thể bạn chưa biết) */}
          {(article.stat_val || article.badge) && (
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark
                  ? "bg-amber-500/10 border-amber-400/30 text-amber-100"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="space-y-1 text-center sm:text-left">
                {article.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {article.badge}
                  </span>
                )}
                <p className="text-xs text-slate-300">
                  Thông số nổi bật hiển thị ở thẻ &ldquo;Có thể bạn chưa biết&rdquo;
                </p>
              </div>

              {article.stat_val && (
                <div className="p-3 rounded-xl bg-black/30 border border-amber-400/30 text-center min-w-[180px]">
                  <p className="text-xl sm:text-2xl font-black text-amber-300 font-heading">
                    {article.stat_val}
                  </p>
                  {article.stat_title && (
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      {article.stat_title}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dải thông số bài viết */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border text-xs ${
              isDark ? "bg-[#183c66]/50 border-white/10" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-sky-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Xuất bản lúc</p>
                <p className="font-semibold">{formatDate(article.published_at || article.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye size={15} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Tổng lượt xem</p>
                <p className="font-semibold">{Number(article.view_count || 0).toLocaleString("vi-VN")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Tag size={15} className="text-purple-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Đường dẫn tĩnh</p>
                <p className="font-mono text-cyan-400 truncate">/{article.slug}</p>
              </div>
            </div>
          </div>

          {/* Nguồn tin chính thống (Nếu dẫn nguồn ngoài) */}
          {article.source_type === "external" && (
            <div
              className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark
                  ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>
                  Nguồn tin chính thống:{" "}
                  <strong className="font-bold">
                    {article.source?.name || "Cơ quan báo chí đối tác"}
                  </strong>
                </span>
              </div>
              {article.external_url && (
                <a
                  href={article.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                >
                  <span>Mở bài báo gốc</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          )}

          {/* Bộ sưu tập ảnh (Gallery) */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-cyan-400" />
                <p className="text-xs font-semibold text-slate-400">
                  Bộ sưu tập ảnh ({article.gallery.length})
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.gallery.map((imgUrl, i) => (
                  <a
                    key={`${imgUrl}-${i}`}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-xl overflow-hidden border border-white/10 aspect-video group bg-slate-900 cursor-pointer block shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`Ảnh minh họa ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      <ExternalLink size={14} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Đoạn tóm tắt (Excerpt) */}
          {article.excerpt && (
            <div
              className={`p-4 rounded-xl border-l-4 border-l-sky-500 border transition-all ${
                isDark
                  ? "bg-[#183c66]/30 border-white/10 text-slate-200"
                  : "bg-sky-50/60 border-slate-200 text-slate-700"
              }`}
            >
              <p className="text-xs font-semibold text-sky-400 mb-1.5">
                Tóm tắt nội dung
              </p>
              <p className="text-xs sm:text-sm leading-relaxed italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Nội dung toàn văn */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400">
              Nội dung bài viết
            </p>
            {article.content || article.clean_content ? (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed space-y-4 news-content-body prose max-w-none ${
                  isDark
                    ? "bg-[#183c66]/20 border-white/10 text-slate-100 prose-invert"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
                dangerouslySetInnerHTML={{ __html: article.content || article.clean_content }}
              />
            ) : (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed italic ${
                  isDark
                    ? "bg-[#183c66]/20 border-white/10 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                Chưa có nội dung chi tiết cho bài viết này.
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div
          className={`flex items-center justify-between gap-3 px-6 py-3.5 border-t shrink-0 ${
            isDark ? "border-white/10 bg-[#0f2744]" : "border-slate-100 bg-slate-50"
          }`}
        >
          <Link
            to={`/news/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer transition-colors"
          >
            <ExternalLink size={14} />
            <span>Xem trên website</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(article);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Pencil size={13} />
              <span>Chỉnh sửa bài viết</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 border-white/15 text-white"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
