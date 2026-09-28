import { AlertTriangle, Trash2, X, Loader2, Info } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

export default function ConfirmModal({
  isOpen = false,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này? Dữ liệu có thể không khôi phục lại được.",
  confirmText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  variant = "danger", // "danger" | "warning" | "info"
  isLoading = false,
  onConfirm = () => {},
  onClose = () => {},
}) {
  const { isDark } = useTheme();
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all duration-300 transform scale-100 animate-in zoom-in-95 ${
          isDark
            ? "bg-[#142144]/95 border-white/20 text-white shadow-cyan-950/50"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isDanger
                  ? isDark
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                    : "bg-rose-50 border-rose-200 text-rose-600"
                  : isWarning
                    ? isDark
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                    : isDark
                      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                      : "bg-cyan-50 border-cyan-200 text-cyan-600"
              }`}
            >
              {isDanger ? (
                <Trash2 size={24} className="animate-pulse" />
              ) : isWarning ? (
                <AlertTriangle size={24} />
              ) : (
                <Info size={24} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading tracking-tight">
                {title}
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-cyan-300/70" : "text-slate-500"
                }`}
              >
                Vui lòng xem kỹ trước khi tiếp tục
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "border-white/10 hover:bg-white/10 text-white/60 hover:text-white"
                : "border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Body */}
        <div className="mt-4">
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer active:scale-95 shadow-lg ${
              isDanger
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
                : isWarning
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25"
                  : "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/25"
            } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
