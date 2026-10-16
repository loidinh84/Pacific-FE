import { Eye, EyeOff, Trash2, X, CheckSquare, Loader2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function SpeciesBulkActionsBar({
  selectedCount = 0,
  onClearSelection = () => {},
  onBulkSetVisibility = () => {},
  onBulkDelete = () => {},
  isProcessing = false,
}) {
  const { isDark } = useTheme();

  if (selectedCount === 0) return null;

  return (
    <div className="w-full animate-in slide-in-from-top-2 fade-in duration-200">
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3.5 px-5 rounded-2xl border shadow-xl transition-all ${
          isDark
            ? "bg-[#192b58]/95 border-cyan-500/30 text-white shadow-cyan-950/40"
            : "bg-cyan-50/90 border-cyan-200 text-slate-800 shadow-cyan-100"
        }`}
      >
        {/* Left: Selected counter */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm border ${
              isDark
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-cyan-500/15 border-cyan-400/40 text-cyan-800"
            }`}
          >
            <CheckSquare size={16} className="text-cyan-400 shrink-0" />
            <span>Đã chọn <strong className="font-extrabold">{selectedCount}</strong> sinh vật</span>
          </div>

          <button
            onClick={onClearSelection}
            disabled={isProcessing}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? "text-white/60 hover:text-white hover:bg-white/10"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <X size={14} />
            <span className="hidden sm:inline">Bỏ chọn</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isProcessing && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 mr-2 font-medium">
              <Loader2 size={14} className="animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          )}

          {/* Make Visible */}
          <button
            onClick={() => onBulkSetVisibility(true)}
            disabled={isProcessing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Hiển thị tất cả sinh vật đã chọn"
          >
            <Eye size={14} />
            <span>Hiện ({selectedCount})</span>
          </button>

          {/* Make Hidden */}
          <button
            onClick={() => onBulkSetVisibility(false)}
            disabled={isProcessing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
            } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Ẩn tất cả sinh vật đã chọn"
          >
            <EyeOff size={14} />
            <span>Ẩn ({selectedCount})</span>
          </button>

          {/* Bulk Delete */}
          <button
            onClick={onBulkDelete}
            disabled={isProcessing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              isDark
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                : "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100"
            } ${isProcessing ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Xóa tất cả sinh vật đã chọn"
          >
            <Trash2 size={14} />
            <span>Xóa đã chọn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
