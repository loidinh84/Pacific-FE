/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Layers,
  Globe,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  Heading,
  Quote,
  Code,
  LayoutList,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { uploadMediaFile } from "../../../services/speciesApi";
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

let blockSeq = 1;
const nextBlockId = () => `blk-${Date.now()}-${blockSeq++}`;

const escapeHtml = (str) =>
  (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function parseContentToBlocks(raw) {
  if (!raw || !raw.trim()) {
    return [{ id: nextBlockId(), type: "paragraph", text: "" }];
  }

  const trimmed = raw.trim();
  const hasHtmlBlocks = /<(p|h[1-6]|figure|blockquote|ul|ol|div|img)\b/i.test(trimmed);

  if (!hasHtmlBlocks) {
    return trimmed
      .split(/\n{2,}/)
      .filter((t) => t.trim())
      .map((text) => ({
        id: nextBlockId(),
        type: "paragraph",
        text: text.trim(),
      }));
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "text/html");
    const blocks = [];

    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeType === 3) {
        const txt = node.textContent.trim();
        if (txt) blocks.push({ id: nextBlockId(), type: "paragraph", text: txt });
        return;
      }
      if (node.nodeType !== 1) return;

      const tag = node.tagName.toLowerCase();
      if (["h1", "h2", "h3", "h4"].includes(tag)) {
        blocks.push({ id: nextBlockId(), type: "heading", text: node.textContent.trim() });
      } else if (tag === "blockquote") {
        blocks.push({ id: nextBlockId(), type: "quote", text: node.textContent.trim() });
      } else if (tag === "figure") {
        const img = node.querySelector("img");
        const captionEl = node.querySelector("figcaption");
        if (img) {
          blocks.push({
            id: nextBlockId(),
            type: "image",
            url: img.getAttribute("src") || "",
            caption: captionEl ? captionEl.textContent.trim() : img.getAttribute("alt") || "",
          });
        }
      } else if (tag === "img") {
        blocks.push({
          id: nextBlockId(),
          type: "image",
          url: node.getAttribute("src") || "",
          caption: node.getAttribute("alt") || "",
        });
      } else if (tag === "p") {
        const innerImg = node.querySelector("img");
        if (innerImg && !node.textContent.trim()) {
          blocks.push({
            id: nextBlockId(),
            type: "image",
            url: innerImg.getAttribute("src") || "",
            caption: innerImg.getAttribute("alt") || "",
          });
        } else {
          const text = node.textContent.trim();
          if (text) blocks.push({ id: nextBlockId(), type: "paragraph", text });
        }
      } else if (tag === "ul" || tag === "ol") {
        const items = Array.from(node.querySelectorAll("li"))
          .map((li) => `- ${li.textContent.trim()}`)
          .join("\n");
        if (items) blocks.push({ id: nextBlockId(), type: "paragraph", text: items });
      } else {
        const text = node.textContent.trim();
        if (text) blocks.push({ id: nextBlockId(), type: "paragraph", text });
      }
    });

    return blocks.length > 0 ? blocks : [{ id: nextBlockId(), type: "paragraph", text: "" }];
  } catch (err) {
    console.warn("Lỗi chuyển HTML sang blocks:", err);
    return [{ id: nextBlockId(), type: "paragraph", text: trimmed }];
  }
}

