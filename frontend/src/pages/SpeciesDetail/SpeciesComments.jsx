/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, Trash2, ShieldCheck, MessageSquare, Loader2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { getClientEffectiveUser } from "../../utils/auth";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../hooks/ToastContainer";
import ConfirmModal from "../Admin/Species/ConfirmModal";
import {
  fetchSpeciesComments,
  postSpeciesComment,
  deleteSpeciesComment,
} from "../../services/speciesCommentsApi";

// Định dạng thời gian tương đối
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
  });
};

export function SpeciesComments({ speciesId }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [currentUser, setCurrentUser] = useState(() => getClientEffectiveUser());
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    commentId: null,
  });

  // Lắng nghe thay đổi phiên hoặc chuyển đổi chế độ xem Khách
  useEffect(() => {
    const handleSync = () => {
      setCurrentUser(getClientEffectiveUser());
    };
    window.addEventListener("pacific_auth_change", handleSync);
    window.addEventListener("pacific_preview_mode_change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("pacific_auth_change", handleSync);
      window.removeEventListener("pacific_preview_mode_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Tải danh sách bình luận từ backend theo loài
  const loadComments = useCallback(async () => {
    if (!speciesId) return;
    try {
      const res = await fetchSpeciesComments(speciesId);
      if (res?.success) {
        setCommentsList(res.data || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải bình luận sinh vật:", err);
      showToast("Không thể tải bình luận lúc này.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [speciesId, showToast]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Gửi bình luận mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await postSpeciesComment(speciesId, commentText.trim());
      if (res?.success && res.data) {
        setCommentsList((prev) => [res.data, ...prev]);
        setCommentText("");
        showToast("Đã gửi bình luận thành công!", "success");
      } else {
        showToast(res?.message || "Không thể gửi bình luận", "error");
      }
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      showToast(
        err.response?.data?.message || "Lỗi khi gửi bình luận. Vui lòng thử lại!",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xác nhận xóa bình luận qua ConfirmModal
  const handleConfirmDelete = async () => {
    if (!deleteModal.commentId) return;
    try {
      setIsDeleting(true);
      const res = await deleteSpeciesComment(deleteModal.commentId);
      if (res?.success) {
        setCommentsList((prev) => prev.filter((c) => c.id !== deleteModal.commentId));
        showToast("Đã xóa bình luận thành công.", "info");
      } else {
        showToast(res?.message || "Không thể xóa bình luận này.", "error");
      }
    } catch (err) {
      console.error("Lỗi xóa bình luận:", err);
      showToast("Có lỗi xảy ra khi xóa bình luận.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, commentId: null });
    }
  };

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "super_admin";

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 mb-12 relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xác nhận xóa bình luận"
        message="Bạn có chắc chắn muốn gỡ bỏ bình luận này khỏi trang sinh vật? Thao tác này sẽ cập nhật ngay lập tức trên hệ thống."
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
      />

      <div className="bg-[#0e1f38] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl shadow-cyan-950/20">
        {/* Header với icon và số lượng bình luận */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white font-heading">
                {t("speciesDetail.commentsTitle") || "Họ nói gì về sinh vật này?"}
              </h2>
              <p className="text-xs text-slate-400">
                Ý kiến và trao đổi từ cộng đồng người yêu đại dương
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            {commentsList.length} bình luận
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentUser
                  ? t("speciesDetail.commentPlaceholder") ||
                    "Nhập ý kiến của bạn về loài sinh vật này..."
                  : "Đăng nhập để chia sẻ cảm nghĩ của bạn..."
              }
              className="flex-1 bg-[#15294a] border border-white/15 text-white placeholder:text-white/40 text-xs md:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {currentUser ? (
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs md:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-md shadow-cyan-900/30 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <span>{t("speciesDetail.btnSendComment") || "Gửi đánh giá"}</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs md:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
              >
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </form>

        {/* Khu vực danh sách bình luận */}
        <div className="pt-4 border-t border-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-cyan-400 gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs text-slate-400">Đang tải bình luận...</span>
            </div>
          ) : commentsList.length === 0 ? (
            <p className="text-center text-white/50 text-xs md:text-sm py-6 italic">
              {t("speciesDetail.noComments") ||
                "Chưa có nhận xét gì về sinh vật này! Hãy là người đầu tiên chia sẻ cảm nghĩ."}
            </p>
          ) : (
            <div className="space-y-3.5">
              {commentsList.map((c) => {
                const authorInitial = (
                  c.user?.fullName ||
                  c.user?.username ||
                  "U"
                )[0]?.toUpperCase();
                const isAuthorAdmin =
                  c.user?.role === "admin" || c.user?.role === "super_admin";
                const canDelete =
                  isAdmin ||
                  (currentUser && String(currentUser.id) === String(c.user?.id));

                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] border border-white/10 space-y-2 transition-all duration-200"
                  >
                    {/* Header bình luận: Avatar + Tên + Badge + Thời gian + Xóa */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-600 to-blue-500 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                          {c.user?.avatarUrl ? (
                            <img
                              src={c.user.avatarUrl}
                              alt={c.user.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span>{authorInitial}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs md:text-sm text-white">
                            {c.user?.fullName || c.user?.username}
                          </span>

                          {isAuthorAdmin && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                              <ShieldCheck size={11} />
                              <span>Quản trị viên</span>
                            </span>
                          )}

                          <span className="text-white/30 text-xs">•</span>

                          <span className="text-[11px] text-white/50">
                            {formatRelativeTime(c.createdAt)}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, commentId: c.id })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer opacity-70 hover:opacity-100"
                          title="Xóa bình luận này"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Nội dung bình luận */}
                    <p className="text-xs md:text-sm text-slate-200 pl-11 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
