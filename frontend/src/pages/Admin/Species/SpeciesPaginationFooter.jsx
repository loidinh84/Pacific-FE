import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

const PER_PAGE_OPTIONS = [10, 20, 50];

export default function SpeciesPaginationFooter({
  page = 1,
  totalPages = 1,
  totalCount = 0,
  filteredCount = 0,
  perPage = 20,
  onPageChange = () => {},
  onPerPageChange = () => {},
}) {
  const { isDark } = useTheme();

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const btnBase = `px-2 py-1 rounded font-bold cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
    isDark
      ? "bg-white/10 hover:bg-white/20 text-white"
      : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
  }`;

  return (
    <div
      className={`px-4 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-sm mt-auto transition-colors duration-300 ${
        isDark
          ? "bg-[#1e2f5c] border-white/10 text-white/70"
          : "bg-slate-100 border-slate-200 text-slate-600"
      }`}
    >
      {/* Per-page selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="opacity-70">Hiển thị</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className={`px-2 py-1 rounded border text-xs font-semibold cursor-pointer focus:outline-none ${
            isDark
              ? "bg-[#142144] border-white/20 text-white"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="opacity-70">/ trang</span>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button className={btnBase} onClick={() => onPageChange(1)} disabled={page <= 1}>
          <ChevronsLeft size={13} />
        </button>
        <button className={btnBase} onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft size={13} />
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors text-xs ${
              p === page
                ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30"
                : isDark
                  ? "bg-white/10 hover:bg-white/20 text-white/70"
                  : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-600"
            }`}
          >
            {p}
          </button>
        ))}

        <button className={btnBase} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          <ChevronRight size={13} />
        </button>
        <button className={btnBase} onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}>
          <ChevronsRight size={13} />
        </button>
      </div>

      {/* Count info */}
      <div className="text-xs">
        <span className={`font-mono font-bold ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
          {filteredCount}
        </span>
        <span className="opacity-70"> / tổng </span>
        <span className={`font-mono font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          {totalCount}
        </span>
        <span className="opacity-70"> sinh vật</span>
      </div>
    </div>
  );
}
