import { useState, useEffect, useMemo } from "react";
import { X, Search, Check, Plus, Loader2 } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import {
  fetchAllSpeciesForAssign,
  assignSpeciesToGroup,
} from "../../../services/speciesGroupApi";

export default function AssignSpeciesModal({
  isOpen,
  onClose,
  groups = [],
  onSuccess,
}) {
  const { isDark } = useTheme();

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [allSpecies, setAllSpecies] = useState([]);
  const [assignedSpeciesIds, setAssignedSpeciesIds] = useState(new Set());
  const [initialAssignedIds, setInitialAssignedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set default group when modal opens
  useEffect(() => {
    if (isOpen && groups.length > 0) {
      const initialGroup = groups[0];
      setSelectedGroupId(initialGroup.id);
    }
    setSearchTerm("");
    setErrorMessage("");
  }, [isOpen, groups]);

  // Load all species from database when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadSpecies = async () => {
      setIsLoadingSpecies(true);
      try {
        const res = await fetchAllSpeciesForAssign({ page: 1, limit: 300 });
        if (isMounted) {
          const list = res.data || [];
          setAllSpecies(list);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sinh vật:", err);
        if (isMounted) setErrorMessage("Không thể tải danh sách sinh vật.");
      } finally {
        if (isMounted) setIsLoadingSpecies(false);
      }
    };

    loadSpecies();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Update assigned set whenever selected group changes
  useEffect(() => {
    if (!selectedGroupId || allSpecies.length === 0) return;

    const currentAssigned = new Set();
    allSpecies.forEach((sp) => {
      const spGroupId = sp.groupId || sp.group_id || sp.species_groups?.id;
      if (spGroupId && String(spGroupId) === String(selectedGroupId)) {
        currentAssigned.add(String(sp.id));
      }
    });

    setAssignedSpeciesIds(new Set(currentAssigned));
    setInitialAssignedIds(new Set(currentAssigned));
  }, [selectedGroupId, allSpecies]);

  // Selected group object
  const currentGroup = groups.find((g) => String(g.id) === String(selectedGroupId)) || groups[0];

  // Filter species based on search query
  const filteredSpecies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allSpecies;
    return allSpecies.filter((sp) => {
      const name = (sp.name || sp.common_name || "").toLowerCase();
      const sci = (sp.scientificName || "").toLowerCase();
      const code = (sp.code || "").toLowerCase();
      return name.includes(q) || sci.includes(q) || code.includes(q);
    });
  }, [searchTerm, allSpecies]);

  if (!isOpen) return null;

  // Toggle species in/out of current group
  const handleToggleSpecies = (speciesId) => {
    const idStr = String(speciesId);
    setAssignedSpeciesIds((prev) => {
      const next = new Set(prev);
      if (next.has(idStr)) {
        next.delete(idStr);
      } else {
        next.add(idStr);
      }
      return next;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!selectedGroupId) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      const idsToAssign = Array.from(assignedSpeciesIds);
      await assignSpeciesToGroup(selectedGroupId, idsToAssign);

      // Cập nhật lại state local của allSpecies
      setAllSpecies((prev) =>
        prev.map((sp) => {
          const isSelected = assignedSpeciesIds.has(String(sp.id));
          const wasInThisGroup = String(sp.groupId || sp.group_id || sp.species_groups?.id) === String(selectedGroupId);

          if (isSelected) {
            return {
              ...sp,
              groupId: selectedGroupId,
              group_id: selectedGroupId,
              species_groups: { id: selectedGroupId, name: currentGroup?.name },
            };
          } else if (wasInThisGroup) {
            return {
              ...sp,
              groupId: null,
              group_id: null,
              species_groups: null,
            };
          }
          return sp;
        })
      );

      if (onSuccess) {
        onSuccess(`Đã cập nhật danh sách sinh vật cho nhóm "${currentGroup?.name}"`);
      }
      onClose();
    } catch (err) {
      console.error("Lỗi khi gán sinh vật:", err);
      setErrorMessage(err.response?.data?.error || "Có lỗi xảy ra khi lưu thay đổi.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = assignedSpeciesIds.size;
  const totalCreaturesCount = allSpecies.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[85vh] ${
          isDark
            ? "bg-[#18254b]/95 border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            : "bg-white border-slate-200 text-slate-900 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-base sm:text-xl font-bold font-heading">
              Gán sinh vật vào nhóm
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Phân loại và gán các loài sinh vật vào các nhóm tương ứng
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-500/15 text-rose-300 text-xs font-medium border-b border-rose-500/20">
            {errorMessage}
          </div>
        )}

        {/* 2-Column Body (Responsive for Mobile & Desktop) */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 overflow-y-auto md:overflow-hidden min-h-0">
          {/* LEFT COLUMN: Chọn nhóm cần gán */}
          <div
            className={`md:col-span-5 lg:col-span-4 p-4 sm:p-5 border-b md:border-b-0 md:border-r overflow-y-auto max-h-52 md:max-h-none shrink-0 ${
              isDark
                ? "bg-[#131d3d]/60 border-white/10"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              Chọn nhóm cần gán
            </h3>

            <div className="space-y-1.5">
              {groups.map((g) => {
                const isSelected = String(g.id) === String(selectedGroupId);
                const color = g.color || "#3b82f6";
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-blue-600/30 border border-blue-500/50 text-white font-bold shadow-sm"
                        : isDark
                        ? "hover:bg-white/5 text-slate-300 border border-transparent"
                        : "hover:bg-slate-200 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="truncate">{g.name}</span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400 shrink-0">
                      {g.creatureCount ?? 0} loài
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Danh sách sinh vật (md:col-span-7 lg:col-span-8) */}
          <div className="md:col-span-7 lg:col-span-8 p-4 sm:p-6 flex flex-col overflow-hidden min-h-[320px] md:min-h-[460px]">
            {/* Title & Search bar */}
            <div className="mb-4 shrink-0">
              <h3 className="text-xs sm:text-sm font-semibold mb-2.5 flex items-center gap-1.5 truncate">
                <span className="text-slate-300">Sinh vật thuộc nhóm</span>
                <span className="text-cyan-400 font-bold truncate">
                  {currentGroup?.name || "..."}
                </span>
              </h3>

              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm sinh vật theo tên hoặc tên khoa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none transition-all ${
                    isDark
                      ? "bg-[#111933] border border-white/15 text-white placeholder:text-white/30 focus:border-cyan-400"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                  }`}
                />
              </div>
            </div>

            {/* Scrollable creature list */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar-thin">
              {isLoadingSpecies ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-cyan-400 mb-2" />
                  <span className="text-xs text-slate-400">Đang tải danh sách sinh vật...</span>
                </div>
              ) : filteredSpecies.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    {searchTerm
                      ? `Không tìm thấy sinh vật phù hợp với "${searchTerm}".`
                      : "Chưa có sinh vật nào trong hệ thống. Hãy thêm sinh vật ở trang Quản lý Sinh vật."}
                  </p>
                </div>
              ) : (
                filteredSpecies.map((sp) => {
                  const idStr = String(sp.id);
                  const isChecked = assignedSpeciesIds.has(idStr);
                  const primaryImage =
                    sp.image ||
                    sp.images?.[0] ||
                    sp.species_media?.[0]?.url ||
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop";

                  return (
                    <div
                      key={sp.id}
                      onClick={() => handleToggleSpecies(sp.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? isDark
                            ? "bg-white/[0.08] border-cyan-500/40 shadow-sm"
                            : "bg-cyan-50 border-cyan-300"
                          : isDark
                          ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {/* Image + Names */}
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <img
                          src={primaryImage}
                          alt={sp.name || sp.common_name}
                          className="w-12 h-10 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                            {sp.name || sp.common_name || "Sinh vật biển"}
                          </p>
                          <p className="text-[11px] text-slate-400 italic truncate leading-tight mt-0.5">
                            {sp.scientificName || "Species"}
                          </p>
                        </div>
                      </div>

                      {/* Checkmark or Plus button */}
                      <button
                        type="button"
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                          isChecked
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                            : "bg-white/5 hover:bg-white/15 text-slate-400 border border-white/10"
                        }`}
                      >
                        {isChecked ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-white/10 bg-white/[0.02] shrink-0">
          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            Đã chọn <strong className="text-white font-bold">{selectedCount}</strong>/ {totalCreaturesCount} sinh vật
          </span>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoadingSpecies}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
