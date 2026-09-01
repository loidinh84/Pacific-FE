import { AlertTriangle, Loader2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  group,
  isLoading = false,
}) {
  const { isDark } = useTheme();

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl transition-all ${
          isDark
            ? "bg-[#18254b]/95 border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            : "bg-white border-slate-200 text-slate-900 shadow-xl"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
            <AlertTriangle size={24} />
          </div>

          <h3 className="text-base font-bold font-heading mb-1.5">
            Xác nhận xóa nhóm
          </h3>

          <p className="text-xs text-slate-300 mb-2 leading-relaxed">
            Bạn có chắc chắn muốn xóa nhóm sinh vật{" "}
            <strong className="text-rose-300">"{group.name}"</strong>?
          </p>

          {group.creatureCount > 0 && (
            <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-4 leading-normal">
              Nhóm này đang có <strong>{group.creatureCount}</strong> sinh vật. Sau khi xóa, các sinh vật này sẽ được chuyển về trạng thái chưa phân nhóm (không bị xóa khỏi hệ thống).
            </p>
          )}

          <div className="flex items-center justify-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isLoading && <Loader2 size={13} className="animate-spin" />}
              <span>Xóa nhóm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
