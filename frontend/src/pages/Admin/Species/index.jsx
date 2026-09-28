import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCw, AlertTriangle, LogIn, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddEditSpeciesModal from "./AddEditSpeciesModal";
import ApiSyncModal from "./ApiSyncModal";
import SpeciesFilterSidebar from "./SpeciesFilterSidebar";
import SpeciesTable from "./SpeciesTable";
import SpeciesBulkActionsBar from "./SpeciesBulkActionsBar";
import ConfirmModal from "./ConfirmModal";
import { useTheme } from "../../../hooks/useTheme";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../hooks/ToastContainer";
import { clearStoredAuth } from "../../../utils/auth";
import {
  fetchAdminSpeciesList,
  toggleSpeciesVisibility,
  deleteAdminSpecies,
  createAdminSpecies,
  updateAdminSpecies,
  bulkDeleteAdminSpecies,
  bulkToggleSpeciesVisibility,
} from "../../../services/speciesApi";
import { fetchAdminSpeciesGroups } from "../../../services/speciesGroupApi";

// Helper to remove redundant text in parentheses
const cleanLabel = (text) => {
  if (!text) return "";
  return text.replace(/\s*\([^)]*\)/g, "").trim();
};

// Helper map backend item to table row item
function mapSpeciesFromApi(item) {
  return {
    id: String(item.id),
    code: item.code || `SV${String(item.id).padStart(6, "0")}`,
    name:
      item.common_name || item.name || item.scientificName || "Sinh vật biển",
    gbifId: item.slug || String(item.id),
    slug: item.slug || "",
    source: item.source_api_id || "Pacific DB",
    location: item.ocean_zones?.name || "Sunlight",
    oceanZone: item.ocean_zones?.name || item.oceanZone || "Sunlight",
    conservation: cleanLabel(item.conservation_statuses?.name) || "Ít lo ngại",
    conservationCode: item.conservation_statuses?.code || "LC",
    views: Number(item.view_count) || 0,
    status: item.is_visible ? "Hiển thị" : "Ẩn",
    is_visible: Boolean(item.is_visible),
    scientificName:
      item.scientificName || item.scientific_name || "Chưa cập nhật",
    classification: cleanLabel(item.species_groups?.name) || "Động vật biển",
    groupName: cleanLabel(item.species_groups?.name) || "Sinh vật biển",
    groupId:
      item.group_id != null
        ? String(item.group_id)
        : item.species_groups?.id != null
        ? String(item.species_groups.id)
        : "",
    depthMin:
      item.depth_min_m != null
        ? String(item.depth_min_m)
        : item.depthMin != null
        ? String(item.depthMin)
        : "",
    depthMax:
      item.depth_max_m != null
        ? String(item.depth_max_m)
        : item.depthMax != null
        ? String(item.depthMax)
        : "",
    sizeMinCm:
      item.size_min_cm != null
        ? String(item.size_min_cm)
        : item.sizeMinCm != null
        ? String(item.sizeMinCm)
        : "",
    sizeMaxCm:
      item.size_max_cm != null
        ? String(item.size_max_cm)
        : item.sizeMaxCm != null
        ? String(item.sizeMaxCm)
        : "",
    weightMinKg:
      item.weight_min_kg != null
        ? String(item.weight_min_kg)
        : item.weightMinKg != null
        ? String(item.weightMinKg)
        : "",
    weightMaxKg:
      item.weight_max_kg != null
        ? String(item.weight_max_kg)
        : item.weightMaxKg != null
        ? String(item.weightMaxKg)
        : "",
    lifespanYears:
      item.lifespan_years != null
        ? String(item.lifespan_years)
        : item.lifespanYears != null
        ? String(item.lifespanYears)
        : "",
    tempMinC:
      item.temperature_min_c != null
        ? String(item.temperature_min_c)
        : item.tempMinC != null
        ? String(item.tempMinC)
        : "",
    tempMaxC:
      item.temperature_max_c != null
        ? String(item.temperature_max_c)
        : item.tempMaxC != null
        ? String(item.tempMaxC)
        : "",
    size:
      item.size_min_cm != null && item.size_max_cm != null
        ? `${item.size_min_cm} - ${item.size_max_cm} cm`
        : item.size_min_cm != null
          ? `${item.size_min_cm} cm`
          : "Chưa cập nhật",
    depth:
      item.depth_min_m !== null && item.depth_max_m !== null
        ? `${item.depth_min_m} - ${item.depth_max_m}m`
        : item.depth_min_m !== null
          ? `${item.depth_min_m}m`
          : "Chưa cập nhật",
    waterTemp:
      item.temperature_min_c !== null
        ? item.temperature_max_c !== null
          ? `${item.temperature_min_c} - ${item.temperature_max_c}°C`
          : `${item.temperature_min_c}°C`
        : "Chưa cập nhật",
    geoZone: item.ocean_zones?.name || "Thái Bình Dương",
    diet: item.diet || "Chưa cập nhật",
    lifespan: item.lifespan_years
      ? `${item.lifespan_years} năm`
      : "Chưa cập nhật",
    dateAdded: new Date(item.created_at || Date.now()).toLocaleDateString(
      "vi-VN",
    ),
    created_at: item.created_at,
    updated_at: item.updated_at,
    description: item.description || "Chưa có mô tả chi tiết.",
    model3dUrl: item.model_3d_url || item.model3dUrl || "",
    soundUrl: item.sound_url || item.soundUrl || "",
    images:
      Array.isArray(item.species_media) && item.species_media.length > 0
        ? item.species_media.map((m) => m.url)
        : Array.isArray(item.images)
          ? item.images
          : [],
  };
}

