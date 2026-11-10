/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  CheckCircle2,
  Clock,
  Archive,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import ConfirmModal from "../Species/ConfirmModal";
import AddEditNewsModal from "./AddEditNewsModal";
import {
  fetchAdminNewsList,
  fetchAdminNewsCategories,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
  toggleAdminNewsFeatured,
} from "../../../services/adminNewsApi";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function NewsManagement() {
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticle, setDeletingArticle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load categories
  useEffect(() => {
    fetchAdminNewsCategories()
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy danh mục tin tức:", err);
      });
  }, []);

  // Load articles list
  const loadArticles = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch || undefined,
          category_id: categoryFilter !== "all" ? categoryFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          is_featured: featuredFilter !== "all" ? featuredFilter : undefined,
        };

        const res = await fetchAdminNewsList(params);
        if (res?.success) {
          setArticles(res.data || []);
          if (res.pagination) {
            setPagination((prev) => ({
              ...prev,
              ...res.pagination,
            }));
          }
          if (isManualRefresh) {
            showToast("Đã làm mới danh sách bài viết!", "success");
          }
        }
      } catch (err) {
        console.error("Lỗi tải tin tức admin:", err);
        showToast("Không thể tải danh sách bài viết.", "error");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pagination.page, pagination.limit, debouncedSearch, categoryFilter, statusFilter, featuredFilter, showToast],
  );

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Handle Create / Update
  const handleSubmitArticle = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingArticle) {
        const res = await updateAdminNews(editingArticle.id, formData);
        if (res?.success) {
          showToast("Cập nhật bài viết thành công!", "success");
          setIsModalOpen(false);
          setEditingArticle(null);
          loadArticles();
        }
      } else {
        const res = await createAdminNews(formData);
        if (res?.success) {
          showToast("Thêm bài viết mới thành công!", "success");
          setIsModalOpen(false);
          loadArticles();
        }
      }
    } catch (err) {
      console.error("Lỗi lưu bài viết:", err);
      showToast(err.response?.data?.message || "Không thể lưu bài viết.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Featured
  const handleToggleFeatured = async (id) => {
    try {
      const res = await toggleAdminNewsFeatured(id);
      if (res?.success) {
        showToast(res.message, "success");
        setArticles((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, is_featured: res.data.is_featured } : a,
          ),
        );
      }
    } catch (err) {
      console.error("Lỗi bật/tắt nổi bật:", err);
      showToast("Không thể thay đổi trạng thái nổi bật.", "error");
    }
  };

  // Handle Delete
  const handleDeleteArticle = async () => {
    if (!deletingArticle) return;
    try {
      const res = await deleteAdminNews(deletingArticle.id);
      if (res?.success) {
        showToast("Đã xóa bài viết thành công!", "success");
        setDeletingArticle(null);
        loadArticles();
      }
    } catch (err) {
      console.error("Lỗi xóa bài viết:", err);
      showToast("Không thể xóa bài viết.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── 1. HEADER CHÍNH (KHÔNG CHỨA THỐNG KÊ RỜI RẠC) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-400/30">
              <Newspaper size={20} />
            </div>
            <h1
              className={`text-xl sm:text-2xl font-bold font-heading ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Quản lý Tin tức & Bài viết
            </h1>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Quản lý các tin bài bảo tồn, bài báo khoa học và các chuyên mục kiến thức đại dương
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => loadArticles(true)}
            disabled={isRefreshing || isLoading}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDark
                ? "bg-[#183c66] hover:bg-[#1f4a7d] border-white/15 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            }`}
            title="Làm mới dữ liệu"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin text-sky-400" : ""}
            />
            <span>Làm mới</span>
          </button>

          <button
            onClick={() => {
              setEditingArticle(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-sky-500/25 cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm bài viết</span>
          </button>
        </div>
      </div>

      {/* ── 2. THANH TÌM KIẾM & BỘ LỌC ── */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isDark
            ? "bg-[#183c66]/70 border-white/15"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tiêu đề, slug..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                isDark
                  ? "bg-[#112d4e] border-white/15 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500"
              }`}
            />
          </div>

          {/* Lọc chuyên mục */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-[#112d4e] border-white/15 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option value="all">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc trạng thái */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-[#112d4e] border-white/15 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          {/* Lọc nổi bật */}
          <div className="relative">
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-all focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-[#112d4e] border-white/15 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option value="all">Tất cả vị trí</option>
              <option value="true">Chỉ bài nổi bật ⭐</option>
              <option value="false">Bài viết thông thường</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. BẢNG DANH SÁCH BÀI VIẾT ── */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all shadow-sm ${
          isDark ? "bg-[#183c66]/90 border-white/15" : "bg-white border-slate-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                  isDark
                    ? "bg-[#112d4e]/80 border-white/10 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <th className="py-3.5 px-4 w-12 text-center">STT</th>
                <th className="py-3.5 px-4">Bài viết & Tiêu đề</th>
                <th className="py-3.5 px-4 w-40">Chuyên mục</th>
                <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 w-28 text-center">Nổi bật</th>
                <th className="py-3.5 px-4 w-24 text-center">Lượt xem</th>
                <th className="py-3.5 px-4 w-32">Ngày xuất bản</th>
                <th className="py-3.5 px-4 w-28 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Đang tải danh sách bài viết...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Newspaper size={32} className="mx-auto mb-2 opacity-40" />
                    Không tìm thấy bài viết nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                articles.map((art, idx) => {
                  const itemIndex = (pagination.page - 1) * pagination.limit + idx + 1;
                  return (
                    <tr
                      key={art.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {itemIndex}
                      </td>

                      {/* Tiêu đề & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {art.cover_url ? (
                            <img
                              src={art.cover_url}
                              alt={art.title}
                              className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0 bg-slate-900"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-14 h-10 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-400">
                              <Newspaper size={18} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`font-semibold line-clamp-1 text-sm ${
                                isDark ? "text-white" : "text-slate-800"
                              }`}
                              title={art.title}
                            >
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {art.excerpt || art.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Chuyên mục */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-sky-500/15 border border-sky-400/30 text-sky-300">
                          {art.category?.name || "Chung"}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        {art.status === "published" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                            <CheckCircle2 size={11} /> Xuất bản
                          </span>
                        ) : art.status === "draft" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-400/30 text-amber-300">
                            <Clock size={11} /> Bản nháp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/15 border border-slate-400/30 text-slate-300">
                            <Archive size={11} /> Lưu trữ
                          </span>
                        )}
                      </td>

                      {/* Ghim nổi bật */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(art.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            art.is_featured
                              ? "bg-amber-500/20 text-amber-400 border-amber-400/40 hover:bg-amber-500/30"
                              : "bg-white/5 text-slate-500 border-white/10 hover:text-slate-300"
                          }`}
                          title={art.is_featured ? "Bỏ ghim nổi bật" : "Ghim lên nổi bật"}
                        >
                          <Sparkles size={14} className={art.is_featured ? "fill-amber-400" : ""} />
                        </button>
                      </td>

                      {/* Lượt xem */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {Number(art.view_count || 0).toLocaleString()}
                      </td>

                      {/* Ngày đăng */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(art.published_at || art.created_at)}
                      </td>

                      {/* Nút hành động */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingArticle(art);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 transition-all cursor-pointer"
                            title="Chỉnh sửa bài viết"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeletingArticle(art)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-400/20 transition-all cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 4. PHÂN TRANG (PAGINATION) ── */}
        {pagination.totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-6 py-3.5 border-t ${
              isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-600"
            }`}
          >
            <div className="text-xs">
              Hiển thị{" "}
              <span className="font-semibold text-white">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-white">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-semibold text-white">{pagination.total}</span> bài viết
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                }
                disabled={pagination.page <= 1}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold px-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm / Chỉnh sửa */}
      <AddEditNewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={handleSubmitArticle}
        initialData={editingArticle}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={Boolean(deletingArticle)}
        title="Xóa bài viết"
        message={`Bạn có chắc chắn muốn xóa bài viết "${deletingArticle?.title}" không? Thao tác này có thể hoàn tác từ cơ sở dữ liệu.`}
        confirmText="Xác nhận xóa"
        confirmType="danger"
        onConfirm={handleDeleteArticle}
        onCancel={() => setDeletingArticle(null)}
      />
    </div>
  );
}

