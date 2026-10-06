/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Search,
  AlertTriangle,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  X,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import ConfirmModal from "../Species/ConfirmModal";
import {
  fetchAdminComments,
  deleteAdminComment,
  restoreAdminComment,
  dismissAdminCommentReports,
  toggleHideAdminComment,
} from "../../../services/adminCommentsApi";

// Helper định dạng thời gian tương đối
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "Vừa xong";
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function CommentsManagement() {
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  // State dữ liệu & điều khiển
  const [comments, setComments] = useState([]);
  const [counts, setCounts] = useState({ all: 0, reported: 0, deleted: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'reported' | 'deleted' | 'today'
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Modal xác nhận
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    variant: "danger",
    action: null,
    isLoading: false,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load danh sách bình luận từ backend
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchAdminComments({
        page,
        limit,
        tab: activeTab,
        search: debouncedSearch,
      });

      if (res?.success) {
        setComments(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        if (res.counts) {
          setCounts(res.counts);
        }
      } else {
        showToast(res?.error || "Không thể tải danh sách bình luận", "error");
      }
    } catch (err) {
      console.error("Error loading comments:", err);
      showToast("Lỗi kết nối khi tải danh sách bình luận", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, activeTab, debouncedSearch, showToast]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Xử lý Xóa mềm
  const handleDeleteComment = (comment) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa bình luận",
      message: `Bạn có chắc chắn muốn chuyển bình luận của "${comment.user?.fullName || "người dùng"}" vào thùng rác?`,
      confirmText: "Xóa bình luận",
      variant: "danger",
      isLoading: false,
      action: async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }));
          const res = await deleteAdminComment(comment.id);
          if (res?.success) {
            showToast("Đã chuyển bình luận vào thùng rác", "success");
            loadComments();
            window.dispatchEvent(new Event("pacific_admin_notification_update"));
          } else {
            showToast(res?.error || "Không thể xóa bình luận", "error");
          }
        } catch {
          showToast("Lỗi khi thực hiện xóa bình luận", "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  // Xử lý Giữ bình luận
  const handleDismissReports = (comment) => {
    setConfirmModal({
      isOpen: true,
      title: "Giữ bình luận",
      message: `Bạn muốn giữ bình luận này và bỏ qua toàn bộ ${comment.reportCount || 1} báo cáo vi phạm?`,
      confirmText: "Giữ bình luận",
      variant: "info",
      isLoading: false,
      action: async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }));
          const res = await dismissAdminCommentReports(comment.id);
          if (res?.success) {
            showToast("Đã giữ bình luận và bỏ qua các báo cáo vi phạm", "success");
            loadComments();
            window.dispatchEvent(new Event("pacific_admin_notification_update"));
          } else {
            showToast(res?.error || "Không thể xử lý yêu cầu", "error");
          }
        } catch {
          showToast("Lỗi khi thực hiện giữ bình luận", "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  // Xử lý Khôi phục bình luận đã xóa
  const handleRestoreComment = async (comment) => {
    try {
      const res = await restoreAdminComment(comment.id);
      if (res?.success) {
        showToast("Đã khôi phục bình luận thành công", "success");
        loadComments();
      } else {
        showToast(res?.error || "Không thể khôi phục bình luận", "error");
      }
    } catch {
      showToast("Lỗi khi thực hiện khôi phục bình luận", "error");
    }
  };

  // Xử lý Ẩn / Hiện bình luận
  const handleToggleHide = async (comment) => {
    try {
      const res = await toggleHideAdminComment(comment.id);
      if (res?.success) {
        showToast(res.message, "success");
        loadComments();
      } else {
        showToast(res?.error || "Không thể đổi trạng thái", "error");
      }
    } catch {
      showToast("Lỗi khi thực hiện đổi trạng thái bình luận", "error");
    }
  };

  // Tabs cấu hình bám sát mockup Figma
  const tabs = [
    { id: "all", label: "Tất cả", count: counts.all },
    { id: "reported", label: "Bị báo cáo", count: counts.reported, isDanger: true },
    { id: "deleted", label: "Đã xóa", count: counts.deleted },
    { id: "today", label: "Hôm nay", count: counts.today },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header & Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
            Quản lý bình luận
          </h1>
        </div>

        <button
          onClick={loadComments}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer self-start sm:self-auto ${
            isDark
              ? "bg-[#162040] border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
          }`}
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-cyan-400" : ""} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Thanh tìm kiếm & Các nút bộ lọc dạng Pill Chips (Chuẩn Figma) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Input Tìm kiếm */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all flex-1 min-w-[240px] max-w-md ${
            isDark
              ? "bg-[#121c38] border-white/10 focus-within:border-cyan-500/50"
              : "bg-white border-slate-200 focus-within:border-cyan-500 shadow-sm"
          }`}
        >
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm nội dung, tên người..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-transparent text-xs sm:text-sm outline-none ${
              isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Tabs Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? tab.isDanger
                      ? "bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-950/30"
                      : isDark
                      ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-sm shadow-cyan-950/30"
                      : "bg-cyan-50 border-cyan-400 text-cyan-800 shadow-sm"
                    : isDark
                    ? "bg-[#121c38] border-white/10 hover:border-white/20 text-slate-400 hover:text-white"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                      tab.isDanger
                        ? "bg-rose-500/30 text-rose-300"
                        : isActive
                        ? isDark
                          ? "bg-cyan-400/20 text-cyan-300"
                          : "bg-cyan-200 text-cyan-900"
                        : isDark
                        ? "bg-white/10 text-slate-400"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Danh sách thẻ bình luận */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 animate-pulse space-y-3.5 ${
                isDark ? "bg-[#142040]/70 border-white/10" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700/40" />
                  <div className="h-4 w-48 bg-slate-700/40 rounded-md" />
                </div>
                <div className="h-8 w-20 bg-slate-700/30 rounded-xl" />
              </div>
              <div className="h-10 w-full bg-slate-700/20 rounded-xl" />
            </div>
          ))
        ) : !comments.length ? (
          // Empty State
          <div
            className={`rounded-2xl border p-12 text-center space-y-3.5 ${
              isDark ? "bg-[#142040]/50 border-white/10" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              {activeTab === "reported" ? (
                <ShieldCheck size={28} className="text-emerald-400" />
              ) : activeTab === "deleted" ? (
                <Trash2 size={28} className="text-slate-400" />
              ) : (
                <MessageSquare size={28} className="text-cyan-400" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {activeTab === "reported"
                  ? "Không có báo cáo vi phạm nào"
                  : activeTab === "deleted"
                  ? "Thùng rác rỗng"
                  : "Chưa có bình luận nào phù hợp"}
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {activeTab === "reported"
                  ? "Tất cả bình luận đều tuân thủ quy tắc và không có báo cáo vi phạm cần duyệt."
                  : activeTab === "deleted"
                  ? "Không có bình luận nào đã bị xóa trong danh sách."
                  : searchQuery
                  ? "Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác."
                  : "Người dùng chưa gửi bình luận nào trong hệ thống."}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Xóa từ khóa tìm kiếm</span>
              </button>
            )}
          </div>
        ) : (
          // Render danh sách bình luận (Bám sát mockup Figma)
          comments.map((comment) => {
            const isDeleted = comment.status === "deleted" || Boolean(comment.deletedAt) || activeTab === "deleted";
            const isReported = !isDeleted && (comment.hasPendingReports || activeTab === "reported");
            const userInitial = (comment.user?.fullName || comment.user?.username || "N")[0]?.toUpperCase();

            return (
              <div
                key={comment.id}
                className={`rounded-2xl border p-5 transition-all duration-200 space-y-3.5 ${
                  isDeleted
                    ? isDark
                      ? "bg-[#11182c]/80 border-white/5 opacity-85"
                      : "bg-slate-50 border-slate-200 opacity-90"
                    : isReported
                    ? isDark
                      ? "bg-[#181a38] border-rose-500/35 hover:border-rose-500/50 shadow-sm shadow-rose-950/20"
                      : "bg-rose-50/50 border-rose-200 hover:border-rose-300"
                    : isDark
                    ? "bg-[#142040] border-white/10 hover:border-white/20 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Header Thẻ: Người dùng + Sinh vật + Thời gian + Nút Hành động */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar Circle */}
                    <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-500 border border-white/20 flex items-center justify-center font-bold text-sm text-white shadow-inner">
                      {comment.user?.avatarUrl ? (
                        <img
                          src={comment.user.avatarUrl}
                          alt={comment.user.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </div>

                    {/* Metadata: User name • Species link • Time */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
                        <span className={`font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                          {comment.user?.fullName || comment.user?.username || "Người dùng ẩn danh"}
                        </span>

                        <span className="text-slate-500">•</span>

                        {comment.species ? (
                          <Link
                            to={`/species/${comment.species.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 transition-colors"
                            title="Xem chi tiết loài sinh vật này"
                          >
                            <span>{comment.species.commonName}</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </Link>
                        ) : (
                          <span className="font-semibold text-cyan-400">Đóng góp ý kiến</span>
                        )}

                        <span className="text-slate-500">•</span>

                        <span className={`text-[11px] sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {formatRelativeTime(comment.createdAt)}
                        </span>

                        {comment.status === "hidden" && !isDeleted && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-400">
                            Đang tạm ẩn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động bên phải (Chuẩn Figma) */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    {isDeleted ? (
                      /* Chế độ ĐÃ XÓA (Image 3): Có nhãn thời gian xóa + nút Khôi phục */
                      <div className="flex flex-col sm:items-end gap-1.5">
                        <span className={`text-[11px] flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          <Clock size={11} />
                          <span>Đã xóa {formatRelativeTime(comment.deletedAt)}</span>
                        </span>
                        <button
                          onClick={() => handleRestoreComment(comment)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isDark
                              ? "bg-white/5 border-white/15 hover:bg-white/10 text-white"
                              : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <RotateCcw size={13} />
                          <span>Khôi phục</span>
                        </button>
                      </div>
                    ) : isReported ? (
                      /* Chế độ BỊ BÁO CÁO (Image 2): Nút Xóa và Nút Giữ */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteComment(comment)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isDark
                              ? "bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25 text-rose-300"
                              : "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700"
                          }`}
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => handleDismissReports(comment)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isDark
                              ? "bg-white/5 border-white/15 hover:bg-white/10 text-white hover:text-cyan-300"
                              : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          Giữ
                        </button>
                      </div>
                    ) : (
                      /* Chế độ BÌNH THƯỜNG / TẤT CẢ (Image 1): Nút Ẩn và Nút Xóa */
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleHide(comment)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            comment.status === "hidden"
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                              : isDark
                              ? "border-white/10 hover:bg-white/10 text-slate-400 hover:text-white"
                              : "border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                          }`}
                          title={comment.status === "hidden" ? "Hiển thị lại bình luận" : "Tạm ẩn bình luận"}
                        >
                          {comment.status === "hidden" ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isDark
                              ? "bg-white/5 border-white/15 hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-300 text-slate-300"
                              : "bg-slate-100 border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700"
                          }`}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nội dung bình luận (trong ngoặc kép như Figma) */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed pl-1 ${
                    isDeleted
                      ? "italic text-slate-500"
                      : isDark
                      ? "text-slate-200"
                      : "text-slate-700"
                  }`}
                >
                  “{comment.content}”
                </p>

                {/* Khung Lý do Báo cáo Vi phạm (Hiển thị nổi bật theo Figma Image 2 khi chưa bị xóa) */}
                {!isDeleted && comment.reportSummaries && comment.reportSummaries.length > 0 && (
                  <div
                    className={`rounded-xl p-3.5 border transition-all space-y-1.5 ${
                      isDark
                        ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                        : "bg-rose-50/80 border-rose-200 text-rose-900"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>Lý do báo cáo:</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {comment.reportSummaries.map((item, idx) => (
                        <p key={idx} className="leading-relaxed">
                          “{item.reason}” —{" "}
                          <span className="font-semibold text-rose-300">
                            Báo cáo bởi {item.count} người dùng
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nhãn chú thích nhẹ nếu bình luận từng bị báo cáo trong thùng rác */}
                {isDeleted && comment.reportSummaries && comment.reportSummaries.length > 0 && (
                  <div className="pt-0.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                      isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      <AlertTriangle size={12} className="opacity-60" />
                      <span>Từng nhận báo cáo vi phạm trước khi xóa</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Phân trang dưới cùng (Chuẩn Figma: << < 1 2 3 > >>) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              page === 1
                ? "opacity-30 cursor-not-allowed border-transparent text-slate-500"
                : isDark
                ? "border-white/10 hover:bg-white/10 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Trang đầu"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              page === 1
                ? "opacity-30 cursor-not-allowed border-transparent text-slate-500"
                : isDark
                ? "border-white/10 hover:bg-white/10 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Danh sách các số trang */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            // Chỉ hiển thị trong khoảng lân cận trang hiện tại nếu nhiều trang
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 2 && pageNum <= page + 2)
            ) {
              const isCurrent = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : isDark
                      ? "hover:bg-white/10 text-slate-400 hover:text-white"
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            if (pageNum === page - 3 || pageNum === page + 3) {
              return (
                <span key={pageNum} className="text-slate-500 px-1">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              page === totalPages
                ? "opacity-30 cursor-not-allowed border-transparent text-slate-500"
                : isDark
                ? "border-white/10 hover:bg-white/10 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Trang kế tiếp"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              page === totalPages
                ? "opacity-30 cursor-not-allowed border-transparent text-slate-500"
                : isDark
                ? "border-white/10 hover:bg-white/10 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
            title="Trang cuối"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      )}

      {/* Modal Xác nhận Hành động */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        isLoading={confirmModal.isLoading}
        onConfirm={confirmModal.action}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
