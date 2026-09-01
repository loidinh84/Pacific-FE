import { Edit3, Trash2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function SpeciesGroupCard({ group, onEdit, onDelete }) {
  const { isDark } = useTheme();

  const groupColor = group.color || "#3b82f6";

  return (
    <div
      className={`group relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
        isDark
          ? "bg-[#182649] border-white/10 hover:border-cyan-400/40 hover:bg-[#1c2c54]"
          : "bg-white border-slate-200 hover:border-cyan-500/40 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            {/* Color indicator */}
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-2 ring-white/20"
              style={{ backgroundColor: groupColor }}
              title={`Màu đại diện: ${groupColor}`}
            />
            <h3
              className={`text-lg sm:text-xl font-bold font-heading truncate ${
                isDark ? "text-white group-hover:text-cyan-300" : "text-slate-900 group-hover:text-cyan-700"
              } transition-colors`}
            >
              {group.name}
            </h3>

            {/* Visibility badge */}
            {!group.is_visible && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Ẩn
              </span>
            )}
          </div>

          <p
            className={`text-xs sm:text-sm font-normal line-clamp-2 leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {group.description || "Chưa có mô tả chi tiết cho nhóm sinh vật này."}
          </p>
        </div>

        {/* Right: Creature count & Action buttons */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Number of Creatures */}
          <div className="text-right select-none">
            <span
              className={`block text-2xl sm:text-3xl font-black font-heading leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {group.creatureCount ?? 0}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 block -mt-0.5">
              Sinh vật
            </span>
          </div>

          {/* Action buttons (vertical stack) */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onEdit(group)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center min-w-[62px] ${
                isDark
                  ? "bg-white/5 hover:bg-white/15 border-white/20 text-white hover:border-cyan-400/50"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
              }`}
            >
              Sửa
            </button>

            <button
              type="button"
              onClick={() => onDelete(group)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center min-w-[62px] ${
                isDark
                  ? "bg-white/5 hover:bg-rose-500/20 border-white/20 text-white/90 hover:text-rose-300 hover:border-rose-400/50"
                  : "bg-slate-100 hover:bg-rose-50 border-slate-200 text-slate-700 hover:text-rose-600"
              }`}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
