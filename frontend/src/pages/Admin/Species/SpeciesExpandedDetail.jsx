import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

export default function SpeciesExpandedDetail({
  selectedSpecies,
  activeDetailTab,
  setActiveDetailTab,
  handleOpenEditModal,
  handleToggleVisibility,
  handleDelete,
}) {
  const { isDark } = useTheme();

  return (
    <tr>
      <td
        colSpan={9}
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
              className={`pb-2 transition-all cursor-pointer ${
                activeDetailTab === "info"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Thông tin sinh vật
            </button>
            <button
              onClick={() => setActiveDetailTab("stats")}
              className={`pb-2 transition-all cursor-pointer ${
                activeDetailTab === "stats"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : isDark
                  ? "text-white/50 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Thống kê hoạt động
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
                    src={
                      selectedSpecies?.images?.[0] ||
                      "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={selectedSpecies?.name || "Species"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gallery Thumbnails */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(selectedSpecies?.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className={`h-12 rounded-lg overflow-hidden border ${
                        isDark ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumb"
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
                <p className={`text-xs font-medium ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  Nguồn dữ liệu:{" "}
                  <strong className={isDark ? "text-white/80" : "text-slate-800"}>
                    {selectedSpecies.source}
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
                  <em className="text-white font-bold">
                    {selectedSpecies.scientificName}
                  </em>
                </p>
                <p>Phân loại: {selectedSpecies.classification}</p>
                <p>Kích thước: {selectedSpecies.size}</p>
                <p>Độ sâu sống: {selectedSpecies.depth}</p>
                <p>Nhiệt độ nước: {selectedSpecies.waterTemp}</p>
                <p>Vùng địa lý: {selectedSpecies.geoZone}</p>
                <p>Chế độ ăn & tập tính: {selectedSpecies.diet}</p>
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
                  {selectedSpecies.description}
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={(e) => handleOpenEditModal(selectedSpecies, e)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
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
            /* Activity Stats Tab Placeholder */
            <div
              className={`p-6 text-center text-sm ${
                isDark ? "text-white/60" : "text-slate-500"
              }`}
            >
              <p>Thống kê lượt xem và lịch sử cập nhật dữ liệu của sinh vật này.</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
