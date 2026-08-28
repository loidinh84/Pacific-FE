import { useTheme } from "../../../hooks/useTheme";

export default function SpeciesPaginationFooter({ filteredCount, totalCount }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`px-6 py-3 border-t flex items-center justify-between text-sm mt-auto transition-colors duration-300 ${
        isDark
          ? "bg-[#1e2f5c] border-white/10 text-white/70"
          : "bg-slate-100 border-slate-200 text-slate-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
          }`}
        >
          &lt;&lt;
        </button>
        <button
          className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
          }`}
        >
          &lt;
        </button>
        <span className="px-3 py-1 rounded bg-cyan-500 text-white font-bold shadow-sm">1</span>
        <span
          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
            isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-200 text-slate-600"
          }`}
        >
          2
        </span>
        <span
          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
            isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-200 text-slate-600"
          }`}
        >
          3
        </span>
        <button
          className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
          }`}
        >
          &gt;
        </button>
        <button
          className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
          }`}
        >
          &gt;&gt;
        </button>
      </div>

      <div>
        <span className="font-mono text-cyan-500 font-bold">
          {filteredCount}/{totalCount}
        </span>{" "}
        sinh vật
      </div>
    </div>
  );
}
