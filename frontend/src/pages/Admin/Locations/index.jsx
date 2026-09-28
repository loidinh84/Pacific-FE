import { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Search,
  RefreshCw,
  X,
  AlertTriangle,
  LogIn,
  Download,
  Fish,
  Users,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { clearStoredAuth } from "../../../utils/auth";
import {
  fetchAdminLocationList,
  fetchAdminLocationById,
  createAdminLocation,
  updateAdminLocation,
  deleteAdminLocation,
  toggleAdminLocationFeatured,
} from "../../../services/adminLocationsApi";

// ── Helpers ──────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCoord = (v, type) => {
  if (v == null) return "—";
  const abs = Math.abs(v);
  const dir = type === "lat" ? (v >= 0 ? "N" : "S") : (v >= 0 ? "E" : "W");
  return `${abs.toFixed(4)}° ${dir}`;
};

// ── Ocean zones list (static from DB enum) ───────────────
const OCEAN_ZONES = [
  { id: 1, name: "Sunlight / Epipelagic" },
  { id: 2, name: "Twilight / Mesopelagic" },
  { id: 3, name: "Midnight / Bathypelagic" },
  { id: 4, name: "Abyssal / Abyssopelagic" },
  { id: 5, name: "Hadal / Hadalpelagic" },
];

const cleanZoneName = (name) => name?.split("/")?.[0]?.trim() || name || "";

// ── Featured badge ───────────────────────────────────────
const FeaturedBadge = ({ isFeatured }) =>
  isFeatured ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
      <Star size={10} fill="currentColor" />
      Nổi bật
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
      Thường
    </span>
  );

