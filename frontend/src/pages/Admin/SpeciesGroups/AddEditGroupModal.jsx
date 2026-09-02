import { useState, useEffect, useRef } from "react";
import { X, Loader2, Pipette } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

const PRESET_COLORS = [
  "#06b6d4", // Cyan
  "#38bdf8", // Sky Blue
  "#34d399", // Mint / Emerald
  "#10b981", // Green
  "#ec4899", // Pink
  "#f97316", // Orange
  "#eab308", // Yellow / Amber
  "#ef4444", // Red
];

export default function AddEditGroupModal({
  isOpen,
  onClose,
  onSave,
  editingGroup = null,
  isLoading = false,
}) {
  const { isDark } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#06b6d4");
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState("");

  const customColorInputRef = useRef(null);

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name || "");
      setDescription(editingGroup.description || "");
      setColor(editingGroup.color || "#06b6d4");
      setIsVisible(editingGroup.is_visible !== undefined ? editingGroup.is_visible : true);
    } else {
      setName("");
      setDescription("");
      setColor("#06b6d4");
      setIsVisible(true);
    }
    setError("");
  }, [editingGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập tên nhóm sinh vật");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      setError("Tên nhóm phải từ 2 đến 50 ký tự");
      return;
    }

    if (description && description.length > 500) {
      setError("Mô tả không được vượt quá 500 ký tự");
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      color,
      is_visible: isVisible,
    });
  };

  const isEdit = !!editingGroup;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 ${
        isDark ? "bg-black/30 text-white" : "bg-slate-900/30 text-slate-800"
      }`}
    >
      <div
        className={`relative w-full max-w-lg sm:max-w-xl rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
          isDark
            ? "bg-[#142247]/95 border-cyan-400/40 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(6,182,212,0.18)]"
            : "bg-white border-slate-300 text-slate-900 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-2 border-b border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading tracking-tight text-white">
              {isEdit ? "Chỉnh sửa nhóm" : "Thêm nhóm mới"}
            </h2>
            <p className="text-xs text-cyan-200/70 mt-0.5 font-medium">Thông tin nhóm sinh vật</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Tên nhóm */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 text-slate-200">
              Tên nhóm <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên nhóm sinh vật (VD: Cá, Giáp xác...)"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                isDark
                  ? "bg-[#0e1732] border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:bg-[#121c3d]"
                  : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
              }`}
            />
          </div>

          {/* 2. Mô tả ngắn */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 text-slate-200">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              placeholder="Mô tả tóm tắt về đặc điểm hoặc thành phần của nhóm..."
              value={description}
              maxLength={500}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all resize-none ${
                isDark
                  ? "bg-[#0e1732] border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-400 focus:bg-[#121c3d]"
                  : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
              }`}
            />
          </div>

          {/* 3. Màu sắc đại diện */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2">
              Màu sắc đại diện
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_COLORS.map((preset) => {
                const isSelected = color.toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    style={{ backgroundColor: preset }}
                    className={`w-6 h-6 rounded-full transition-all cursor-pointer relative ${
                      isSelected
                        ? "ring-3 ring-white scale-110 shadow-md"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    }`}
                  />
                );
              })}

              {/* Custom Color Input */}
              <div className="relative">
                <input
                  ref={customColorInputRef}
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => customColorInputRef.current?.click()}
                  className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-all cursor-pointer ${
                    !PRESET_COLORS.includes(color)
                      ? "ring-2 ring-white scale-110 shadow-md"
                      : "bg-white/10 hover:bg-white/20 text-slate-300"
                  }`}
                  style={{
                    backgroundColor: !PRESET_COLORS.includes(color) ? color : undefined,
                  }}
                  title="Chọn màu tùy chỉnh"
                >
                  <Pipette size={12} className={!PRESET_COLORS.includes(color) ? "text-white" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Trạng thái trên trang người dùng */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2">
              Trạng thái trên trang người dùng
            </label>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isVisible
                    ? "bg-slate-600 text-white shadow-sm ring-1 ring-white/30"
                    : "bg-white/5 hover:bg-white/10 text-slate-400"
                }`}
              >
                Ẩn
              </button>
              <button
                type="button"
                onClick={() => setIsVisible(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isVisible
                    ? "bg-emerald-500 text-white shadow-md ring-1 ring-emerald-300"
                    : "bg-white/5 hover:bg-white/10 text-slate-400"
                }`}
              >
                Hiển thị
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoading && <Loader2 size={13} className="animate-spin" />}
              <span>{isEdit ? "Lưu thay đổi" : "Lưu nhóm"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
