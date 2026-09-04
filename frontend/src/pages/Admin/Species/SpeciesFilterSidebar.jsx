import { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function SpeciesFilterSidebar({
  searchTerm,
  setSearchTerm,
  selectedConservation,
  setSelectedConservation,
}) {
  const { isDark } = useTheme();
  const [isTreeGroupOpen, setIsTreeGroupOpen] = useState(true);

  return (
    <aside className="lg:col-span-4 xl:col-span-3 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1.5 custom-scrollbar sticky top-20">
      {/* Filter Card 1: Tìm kiếm */}
      <div
        className={`p-4 rounded-2xl border space-y-2 shadow-sm ${
          isDark
            ? "bg-[#0b1739]/85 backdrop-blur-md border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Tìm kiếm
        </h3>
        <div className="relative">
          <Search
            size={14}
            className={`absolute left-3 top-3 ${isDark ? "text-white/40" : "text-slate-400"}`}
          />
          <input
            type="text"
            placeholder="Theo mã, tên sinh vật..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none transition-all ${
              isDark
                ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
            }`}
          />
        </div>
      </div>

      {/* Filter Card 2: Loại sinh vật */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-sm ${
          isDark
            ? "bg-[#0b1739]/85 backdrop-blur-md border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Loại sinh vật
        </h3>
        <div className="space-y-2 text-sm">
          {["Cá", "Động vật có vú", "Động vật không xương", "Bò sát", "Thực vật biển"].map(
            (cat, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <input
                  type="checkbox"
                  defaultChecked={idx === 0}
                  className="w-3.5 h-3.5 rounded border-white/20 bg-white/10 accent-cyan-400 cursor-pointer"
                />
                <span>{cat}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Filter Card 3: Nhóm sinh vật Tree Navigation */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-sm ${
          isDark
            ? "bg-[#0b1739]/85 backdrop-blur-md border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Nhóm sinh vật
        </h3>
        <div className="relative">
          <Search
            size={13}
            className={`absolute left-3 top-2.5 ${isDark ? "text-white/40" : "text-slate-400"}`}
          />
          <input
            type="text"
            placeholder="Tìm nhóm..."
            className={`w-full pl-8 pr-3 py-1.5 border rounded-xl text-sm focus:outline-none ${
              isDark
                ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
            }`}
          />
        </div>

        <div className="space-y-1 text-sm pt-1">
          <button
            onClick={() => setIsTreeGroupOpen(!isTreeGroupOpen)}
            className={`w-full flex items-center justify-between py-1 text-left font-bold cursor-pointer ${
              isDark ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-600 hover:text-cyan-700"
            }`}
          >
            <div className="flex items-center gap-1">
              {isTreeGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Vùng nước mở</span>
            </div>
          </button>

          {isTreeGroupOpen && (
            <div
              className={`pl-5 space-y-1.5 border-l ml-2 text-[11px] ${
                isDark ? "border-cyan-500/30 text-white/70" : "border-cyan-300 text-slate-600"
              }`}
            >
              <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Cá tầng giữa</p>
              <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Cá tầng sâu</p>
              <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Động vật có vú biển</p>
            </div>
          )}

          <p
            className={`py-1 pl-1 font-semibold cursor-pointer transition-colors ${
              isDark ? "text-white/80 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-600"
            }`}
          >
            › Vùng đáy biển
          </p>
          <p
            className={`py-1 pl-1 font-semibold cursor-pointer transition-colors ${
              isDark ? "text-white/80 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-600"
            }`}
          >
            › Rạn san hô
          </p>
        </div>
      </div>

      {/* Filter Card 4: Tình trạng bảo tồn */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-sm ${
          isDark
            ? "bg-[#0b1739]/85 backdrop-blur-md border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Tình trạng bảo tồn
        </h3>
        <div className="space-y-1.5 text-sm">
          {[
            { code: "all", label: "Tất cả", color: "bg-white/40" },
            { code: "LC", label: "Ít lo ngại (LC)", color: "bg-emerald-400" },
            { code: "VU", label: "Sắp nguy cấp (VU)", color: "bg-amber-400" },
            { code: "EN", label: "Nguy cấp (EN)", color: "bg-orange-500" },
            { code: "CR", label: "Cực kỳ nguy cấp (CR)", color: "bg-rose-500" },
            { code: "DD", label: "Thiếu dữ liệu (DD)", color: "bg-slate-400" },
            { code: "NE", label: "Chưa đánh giá (NE)", color: "bg-gray-500" },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedConservation(item.code)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-left ${
                selectedConservation === item.code
                  ? isDark
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                  : isDark
                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
