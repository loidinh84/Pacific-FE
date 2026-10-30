import { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
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

// Loại bỏ các chữ trong ngoặc đơn giải thích dư thừa
const cleanSpeciesName = (name = "") => {
  if (!name) return "";
  return name.replace(/\s*\([^)]*\)/g, "").trim() || name;
};

const RELATIONSHIP_TYPES = [
  {
    value: "predator_prey",
    label: "Ăn thịt / Con mồi",
    badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  {
    value: "symbiosis",
    label: "Cộng sinh tương hỗ",
    badgeStyle: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  },
  {
    value: "habitat_provider",
    label: "Cung cấp nơi ở",
    badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    value: "herbivory",
    label: "Ăn thực vật / Gặm cỏ",
    badgeStyle: "bg-lime-500/15 text-lime-300 border-lime-500/30",
  },
  {
    value: "commensalism",
    label: "Hội sinh",
    badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
  {
    value: "parasitism",
    label: "Ký sinh",
    badgeStyle: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  },
  {
    value: "competitor",
    label: "Cạnh tranh sinh thái",
    badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
];

// ── Dropdown chuẩn phong cách Pacific Admin ──────────────────────
function CustomSelect({
  options = [],
  value,
  onChange,
  isDark,
  placeholder = "Chọn...",
  size = "md",
  className = "",
  searchable = false,
  direction = "down",
}) {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
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

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const filteredOptions = useMemo(() => {
    if (!searchable || !filterText.trim()) return options;
    const term = filterText.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(term));
  }, [options, filterText, searchable]);

  const pyCls = size === "sm" ? "py-2 px-3 text-xs" : "py-2.5 px-3.5 text-sm";
  const positionClasses = direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setFilterText("");
        }}
        className={`w-full ${pyCls} rounded-xl font-medium flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${
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
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          size={size === "sm" ? 14 : 16}
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
          className={`absolute left-0 min-w-full w-max max-w-sm ${positionClasses} z-50 rounded-2xl border p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 shadow-xl ${
            isDark
              ? "bg-[#0f1c3d] border-cyan-500/30 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {searchable && (
            <div className="p-1 mb-1 border-b border-white/10">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Tìm nhanh..."
                className={`w-full px-2.5 py-1.5 rounded-lg text-xs outline-none ${
                  isDark
                    ? "bg-white/5 text-white placeholder-white/40 border border-white/10"
                    : "bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200"
                }`}
                autoFocus
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">
                Không tìm thấy loài phù hợp
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition-all text-left cursor-pointer ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                          : "bg-cyan-50 text-cyan-700 font-semibold"
                        : isDark
                          ? "hover:bg-white/10 text-white/90 hover:text-white"
                          : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <CheckCircle2
                        size={14}
                        className="text-cyan-400 shrink-0 ml-1"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Danh sách sinh vật tải từ DB để phục vụ chọn loài
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

  // Tải danh sách quan hệ sinh thái
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

  // Tải danh sách sinh vật phục vụ dropdown
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

  // Options sinh vật đã lọc bỏ chú thích dư thừa
  const speciesOptions = useMemo(() => {
    return allSpecies.map((s) => ({
      value: String(s.id),
      label: cleanSpeciesName(s.commonName || s.common_name),
    }));
  }, [allSpecies]);

  // Options kiểu quan hệ cho CustomSelect
  const filterTypeOptions = useMemo(() => {
    return [
      { value: "", label: "Tất cả kiểu quan hệ" },
      ...RELATIONSHIP_TYPES.map((t) => ({ value: t.value, label: t.label })),
    ];
  }, []);

  const modalTypeOptions = useMemo(() => {
    return RELATIONSHIP_TYPES.map((t) => ({ value: t.value, label: t.label }));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      sourceSpeciesId: allSpecies[0]?.id ? String(allSpecies[0].id) : "",
      targetSpeciesId: allSpecies[1]?.id ? String(allSpecies[1].id) : "",
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
      sourceSpeciesId: String(item.sourceSpeciesId),
      targetSpeciesId: String(item.targetSpeciesId),
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
    if (formData.sourceSpeciesId === formData.targetSpeciesId) {
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
        showSuccess("Cập nhật mối quan hệ thành công");
      } else {
        await createAdminRelationship(formData);
        showSuccess("Tạo mối quan hệ mới thành công");
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
      showSuccess("Đã xóa mối quan hệ thành công");
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

      {/* ── HEADER TINH GIẢN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Quản lý mối quan hệ sinh thái
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          <span>Thêm quan hệ mới</span>
        </button>
      </div>

      {/* ── BỘ LỌC & TÌM KIẾM ── */}
      <div
        className={`p-4 rounded-2xl border mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDark
            ? "bg-[#151f42]/70 border-white/10"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên loài, mô tả, tác động..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-cyan-400"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <CustomSelect
            options={filterTypeOptions}
            value={selectedType}
            onChange={(val) => {
              setSelectedType(val);
              setPage(1);
            }}
            isDark={isDark}
            placeholder="Tất cả kiểu quan hệ"
            size="md"
            className="w-full md:w-56"
          />

          <button
            onClick={() => {
              setSearch("");
              setSelectedType("");
              setPage(1);
              loadData();
            }}
            title="Làm mới"
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── BẢNG DANH SÁCH QUAN HỆ ── */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          isDark
            ? "bg-[#151f42]/70 border-white/10"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-sm font-semibold ${
                  isDark
                    ? "border-white/10 bg-white/[0.02] text-slate-300"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <th className="py-3.5 px-4 font-semibold">Loài nguồn</th>
                <th className="py-3.5 px-4 font-semibold text-center">
                  Mối quan hệ
                </th>
                <th className="py-3.5 px-4 font-semibold">Loài đích</th>
                <th className="py-3.5 px-4 font-semibold text-center">
                  Trọng số
                </th>
                <th className="py-3.5 px-4 font-semibold">
                  Tác động sinh thái
                </th>
                <th className="py-3.5 px-4 font-semibold text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
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
                    RELATIONSHIP_TYPES.find(
                      (t) => t.value === rel.relationshipType
                    ) || {
                      label: rel.relationshipType,
                      badgeStyle:
                        "bg-slate-500/15 text-slate-300 border-slate-500/30",
                    };

                  return (
                    <tr
                      key={rel.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Loài nguồn */}
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
                            <p
                              className={`font-semibold text-sm ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {cleanSpeciesName(rel.sourceSpecies?.commonName)}
                            </p>
                            <p className="text-xs text-slate-400 italic">
                              {rel.sourceSpecies?.scientificName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Huy hiệu kiểu quan hệ */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap shadow-sm ${typeObj.badgeStyle}`}
                        >
                          <span>{typeObj.label}</span>
                          <ArrowRight
                            size={13}
                            className="shrink-0 opacity-75"
                          />
                        </span>
                      </td>

                      {/* Loài đích */}
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
                            <p
                              className={`font-semibold text-sm ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {cleanSpeciesName(rel.targetSpecies?.commonName)}
                            </p>
                            <p className="text-xs text-slate-400 italic">
                              {rel.targetSpecies?.scientificName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Trọng số */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-semibold text-cyan-400 text-xs">
                            {Math.round(rel.strength * 100)}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{
                                width: `${Math.round(rel.strength * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Tác động sinh thái */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <p
                          className={`line-clamp-2 text-xs leading-relaxed ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {rel.ecologicalImpact || rel.description || "—"}
                        </p>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(rel)}
                            title="Chỉnh sửa"
                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(rel)}
                            title="Xóa quan hệ"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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

        {/* ── PHÂN TRANG ── */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs sm:text-sm ${
            isDark
              ? "border-white/10 text-slate-400"
              : "border-slate-200 text-slate-600"
          }`}
        >
          <span>
            Tổng cộng:{" "}
            <strong className={isDark ? "text-white" : "text-slate-900"}>
              {total}
            </strong>{" "}
            mối quan hệ
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

      {/* ── MODAL: THÊM / CHỈNH SỬA QUAN HỆ ── */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 ${
            isDark ? "bg-black/40 text-white" : "bg-slate-900/30 text-slate-800"
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 ${
              isDark
                ? "bg-[#142247] border-cyan-400/40 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
              <h2 className="text-lg font-bold font-heading text-white">
                {editingItem ? "Chỉnh sửa quan hệ sinh thái" : "Thêm quan hệ mới"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Chọn loài nguồn & loài đích qua CustomSelect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                    Loài nguồn
                  </label>
                  <CustomSelect
                    options={speciesOptions}
                    value={formData.sourceSpeciesId}
                    onChange={(val) =>
                      setFormData({ ...formData, sourceSpeciesId: val })
                    }
                    isDark={isDark}
                    placeholder="Chọn loài nguồn..."
                    searchable={true}
                    size="md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                    Loài đích
                  </label>
                  <CustomSelect
                    options={speciesOptions}
                    value={formData.targetSpeciesId}
                    onChange={(val) =>
                      setFormData({ ...formData, targetSpeciesId: val })
                    }
                    isDark={isDark}
                    placeholder="Chọn loài đích..."
                    searchable={true}
                    size="md"
                  />
                </div>
              </div>

              {/* Kiểu quan hệ & Trọng số */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                    Kiểu quan hệ
                  </label>
                  <CustomSelect
                    options={modalTypeOptions}
                    value={formData.relationshipType}
                    onChange={(val) =>
                      setFormData({ ...formData, relationshipType: val })
                    }
                    isDark={isDark}
                    placeholder="Chọn kiểu..."
                    size="md"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
                    <span>Trọng số tương tác</span>
                    <span className="text-cyan-400 font-mono text-xs">
                      {Math.round(formData.strength * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={formData.strength}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        strength: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Mô tả tập tính */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                  Mô tả dòng năng lượng / tập tính
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ví dụ: Ốc tù và săn bắt sao biển gai trưởng thành..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark
                      ? "bg-[#0d1730] border-white/15 text-white placeholder-white/30 focus:border-cyan-400"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Tác động sinh thái */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-300">
                  Tác động sinh thái
                </label>
                <textarea
                  rows={3}
                  value={formData.ecologicalImpact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ecologicalImpact: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Giúp bảo vệ các rạn san hô khỏi bị tàn phá khi sao biển gai bùng phát dịch hại..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none transition-all ${
                    isDark
                      ? "bg-[#0d1730] border-white/15 text-white placeholder-white/30 focus:border-cyan-400"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Nút hành động */}
              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingItem
                      ? "Cập nhật"
                      : "Tạo quan hệ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: XÁC NHẬN XÓA ── */}
      {deleteTarget && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 ${
            isDark ? "bg-black/40 text-white" : "bg-slate-900/30 text-slate-800"
          }`}
        >
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative ${
              isDark
                ? "bg-[#142247] border-red-500/30 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>Xác nhận xóa quan hệ sinh thái</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Bạn có chắc chắn muốn xóa mối quan hệ giữa{" "}
              <strong>
                {cleanSpeciesName(deleteTarget.sourceSpecies?.commonName)}
              </strong>{" "}
              và{" "}
              <strong>
                {cleanSpeciesName(deleteTarget.targetSpecies?.commonName)}
              </strong>{" "}
              khỏi hệ thống không?
            </p>

            <div className="flex justify-end gap-3 text-sm">
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
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