// ── Location Card (grid view) ─────────────────────────────
const LocationCard = ({ loc, isDark, onEdit, onDelete, onToggleFeatured, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl border overflow-hidden transition-all cursor-pointer group ${
      isSelected
        ? isDark ? "border-cyan-500/60 ring-1 ring-cyan-500/30 bg-cyan-500/5" : "border-cyan-400 ring-1 ring-cyan-300 bg-cyan-50"
        : isDark ? "border-white/10 bg-[#162040] hover:border-white/25" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
    }`}
  >
    {/* Location Image */}
    <div className="relative h-36 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
      {loc.imageUrl ? (
        <img
          src={loc.imageUrl}
          alt={loc.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Globe size={32} className="text-slate-500" />
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Featured star button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFeatured(loc); }}
        className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all cursor-pointer ${
          loc.isFeatured
            ? "bg-amber-500/30 text-amber-300 hover:bg-amber-500/50"
            : "bg-black/30 text-white/50 hover:text-amber-300 hover:bg-amber-500/20"
        }`}
        title={loc.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
      >
        <Star size={13} fill={loc.isFeatured ? "currentColor" : "none"} />
      </button>

      {/* Location name overlay */}
      <div className="absolute bottom-2 left-3 right-3">
        <p className="text-white font-bold text-sm leading-tight truncate">{loc.name}</p>
        {loc.oceanZoneName && (
          <p className="text-white/70 text-xs">{cleanZoneName(loc.oceanZoneName)}</p>
        )}
      </div>
    </div>

    {/* Card Body */}
    <div className="p-3 space-y-2">
      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs">
        <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Fish size={11} />
          {loc.speciesCount} loài
        </span>
        <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Users size={11} />
          {loc.exploredCount} khám phá
        </span>
        <FeaturedBadge isFeatured={loc.isFeatured} />
      </div>

      {/* Coordinates */}
      {(loc.latitude != null || loc.longitude != null) && (
        <p className={`text-xs font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Navigation size={10} className="inline mr-1" />
          {formatCoord(loc.latitude, "lat")} · {formatCoord(loc.longitude, "lng")}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onEdit(loc)}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            isDark ? "bg-white/5 hover:bg-white/10 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <Pencil size={11} />
          Sửa
        </button>
        <button
          onClick={() => onDelete(loc)}
          className="flex items-center justify-center px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  </div>
);

// ── Add/Edit Modal ────────────────────────────────────────
const AddEditModal = ({ isOpen, editingLocation, onClose, onSave, isDark }) => {
  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    oceanZoneId: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingLocation) {
      setForm({
        name: editingLocation.name || "",
        latitude: editingLocation.latitude != null ? String(editingLocation.latitude) : "",
        longitude: editingLocation.longitude != null ? String(editingLocation.longitude) : "",
        description: editingLocation.description || "",
        imageUrl: editingLocation.imageUrl || "",
        isFeatured: Boolean(editingLocation.isFeatured),
        oceanZoneId: editingLocation.oceanZoneId != null ? String(editingLocation.oceanZoneId) : "",
      });
    } else {
      setForm({ name: "", latitude: "", longitude: "", description: "", imageUrl: "", isFeatured: false, oceanZoneId: "" });
    }
    setErrors({});
  }, [isOpen, editingLocation]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Tên địa điểm không được để trống";
    if (form.latitude && isNaN(parseFloat(form.latitude))) errs.latitude = "Vĩ độ không hợp lệ";
    if (form.longitude && isNaN(parseFloat(form.longitude))) errs.longitude = "Kinh độ không hợp lệ";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        latitude: form.latitude !== "" ? parseFloat(form.latitude) : null,
        longitude: form.longitude !== "" ? parseFloat(form.longitude) : null,
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        isFeatured: form.isFeatured,
        oceanZoneId: form.oceanZoneId !== "" ? parseInt(form.oceanZoneId) : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = (field) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors ${
      isDark
        ? `bg-white/5 text-white placeholder:text-slate-500 ${errors[field] ? "border-rose-400/60" : "border-white/15 focus:border-cyan-400/60"}`
        : `bg-white text-slate-900 placeholder:text-slate-400 ${errors[field] ? "border-rose-400" : "border-slate-200 focus:border-blue-400"}`
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-xl rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
        isDark ? "bg-[#162040] border-white/15 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            <h2 className="font-bold text-sm">{editingLocation ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
            <X size={15} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Tên địa điểm <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Vd: Rạn san hô Great Barrier"
              className={inputCls("name")}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Ocean Zone */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Tầng đại dương
            </label>
            <select
              value={form.oceanZoneId}
              onChange={(e) => setForm((p) => ({ ...p, oceanZoneId: e.target.value }))}
              className={`${inputCls("oceanZoneId")} cursor-pointer`}
            >
              <option value="">— Chưa phân loại —</option>
              {OCEAN_ZONES.map((z) => (
                <option key={z.id} value={z.id}>{cleanZoneName(z.name)}</option>
              ))}
            </select>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Vĩ độ (Latitude)
              </label>
              <input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={form.latitude}
                onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
                placeholder="-90 đến 90"
                className={inputCls("latitude")}
              />
              {errors.latitude && <p className="text-xs text-rose-400 mt-1">{errors.latitude}</p>}
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Kinh độ (Longitude)
              </label>
              <input
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={form.longitude}
                onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
                placeholder="-180 đến 180"
                className={inputCls("longitude")}
              />
              {errors.longitude && <p className="text-xs text-rose-400 mt-1">{errors.longitude}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              URL ảnh đại diện
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://..."
                className={`${inputCls("imageUrl")} flex-1`}
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả ngắn về địa điểm..."
              rows={3}
              className={`${inputCls("description")} resize-none`}
            />
          </div>

          {/* Featured toggle */}
          <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
            <div>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Địa điểm nổi bật</p>
              <p className="text-xs text-slate-400">Hiển thị nổi bật trên trang khám phá</p>
            </div>
            <button
              onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.isFeatured ? "bg-amber-500" : isDark ? "bg-white/20" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${form.isFeatured ? "left-5.5" : "left-0.5"}`} style={{ left: form.isFeatured ? "1.375rem" : "0.125rem" }} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-5 py-4 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
            {editingLocation ? "Lưu thay đổi" : "Tạo địa điểm"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Confirm Delete Modal ──────────────────────────────────
const ConfirmDelete = ({ isOpen, location, isLoading, onConfirm, onClose, isDark }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${isDark ? "bg-[#1a2744] border-white/15" : "bg-white border-slate-200"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
            <Trash2 size={18} className="text-rose-400" />
          </div>
          <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Xác nhận xóa địa điểm</h3>
        </div>
        <p className={`text-sm mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Bạn có chắc chắn muốn xóa địa điểm <strong className="text-rose-400">"{location?.name}"</strong>?
        </p>
        <p className="text-xs text-slate-400 mb-6">
          Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác. Tất cả liên kết sinh vật và lịch sử khám phá sẽ bị xóa.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${isDark ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Location Detail Panel ─────────────────────────────────
const LocationDetailPanel = ({ locationId, isDark, onClose, onEdit }) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;
    setIsLoading(true);
    fetchAdminLocationById(locationId)
      .then((res) => { if (res?.success) setDetail(res.location); })
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, [locationId]);

  return (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Chi tiết địa điểm</span>
        <div className="flex gap-1">
          {detail && (
            <button onClick={() => onEdit(detail)} className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 cursor-pointer">
              <Pencil size={13} />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
            <X size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={20} className="animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && detail && (
        <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* Image header */}
          <div className="relative h-44 bg-gradient-to-br from-slate-700 to-slate-900">
            {detail.imageUrl ? (
              <img src={detail.imageUrl} alt={detail.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Globe size={40} className="text-slate-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-bold text-base">{detail.name}</p>
              {detail.oceanZoneName && <p className="text-white/70 text-xs">{cleanZoneName(detail.oceanZoneName)}</p>}
            </div>
            {detail.isFeatured && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                <Star size={10} fill="currentColor" />
                Nổi bật
              </div>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Fish, label: "Số loài", val: detail.speciesCount, color: "text-cyan-400" },
                { icon: Users, label: "Đã khám phá", val: detail.exploredCount, color: "text-emerald-400" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className={color} />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{val}</p>
                </div>
              ))}
            </div>

            {/* Coordinates */}
            {(detail.latitude != null || detail.longitude != null) && (
              <div className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <p className="text-xs text-slate-400 mb-2 font-semibold">Tọa độ</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vĩ độ</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-slate-900"}`}>{formatCoord(detail.latitude, "lat")}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Kinh độ</span>
                    <span className={`font-mono ${isDark ? "text-white" : "text-slate-900"}`}>{formatCoord(detail.longitude, "lng")}</span>
                  </div>
                </div>
                {detail.latitude != null && detail.longitude != null && (
                  <a
                    href={`https://www.google.com/maps?q=${detail.latitude},${detail.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Navigation size={11} />
                    Xem trên Google Maps →
                  </a>
                )}
              </div>
            )}

            {/* Description */}
            {detail.description && (
              <div className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <p className="text-xs text-slate-400 mb-1.5 font-semibold">Mô tả</p>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>{detail.description}</p>
              </div>
            )}

            {/* Recent species */}
            {detail.recentSpecies?.length > 0 && (
              <div>
                <p className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  Sinh vật tại địa điểm ({detail.recentSpecies.length})
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {detail.recentSpecies.map((sp) => (
                    <div key={sp.id} className="rounded-lg overflow-hidden aspect-square bg-slate-800" title={sp.name}>
                      {sp.image ? (
                        <img src={sp.image} alt={sp.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Fish size={16} className="text-slate-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className={`text-xs rounded-xl p-3 space-y-1.5 ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
              <div className="flex justify-between">
                <span className="text-slate-400">Slug</span>
                <span className={`font-mono ${isDark ? "text-slate-300" : "text-slate-700"}`}>/{detail.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ngày tạo</span>
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>{formatDate(detail.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
export default function LocationsManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();

  // Data
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("all"); // "all" | "true" | "false"
  const [filterZone, setFilterZone] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Selected
  const [selectedId, setSelectedId] = useState(null);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, location: null, isLoading: false });

  // Debounce
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(h);
  }, [searchTerm]);

  useEffect(() => { setPage(1); }, [debouncedSearch, filterFeatured, filterZone]);

  // Fetch
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setAuthError(false);
        setIsLoading(true);
        const params = { page, limit: perPage, sortBy, order: sortOrder };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filterFeatured !== "all") params.is_featured = filterFeatured;
        if (filterZone !== "all") params.ocean_zone_id = filterZone;

        const res = await fetchAdminLocationList(params);
        if (!ignore && res?.success) {
          setLocationList(res.data || []);
          setPagination({ total: res.pagination?.total ?? 0, totalPages: res.pagination?.totalPages ?? 1 });
        }
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401 || err.response?.status === 403) setAuthError(true);
          else showToast("Không thể tải danh sách địa điểm.", "error");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [refreshKey, page, perPage, sortBy, sortOrder, debouncedSearch, filterFeatured, filterZone]);

  // Stats
  const stats = useMemo(() => {
    const featured = locationList.filter((l) => l.isFeatured).length;
    const totalSpecies = locationList.reduce((s, l) => s + (l.speciesCount || 0), 0);
    const totalExplored = locationList.reduce((s, l) => s + (l.exploredCount || 0), 0);
    return { featured, totalSpecies, totalExplored };
  }, [locationList]);

  // Actions
  const handleOpenAdd = () => { setEditingLocation(null); setIsAddEditOpen(true); };
  const handleOpenEdit = (loc) => { setEditingLocation(loc); setIsAddEditOpen(true); };

  const handleSave = async (formData) => {
    try {
      if (editingLocation) {
        const res = await updateAdminLocation(editingLocation.id, formData);
        if (res?.success) {
          setLocationList((prev) => prev.map((l) => l.id === editingLocation.id ? res.location : l));
          showToast(`Đã cập nhật "${res.location.name}" thành công!`, "success");
        }
      } else {
        const res = await createAdminLocation(formData);
        if (res?.success) {
          setLocationList((prev) => [res.location, ...prev]);
          showToast(`Đã tạo địa điểm "${res.location.name}" thành công!`, "success");
        }
      }
      setIsAddEditOpen(false);
    } catch (err) {
      showToast(err?.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  };

  const handleDeleteRequest = (loc) => {
    setDeleteModal({ isOpen: true, location: loc, isLoading: false });
  };

  const handleDeleteConfirm = async () => {
    const loc = deleteModal.location;
    setDeleteModal((p) => ({ ...p, isLoading: true }));
    try {
      await deleteAdminLocation(loc.id);
      setLocationList((prev) => prev.filter((l) => l.id !== loc.id));
      if (selectedId === loc.id) setSelectedId(null);
      showToast(`Đã xóa địa điểm "${loc.name}" thành công!`, "success");
      setDeleteModal({ isOpen: false, location: null, isLoading: false });
    } catch (err) {
      showToast(err?.response?.data?.error || "Không thể xóa địa điểm.", "error");
      setDeleteModal((p) => ({ ...p, isLoading: false }));
    }
  };

  const handleToggleFeatured = async (loc) => {
    try {
      const res = await toggleAdminLocationFeatured(loc.id);
      if (res?.success) {
        setLocationList((prev) => prev.map((l) => l.id === loc.id ? { ...l, isFeatured: res.isFeatured } : l));
        showToast(res.message, "success");
      }
    } catch (err) {
      showToast("Không thể cập nhật trạng thái nổi bật.", "error");
    }
  };

  const handleExportCSV = () => {
    if (!locationList.length) { showToast("Không có dữ liệu để xuất", "warning"); return; }
    const headers = ["ID", "Tên địa điểm", "Slug", "Vĩ độ", "Kinh độ", "Tầng đại dương", "Nổi bật", "Số loài", "Đã khám phá", "Ngày tạo"];
    const rows = locationList.map((l) => [
      `"${l.id}"`, `"${l.name}"`, `"${l.slug}"`,
      l.latitude ?? "", l.longitude ?? "",
      `"${l.oceanZoneName || ""}"`, l.isFeatured ? "Có" : "Không",
      l.speciesCount, l.exploredCount, `"${formatDate(l.createdAt)}"`,
    ]);
    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pacific_locations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${locationList.length} địa điểm ra CSV!`, "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Quản lý địa điểm
          </h1>
          <p className={`text-xs md:text-sm font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Quản lý các tọa độ, rạn san hô, rãnh đại dương và khu bảo tồn biển Thái Bình Dương
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${isDark ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            <Download size={14} />
            Xuất CSV
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${isDark ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"}`}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            Thêm địa điểm
          </button>
        </div>
      </div>

      {/* ── AUTH ERROR ── */}
      {authError && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
            <span><strong>Phiên đăng nhập đã hết hạn.</strong> Vui lòng đăng nhập lại.</span>
          </div>
          <button onClick={() => { clearStoredAuth(); navigate("/login"); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 font-bold text-xs rounded-xl cursor-pointer">
            <LogIn size={14} /> Đăng nhập lại
          </button>
        </div>
      )}

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tổng địa điểm", value: pagination.total, icon: MapPin, bg: isDark ? "bg-sky-500/10 border-sky-500/25" : "bg-sky-50 border-sky-200", text: isDark ? "text-sky-300" : "text-sky-700" },
          { label: "Nổi bật (trang này)", value: isLoading ? "—" : stats.featured, icon: Star, bg: isDark ? "bg-amber-500/10 border-amber-500/25" : "bg-amber-50 border-amber-200", text: isDark ? "text-amber-300" : "text-amber-700" },
          { label: "Tổng loài liên kết", value: isLoading ? "—" : stats.totalSpecies, icon: Fish, bg: isDark ? "bg-emerald-500/10 border-emerald-500/25" : "bg-emerald-50 border-emerald-200", text: isDark ? "text-emerald-300" : "text-emerald-700" },
          { label: "Lượt khám phá", value: isLoading ? "—" : stats.totalExplored, icon: Globe, bg: isDark ? "bg-violet-500/10 border-violet-500/25" : "bg-violet-50 border-violet-200", text: isDark ? "text-violet-300" : "text-violet-700" },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <div className="flex items-start justify-between mb-2">
              <p className={`text-xs font-semibold ${text}`}>{label}</p>
              <Icon size={16} className={text} />
            </div>
            <p className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── FILTER BAR ── */}
      <div className={`rounded-2xl border p-4 flex flex-wrap gap-3 items-center ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
        <div className={`flex items-center gap-2 flex-1 min-w-48 rounded-xl border px-3 py-2 ${isDark ? "bg-white/5 border-white/15" : "bg-slate-50 border-slate-200"}`}>
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm tên, mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
          />
          {searchTerm && <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-white cursor-pointer"><X size={13} /></button>}
        </div>

        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
        >
          <option value="all">Tất cả</option>
          <option value="true">⭐ Nổi bật</option>
          <option value="false">Thường</option>
        </select>

        <select
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
        >
          <option value="all">Tất cả tầng</option>
          {OCEAN_ZONES.map((z) => <option key={z.id} value={z.id}>{cleanZoneName(z.name)}</option>)}
        </select>

        <select
          value={`${sortBy}_${sortOrder}`}
          onChange={(e) => { const [f, o] = e.target.value.split("_"); setSortBy(f); setSortOrder(o); }}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
        >
          <option value="id_asc">Thứ tự tạo ↑</option>
          <option value="id_desc">Thứ tự tạo ↓</option>
          <option value="name_asc">Tên A→Z</option>
          <option value="name_desc">Tên Z→A</option>
          <option value="is_featured_desc">Nổi bật trước</option>
        </select>

        <select
          value={perPage}
          onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
          className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none cursor-pointer ${isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
        >
          {[12, 24, 48].map((n) => <option key={n} value={n}>{n} / trang</option>)}
        </select>

        <span className={`ml-auto text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {isLoading ? "Đang tải..." : `${pagination.total} địa điểm`}
        </span>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className={`grid gap-5 ${selectedId ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* Card Grid */}
        <div className={selectedId ? "lg:col-span-8" : "col-span-1"}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
                  <div className={`h-36 animate-pulse ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
                  <div className="p-3 space-y-2">
                    <div className={`h-3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
                    <div className={`h-3 w-2/3 rounded animate-pulse ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : locationList.length === 0 ? (
            <div className={`rounded-2xl border p-16 text-center ${isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"}`}>
              <Globe size={36} className="mx-auto text-slate-400 mb-3" />
              <p className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>Không tìm thấy địa điểm nào</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Thử thay đổi bộ lọc hoặc thêm địa điểm mới</p>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                + Thêm địa điểm đầu tiên
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${selectedId ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
                {locationList.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    loc={loc}
                    isDark={isDark}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteRequest}
                    onToggleFeatured={handleToggleFeatured}
                    isSelected={selectedId === loc.id}
                    onClick={() => setSelectedId(selectedId === loc.id ? null : loc.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={`flex items-center justify-between mt-4 px-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <span>Trang {page} / {pagination.totalPages} · {pagination.total} địa điểm</span>
                  <div className="flex gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={`p-1.5 rounded-lg disabled:opacity-30 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(pagination.totalPages - 4, page - 2)) + i;
                      return (
                        <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${p === page ? "bg-blue-500 text-white" : isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className={`p-1.5 rounded-lg disabled:opacity-30 cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Panel */}
        {selectedId && (
          <div className="lg:col-span-4">
            <LocationDetailPanel
              locationId={selectedId}
              isDark={isDark}
              onClose={() => setSelectedId(null)}
              onEdit={handleOpenEdit}
            />
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AddEditModal
        isOpen={isAddEditOpen}
        editingLocation={editingLocation}
        isDark={isDark}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        location={deleteModal.location}
        isLoading={deleteModal.isLoading}
        isDark={isDark}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ isOpen: false, location: null, isLoading: false })}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
