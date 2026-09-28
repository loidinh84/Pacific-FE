import { useState, useMemo } from "react";
import { Search, Layers, X, Check } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

// Helper to remove redundant text in parentheses (e.g. "(Fish)", "(Marine Mammals)")
const cleanLabel = (text) => {
  if (!text) return "";
  return text.replace(/\s*\([^)]*\)/g, "").trim();
};

export default function SpeciesFilterSidebar({
  searchTerm = "",
  setSearchTerm = () => {},
  selectedConservation = "all",
  setSelectedConservation = () => {},
  groups = [],
  selectedGroupId = "all",
  setSelectedGroupId = () => {},
}) {
  const { isDark } = useTheme();
  const [groupSearch, setGroupSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    const term = groupSearch.toLowerCase().trim();
    return groups.filter((g) => {
      const clean = cleanLabel(g.name).toLowerCase();
      const raw = (g.name || "").toLowerCase();
      return clean.includes(term) || raw.includes(term);
    });
  }, [groups, groupSearch]);

  const totalAllCreatures = useMemo(() => {
    return groups.reduce((acc, curr) => acc + (Number(curr.creatureCount) || 0), 0);
  }, [groups]);

  return (
    <aside className="lg:col-span-4 xl:col-span-3 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1.5 custom-scrollbar sticky top-20">
      {/* Filter Card 1: Tìm kiếm */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Tìm kiếm
          </h3>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X size={12} />
              <span>Xóa</span>
            </button>
          )}
        </div>
        <div className="relative">
          <Search
            size={14}
            className={`absolute left-3 top-3 ${isDark ? "text-white/40" : "text-slate-400"}`}
          />
          <input
            type="text"
            placeholder="Theo mã, tên, tên KH..."
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

      {/* Filter Card 2: Nhóm sinh vật (Dynamic from API) */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers size={15} className="text-cyan-400" />
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Nhóm sinh vật
            </h3>
          </div>
          {selectedGroupId !== "all" && (
            <button
              onClick={() => setSelectedGroupId("all")}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Mặc định</span>
            </button>
          )}
        </div>

        {/* Group Quick Search if groups list has more than 4 items */}
        {groups.length > 4 && (
          <div className="relative">
            <Search
              size={13}
              className={`absolute left-2.5 top-2.5 ${isDark ? "text-white/40" : "text-slate-400"}`}
            />
            <input
              type="text"
              placeholder="Lọc nhóm..."
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              className={`w-full pl-8 pr-2.5 py-1.5 border rounded-xl text-xs focus:outline-none ${
                isDark
                  ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
              }`}
            />
          </div>
        )}

        <div className="space-y-1 text-sm max-h-52 overflow-y-auto custom-scrollbar pr-0.5">
          {/* Tất cả các nhóm button */}
          <button
            onClick={() => setSelectedGroupId("all")}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-left ${
              selectedGroupId === "all"
                ? isDark
                  ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                  : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                : isDark
                ? "text-white/70 hover:bg-white/5 hover:text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate">Tất cả các nhóm</span>
            </div>
            {totalAllCreatures > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                  isDark ? "bg-white/10 text-white/80" : "bg-slate-200 text-slate-700"
                }`}
              >
                {totalAllCreatures}
              </span>
            )}
          </button>

          {/* Dynamic groups */}
          {filteredGroups.map((g) => {
            const isSelected = String(selectedGroupId) === String(g.id);
            return (
              <button
                key={g.id}
                onClick={() =>
                  setSelectedGroupId(isSelected ? "all" : String(g.id))
                }
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                      : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                    : isDark
                    ? "text-white/70 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: g.color || "#06b6d4" }}
                  />
                  <span className="truncate" title={g.name}>
                    {cleanLabel(g.name)}
                  </span>
                </div>
                {g.creatureCount != null && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono font-semibold shrink-0 ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-400/20 text-cyan-200"
                          : "bg-cyan-100 text-cyan-800"
                        : isDark
                        ? "bg-white/10 text-white/80"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {g.creatureCount}
                  </span>
                )}
              </button>
            );
          })}

          {filteredGroups.length === 0 && (
            <p className="text-xs text-center py-2 opacity-50">Không có nhóm phù hợp</p>
          )}
        </div>
      </div>

      {/* Filter Card 3: Tình trạng bảo tồn */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white"
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Tình trạng bảo tồn
          </h3>
          {selectedConservation !== "all" && (
            <button
              onClick={() => setSelectedConservation("all")}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Mặc định</span>
            </button>
          )}
        </div>
        <div className="space-y-1.5 text-sm">
          {[
            { code: "all", label: "Tất cả", color: "bg-white/40" },
            { code: "LC", label: "Ít lo ngại", color: "bg-emerald-400" },
            { code: "VU", label: "Sắp nguy cấp", color: "bg-amber-400" },
            { code: "EN", label: "Nguy cấp", color: "bg-orange-500" },
            { code: "CR", label: "Cực kỳ nguy cấp", color: "bg-rose-500" },
            { code: "DD", label: "Thiếu dữ liệu", color: "bg-slate-400" },
            { code: "NE", label: "Chưa đánh giá", color: "bg-gray-500" },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setSelectedConservation(item.code)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-left ${
                selectedConservation === item.code
                  ? isDark
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                  : isDark
                  ? "text-white/70 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2 truncate mr-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.code !== "all" && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    selectedConservation === item.code
                      ? isDark
                        ? "bg-cyan-400/20 text-cyan-200"
                        : "bg-cyan-100 text-cyan-800"
                      : isDark
                      ? "bg-white/10 text-white/50"
                      : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {item.code}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

