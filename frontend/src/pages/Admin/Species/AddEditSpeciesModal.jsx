import { useState } from "react";
import { X, Search, Upload, ArrowLeft, ArrowRight, Trash2, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

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
      gbifQuery: editingSpecies.scientificName || "",
      description: editingSpecies.description || "",
      images: editingSpecies.images || [
        "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80",
      ],
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
    gbifQuery: "",
    description: "",
    images: [
      "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80",
    ],
  };
};

export default function AddEditSpeciesModal({ isOpen, onClose, onSave, editingSpecies = null }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("basic"); // "basic" | "media"
  const [formData, setFormData] = useState(() => getInitialFormData(editingSpecies));
  const [isSearchingGbif, setIsSearchingGbif] = useState(false);
  const [gbifFound, setGbifFound] = useState(false);

  if (!isOpen) return null;

  const handleGbifSearch = () => {
    if (!formData.gbifQuery && !formData.scientificName) return;
    setIsSearchingGbif(true);
    setTimeout(() => {
      setIsSearchingGbif(false);
      setGbifFound(true);
      setFormData((prev) => ({
        ...prev,
        scientificName: prev.gbifQuery || prev.scientificName || "Carcharodon carcharias",
        description:
          prev.description ||
          "Dữ liệu tự động đồng bộ từ GBIF taxonomy backend. Cá mập trắng là một loài cá mập săn mồi lớn sống ở vùng biển ôn hòa.",
      }));
    }, 700);
  };

  const handleImageMove = (index, direction) => {
    const newImages = [...formData.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200 ${
      isDark ? "bg-black/75 text-white" : "bg-slate-900/50 text-slate-800"
    }`}>
      {/* Theme-Aware Glassmorphism Modal Card */}
      <div className={`w-full max-w-2xl backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 ${
        isDark
          ? "bg-[#0d1730]/90 border-cyan-500/30 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(6,182,212,0.15)]"
          : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl"
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              isDark
                ? "bg-cyan-500/20 border-cyan-400/30 text-cyan-300"
                : "bg-cyan-50 border-cyan-200 text-cyan-600"
            }`}>
              <Sparkles size={16} />
            </div>
            <h2 className={`text-lg font-bold font-heading tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
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
        <div className={`flex border-b px-6 pt-3 backdrop-blur-md gap-3 ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "basic"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300 shadow-[0_-5px_15px_rgba(6,182,212,0.15)]"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600 shadow-sm"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            Thông tin cơ bản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === "media"
                ? isDark
                  ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-t border-x border-cyan-400/40 text-cyan-300 shadow-[0_-5px_15px_rgba(6,182,212,0.15)]"
                  : "bg-white border-t border-x border-slate-200 text-cyan-600 shadow-sm"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent"
            }`}
          >
            Dữ liệu và hình ảnh
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {activeTab === "basic" ? (
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
                  <select
                    value={formData.oceanZone}
                    onChange={(e) => setFormData({ ...formData, oceanZone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${
                      isDark
                        ? "bg-[#0d1730] border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  >
                    <option value="Sunlight" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Tầng nắng (Sunlight / Epipelagic)</option>
                    <option value="Twilight" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Tầng hoàng hôn (Twilight / Mesopelagic)</option>
                    <option value="Midnight" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Tầng nửa đêm (Midnight / Bathypelagic)</option>
                    <option value="Abyssal" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Tầng vực sâu (Abyssal / Abyssopelagic)</option>
                    <option value="Hadal" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Tầng khe sâu (Hadal / Hadalpelagic)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Bảo tồn <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.conservationStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, conservationStatus: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${
                      isDark
                        ? "bg-[#0d1730] border border-white/15 text-white focus:border-cyan-400"
                        : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                    }`}
                  >
                    <option value="LC" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Ít lo ngại (LC)</option>
                    <option value="VU" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Sắp nguy cấp (VU)</option>
                    <option value="EN" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Nguy cấp (EN)</option>
                    <option value="CR" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Cực kỳ nguy cấp (CR)</option>
                    <option value="DD" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Thiếu dữ liệu (DD)</option>
                    <option value="NE" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Chưa đánh giá (NE)</option>
                  </select>
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
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${
                    isDark
                      ? "bg-[#0d1730] border border-white/15 text-white focus:border-cyan-400"
                      : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500"
                  }`}
                >
                  <option value="1" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Cá mập & Kẻ săn mồi lớn</option>
                  <option value="2" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Động vật có vú biển</option>
                  <option value="3" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Động vật thân mềm (Bạch tuộc/Mực)</option>
                  <option value="4" className={isDark ? "bg-[#0d1730] text-white" : "bg-white text-slate-900"}>Cá sặc sỡ rạn san hô</option>
                </select>
              </div>
            </div>
          ) : (
            /* TAB 2: DỮ LIỆU VÀ HÌNH ẢNH */
            <div className="space-y-5">
              {/* GBIF API Search Fetcher Card */}
              <div className={`p-4 rounded-2xl border space-y-3 shadow-md ${
                isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"
              }`}>
                <label className={`block text-sm font-bold ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}>
                  Lấy dữ liệu từ API bên ngoài
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tên khoa học để tra cứu GBIF (VD: Carcharodon carcharias)"
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
                    <span>Tìm trên GBIF</span>
                  </button>
                </div>

                {gbifFound && (
                  <div className={`p-2.5 rounded-xl border text-sm flex items-center gap-2 animate-in fade-in ${
                    isDark
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    <CheckCircle2 size={16} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                    <span>✓ Tìm thấy tên GBIF - dữ liệu sinh học sẽ tự động điền!</span>
                  </div>
                )}
              </div>

              {/* Image Dropzone */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  Hình ảnh sinh vật (Tối đa 5 ảnh)
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  isDark
                    ? "border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-500/5 hover:bg-cyan-500/10"
                    : "border-cyan-300 hover:border-cyan-500 bg-cyan-50/50 hover:bg-cyan-50"
                }`}>
                  <Upload size={24} className={`mx-auto mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                  <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-slate-700"}`}>
                    Kéo thả hoặc click để tải lên hình ảnh
                  </p>
                  <p className={`text-[11px] mt-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>PNG, JPG tối đa 5MB</p>
                </div>

                {/* Thumbnails Reorder Carousel */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 custom-scrollbar">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border shrink-0 group shadow-md ${
                        isDark ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-100"
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleImageMove(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowLeft size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageRemove(idx)}
                          className="p-1 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageMove(idx, 1)}
                          disabled={idx === formData.images.length - 1}
                          className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
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
                  className={`w-full p-3.5 rounded-2xl text-sm focus:outline-none transition-all resize-none ${
                    isDark
                      ? "bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className={`pt-4 border-t flex items-center justify-end gap-3 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
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
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
            >
              Lưu sinh vật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
