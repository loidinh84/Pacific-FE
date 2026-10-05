import {
  Edit,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Activity,
  Calendar,
  BarChart3,
  Database,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { FishHidden } from "../../../assets/Images";

export default function SpeciesExpandedDetail({
  selectedSpecies,
  activeDetailTab,
  setActiveDetailTab,
  handleOpenEditModal,
  handleToggleVisibility,
  handleDelete,
}) {
  const { isDark } = useTheme();

  if (!selectedSpecies) return null;

  // Generate 7-day mock view distribution based on current total views
  const totalViews = Number(selectedSpecies.views) || 0;
  const dayWeights = [0.12, 0.08, 0.15, 0.1, 0.18, 0.22, 0.15];
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const maxDayView = Math.max(1, ...dayWeights.map((w) => Math.round(totalViews * w)));

  return (
    <tr>
      <td
        colSpan={10}
        className={`p-0 border-b-2 border-cyan-500/40 ${
          isDark ? "bg-[#16254e]/95" : "bg-slate-100/90"
        }`}
      >
        <div className="p-5 space-y-4 animate-in fade-in duration-200">
          {/* Detail Sub-Tabs */}
          <div
            className={`flex border-b gap-4 text-sm font-bold ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          >
            <button
              onClick={() => setActiveDetailTab("info")}
              className={`pb-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDetailTab === "info"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Thông tin sinh vật</span>
            </button>
            <button
              onClick={() => setActiveDetailTab("stats")}
              className={`pb-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDetailTab === "stats"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Activity size={14} />
              <span>Thống kê hoạt động</span>
            </button>
          </div>

          {activeDetailTab === "info" ? (
            /* EXPANDED PANEL CONTENT */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left: Main Image + Thumbnails */}
              <div className="md:col-span-4 space-y-2.5">
                <div
                  className={`w-full h-44 rounded-2xl overflow-hidden border ${
                    isDark ? "border-white/15 bg-black/40" : "border-slate-200 bg-slate-200"
                  }`}
                >
                  <img
                    src={selectedSpecies?.images?.[0] || FishHidden}
                    alt={selectedSpecies?.name || "Species"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FishHidden;
                    }}
                  />
                </div>

                {/* Gallery Thumbnails */}
                {selectedSpecies?.images && selectedSpecies.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {selectedSpecies.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`h-12 rounded-lg overflow-hidden border ${
                          isDark ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-200"
                        }`}
                      >
                        <img
                          src={img || FishHidden}
                          alt={`Thumb ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FishHidden;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p className={`text-xs font-medium ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  Nguồn dữ liệu:{" "}
                  <strong className={isDark ? "text-white/80" : "text-slate-800"}>
                    {selectedSpecies.source || "Pacific DB"}
                  </strong>
                </p>
              </div>

              {/* Middle: Biological Attributes List */}
              <div
                className={`md:col-span-4 space-y-1.5 text-sm ${
                  isDark ? "text-white/80" : "text-slate-700"
                }`}
              >
                <p>
                  Tên sinh vật:{" "}
                  <strong className={isDark ? "text-white" : "text-slate-900"}>
                    {selectedSpecies.name}
                  </strong>
                </p>
                <p>
                  Tên khoa học:{" "}
                  <em className={`font-bold italic ${isDark ? "text-cyan-200" : "text-slate-900"}`}>
                    {selectedSpecies.scientificName}
                  </em>
                </p>
                <p>Phân loại: {selectedSpecies.classification}</p>
                <p>Kích thước: {selectedSpecies.size}</p>
                <p>Độ sâu sống: {selectedSpecies.depth}</p>
                <p>Nhiệt độ nước: {selectedSpecies.waterTemp}</p>
                <p>Vùng địa lý: {selectedSpecies.geoZone}</p>
                <p>Chế độ ăn & tập tính: {selectedSpecies.diet || "Chưa cập nhật"}</p>
                <p>Tuổi thọ: {selectedSpecies.lifespan}</p>
              </div>

              {/* Right: Metadata + Action Buttons */}
              <div className="md:col-span-4 space-y-3">
                <div className={`text-sm space-y-1 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  <p>
                    Bảo tồn:{" "}
                    <span className="text-rose-500 font-bold">
                      {selectedSpecies.conservation}
                    </span>
                  </p>
                  <p>Nhóm sinh vật: {selectedSpecies.groupName}</p>
                  <p>Trạng thái: {selectedSpecies.status}</p>
                  <p>Ngày thêm: {selectedSpecies.dateAdded}</p>
                </div>

                {/* Description Box */}
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed max-h-24 overflow-y-auto ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white/70"
                      : "bg-white border-slate-200 text-slate-700 shadow-xs"
                  }`}
                >
                  {selectedSpecies.description || "Chưa có mô tả chi tiết."}
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={(e) => handleOpenEditModal(selectedSpecies, e)}
                    className="flex-1 min-w-[100px] py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Edit size={14} />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    onClick={(e) => handleToggleVisibility(selectedSpecies.id, e)}
                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isDark
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                    }`}
                  >
                    {selectedSpecies.is_visible ? (
                      <>
                        <EyeOff size={14} />
                        <span>Ẩn</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Hiện</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/species/${selectedSpecies.gbifId || selectedSpecies.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isDark
                        ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                        : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                    }`}
                    title="Mở xem trang công khai của sinh vật này"
                  >
                    <ExternalLink size={14} />
                    <span>Xem trang</span>
                  </a>

                  <button
                    onClick={(e) => handleDelete(selectedSpecies.id, e)}
                    className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Trash2 size={14} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVITY STATS TAB */
            <div className="space-y-4">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={15} className="text-cyan-400" />
                    <span className="text-xs font-semibold opacity-70">Tổng lượt xem</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-cyan-400">
                    {totalViews.toLocaleString()}
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={15} className="text-emerald-400" />
                    <span className="text-xs font-semibold opacity-70">Trạng thái</span>
                  </div>
                  <div className="text-sm font-bold mt-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                        selectedSpecies.is_visible
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {selectedSpecies.is_visible ? "Đang công khai" : "Đã tạm ẩn"}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={15} className="text-amber-400" />
                    <span className="text-xs font-semibold opacity-70">Ngày thêm</span>
                  </div>
                  <div className="text-sm font-bold font-mono mt-0.5">
                    {selectedSpecies.dateAdded || "Chưa rõ"}
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-slate-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Database size={15} className="text-indigo-400" />
                    <span className="text-xs font-semibold opacity-70">Mã GBIF / ID</span>
                  </div>
                  <div className="text-xs font-mono font-bold truncate mt-0.5" title={selectedSpecies.gbifId}>
                    {selectedSpecies.gbifId || `#${selectedSpecies.id}`}
                  </div>
                </div>
              </div>

              {/* 7-Day View Trend Simulation Bar Chart */}
              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-cyan-400" />
                    <h4 className="text-xs font-bold">
                      Biểu đồ tương tác 7 ngày qua
                    </h4>
                  </div>
                  <span className="text-[11px] opacity-60 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-400" />
                    Xu hướng tương tác
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 h-28 pt-4 px-2">
                  {dayLabels.map((label, index) => {
                    const count = Math.round(totalViews * dayWeights[index]);
                    const heightPercent = Math.max(12, Math.round((count / maxDayView) * 100));

                    return (
                      <div key={label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 font-bold">
                          {count}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                            index === 6
                              ? "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-md shadow-cyan-500/20"
                              : isDark
                              ? "bg-cyan-500/40 hover:bg-cyan-500/60"
                              : "bg-cyan-200 hover:bg-cyan-300"
                          }`}
                        />
                        <span className="text-[11px] font-medium opacity-60">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="text-xs opacity-60">
                  Dữ liệu được cập nhật tự động từ cổng cơ sở dữ liệu sinh học đại dương.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenEditModal(selectedSpecies, e)}
                    className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Edit size={13} />
                    <span>Sửa thông tin</span>
                  </button>
                  <a
                    href={`/species/${selectedSpecies.gbifId || selectedSpecies.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                      isDark
                        ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                        : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                    }`}
                  >
                    <ExternalLink size={13} />
                    <span>Xem trang công khai</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

