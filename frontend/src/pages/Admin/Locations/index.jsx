import { Plus } from "lucide-react";

export default function LocationsManagement() {
  return (
    <div className="space-y-6">
      {/* ── TOP HEADER (TITLE + ACTIONS) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Quản lý địa điểm nổi tiếng
        </h1>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs md:text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0">
          <Plus size={16} />
          <span>Thêm địa điểm mới</span>
        </button>
      </div>

      <div className="rounded-2xl border border-white/20 bg-[#0b1739]/85 backdrop-blur-md p-12 text-center shadow-sm">
        <p className="text-white text-sm font-semibold">
          [ Khu vực: Danh sách các địa điểm nổi tiếng Thái Bình Dương ]
        </p>
      </div>
    </div>
  );
}