function serializeBlocksToHtml(blocks) {
  return blocks
    .map((b) => {
      if (b.type === "heading") {
        return b.text?.trim() ? `<h2>${escapeHtml(b.text.trim())}</h2>` : "";
      }
      if (b.type === "quote") {
        return b.text?.trim() ? `<blockquote>${escapeHtml(b.text.trim())}</blockquote>` : "";
      }
      if (b.type === "image") {
        if (!b.url?.trim()) return "";
        const url = escapeHtml(b.url.trim());
        const caption = b.caption?.trim() ? escapeHtml(b.caption.trim()) : "";
        return `<figure class="my-6">\n  <img src="${url}" alt="${caption || "Ảnh minh họa"}" class="w-full rounded-2xl shadow-lg object-cover max-h-[520px]" />${
          caption ? `\n  <figcaption>${caption}</figcaption>` : ""
        }\n</figure>`;
      }
      if (!b.text?.trim()) return "";
      const lines = b.text.trim().split("\n");
      if (lines.every((l) => l.trim().startsWith("- "))) {
        const lis = lines
          .map((l) => `  <li>${escapeHtml(l.trim().replace(/^-\s+/, ""))}</li>`)
          .join("\n");
        return `<ul>\n${lis}\n</ul>`;
      }
      return `<p>${escapeHtml(b.text.trim()).replace(/\n/g, "<br/>")}</p>`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export default function AddEditNewsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  sources = [],
  isLoading = false,
}) {
  const { isDark } = useTheme();

  const coverFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category_id: "",
    status: "published",
    is_featured: false,
    source_type: "internal",
    source_id: "",
    external_url: "",
    cover_url: "",
    cover_caption: "",
    excerpt: "",
    content: "",
    badge: "",
    stat_val: "",
    stat_title: "",
    gallery: [],
  });

  const [blocks, setBlocks] = useState([{ id: nextBlockId(), type: "paragraph", text: "" }]);
  const [editorMode, setEditorMode] = useState("blocks"); // 'blocks' | 'html'
  const [uploadingBlockId, setUploadingBlockId] = useState(null);

  const [errors, setErrors] = useState({});
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  useEffect(() => {
    if (initialData) {
      const rawContent = initialData.content || initialData.clean_content || "";
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        category_id: initialData.category_id || initialData.category?.id || "",
        status: initialData.status || "published",
        is_featured: Boolean(initialData.is_featured),
        source_type: initialData.source_type || "internal",
        source_id: initialData.source_id || initialData.source?.id || "",
        external_url: initialData.external_url || "",
        cover_url: initialData.cover_url || "",
        cover_caption: initialData.cover_caption || "",
        excerpt: initialData.excerpt || "",
        content: rawContent,
        badge: initialData.badge || "",
        stat_val: initialData.stat_val || "",
        stat_title: initialData.stat_title || "",
        gallery: Array.isArray(initialData.gallery) ? initialData.gallery : [],
      });
      setBlocks(parseContentToBlocks(rawContent));
      setIsAutoSlug(false);
    } else {
      setFormData({
        title: "",
        slug: "",
        category_id: categories[0]?.id || "",
        status: "published",
        is_featured: false,
        source_type: "internal",
        source_id: sources[0]?.id || "",
        external_url: "",
        cover_url: "",
        cover_caption: "",
        excerpt: "",
        content: "",
        badge: "",
        stat_val: "",
        stat_title: "",
        gallery: [],
      });
      setBlocks([{ id: nextBlockId(), type: "paragraph", text: "" }]);
      setIsAutoSlug(true);
    }
    setEditorMode("blocks");
    setErrors({});
    setGalleryUrlInput("");
  }, [initialData, categories, sources, isOpen]);

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

  // Chuyển đổi giữa Chế độ Khối trực quan & Chế độ HTML/Mã nguồn
  const handleSwitchEditorMode = (nextMode) => {
    if (nextMode === editorMode) return;
    if (nextMode === "html") {
      const compiled = serializeBlocksToHtml(blocks);
      setFormData((prev) => ({ ...prev, content: compiled }));
    } else {
      setBlocks(parseContentToBlocks(formData.content));
    }
    setEditorMode(nextMode);
  };

  // Quản lý các khối nội dung (Blocks)
  const addBlock = (type) => {
    const newBlock =
      type === "image"
        ? { id: nextBlockId(), type: "image", url: "", caption: "" }
        : { id: nextBlockId(), type, text: "" };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id, patch) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBlock = (id) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      return filtered.length > 0 ? filtered : [{ id: nextBlockId(), type: "paragraph", text: "" }];
    });
  };

  const moveBlock = (index, direction) => {
    setBlocks((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleBlockImageUpload = async (blockId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBlockId(blockId);
    try {
      const res = await uploadMediaFile(file);
      if (res?.url) {
        updateBlock(blockId, { url: res.url });
      }
    } catch (err) {
      console.error("Lỗi khi tải ảnh khối nội dung:", err);
    } finally {
      setUploadingBlockId(null);
      e.target.value = "";
    }
  };

  // Upload ảnh bìa từ máy tính
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const res = await uploadMediaFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, cover_url: res.url }));
      }
    } catch (err) {
      console.error("Lỗi khi tải ảnh bìa từ máy:", err);
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
    }
  };

  // Upload nhiều ảnh vào Gallery từ máy tính
  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadMediaFile(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url).filter(Boolean);

      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newUrls],
      }));
    } catch (err) {
      console.error("Lỗi khi tải album ảnh:", err);
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), galleryUrlInput.trim()],
    }));
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetAsCover = (url) => {
    setFormData((prev) => ({ ...prev, cover_url: url }));
  };

  const handleInsertGalleryIntoBlocks = (url) => {
    const newImgBlock = { id: nextBlockId(), type: "image", url, caption: "" };
    if (editorMode === "blocks") {
      setBlocks((prev) => [...prev, newImgBlock]);
    } else {
      const tag = `\n\n<figure class="my-6">\n  <img src="${url}" alt="Ảnh minh họa" class="w-full rounded-2xl shadow-lg object-cover max-h-[520px]" />\n</figure>\n`;
      setFormData((prev) => ({ ...prev, content: (prev.content || "") + tag }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài viết";
    }

    if (formData.source_type === "external") {
      if (!formData.source_id) {
        newErrors.source_id = "Vui lòng chọn nguồn tin chính thống";
      }
      if (!formData.external_url || !/^https?:\/\/.+/i.test(formData.external_url.trim())) {
        newErrors.external_url = "Vui lòng nhập link bài báo gốc hợp lệ (https://...)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalContent =
      editorMode === "blocks" ? serializeBlocksToHtml(blocks) : formData.content;

    onSubmit({
      ...formData,
      content: finalContent,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      source_id:
        formData.source_type === "external" && formData.source_id
          ? Number(formData.source_id)
          : null,
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

  const sourceTypeOptions = [
    { value: "internal", label: "Bài viết nội bộ Pacific" },
    { value: "external", label: "Dẫn nguồn báo chí / tổ chức chính thống" },
  ];

  const sourceOptions = [
    { value: "", label: "-- Chọn nguồn tin chính thống --" },
    ...sources.map((s) => ({ value: String(s.id), label: s.name })),
  ];

  // Kiểm tra xem chuyên mục có phải là "Có thể bạn chưa biết"
  const selectedCat = categories.find((c) => String(c.id) === String(formData.category_id));
  const isFunFactsCategory =
    selectedCat?.slug === "fun-facts" ||
    selectedCat?.name?.toLowerCase().includes("chưa biết");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150 overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl transition-all my-8 overflow-hidden ${
          isDark
            ? "bg-[#112d4e] border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header Modal - Sạch gọn, không tiêu đề phụ */}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
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

          {/* Nguồn gốc bài viết & Xác thực nguồn tin chính thống */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? "bg-[#0f2744]/70 border-white/10" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h4 className="text-xs font-bold font-heading">
                Nguồn tin &amp; Bản quyền bài viết
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Loại hình bài viết</label>
                <CustomSelect
                  options={sourceTypeOptions}
                  value={formData.source_type}
                  onChange={(val) => {
                    setFormData((prev) => ({
                      ...prev,
                      source_type: val,
                      source_id: val === "external" ? prev.source_id || sources[0]?.id || "" : "",
                    }));
                    setErrors((prev) => ({ ...prev, source_id: null, external_url: null }));
                  }}
                  isDark={isDark}
                />
              </div>

              {formData.source_type === "external" && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Nguồn tin chính thống <span className="text-rose-400">*</span>
                  </label>
                  <CustomSelect
                    options={sourceOptions}
                    value={formData.source_id}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, source_id: val }));
                      if (errors.source_id) setErrors((prev) => ({ ...prev, source_id: null }));
                    }}
                    isDark={isDark}
                    placeholder="Chọn nguồn chính thống..."
                  />
                  {errors.source_id && (
                    <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                      <AlertCircle size={12} /> {errors.source_id}
                    </p>
                  )}
                </div>
              )}
            </div>

            {formData.source_type === "external" && (
              <div className="mt-3">
                <label className="block text-xs font-semibold mb-1.5">
                  Đường dẫn bài báo gốc (URL chính thống) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Globe size={15} />
                  </span>
                  <input
                    type="url"
                    name="external_url"
                    value={formData.external_url}
                    onChange={handleChange}
                    placeholder="https://vnexpress.net/... hoặc https://vietnam.panda.org/..."
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                      errors.external_url
                        ? "border-rose-400 focus:border-rose-500"
                        : isDark
                        ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                        : "bg-white border-slate-200 focus:border-sky-500 text-slate-800"
                    }`}
                  />
                </div>
                {errors.external_url && (
                  <p className="flex items-center gap-1 text-xs text-rose-400 mt-1">
                    <AlertCircle size={12} /> {errors.external_url}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Bài viết dẫn nguồn sẽ hiển thị rõ tên cơ quan báo chí / tổ chức khoa học và nút dẫn liên kết về trang gốc để tôn trọng bản quyền.
                </p>
              </div>
            )}
          </div>

          {/* Khối chuyên biệt dành riêng cho chuyên mục "Có thể bạn chưa biết" */}
          {isFunFactsCategory && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? "bg-amber-500/10 border-amber-400/30 text-amber-100"
                  : "bg-amber-50/80 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-amber-400" />
                <h4 className="text-xs font-bold text-amber-400">
                  Thông số thẻ kỳ thú (Có thể bạn chưa biết)
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 mb-3.5">
                Các thông tin dưới đây sẽ hiển thị trực tiếp trên thẻ nổi bật tại khối &ldquo;Có thể bạn chưa biết&rdquo; ngoài trang Khám phá &amp; Tìm kiếm.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Thẻ phân loại (Badge)
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="VD: Địa lý, Bí ẩn, Địa chất..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                      isDark
                        ? "bg-[#183c66] border-white/15 focus:border-amber-400 text-white"
                        : "bg-white border-slate-200 focus:border-amber-500 text-slate-800"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Con số nổi bật (Stat Value)
                  </label>
                  <input
                    type="text"
                    name="stat_val"
                    value={formData.stat_val}
                    onChange={handleChange}
                    placeholder="VD: 3.5 triệu km², 2,688 km, 90%"
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold transition-all focus:outline-none ${
                      isDark
                        ? "bg-[#183c66] border-white/15 focus:border-amber-400 text-amber-300"
                        : "bg-white border-slate-200 focus:border-amber-500 text-amber-700"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Tiêu đề số liệu (Stat Title)
                  </label>
                  <input
                    type="text"
                    name="stat_title"
                    value={formData.stat_title}
                    onChange={handleChange}
                    placeholder="VD: DIỆN TÍCH BIỂN ĐÔNG"
                    className={`w-full px-3 py-2 rounded-xl border text-xs transition-all focus:outline-none ${
                      isDark
                        ? "bg-[#183c66] border-white/15 focus:border-amber-400 text-white"
                        : "bg-white border-slate-200 focus:border-amber-500 text-slate-800"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ảnh bìa & Tải ảnh từ máy tính */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold">
                  Ảnh bìa đại diện (Cover Image)
                </label>
                <input
                  type="file"
                  ref={coverFileInputRef}
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload size={13} />
                  <span>{isUploadingCover ? "Đang tải ảnh lên..." : "Tải ảnh từ máy tính"}</span>
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ImageIcon size={16} />
                </span>
                <input
                  type="url"
                  name="cover_url"
                  value={formData.cover_url}
                  onChange={handleChange}
                  placeholder="Hoặc dán link ảnh: https://..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                    isDark
                      ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                      : "bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-800"
                  }`}
                />
              </div>
            </div>

            {formData.cover_url && (
              <div className="relative h-40 w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 group">
                <img
                  src={formData.cover_url}
                  alt="Ảnh xem trước"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute top-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, cover_url: "" }))}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-500/80 text-white transition-colors cursor-pointer"
                    title="Gỡ ảnh bìa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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

          {/* Trình soạn thảo nội dung theo Khối (Cho phép chèn nhiều hình ảnh xen kẽ mọi vị trí) */}
          <div
            className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
              isDark ? "bg-[#0f2744]/70 border-white/10" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold font-heading">
                  Nội dung bài viết chi tiết
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bạn có thể thêm nhiều hình ảnh xen kẽ giữa các đoạn văn và sắp xếp vị trí lên/xuống linh hoạt.
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/25 border border-white/10">
                <button
                  type="button"
                  onClick={() => handleSwitchEditorMode("blocks")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    editorMode === "blocks"
                      ? "bg-sky-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutList size={12} />
                  <span>Soạn theo khối</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchEditorMode("html")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    editorMode === "html"
                      ? "bg-sky-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Code size={12} />
                  <span>Mã HTML</span>
                </button>
              </div>
            </div>

            {editorMode === "blocks" ? (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isDark ? "bg-[#183c66]/70 border-white/15" : "bg-white border-slate-200"
                    }`}
                  >
                    {/* Header của khối */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                        {block.type === "heading" && (
                          <>
                            <Heading size={13} /> Tiêu đề mục #{index + 1}
                          </>
                        )}
                        {block.type === "paragraph" && (
                          <>
                            <AlignLeft size={13} /> Đoạn văn bản #{index + 1}
                          </>
                        )}
                        {block.type === "image" && (
                          <>
                            <ImageIcon size={13} /> Hình ảnh minh họa #{index + 1}
                          </>
                        )}
                        {block.type === "quote" && (
                          <>
                            <Quote size={13} /> Trích dẫn nổi bật #{index + 1}
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlock(index, -1)}
                          disabled={index === 0}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer transition-colors"
                          title="Di chuyển lên"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, 1)}
                          disabled={index === blocks.length - 1}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer transition-colors"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors"
                          title="Xóa khối này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Thân khối theo từng loại */}
                    {block.type === "image" ? (
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="url"
                            value={block.url}
                            onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                            placeholder="Dán link ảnh hoặc tải lên từ máy tính..."
                            className={`flex-1 min-w-[200px] px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                              isDark
                                ? "bg-[#0f2744] border-white/15 focus:border-cyan-400 text-white"
                                : "bg-slate-50 border-slate-200 text-slate-800"
                            }`}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold cursor-pointer transition-all shrink-0">
                            <Upload size={13} />
                            <span>
                              {uploadingBlockId === block.id ? "Đang tải..." : "Tải ảnh từ máy"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleBlockImageUpload(block.id, e)}
                            />
                          </label>
                        </div>

                        {block.url && (
                          <div className="h-36 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
                            <img
                              src={block.url}
                              alt={block.caption || "Xem trước ảnh"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <input
                          type="text"
                          value={block.caption}
                          onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                          placeholder="Nhập chú thích dưới bức ảnh (không bắt buộc)..."
                          className={`w-full px-3 py-1.5 rounded-lg border text-xs italic focus:outline-none ${
                            isDark
                              ? "bg-[#0f2744] border-white/10 text-slate-300"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        />
                      </div>
                    ) : block.type === "heading" ? (
                      <input
                        type="text"
                        value={block.text}
                        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                        placeholder="Nhập tiêu đề phần (VD: 1. Ý nghĩa của rạn san hô...)"
                        className={`w-full px-3 py-2 rounded-lg border text-sm font-bold focus:outline-none ${
                          isDark
                            ? "bg-[#0f2744] border-white/15 focus:border-cyan-400 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    ) : block.type === "quote" ? (
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                        placeholder="Nhập câu trích dẫn nổi bật..."
                        className={`w-full px-3 py-2 rounded-lg border text-xs italic focus:outline-none resize-y ${
                          isDark
                            ? "bg-[#0f2744] border-white/15 focus:border-cyan-400 text-cyan-100"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={block.text}
                        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                        placeholder="Nhập nội dung đoạn văn (dùng dấu '- ' đầu dòng để tạo danh sách gạch đầu dòng)..."
                        className={`w-full px-3 py-2 rounded-lg border text-sm leading-relaxed focus:outline-none resize-y ${
                          isDark
                            ? "bg-[#0f2744] border-white/15 focus:border-cyan-400 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    )}
                  </div>
                ))}

                {/* Thanh công cụ thêm khối mới */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => addBlock("paragraph")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-all"
                  >
                    <AlignLeft size={13} />
                    <span>+ Đoạn văn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("heading")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-all"
                  >
                    <Heading size={13} />
                    <span>+ Tiêu đề mục</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-semibold text-cyan-300 cursor-pointer transition-all"
                  >
                    <ImageIcon size={13} />
                    <span>+ Hình ảnh minh họa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("quote")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-all"
                  >
                    <Quote size={13} />
                    <span>+ Trích dẫn</span>
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                name="content"
                rows={10}
                value={formData.content}
                onChange={handleChange}
                placeholder="Nhập mã HTML hoặc nội dung chi tiết của bài viết..."
                className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all focus:outline-none resize-y leading-relaxed ${
                  isDark
                    ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                    : "bg-white border-slate-200 focus:border-sky-500 text-slate-800"
                }`}
              />
            )}
          </div>

          {/* Bộ sưu tập ảnh đính kèm bổ sung (Album cuối bài - tùy chọn) */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? "bg-[#0f2744]/70 border-white/10" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cyan-400" />
                <h4 className="text-xs font-bold font-heading">
                  Album ảnh đính kèm cuối bài (Tùy chọn)
                </h4>
                {formData.gallery?.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold">
                    {formData.gallery.length} ảnh
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={galleryFileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  disabled={isUploadingGallery}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload size={13} />
                  <span>
                    {isUploadingGallery ? "Đang tải ảnh..." : "Tải nhiều ảnh từ máy"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddGalleryUrl();
                  }
                }}
                placeholder="Hoặc dán link ảnh để thêm vào album cuối bài..."
                className={`flex-1 px-3 py-1.5 rounded-xl border text-xs transition-all focus:outline-none ${
                  isDark
                    ? "bg-[#183c66] border-white/15 focus:border-cyan-400 text-white"
                    : "bg-white border-slate-200 focus:border-sky-500 text-slate-800"
                }`}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                disabled={!galleryUrlInput.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>Thêm</span>
              </button>
            </div>

            {formData.gallery && formData.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.gallery.map((imgUrl, index) => (
                  <div
                    key={`${imgUrl}-${index}`}
                    className="group relative rounded-xl overflow-hidden border border-white/15 bg-slate-900 aspect-video shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="p-1 rounded-md bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Xóa ảnh"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => handleInsertGalleryIntoBlocks(imgUrl)}
                          className="px-2 py-1 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold transition-colors cursor-pointer text-center"
                        >
                          Chèn thành khối ảnh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetAsCover(imgUrl)}
                          className="px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium transition-colors cursor-pointer text-center"
                        >
                          Làm ảnh bìa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 py-2 italic">
                Chưa có ảnh nào trong album cuối bài. Bạn có thể chèn ảnh rải rác trong nội dung ở phía trên hoặc tải album tại đây.
              </p>
            )}
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
