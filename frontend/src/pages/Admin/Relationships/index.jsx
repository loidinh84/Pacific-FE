import { useState, useEffect, useMemo } from "react";
import {
  Network,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import {
  fetchAdminRelationships,
  createAdminRelationship,
  updateAdminRelationship,
  deleteAdminRelationship,
} from "../../../services/ecosystemApi";
import { fetchAdminSpeciesList } from "../../../services/speciesApi";

const RELATIONSHIP_TYPES = [
  { value: "predator_prey", label: "Ăn thịt / Con mồi", color: "bg-red-500/20 text-red-300 border-red-500/40" },
  { value: "symbiosis", label: "Cộng sinh tương hỗ", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { value: "habitat_provider", label: "Cung cấp nơi ở / Sinh cảnh", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { value: "herbivory", label: "Ăn thực vật / Gặm cỏ", color: "bg-lime-500/20 text-lime-300 border-lime-500/40" },
  { value: "commensalism", label: "Hội sinh", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { value: "parasitism", label: "Ký sinh", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { value: "competitor", label: "Cạnh tranh sinh thái", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
];

export default function RelationshipsManagement() {
  const { isDark } = useTheme();
  const { toasts, showSuccess, showError } = useToast();

  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Species list for modal selector
  const [allSpecies, setAllSpecies] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    sourceSpeciesId: "",
    targetSpeciesId: "",
    relationshipType: "predator_prey",
    strength: 0.9,
    description: "",
    ecologicalImpact: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load relationships
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminRelationships({
        page,
        limit,
        search,
        type: selectedType,
      });
      if (res && res.success) {
        setRelationships(res.data);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      showError("Không thể tải danh sách quan hệ sinh thái");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, selectedType]);

  // Load species list once for dropdown selection
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const res = await fetchAdminSpeciesList({ limit: 150 });
        if (res && res.success && res.data) {
          setAllSpecies(res.data);
        }
      } catch (err) {
        console.warn("Không thể tải danh sách loài sinh vật:", err);
      }
    };
    loadSpecies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      sourceSpeciesId: allSpecies[0]?.id || "",
      targetSpeciesId: allSpecies[1]?.id || "",
      relationshipType: "predator_prey",
      strength: 0.9,
      description: "",
      ecologicalImpact: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      sourceSpeciesId: item.sourceSpeciesId,
      targetSpeciesId: item.targetSpeciesId,
      relationshipType: item.relationshipType,
      strength: item.strength || 0.9,
      description: item.description || "",
      ecologicalImpact: item.ecologicalImpact || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sourceSpeciesId || !formData.targetSpeciesId) {
      showError("Vui lòng chọn đầy đủ loài nguồn và loài đích");
      return;
    }
    if (formData.sourceSpeciesId.toString() === formData.targetSpeciesId.toString()) {
      showError("Loài nguồn và loài đích không thể trùng nhau");
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await updateAdminRelationship(editingItem.id, {
          relationshipType: formData.relationshipType,
          strength: formData.strength,
          description: formData.description,
          ecologicalImpact: formData.ecologicalImpact,
        });
        showSuccess("Cập nhật mối quan hệ sinh thái thành công");
      } else {
        await createAdminRelationship(formData);
        showSuccess("Tạo mối quan hệ sinh thái mới thành công");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showError(err.response?.data?.message || err.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminRelationship(deleteTarget.id);
      showSuccess("Đã xóa mối quan hệ sinh thái thành công");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      showError("Xóa mối quan hệ thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <ToastContainer toasts={toasts} />

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Network size={14} />
            <span>Đồ Thị Tri Thức & Mạng Lưới Sinh Thái (Knowledge Graph CMS)</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Quản Lý Mối Quan Hệ Sinh Thái Biển Đông
          </h1>
          <p className={`text-xs md:text-sm mt-1 max-w-2xl leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Mô hình hóa chuỗi thức ăn, thiên địch khống chế dịch hại, quan hệ cộng sinh tương hỗ và nơi cư trú rạn san hô giữa các loài sinh vật Biển Đông.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/40 shrink-0 cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          <span>Thêm Quan Hệ Mới</span>
        </button>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${
        isDark ? "bg-[#151f42]/70 border-white/10" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên loài, mô tả, tác động..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none border transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-cyan-400"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs outline-none border cursor-pointer ${
              isDark
                ? "bg-[#101735] border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <option value="">Tất cả kiểu quan hệ</option>
            {RELATIONSHIP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedType("");
              setPage(1);
              loadData();
            }}
            title="Làm mới"
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? "bg-[#151f42]/70 border-white/10" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                isDark ? "border-white/10 bg-white/[0.02] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}>
                <th className="py-3.5 px-4">Loài Nguồn (Source)</th>
                <th className="py-3.5 px-4 text-center">Mối Quan Hệ</th>
                <th className="py-3.5 px-4">Loài Đích (Target)</th>
                <th className="py-3.5 px-4 text-center">Trọng Số</th>
                <th className="py-3.5 px-4">Tác Động Sinh Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Đang tải dữ liệu quan hệ sinh thái...</p>
                  </td>
                </tr>
              ) : relationships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Chưa tìm thấy mối quan hệ sinh thái nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                relationships.map((rel) => {
                  const typeObj =
                    RELATIONSHIP_TYPES.find((t) => t.value === rel.relationshipType) || {
                      label: rel.relationshipType,
                      color: "bg-slate-500/20 text-slate-300 border-slate-500/30",
                    };

                  return (
                    <tr
                      key={rel.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Source Species */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rel.sourceSpecies?.image || ""}
                            alt={rel.sourceSpecies?.commonName}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/10"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div>
                            <p className={`font-bold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                              {rel.sourceSpecies?.commonName}
                            </p>
                            <p className="text-[11px] text-slate-400 italic">
                              {rel.sourceSpecies?.scientificName}
                            </p>
                            <span className="text-[10px] font-mono text-cyan-400">
                              {rel.sourceSpecies?.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Relationship Type Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide">
                          <span className={typeObj.color}>{typeObj.label}</span>
                          <ArrowRight size={12} className="text-slate-400" />
                        </div>
                      </td>

                      {/* Target Species */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rel.targetSpecies?.image || ""}
                            alt={rel.targetSpecies?.commonName}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/10"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div>
                            <p className={`font-bold text-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                              {rel.targetSpecies?.commonName}
                            </p>
                            <p className="text-[11px] text-slate-400 italic">
                              {rel.targetSpecies?.scientificName}
                            </p>
                            <span className="text-[10px] font-mono text-cyan-400">
                              {rel.targetSpecies?.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Strength */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-cyan-400 text-xs">
                            {Math.round(rel.strength * 100)}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${Math.round(rel.strength * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Ecological Impact / Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className={`line-clamp-2 text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {rel.ecologicalImpact || rel.description || "—"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(rel)}
                            title="Chỉnh sửa"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(rel)}
                            title="Xóa quan hệ"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-600"
        }`}>
          <span>
            Tổng cộng: <strong className={isDark ? "text-white" : "text-slate-900"}>{total}</strong> mối quan hệ
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: CREATE / EDIT RELATIONSHIP ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#101b3b] border-cyan-500/30 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-heading mb-1 flex items-center gap-2">
              <Network size={18} className="text-cyan-400" />
              <span>{editingItem ? "Chỉnh Sửa Mối Quan Hệ Sinh Thái" : "Thiết Lập Quan Hệ Sinh Thái Mới"}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Định nghĩa dòng năng lượng chuỗi thức ăn hoặc quan hệ tương hỗ giữa 2 loài tại Biển Đông.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Source & Target Species */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Loài Nguồn (Source Species)</label>
                  <select
                    disabled={!!editingItem}
                    value={formData.sourceSpeciesId}
                    onChange={(e) => setFormData({ ...formData, sourceSpeciesId: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {allSpecies.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#101b3b]">
                        {s.commonName || s.common_name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Loài Đích (Target Species)</label>
                  <select
                    disabled={!!editingItem}
                    value={formData.targetSpeciesId}
                    onChange={(e) => setFormData({ ...formData, targetSpeciesId: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {allSpecies.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#101b3b]">
                        {s.commonName || s.common_name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Relationship Type & Strength */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Kiểu Quan Hệ Sinh Thái</label>
                  <select
                    value={formData.relationshipType}
                    onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {RELATIONSHIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#101b3b]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-300">
                    <span>Trọng Số Tương Tác</span>
                    <span className="text-cyan-400 font-mono">{Math.round(formData.strength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Mô Tả Tập Tính / Dòng Năng Lượng</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Ốc tù và săn bắt sao biển gai trưởng thành..."
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              {/* Ecological Impact */}
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Tác Động Sinh Thái / Ý Nghĩa Bảo Tồn</label>
                <textarea
                  rows={3}
                  value={formData.ecologicalImpact}
                  onChange={(e) => setFormData({ ...formData, ecologicalImpact: e.target.value })}
                  placeholder="Ví dụ: Giúp bảo vệ các rạn san hô khỏi bị tàn phá khi sao biển gai bùng phát dịch hại..."
                  className={`w-full p-2.5 rounded-xl border outline-none resize-none ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-950/40 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : editingItem ? "Cập Nhật" : "Tạo Quan Hệ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM DELETE ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
            isDark ? "bg-[#101b3b] border-red-500/30 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Xác nhận xóa quan hệ sinh thái</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Bạn có chắc chắn muốn xóa mối quan hệ giữa <strong>{deleteTarget.sourceSpecies?.commonName}</strong> và <strong>{deleteTarget.targetSpecies?.commonName}</strong> khỏi đồ thị tri thức không? Hành động này sẽ cập nhật lại toàn bộ mô phỏng Ego Network.
            </p>

            <div className="flex justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xác Nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