export default function SpeciesManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("info");
  const [authError, setAuthError] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Sorting State
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedConservation, setSelectedConservation] = useState("all");
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("all");

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load groups for filter sidebar
  useEffect(() => {
    let ignore = false;
    async function loadGroups() {
      try {
        const res = await fetchAdminSpeciesGroups();
        if (!ignore && res?.success && Array.isArray(res.groups)) {
          setGroups(res.groups);
        }
      } catch (err) {
        console.warn("Lỗi khi tải danh sách nhóm cho sidebar:", err.message);
      }
    }
    loadGroups();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // "single" | "bulk"
    title: "",
    message: "",
    targetSpecies: null,
    targetId: null,
    ids: [],
    isLoading: false,
  });

  // Load from Backend API
  useEffect(() => {
    let ignore = false;

    const startFetching = async () => {
      try {
        setAuthError(false);
        setIsLoading(true);
        const params = {
          page,
          limit: perPage,
        };
        if (sortBy) {
          params.sortBy = sortBy;
          params.order = sortOrder;
        }
        if (selectedGroupId && selectedGroupId !== "all") {
          params.group_id = selectedGroupId;
        }

        const res = await fetchAdminSpeciesList(params);
        if (!ignore && res?.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapSpeciesFromApi);
          setSpeciesList(mapped);
          setPagination({
            total: res.pagination?.total ?? mapped.length,
            totalPages: res.pagination?.totalPages ?? 1,
          });
          if (mapped.length > 0) {
            setSelectedRowId((prev) =>
              prev && mapped.some((m) => m.id === prev) ? prev : null,
            );
          } else {
            setSelectedRowId(null);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Lỗi khi tải danh sách sinh vật:", err.message);
          if (err.response?.status === 401 || err.response?.status === 403) {
            setAuthError(true);
          } else if (!err.response) {
            showToast(
              "Không thể kết nối đến máy chủ (Port 3000). Vui lòng đảm bảo backend đang chạy.",
              "error",
            );
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    startFetching();

    return () => {
      ignore = true;
    };
  }, [refreshKey, page, perPage, sortBy, sortOrder, selectedGroupId]);

  // Filtered & Client-Sorted Species
  const filteredList = useMemo(() => {
    const list = (speciesList || []).filter((sp) => {
      if (!sp) return false;
      const nameStr = (sp.name || "").toLowerCase();
      const codeStr = (sp.code || "").toLowerCase();
      const sciStr = (
        sp.scientificName ||
        sp.scientific_name ||
        ""
      ).toLowerCase();
      const term = (debouncedSearchTerm || "").toLowerCase();

      const matchSearch =
        !term ||
        nameStr.includes(term) ||
        codeStr.includes(term) ||
        sciStr.includes(term);
      const matchCons =
        selectedConservation === "all" ||
        sp.conservationCode === selectedConservation;
      const matchGroup =
        selectedGroupId === "all" ||
        String(sp.groupId) === String(selectedGroupId);

      return matchSearch && matchCons && matchGroup;
    });

    // Client-side instant sort
    if (sortBy) {
      return [...list].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [
    speciesList,
    debouncedSearchTerm,
    selectedConservation,
    selectedGroupId,
    sortBy,
    sortOrder,
  ]);

  const selectedSpecies = selectedRowId
    ? speciesList.find((sp) => sp.id === selectedRowId) || null
    : null;

  // Actions
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRowId(null);
    setCheckedIds([]);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
    setSelectedRowId(null);
    setCheckedIds([]);
  };

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
  };

  const handleToggleCheckAll = () => {
    if (checkedIds.length === filteredList.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(filteredList.map((sp) => sp.id));
    }
  };

  const handleToggleCheckRow = (id, e) => {
    e.stopPropagation();
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleToggleVisibility = async (id, e) => {
    if (e) e.stopPropagation();
    const target = speciesList.find((sp) => sp.id === id);
    if (!target) return;
    const newVis = !target.is_visible;

    // Optimistic update
    setSpeciesList((prev) =>
      prev.map((sp) =>
        sp.id === id
          ? { ...sp, is_visible: newVis, status: newVis ? "Hiển thị" : "Ẩn" }
          : sp,
      ),
    );

    try {
      await toggleSpeciesVisibility(id, newVis);
      showToast(
        newVis ? `Đã hiển thị sinh vật "${target.name}"` : `Đã ẩn sinh vật "${target.name}"`,
        "success",
      );
    } catch (err) {
      // Rollback on failure
      setSpeciesList((prev) =>
        prev.map((sp) =>
          sp.id === id
            ? { ...sp, is_visible: !newVis, status: !newVis ? "Hiển thị" : "Ẩn" }
            : sp,
        ),
      );
      const msg = err?.response?.status === 401
        ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        : "Không thể cập nhật trạng thái. Vui lòng thử lại.";
      showToast(msg, "error");
    }
  };

  // Bulk Actions
  const handleBulkSetVisibility = async (isVisible) => {
    if (checkedIds.length === 0) return;
    setIsBulkProcessing(true);

    // Optimistic update
    setSpeciesList((prev) =>
      prev.map((sp) =>
        checkedIds.includes(sp.id)
          ? { ...sp, is_visible: isVisible, status: isVisible ? "Hiển thị" : "Ẩn" }
          : sp,
      ),
    );

    try {
      const { successful, failed } = await bulkToggleSpeciesVisibility(checkedIds, isVisible);
      if (failed.length > 0) {
        showToast(
          `Cập nhật thành công ${successful.length} sinh vật, có ${failed.length} mục gặp lỗi.`,
          "warning",
        );
      } else {
        showToast(
          isVisible
            ? `Đã hiển thị ${successful.length} sinh vật đã chọn`
            : `Đã ẩn ${successful.length} sinh vật đã chọn`,
          "success",
        );
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái hàng loạt:", err);
      showToast("Không thể cập nhật trạng thái hàng loạt. Đang tải lại dữ liệu...", "error");
      setRefreshKey((k) => k + 1);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleRequestBulkDelete = () => {
    if (checkedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      type: "bulk",
      title: "Xác nhận xóa hàng loạt sinh vật",
      message: `Bạn có chắc chắn muốn xóa ${checkedIds.length} sinh vật đã chọn? Các mục này sẽ được chuyển vào trạng thái xóa mềm.`,
      targetSpecies: null,
      targetId: null,
      ids: [...checkedIds],
      isLoading: false,
    });
  };

  // Trigger single item delete with modal
  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    const target = speciesList.find((sp) => sp.id === id);
    setConfirmModal({
      isOpen: true,
      type: "single",
      title: "Xác nhận xóa sinh vật",
      message: `Bạn có chắc chắn muốn xóa "${target?.name || "sinh vật này"}" (${target?.code || "Mã chưa cập nhật"}) khỏi danh sách?`,
      targetSpecies: target,
      targetId: id,
      ids: [id],
      isLoading: false,
    });
  };

  // Confirmed delete callback from ConfirmModal
  const handleConfirmModalAction = async () => {
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));

    if (confirmModal.type === "single") {
      const id = confirmModal.targetId;
      const target = confirmModal.targetSpecies;
      try {
        await deleteAdminSpecies(id);
        setSpeciesList((prev) => prev.filter((sp) => sp.id !== id));
        setCheckedIds((prev) => prev.filter((item) => item !== id));
        if (selectedRowId === id) setSelectedRowId(null);
        showToast(`Đã xóa "${target?.name || "sinh vật"}" thành công.`, "success");
        setConfirmModal({
          isOpen: false,
          type: null,
          title: "",
          message: "",
          targetSpecies: null,
          targetId: null,
          ids: [],
          isLoading: false,
        });
      } catch (err) {
        const msg = err?.response?.status === 401
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : "Không thể xóa sinh vật. Vui lòng thử lại.";
        showToast(msg, "error");
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    } else if (confirmModal.type === "bulk") {
      const idsToDelete = confirmModal.ids;
      try {
        const { successful, failed } = await bulkDeleteAdminSpecies(idsToDelete);
        setSpeciesList((prev) => prev.filter((sp) => !successful.includes(sp.id)));
        setCheckedIds((prev) => prev.filter((id) => !successful.includes(id)));
        if (selectedRowId && successful.includes(selectedRowId)) {
          setSelectedRowId(null);
        }
        if (failed.length > 0) {
          showToast(
            `Đã xóa ${successful.length} sinh vật, có ${failed.length} mục gặp lỗi.`,
            "warning",
          );
        } else {
          showToast(`Đã xóa thành công ${successful.length} sinh vật đã chọn.`, "success");
        }
        setConfirmModal({
          isOpen: false,
          type: null,
          title: "",
          message: "",
          targetSpecies: null,
          targetId: null,
          ids: [],
          isLoading: false,
        });
      } catch (err) {
        console.error("Lỗi khi xóa hàng loạt sinh vật:", err);
        showToast("Có lỗi xảy ra khi xóa hàng loạt sinh vật.", "error");
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingSpecies(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (sp, e) => {
    if (e) e.stopPropagation();
    setEditingSpecies(sp);
    setIsAddEditOpen(true);
  };

  const handleSaveSpeciesModal = async (form) => {
    if (editingSpecies) {
      try {
        const res = await updateAdminSpecies(editingSpecies.id, form);
        if (res?.success && res?.data) {
          const updated = mapSpeciesFromApi(res.data);
          setSpeciesList((prev) =>
            prev.map((sp) => (sp.id === editingSpecies.id ? updated : sp)),
          );
          showToast(`Đã cập nhật sinh vật "${updated.name}" thành công!`, "success");
        } else {
          setRefreshKey((k) => k + 1);
        }
      } catch (err) {
        console.warn("Backend update API fallback:", err.message);
        setRefreshKey((k) => k + 1);
      }
    } else {
      try {
        const res = await createAdminSpecies(form);
        if (res?.success && res?.data) {
          const newSp = mapSpeciesFromApi(res.data);
          setSpeciesList((prev) => [newSp, ...prev]);
          setSelectedRowId(newSp.id);
          showToast(`Đã tạo mới sinh vật "${newSp.name}" thành công!`, "success");
        } else {
          setRefreshKey((k) => k + 1);
        }
      } catch (err) {
        console.warn("Backend create API fallback:", err.message);
        setRefreshKey((k) => k + 1);
      }
    }
    setIsAddEditOpen(false);
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setPage(1);
    setSelectedRowId(null);
    setCheckedIds([]);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedConservation("all");
    setSelectedGroupId("all");
    setSortBy(null);
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedConservation !== "all" ||
    selectedGroupId !== "all"
  );

  const handleExportCSV = () => {
    if (!filteredList || filteredList.length === 0) {
      showToast("Không có dữ liệu sinh vật để xuất CSV", "warning");
      return;
    }
    const headers = [
      "Mã SV",
      "Tên sinh vật",
      "Tên khoa học",
      "Nhóm",
      "Vùng sinh sống",
      "Tình trạng bảo tồn",
      "Lượt xem",
      "Trạng thái",
      "Ngày thêm",
    ];

    const rows = filteredList.map((sp) => [
      `"${sp.code || ""}"`,
      `"${(sp.name || "").replace(/"/g, '""')}"`,
      `"${(sp.scientificName || "").replace(/"/g, '""')}"`,
      `"${(sp.groupName || "").replace(/"/g, '""')}"`,
      `"${(sp.location || "").replace(/"/g, '""')}"`,
      `"${(sp.conservation || "").replace(/"/g, '""')}"`,
      sp.views || 0,
      `"${sp.status || ""}"`,
      `"${sp.dateAdded || ""}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pacific_sinh_vat_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Đã xuất thành công ${filteredList.length} sinh vật ra file CSV!`, "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── TOP HEADER TITLE & ACTION BUTTONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-black font-heading tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Quản lý sinh vật
          </h1>
          <p
            className={`text-xs md:text-sm font-medium mt-1 ${
              isDark ? "text-pacific-blue-pale" : "text-slate-500"
            }`}
          >
            Tra cứu, sắp xếp, cập nhật thông tin và đồng bộ hóa danh mục sinh vật biển
            Thái Bình Dương
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs md:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
              isDark
                ? "bg-white/10 hover:bg-white/15 border-white/20 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
            }`}
            title="Xuất danh sách sinh vật đang lọc ra file Excel/CSV"
          >
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={() => setIsApiSyncOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
              isDark
                ? "bg-[#284980] hover:bg-[#345ba0] border-white/20 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-indigo-700 shadow-sm"
            }`}
          >
            <RefreshCw size={16} />
            <span>Đồng bộ API ({pagination.total || speciesList.length})</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm sinh vật</span>
          </button>
        </div>
      </div>

      {/* ── AUTH ERROR / SESSION EXPIRED BANNER ── */}
      {authError && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-lg ${
            isDark
              ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" size={22} />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Phiên đăng nhập quản trị đã hết hạn hoặc không hợp lệ (401).</span>{" "}
              Vui lòng đăng nhập lại tài khoản Admin (<strong>adminOcean@gmail.com</strong>) để tải dữ liệu sinh vật và thực hiện đồng bộ.
            </div>
          </div>
          <button
            onClick={() => {
              clearStoredAuth();
              navigate("/login");
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
          >
            <LogIn size={15} />
            <span>Đăng nhập lại</span>
          </button>
        </div>
      )}

      {/* ── MAIN 2-COLUMN LAYOUT: FILTER SIDEBAR (LEFT) + TABLE & DETAIL (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-3">
          <SpeciesFilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedConservation={selectedConservation}
            setSelectedConservation={setSelectedConservation}
            groups={groups}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={handleSelectGroup}
          />
        </div>

        {/* Right Column: Species Bulk Actions Bar & Species Table */}
        <div className="lg:col-span-9 space-y-4">
          {/* Bulk Actions Toolbar (Phase 1.1) */}
          <SpeciesBulkActionsBar
            selectedCount={checkedIds.length}
            onClearSelection={() => setCheckedIds([])}
            onBulkSetVisibility={handleBulkSetVisibility}
            onBulkDelete={handleRequestBulkDelete}
            isProcessing={isBulkProcessing}
          />

          {/* Species Table (Phase 1.2 Column Sorting & 1.4 Empty state) */}
          <SpeciesTable
            isLoading={isLoading}
            filteredList={filteredList}
            totalCount={pagination.total}
            selectedRowId={selectedRowId}
            setSelectedRowId={setSelectedRowId}
            checkedIds={checkedIds}
            handleToggleCheckAll={handleToggleCheckAll}
            handleToggleCheckRow={handleToggleCheckRow}
            handleToggleVisibility={handleToggleVisibility}
            handleOpenEditModal={handleOpenEditModal}
            handleDelete={handleDelete}
            selectedSpecies={selectedSpecies}
            activeDetailTab={activeDetailTab}
            setActiveDetailTab={setActiveDetailTab}
            // Sorting props
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            // Empty state helpers
            onResetFilters={handleResetFilters}
            onOpenAddModal={handleOpenAddModal}
            hasActiveFilters={hasActiveFilters}
            // Pagination props
            page={page}
            totalPages={pagination.totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      </div>

      {/* ── MODALS ── */}
      <AddEditSpeciesModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveSpeciesModal}
        editingSpecies={editingSpecies}
      />

      <ApiSyncModal
        isOpen={isApiSyncOpen}
        onClose={() => setIsApiSyncOpen(false)}
        onSyncAll={() => {
          setRefreshKey((k) => k + 1);
          setIsApiSyncOpen(false);
        }}
      />

      {/* Inline Confirm Modal (Phase 1.3) */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.type === "bulk" ? "Xóa tất cả đã chọn" : "Xác nhận xóa"}
        variant="danger"
        isLoading={confirmModal.isLoading}
        onConfirm={handleConfirmModalAction}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            type: null,
            title: "",
            message: "",
            targetSpecies: null,
            targetId: null,
            ids: [],
            isLoading: false,
          })
        }
      />

      {/* ── TOAST NOTIFICATIONS ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
