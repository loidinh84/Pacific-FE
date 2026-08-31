import { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  Upload,
  ArrowLeft,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronDown,
  Film,
  Music,
  Box,
  Plus,
  Image as ImageIcon,
  Activity,
  Layers,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { searchSpeciesTaxonomy, uploadMediaFile } from "../../../services/speciesApi";
import OceanSoundPickerModal from "./OceanSoundPickerModal";

const OCEAN_ZONE_OPTIONS = [
  { value: "Sunlight", label: "Tầng nắng (Sunlight / Epipelagic)" },
  { value: "Twilight", label: "Tầng hoàng hôn (Twilight / Mesopelagic)" },
  { value: "Midnight", label: "Tầng nửa đêm (Midnight / Bathypelagic)" },
  { value: "Abyssal", label: "Tầng vực sâu (Abyssal / Abyssopelagic)" },
  { value: "Hadal", label: "Tầng khe sâu (Hadal / Hadalpelagic)" },
];

const CONSERVATION_STATUS_OPTIONS = [
  { value: "LC", label: "Ít lo ngại (LC)" },
  { value: "VU", label: "Sắp nguy cấp (VU)" },
  { value: "EN", label: "Nguy cấp (EN)" },
  { value: "CR", label: "Cực kỳ nguy cấp (CR)" },
  { value: "DD", label: "Thiếu dữ liệu (DD)" },
  { value: "NE", label: "Chưa đánh giá (NE)" },
];

const GROUP_OPTIONS = [
  { value: "1", label: "Cá mập & Kẻ săn mồi lớn" },
  { value: "2", label: "Động vật có vú biển" },
  { value: "3", label: "Động vật thân mềm (Bạch tuộc/Mực)" },
  { value: "4", label: "Cá sặc sỡ rạn san hô" },
];

const API_PROVIDER_OPTIONS = [
  { value: "auto", label: "AI Auto Gateway" },
  { value: "gbif", label: "GBIF API" },
  { value: "inaturalist", label: "iNaturalist API" },
  { value: "worms", label: "WoRMS API" },
];

const DIET_OPTIONS = [
  { value: "Kẻ săn mồi (Carnivore)", label: "Kẻ săn mồi (Carnivore)" },
  { value: "Ăn thực vật (Herbivore)", label: "Ăn thực vật (Herbivore)" },
  { value: "Ăn sinh vật phù du (Planktonivore)", label: "Ăn sinh vật phù du (Planktonivore)" },
  { value: "Ăn tạp (Omnivore)", label: "Ăn tạp (Omnivore)" },
  { value: "Ăn xác thối (Scavenger)", label: "Ăn xác thối (Scavenger)" },
];

function CustomSelect({ options, value, onChange, isDark, direction = "down" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || options[0];

  const positionClasses =
    direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all cursor-pointer shadow-sm ${
          isDark
            ? "bg-[#0d1730] border border-white/15 text-white hover:border-cyan-400/50"
            : "bg-slate-50 border border-slate-200 text-slate-900 hover:border-cyan-500/50"
        } ${
          open
            ? isDark
              ? "border-cyan-400 ring-2 ring-cyan-400/20"
              : "border-cyan-500 ring-2 ring-cyan-500/20"
            : ""
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            open
              ? "rotate-180 text-cyan-400"
              : isDark
              ? "text-cyan-400/70"
              : "text-slate-400"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 ${positionClasses} z-50 rounded-2xl border shadow-2xl overflow-y-auto max-h-44 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl ${
            isDark
              ? "bg-[#0f1c3d]/95 border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              : "bg-white/95 border-slate-200 text-slate-900 shadow-xl"
          }`}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between transition-all text-left cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "bg-cyan-50 text-cyan-700 font-bold"
                    : isDark
                    ? "hover:bg-white/10 text-white/90 hover:text-white"
                    : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <CheckCircle2
                    size={15}
                    className="text-cyan-400 shrink-0 ml-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const getInitialFormData = (editingSpecies) => {
  if (editingSpecies) {
    return {
      name: editingSpecies.name || "",
      scientificName: editingSpecies.scientificName || editingSpecies.scientific_name || "",
      oceanZone: editingSpecies.location || editingSpecies.oceanZone || "Sunlight",
      conservationStatus: editingSpecies.conservationCode || "VU",
      depthMin: editingSpecies.depthMin || "0",
      depthMax: editingSpecies.depthMax || "100",
      groupId: editingSpecies.groupId || "1",
      sizeMinCm: editingSpecies.sizeMinCm || "300",
      sizeMaxCm: editingSpecies.sizeMaxCm || "600",
      weightMinKg: editingSpecies.weightMinKg || "600",
      weightMaxKg: editingSpecies.weightMaxKg || "2200",
      lifespanYears: editingSpecies.lifespanYears || "70",
      diet: editingSpecies.diet || "Kẻ săn mồi (Carnivore)",
      tempMinC: editingSpecies.tempMinC || "12",
      tempMaxC: editingSpecies.tempMaxC || "24",
      model3dUrl: editingSpecies.model3dUrl || "",
      soundUrl: editingSpecies.soundUrl || "",
      gbifQuery: editingSpecies.scientificName || "",
      description: editingSpecies.description || "",
      mediaItems: (editingSpecies.images || []).map((item) =>
        typeof item === "string"
          ? { url: item, type: item.includes(".mp4") || item.includes("youtube") ? "video" : "image" }
          : item
      ),
    };
  }
  return {
    name: "",
    scientificName: "",
    oceanZone: "Sunlight",
    conservationStatus: "VU",
    depthMin: "0",
    depthMax: "100",
    groupId: "1",
    sizeMinCm: "100",
    sizeMaxCm: "400",
    weightMinKg: "100",
    weightMaxKg: "1000",
    lifespanYears: "20",
    diet: "Kẻ săn mồi (Carnivore)",
    tempMinC: "10",
    tempMaxC: "25",
    model3dUrl: "",
    soundUrl: "",
    gbifQuery: "",
    description: "",
    mediaItems: [],
  };
};

export default function AddEditSpeciesModal({ isOpen, onClose, onSave, editingSpecies = null }) {
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);
  const model3DInputRef = useRef(null);
  const soundInputRef = useRef(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // "basic" | "bio" | "media"
  const [formData, setFormData] = useState(() => getInitialFormData(editingSpecies));
  const [isSearchingGbif, setIsSearchingGbif] = useState(false);
  const [selectedApiProvider, setSelectedApiProvider] = useState("auto"); // "auto" | "gbif" | "inaturalist" | "worms"
  const [gbifFound, setGbifFound] = useState(false);
  const [gbifMessage, setGbifMessage] = useState("");
  const [gbifStatusType, setGbifStatusType] = useState("success"); // "success" | "warning" | "error"
  const [inputMediaUrl, setInputMediaUrl] = useState("");
  const [inputMediaType, setInputMediaType] = useState("image");
  const [isSoundPickerOpen, setIsSoundPickerOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGbifSearch = async () => {
    const rawQuery = (formData.gbifQuery || formData.scientificName || "").trim();
    if (!rawQuery) return;

    setIsSearchingGbif(true);
    setGbifFound(false);
    setGbifMessage("");

    try {
      // Gọi qua Backend Proxy Gateway API với Nguồn API được chọn (auto, gbif, inaturalist, worms)
      const res = await searchSpeciesTaxonomy(rawQuery, selectedApiProvider);

      if (res && res.success && res.data) {
        const d = res.data;

        setFormData((prev) => ({
          ...prev,
          name: prev.name || d.name || rawQuery,
          scientificName: d.scientificName || rawQuery,
          description: d.description || prev.description || `Sinh vật biển loài ${d.scientificName}.`,
          mediaItems: d.mediaItems && d.mediaItems.length > 0 ? d.mediaItems : prev.mediaItems,
          groupId: d.groupId || prev.groupId || "1",
          oceanZone: d.oceanZone || prev.oceanZone || "Sunlight",
          diet: d.diet || prev.diet || "Kẻ săn mồi (Carnivore)",
          depthMin: d.depthMin || prev.depthMin || "0",
          depthMax: d.depthMax || prev.depthMax || "100",
          sizeMinCm: d.sizeMinCm || prev.sizeMinCm || "50",
          sizeMaxCm: d.sizeMaxCm || prev.sizeMaxCm || "200",
          weightMinKg: d.weightMinKg || prev.weightMinKg || "5",
          weightMaxKg: d.weightMaxKg || prev.weightMaxKg || "50",
          lifespanYears: d.lifespanYears || prev.lifespanYears || "10",
          tempMinC: d.tempMinC || prev.tempMinC || "10",
          tempMaxC: d.tempMaxC || prev.tempMaxC || "25",
        }));

        setGbifFound(true);

        if (res.warningMessage) {
          setGbifStatusType("warning");
          setGbifMessage(res.warningMessage);
        } else {
          setGbifStatusType("success");
          const providerLabel = selectedApiProvider === "auto"
            ? "AI Gateway"
            : selectedApiProvider.toUpperCase();
          setGbifMessage(`✓ Tra cứu thành công từ [${providerLabel}] - Thông tin sinh học tự động điền!`);
        }
      } else {
        setGbifFound(true);
        setGbifStatusType("error");
        setGbifMessage(res?.message || `Không tìm thấy sinh vật hợp lệ cho từ khóa "${rawQuery}".`);
      }
    } catch (err) {
      console.warn("Lỗi tra cứu Taxonomy qua Backend Proxy:", err);
      setGbifFound(true);
      setGbifStatusType("error");
      setGbifMessage("Không tìm thấy dữ liệu sinh học đại dương hợp lệ.");
    } finally {
      setIsSearchingGbif(false);
    }
  };

  const handleAddMedia = () => {
    if (!inputMediaUrl || !inputMediaUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      mediaItems: [...(prev.mediaItems || []), { url: inputMediaUrl.trim(), type: inputMediaType }],
    }));
    setInputMediaUrl("");
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFile(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadMediaFile(file));
      const results = await Promise.all(uploadPromises);

      const newItems = results.map((res, i) => {
        const file = files[i];
        const isVideo = file.type.startsWith("video/");
        return { url: res.url, type: isVideo ? "video" : "image", name: file.name };
      });

      setFormData((prev) => ({
        ...prev,
        mediaItems: [...(prev.mediaItems || []), ...newItems],
      }));
    } catch (err) {
      console.error("Lỗi upload media files:", err);
      const fallbackItems = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
      }));
      setFormData((prev) => ({
        ...prev,
        mediaItems: [...(prev.mediaItems || []), ...fallbackItems],
      }));
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleModel3DUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      const res = await uploadMediaFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, model3dUrl: res.url }));
      }
    } catch (err) {
      console.error("Lỗi upload 3D file:", err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSoundUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      const res = await uploadMediaFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, soundUrl: res.url }));
      }
    } catch (err) {
      console.error("Lỗi upload Audio file:", err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleMediaRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((_, idx) => idx !== index),
    }));
  };

  const handleMediaMove = (index, dir) => {
    const newItems = [...formData.mediaItems];
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, mediaItems: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      images: formData.mediaItems.map((m) => m.url),
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 ${
        isDark ? "bg-black/30 text-white" : "bg-slate-900/30 text-slate-800"
      }`}
    >
      {/* Theme-Aware Glassmorphism Modal Card */}
      <div
        className={`w-full max-w-2xl backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 ${
          isDark
            ? "bg-[#0d1730]/90 border-cyan-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(6,182,212,0.15)]"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark
                  ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"
                  : "bg-cyan-50 border-cyan-200 text-cyan-600"
              }`}
            >
              <Sparkles size={16} />
            </div>
            <h2
              className={`text-lg font-bold font-heading tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {editingSpecies ? "Chỉnh sửa sinh vật" : "Thêm sinh vật mới"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? "bg-white/5 hover:bg-white/15 border-white/10 text-white/70 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div
          className={`flex border-b px-6 pt-3 backdrop-blur-md gap-2 ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "basic"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600 shadow-sm"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            <Layers size={14} />
            <span>Thông tin cơ bản</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bio")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "bio"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600 shadow-sm"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            <Activity size={14} />
            <span>Chỉ số sinh học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "media"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600 shadow-sm"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            <Film size={14} />
            <span>Ảnh, Video & 3D</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === "basic" && (
            /* TAB 1: THÔNG TIN CƠ BẢN */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Tên sinh vật <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên sinh vật (VD: Cá mập trắng)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400 focus:bg-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white shadow-xs"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Tên khoa học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Carcharodon carcharias"
                    value={formData.scientificName}
                    onChange={(e) =>
                      setFormData({ ...formData, scientificName: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm italic focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400 focus:bg-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white shadow-xs"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Tầng sống <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    options={OCEAN_ZONE_OPTIONS}
                    value={formData.oceanZone}
                    onChange={(val) => setFormData({ ...formData, oceanZone: val })}
                    isDark={isDark}
                    direction="down"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Bảo tồn <span className="text-rose-500">*</span>
                  </label>
                  <CustomSelect
                    options={CONSERVATION_STATUS_OPTIONS}
                    value={formData.conservationStatus}
                    onChange={(val) => setFormData({ ...formData, conservationStatus: val })}
                    isDark={isDark}
                    direction="down"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Độ sâu tối thiểu (m)
                  </label>
                  <input
                    type="number"
                    value={formData.depthMin}
                    onChange={(e) => setFormData({ ...formData, depthMin: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Độ sâu tối đa (m)
                  </label>
                  <input
                    type="number"
                    value={formData.depthMax}
                    onChange={(e) => setFormData({ ...formData, depthMax: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  Nhóm sinh vật
                </label>
                <CustomSelect
                  options={GROUP_OPTIONS}
                  value={formData.groupId}
                  onChange={(val) => setFormData({ ...formData, groupId: val })}
                  isDark={isDark}
                  direction="down"
                />
              </div>
            </div>
          )}

          {activeTab === "bio" && (
            /* TAB 2: CHỈ SỐ SINH HỌC & MÔI TRƯỜNG */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Kích thước min (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 300"
                    value={formData.sizeMinCm}
                    onChange={(e) => setFormData({ ...formData, sizeMinCm: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Kích thước max (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 600"
                    value={formData.sizeMaxCm}
                    onChange={(e) => setFormData({ ...formData, sizeMaxCm: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Trọng lượng min (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 600"
                    value={formData.weightMinKg}
                    onChange={(e) => setFormData({ ...formData, weightMinKg: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Trọng lượng max (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 2200"
                    value={formData.weightMaxKg}
                    onChange={(e) => setFormData({ ...formData, weightMaxKg: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Tuổi thọ trung bình (Năm)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 70"
                    value={formData.lifespanYears}
                    onChange={(e) => setFormData({ ...formData, lifespanYears: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Chế độ ăn (Diet)
                  </label>
                  <CustomSelect
                    options={DIET_OPTIONS}
                    value={formData.diet}
                    onChange={(val) => setFormData({ ...formData, diet: val })}
                    isDark={isDark}
                    direction="down"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Nhiệt độ tối thiểu (°C)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 10"
                    value={formData.tempMinC}
                    onChange={(e) => setFormData({ ...formData, tempMinC: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Nhiệt độ tối đa (°C)
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 24"
                    value={formData.tempMaxC}
                    onChange={(e) => setFormData({ ...formData, tempMaxC: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            /* TAB 3: TRUYỀN THÔNG & ĐA PHƯƠNG TIỆN */
            <div className="space-y-5">
              {/* Tra cứu & Tự động điền dữ liệu Sinh học Card */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2.5 shadow-sm ${
                  isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className={`block text-xs sm:text-sm font-bold ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
                    Tra cứu & Tự động điền dữ liệu
                  </label>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold ${isDark ? "text-white/60" : "text-slate-500"}`}>Nguồn API:</span>
                    <div className="w-60 sm:w-64">
                      <CustomSelect
                        options={API_PROVIDER_OPTIONS}
                        value={selectedApiProvider}
                        onChange={(val) => setSelectedApiProvider(val)}
                        isDark={isDark}
                        direction="down"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      selectedApiProvider === "auto"
                        ? "Nhập từ khóa tiếng Việt hoặc Tên khoa học (VD: Cá lồng đèn, Cá mập trắng...)"
                        : selectedApiProvider === "gbif"
                        ? "Nhập tên loài tra cứu trên GBIF Registry..."
                        : selectedApiProvider === "inaturalist"
                        ? "Nhập tên loài tra cứu trên iNaturalist..."
                        : "Nhập tên loài tra cứu trên WoRMS Marine Registry..."
                    }
                    value={formData.gbifQuery}
                    onChange={(e) => setFormData({ ...formData, gbifQuery: e.target.value })}
                    className={`flex-1 px-3.5 py-2 rounded-xl text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                        : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleGbifSearch}
                    disabled={isSearchingGbif}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:brightness-110 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
                  >
                    {isSearchingGbif ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Search size={14} />
                    )}
                    <span>
                      {selectedApiProvider === "auto"
                        ? "Tra cứu AI Auto"
                        : selectedApiProvider === "gbif"
                        ? "Tìm trên GBIF"
                        : selectedApiProvider === "inaturalist"
                        ? "Tìm trên iNaturalist"
                        : "Tìm trên WoRMS"}
                    </span>
                  </button>
                </div>

                {gbifFound && gbifMessage && (
                  <div
                    className={`p-3 rounded-xl border text-sm flex items-start gap-2 animate-in fade-in transition-all ${
                      gbifStatusType === "success"
                        ? isDark
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : gbifStatusType === "warning"
                        ? isDark
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                          : "bg-amber-50 border-amber-300 text-amber-800"
                        : isDark
                        ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                        : "bg-rose-50 border-rose-300 text-rose-800"
                    }`}
                  >
                    <Sparkles size={16} className="shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{gbifMessage}</span>
                  </div>
                )}
              </div>

              {/* Add Custom Media Section (Compact Unified Bar) */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleFileUpload({ target: { files: e.dataTransfer.files } });
                  }
                }}
                className={`p-3.5 rounded-2xl border space-y-2.5 shadow-sm ${
                  isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className={`block text-xs sm:text-sm font-bold ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
                    Thêm Phương tiện
                  </label>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInputMediaType("image")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        inputMediaType === "image"
                          ? "bg-cyan-500 text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <ImageIcon size={12} />
                      <span>Ảnh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMediaType("video")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        inputMediaType === "video"
                          ? "bg-cyan-500 text-white shadow-sm"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Film size={12} />
                      <span>Video</span>
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder={
                      inputMediaType === "image"
                        ? "Dán URL hình ảnh (https://...)"
                        : "Dán URL Video MP4/Youtube (https://...)"
                    }
                    value={inputMediaUrl}
                    onChange={(e) => setInputMediaUrl(e.target.value)}
                    className={`flex-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                        : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                    }`}
                  />

                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingFile}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <Upload size={13} />
                      <span>Tải tệp</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddMedia}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md active:scale-95"
                    >
                      <Plus size={13} />
                      <span>Thêm URL</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Image & Video Dropzone & Preview Gallery */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  Danh sách phương tiện ({(formData.mediaItems || []).length} tập tin)
                </label>

                <div
                  className="flex gap-3 overflow-x-auto pb-1.5 custom-scrollbar-thin"
                >
                  {(formData.mediaItems || []).map((item, idx) => {
                    const mediaUrl = typeof item === "string" ? item : item?.url || "";
                    const mediaType = typeof item === "string" ? "image" : item?.type || "image";

                    return (
                      <div
                        key={idx}
                        className={`relative w-28 h-24 rounded-2xl overflow-hidden border shrink-0 group shadow-md ${
                          isDark ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-100"
                        }`}
                      >
                        {mediaType === "video" ? (
                          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-cyan-400 relative">
                            <video src={mediaUrl} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Film size={24} className="text-cyan-400" />
                            </div>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-cyan-300 font-bold">
                              VIDEO
                            </span>
                          </div>
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={`Media ${idx + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop";
                            }}
                            className="w-full h-full object-cover"
                          />
                        )}

                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMediaMove(idx, -1)}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowLeft size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMediaRemove(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMediaMove(idx, 1)}
                            disabled={idx === (formData.mediaItems || []).length - 1}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hidden 3D and Audio File Inputs */}
              <input
                ref={model3DInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleModel3DUpload}
                className="hidden"
              />
              <input
                ref={soundInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg"
                onChange={handleSoundUpload}
                className="hidden"
              />

              {/* 3D Model & Audio Link Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3D Model */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50/80 border-slate-200/80"
                }`}>
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <label className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                      isDark ? "text-white/90" : "text-slate-800"
                    }`}>
                      <Box size={15} className="text-cyan-400 shrink-0" />
                      <span>Mô hình 3D (.glb / .gltf)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => model3DInputRef.current?.click()}
                      disabled={isUploadingFile}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 shadow-sm"
                    >
                      <Upload size={13} />
                      <span>Tải từ máy</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="URL file mô hình 3D (https://...)"
                    value={formData.model3dUrl}
                    onChange={(e) => setFormData({ ...formData, model3dUrl: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-slate-900/80 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                        : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                    }`}
                  />
                </div>

                {/* Ocean Audio */}
                <div className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? "bg-white/[0.03] border-white/10" : "bg-slate-50/80 border-slate-200/80"
                }`}>
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <label className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                      isDark ? "text-white/90" : "text-slate-800"
                    }`}>
                      <Music size={15} className="text-cyan-400 shrink-0" />
                      <span>Âm thanh sinh vật (.mp3 / .wav)</span>
                    </label>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => soundInputRef.current?.click()}
                        disabled={isUploadingFile}
                        className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                      >
                        <Upload size={13} />
                        <span>Tải từ máy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSoundPickerOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-400/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                      >
                        <Search size={13} />
                        <span>Kho âm thanh</span>
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="URL âm thanh sinh vật (https://...)"
                    value={formData.soundUrl}
                    onChange={(e) => setFormData({ ...formData, soundUrl: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                      isDark
                        ? "bg-slate-900/80 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                        : "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                    }`}
                  />
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập mô tả về tập tính, môi trường sống và đặc điểm nhận dạng..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-3.5 rounded-2xl text-sm focus:outline-none transition-all resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                    isDark
                      ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                  }`}
                />
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-end gap-3 backdrop-blur-md ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? "bg-white/5 hover:bg-white/10 border-white/15 text-white/80 hover:text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
          >
            Lưu sinh vật
          </button>
        </div>
      </div>

      {/* Ocean Sound Library Slide-over Modal */}
      <OceanSoundPickerModal
        isOpen={isSoundPickerOpen}
        onClose={() => setIsSoundPickerOpen(false)}
        onSelectSound={(soundUrl) => setFormData((prev) => ({ ...prev, soundUrl }))}
        currentSoundUrl={formData.soundUrl}
      />
    </div>
  );
}
