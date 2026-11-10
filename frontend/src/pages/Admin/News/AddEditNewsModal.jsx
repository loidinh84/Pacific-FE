/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import CustomSelect from "./CustomSelect";

function createSlug(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddEditNewsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) {
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category_id: "",
    status: "published",
    is_featured: false,
    cover_url: "",
    cover_caption: "",
    excerpt: "",
    content: "",
  });

  const [errors, setErrors] = useState({});
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        category_id: initialData.category_id || initialData.category?.id || "",
        status: initialData.status || "published",
        is_featured: Boolean(initialData.is_featured),
        cover_url: initialData.cover_url || "",
        cover_caption: initialData.cover_caption || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
      });
      setIsAutoSlug(false);
    } else {
      setFormData({
        title: "",
        slug: "",
        category_id: categories[0]?.id || "",
        status: "published",
        is_featured: false,
        cover_url: "",
        cover_caption: "",
        excerpt: "",
        content: "",
      });
      setIsAutoSlug(true);
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const next = { ...prev, [name]: val };
      if (name === "title" && isAutoSlug) {
        next.slug = createSlug(value);
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSlugChange = (e) => {
    setIsAutoSlug(false);
    setFormData((prev) => ({ ...prev, slug: createSlug(e.target.value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài viết";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      category_id: formData.category_id ? Number(formData.category_id) : null,
    });
  };

  const categoryOptions = [
    { value: "", label: "-- Chưa phân loại --" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const statusOptions = [
    { value: "published", label: "Đã xuất bản (Công khai)" },
    { value: "draft", label: "Bản nháp (Lưu tạm)" },
    { value: "archived", label: "Lưu trữ (Ẩn)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150 overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl transition-all my-8 overflow-hidden ${
          isDark
            ? "bg-[#112d4e] border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header Modal - Không có tiêu đề phụ */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-white/10 bg-[#0f2744]" : "border-slate-100 bg-slate-50"
          }`}
        >
          <h3 className="text-base sm:text-lg font-bold font-heading">
            {initialData ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-200 text-slate-500"
            }`}
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Tiêu đề & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Tiêu đề bài viết <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề tin tức hoặc sự thật đại dương..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                  errors.title
                    ? "border-rose-400 focus:border-rose-500"
                    : isDark
                    ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                    : "bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800"
                }`}
              />
              {errors.title && (
                <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                  <AlertCircle size={13} /> {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="duong-dan-bai-viet-tu-dong"
                className={`w-full px-4 py-2 rounded-xl border text-xs font-mono transition-all focus:outline-none ${
                  isDark
                    ? "bg-[#183c66]/60 border-white/10 focus:border-cyan-400 text-cyan-300"
                    : "bg-slate-50 border-slate-200 focus:border-sky-500 text-sky-700"
                }`}
              />
            </div>
          </div>

          {/* Chuyên mục & Trạng thái & Nổi bật */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Chuyên mục</label>
              <CustomSelect
                options={categoryOptions}
                value={formData.category_id}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, category_id: val }));
                  if (errors.category_id) setErrors((prev) => ({ ...prev, category_id: null }));
                }}
                isDark={isDark}
                placeholder="Chọn chuyên mục..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Trạng thái xuất bản</label>
              <CustomSelect
                options={statusOptions}
                value={formData.status}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, status: val }));
                }}
                isDark={isDark}
                placeholder="Chọn trạng thái..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Ghim trang chủ</label>
              <label
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  formData.is_featured
                    ? "bg-amber-500/15 border-amber-400/40 text-amber-300"
                    : isDark
                    ? "bg-[#183c66] border-white/15 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="rounded text-amber-400 focus:ring-amber-400 cursor-pointer"
                />
                <Sparkles size={16} className={formData.is_featured ? "text-amber-400" : "text-slate-400"} />
                <span className="text-xs font-semibold">Bài viết nổi bật</span>
              </label>
            </div>
          </div>

          {/* Ảnh bìa & Chú thích */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Đường dẫn ảnh bìa (Cover Image URL)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <ImageIcon size={16} />
                  </span>
                  <input
                    type="url"
                    name="cover_url"
                    value={formData.cover_url}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                      isDark
                        ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                        : "bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800"
                    }`}
                  />
                </div>
              </div>
            </div>

            {formData.cover_url && (
              <div className="relative h-36 w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                <img
                  src={formData.cover_url}
                  alt="Ảnh xem trước"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5">Chú thích ảnh bìa</label>
              <input
                type="text"
                name="cover_caption"
                value={formData.cover_caption}
                onChange={handleChange}
                placeholder="VD: Rạn san hô Côn Đảo nhìn từ trên cao..."
                className={`w-full px-4 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                  isDark
                    ? "bg-[#183c66] border-white/15 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          {/* Tóm tắt ngắn (Excerpt) */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Đoạn tóm tắt (Excerpt)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Tóm tắt ngắn gọn 1-2 câu hiển thị ở danh sách bài viết..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                isDark
                  ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                  : "bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800"
              }`}
            />
          </div>

          {/* Nội dung chi tiết (Content) */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Nội dung bài viết chi tiết
            </label>
            <textarea
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung đầy đủ của bài viết..."
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none resize-y leading-relaxed ${
                isDark
                  ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                  : "bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800"
              }`}
            />
          </div>

          {/* Footer nút hành động */}
          <div
            className={`flex items-center justify-end gap-3 pt-4 border-t ${
              isDark ? "border-white/10" : "border-slate-100"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md hover:shadow-sky-500/25 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Xuất bản bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

