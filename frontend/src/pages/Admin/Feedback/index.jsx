import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  RefreshCw,
  Star,
  Clock,
  User,
  Users,
  UserX,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import ConfirmModal from "../Species/ConfirmModal";
import {
  fetchAdminFeedback,
  deleteAdminFeedback,
} from "../../../services/feedbackApi";

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
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function FeedbackManagement() {
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    guest: 0,
    user: 0,
    avgRating: 5.0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(""); // "" | "5" | "4" | "3" | "2" | "1"
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // 'all' | 'user' | 'guest'

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8;

  // Confirm Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    isLoading: false,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load feedback from API
  const loadFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch || undefined,
        rating: ratingFilter || undefined,
        userType: userTypeFilter !== "all" ? userTypeFilter : undefined,
      };

      const res = await fetchAdminFeedback(params);
      if (res?.success) {
        setFeedbackList(res.data.items || []);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalCount(res.data.pagination.total || 0);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      } else {
        showToast("Không thể tải danh sách ý kiến đóng góp", "error");
      }
    } catch (err) {
      console.error("Lỗi khi tải ý kiến đóng góp:", err);
      showToast(err.response?.data?.message || "Lỗi kết nối máy chủ", "error");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, ratingFilter, userTypeFilter, showToast]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  // Handle Delete
  const handleDeleteClick = (id) => {
    setConfirmModal({
      isOpen: true,
      id,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.id) return;
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await deleteAdminFeedback(confirmModal.id);
      if (res?.success) {
        showToast("Đã xóa ý kiến đóng góp thành công", "success");
        setConfirmModal({ isOpen: false, id: null, isLoading: false });
        loadFeedback();
      } else {
        showToast(res?.message || "Xóa thất bại", "error");
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error("Lỗi khi xóa ý kiến:", err);
      showToast(err.response?.data?.message || "Lỗi khi xóa ý kiến", "error");
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header & Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-bold font-heading ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Ý kiến đóng góp
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Xem và quản lý tất cả ý kiến, phản hồi và cảm nghĩ gửi từ chân trang (Footer)
          </p>
        </div>

        <button
          onClick={loadFeedback}
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

      {/* ── 4 STAT CARDS TỔNG QUAN ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng ý kiến */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? "bg-[#152042]/80 border-white/10 shadow-lg shadow-cyan-950/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <MessageSquare size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng ý kiến</p>
            <p className="text-2xl font-bold font-heading text-white">{stats.total}</p>
          </div>
        </div>

        {/* Card 2: Đánh giá trung bình */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? "bg-[#152042]/80 border-white/10 shadow-lg shadow-cyan-950/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Star size={22} className="fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Đánh giá trung bình</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-heading text-amber-400">
                {stats.avgRating}
              </span>
              <span className="text-xs text-slate-400">/ 5 sao</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ý kiến hôm nay */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? "bg-[#152042]/80 border-white/10 shadow-lg shadow-cyan-950/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Ý kiến hôm nay</p>
            <p className="text-2xl font-bold font-heading text-emerald-400">
              {stats.today}
            </p>
          </div>
        </div>

        {/* Card 4: Khách vãng lai / Thành viên */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
            isDark
              ? "bg-[#152042]/80 border-white/10 shadow-lg shadow-cyan-950/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Khách / Thành viên</p>
            <p className="text-base font-bold font-heading text-white">
              <span className="text-indigo-400">{stats.guest}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-cyan-400">{stats.user}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── BỘ LỌC & TÌM KIẾM ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            placeholder="Tìm theo nội dung, tên người gửi, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lọc theo loại người gửi */}
          <div
            className={`flex items-center p-1 rounded-xl border text-xs ${
              isDark ? "bg-[#121c38] border-white/10" : "bg-white border-slate-200"
            }`}
          >
            {[
              { id: "all", label: "Tất cả" },
              { id: "user", label: "Thành viên" },
              { id: "guest", label: "Khách vãng lai" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setUserTypeFilter(t.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  userTypeFilter === t.id
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold"
                    : isDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Lọc theo số sao */}
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
              isDark
                ? "bg-[#121c38] border-white/10 text-slate-300"
                : "bg-white border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            <option value="">Tất cả đánh giá</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
            <option value="4">⭐⭐⭐⭐ 4 sao</option>
            <option value="3">⭐⭐⭐ 3 sao</option>
            <option value="2">⭐⭐ 2 sao</option>
            <option value="1">⭐ 1 sao</option>
          </select>
        </div>
      </div>

      {/* ── DANH SÁCH Ý KIẾN ĐÓNG GÓP ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border animate-pulse flex flex-col gap-3 ${
                isDark ? "bg-[#142144]/60 border-white/5" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="space-y-1.5">
                  <div className="w-32 h-3.5 bg-white/10 rounded" />
                  <div className="w-20 h-2.5 bg-white/10 rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : feedbackList.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${
            isDark ? "bg-[#142144]/40 border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-white">Chưa có ý kiến đóng góp nào</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            {searchQuery || ratingFilter || userTypeFilter !== "all"
              ? "Không tìm thấy ý kiến nào phù hợp với bộ lọc hiện tại."
              : "Các ý kiến đóng góp được gửi từ biểu mẫu chân trang (Footer) sẽ xuất hiện tại đây."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {feedbackList.map((item) => {
            const hasUser = !!item.users;
            const authorName = hasUser
              ? item.users.full_name || item.users.username
              : "Khách vãng lai (Ẩn danh)";
            const avatarUrl = item.users?.avatar_url;
            const userRole = item.users?.role;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all relative group hover:border-cyan-500/40 ${
                  isDark
                    ? "bg-[#152042]/90 border-white/10 shadow-md"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: User Profile & Star Rating */}
                  <div className="flex items-start gap-3.5">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border ${
                          hasUser
                            ? "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white border-cyan-400/40"
                            : "bg-slate-700/50 text-slate-300 border-white/10"
                        }`}
                      >
                        {hasUser ? (
                          authorName.charAt(0).toUpperCase()
                        ) : (
                          <UserX size={16} className="text-slate-400" />
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{authorName}</span>
                        {hasUser ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              userRole === "admin"
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                            }`}
                          >
                            <Shield size={10} />
                            {userRole === "admin" ? "Quản trị viên" : "Thành viên"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/50 text-slate-300 border border-white/10">
                            Khách vãng lai
                          </span>
                        )}
                        {item.users?.email && (
                          <span className="text-xs text-slate-400">
                            ({item.users.email})
                          </span>
                        )}
                      </div>

                      {/* Stars & Timestamp */}
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              className={
                                s <= item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-600"
                              }
                            />
                          ))}
                          <span className="text-xs font-bold text-amber-400 ml-1">
                            {item.rating}/5
                          </span>
                        </div>
                        <span className="text-white/20">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                    title="Xóa ý kiến này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Content text */}
                <div
                  className={`mt-3.5 p-3.5 rounded-xl border text-xs md:text-sm text-slate-200 leading-relaxed ${
                    isDark ? "bg-[#111a36]/80 border-white/5" : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{item.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <p className="text-xs text-slate-400">
            Hiển thị <span className="text-white font-bold">{feedbackList.length}</span> /{" "}
            <span className="text-white font-bold">{totalCount}</span> ý kiến
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                page <= 1
                  ? "opacity-40 cursor-not-allowed"
                  : isDark
                    ? "bg-[#152042] border-white/10 hover:border-white/20 text-white cursor-pointer"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs text-slate-400 px-2 font-medium">
              Trang <span className="text-white font-bold">{page}</span> / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                page >= totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : isDark
                    ? "bg-[#152042] border-white/10 hover:border-white/20 text-white cursor-pointer"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Xác nhận xóa ý kiến"
        message="Bạn có chắc chắn muốn xóa ý kiến đóng góp này? Dữ liệu sẽ bị xóa hoàn toàn khỏi hệ thống."
        confirmText="Xóa ý kiến"
        variant="danger"
        isLoading={confirmModal.isLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmModal({ isOpen: false, id: null, isLoading: false })}
      />
    </div>
  );
}
