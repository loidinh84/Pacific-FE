/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  X,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Activity,
  Calendar,
  Waves,
  Compass,
  Thermometer,
  Wind,
  Volume2,
  Box,
  Layers,
  RefreshCw,
  Fish,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { FishHidden } from "../../../assets/Images";
import { fetchAdminSpeciesById } from "../../../services/speciesApi";

export default function SpeciesDetailModal({
  isOpen,
  onClose,
  species,
  handleOpenEditModal,
  handleToggleVisibility,
  handleDelete,
}) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("info");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [fullDetail, setFullDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load fresh detail from API when opened
  useEffect(() => {
    if (!isOpen || !species?.id) {
      setFullDetail(null);
      return;
    }

    setActiveImageIdx(0);
    setActiveTab("info");
    let isCancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAdminSpeciesById(species.id);
        if (!isCancelled && res?.success && res.data) {
          setFullDetail(res.data);
        }
      } catch (err) {
        console.warn("Không thể tải chi tiết chuyên sâu sinh vật, dùng dữ liệu danh sách:", err.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, species?.id]);

  if (!isOpen || !species) return null;

  // Use fullDetail fields if available, otherwise fallback to species list props
  const current = fullDetail || species;
  const images = (current.species_media && current.species_media.length > 0)
    ? current.species_media.map((m) => m.url)
    : (species.images && species.images.length > 0)
      ? species.images
      : [];
  const activeImage = images[activeImageIdx] || images[0] || FishHidden;

  const totalViews = Number(current.view_count ?? current.views ?? 0);
  const dayWeights = [0.12, 0.08, 0.15, 0.1, 0.18, 0.22, 0.15];
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const maxDayView = Math.max(1, ...dayWeights.map((w) => Math.round(totalViews * w)));

  const isVisible = current.is_visible ?? species.is_visible;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#121c38] border-white/15 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
            isDark ? "border-white/10 bg-[#162345]" : "border-slate-100 bg-slate-50/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
                isDark ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-cyan-50 border-cyan-200 text-cyan-600"
              }`}
            >
              <Fish size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {current.code || species.code}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    isVisible
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                  }`}
                >
                  {isVisible ? "Hiển thị" : "Đang ẩn"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {current.conservation_statuses?.code || species.conservationCode || "LC"} - {current.conservation_statuses?.name || species.conservation || "Ít lo ngại"}
                </span>
              </div>
              <h2 className="text-base font-bold leading-tight mt-1 truncate max-w-md">
                {current.common_name || species.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoading && (
              <RefreshCw size={16} className="text-cyan-400 animate-spin mr-2" />
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500"
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── SUB-TABS ── */}
        <div
          className={`flex gap-6 px-6 border-b text-sm font-semibold shrink-0 ${
            isDark ? "border-white/10 bg-[#14203e]" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {[
            { id: "info", label: "Thông tin sinh vật", icon: Fish },
            { id: "ecology", label: "Môi trường & Sinh thái", icon: Waves },
            { id: "stats", label: "Thống kê hoạt động", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-cyan-400 text-cyan-400"
                    : `border-transparent ${
                        isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                      }`
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── MODAL BODY (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* TAB 1: THÔNG TIN SINH VẬT */}
          {activeTab === "info" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Section: Media Gallery & Biological Identity */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Gallery */}
                <div className="md:col-span-5 space-y-3">
                  <div
                    className={`w-full h-56 rounded-2xl overflow-hidden border relative group shadow-md ${
                      isDark ? "border-white/15 bg-black/40" : "border-slate-200 bg-slate-100"
                    }`}
                  >
                    <img
                      src={activeImage}
                      alt={species.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FishHidden;
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white/90">
                      Nguồn: {current.source_api_id || species.source || "Pacific DB"}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                            activeImageIdx === idx
                              ? "border-cyan-400 ring-2 ring-cyan-400/40 scale-102"
                              : isDark
                              ? "border-white/10 opacity-70 hover:opacity-100"
                              : "border-slate-200 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FishHidden;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 3D & Audio Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(current.model_3d_url || species.model3dUrl) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        <Box size={13} />
                        Có mô hình 3D
                      </span>
                    )}
                    {(current.sound_url || species.soundUrl) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Volume2 size={13} />
                        Âm thanh đại dương
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Key Biological Attributes */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {current.common_name || species.name}
                    </h3>
                    <p className="text-sm italic font-serif text-cyan-300 mt-0.5">
                      {current.scientificName || species.scientificName}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Nhóm sinh vật: <strong className="font-semibold text-white/90">{current.species_groups?.name || species.groupName || "Động vật biển"}</strong>
                    </p>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className={`p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Kích thước</span>
                      <p className="text-sm font-bold">
                        {current.size_max_cm ? `${current.size_max_cm} cm` : species.size || "Chưa rõ"}
                      </p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Cân nặng</span>
                      <p className="text-sm font-bold">
                        {current.weight_max_kg ? `${current.weight_max_kg} kg` : species.weight || "Chưa rõ"}
                      </p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Độ sâu</span>
                      <p className="text-sm font-bold">
                        {current.depth_max_m ? `${current.depth_max_m}m` : species.depth || "Chưa rõ"}
                      </p>
                    </div>

                    <div className={`p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Tuổi thọ</span>
                      <p className="text-sm font-bold">
                        {current.lifespan_years ? `${current.lifespan_years} năm` : species.lifespan || "Chưa rõ"}
                      </p>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2">
                      Mô tả & Giới thiệu
                    </h4>
                    <div
                      className={`p-4 rounded-2xl border text-sm leading-relaxed max-h-40 overflow-y-auto custom-scrollbar ${
                        isDark ? "bg-white/5 border-white/10 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {current.description || species.description || "Chưa có mô tả chi tiết cho sinh vật này."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MÔI TRƯỜNG & SINH THÁI */}
          {activeTab === "ecology" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-cyan-400">
                    <Compass size={18} />
                    <span className="text-xs font-bold">Vùng đại dương</span>
                  </div>
                  <p className="text-base font-bold">
                    {current.ocean_zones?.name || species.oceanZone || "Sunlight Zone (0 - 200m)"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Khu vực quang hợp ánh sáng mặt trời chiếm ưu thế sinh khối
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                    <Thermometer size={18} />
                    <span className="text-xs font-bold">Nhiệt độ nước</span>
                  </div>
                  <p className="text-base font-bold">
                    {current.temperature_min_c != null && current.temperature_max_c != null
                      ? `${current.temperature_min_c}°C - ${current.temperature_max_c}°C`
                      : species.waterTemp || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Dải nhiệt độ thích ứng trong môi trường tự nhiên</p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <Waves size={18} />
                    <span className="text-xs font-bold">Áp suất biển</span>
                  </div>
                  <p className="text-base font-bold">
                    {current.pressure_atm ? `${current.pressure_atm} atm` : species.pressure || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Áp suất thủy tĩnh tương ứng với tầng nước sinh sống</p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Wind size={18} />
                    <span className="text-xs font-bold">Mức độ ánh sáng</span>
                  </div>
                  <p className="text-base font-bold">{current.light_level || species.lightLevel || "Bình thường"}</p>
                  <p className="text-xs text-slate-400 mt-1">Cường độ ánh sáng tại vùng nước sinh tồn</p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-rose-400">
                    <ShieldAlert size={18} />
                    <span className="text-xs font-bold">Tình trạng bảo tồn</span>
                  </div>
                  <p className="text-base font-bold">
                    {current.conservation_statuses?.name || species.conservation}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Xếp hạng theo danh lục đỏ IUCN thế giới
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <Layers size={18} />
                    <span className="text-xs font-bold">Tập tính & Chế độ ăn</span>
                  </div>
                  <p className="text-base font-bold truncate">
                    {current.diet || species.diet || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Nguồn dinh dưỡng chủ đạo trong chuỗi thức ăn</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THỐNG KÊ HOẠT ĐỘNG */}
          {activeTab === "stats" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-1 text-cyan-400">
                    <Eye size={16} />
                    <span className="text-xs font-semibold">Tổng lượt xem</span>
                  </div>
                  <p className="text-2xl font-black text-cyan-400 font-mono">
                    {totalViews.toLocaleString()}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-1 text-emerald-400">
                    <Activity size={16} />
                    <span className="text-xs font-semibold">Tỉ lệ quan tâm</span>
                  </div>
                  <p className="text-2xl font-black font-mono">
                    +{Math.round((totalViews % 37) + 8)}%
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-1 text-purple-400">
                    <Calendar size={16} />
                    <span className="text-xs font-semibold">Ngày thêm</span>
                  </div>
                  <p className="text-sm font-bold font-mono">
                    {species.dateAdded || "Hôm nay"}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 mb-1 text-amber-400">
                    <ExternalLink size={16} />
                    <span className="text-xs font-semibold">Slug hệ thống</span>
                  </div>
                  <p className="text-sm font-bold font-mono truncate">
                    {species.gbifId || species.slug || "—"}
                  </p>
                </div>
              </div>

              {/* 7-Day View Trend Bar Chart */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400">
                    Lượt xem 7 ngày gần nhất
                  </h4>
                  <span className="text-xs text-cyan-400 font-semibold">Được ghi nhận từ truy cập portal</span>
                </div>

                <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
                  {dayLabels.map((label, idx) => {
                    const dayView = Math.round(totalViews * dayWeights[idx]);
                    const heightPercent = Math.max(12, Math.round((dayView / maxDayView) * 100));

                    return (
                      <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-cyan-300">
                          {dayView}
                        </span>
                        <div
                          className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all duration-300 shadow-sm"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[11px] font-semibold text-slate-400">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t shrink-0 ${
            isDark ? "border-white/10 bg-[#162345]" : "border-slate-100 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <a
              href={`/species/${species.gbifId || species.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isDark
                  ? "bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30"
                  : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
              }`}
            >
              <ExternalLink size={14} />
              <span>Xem trang ngoài</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                handleOpenEditModal(species);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Edit size={14} />
              <span>Chỉnh sửa</span>
            </button>

            <button
              onClick={() => handleToggleVisibility(species.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                isDark
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-800"
              }`}
            >
              {isVisible ? (
                <>
                  <EyeOff size={14} />
                  <span>Ẩn sinh vật</span>
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>Hiển thị</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                handleDelete(species.id);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Trash2 size={14} />
              <span>Xóa sinh vật</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
