import { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import AddEditSpeciesModal from "./AddEditSpeciesModal";
import ApiSyncModal from "./ApiSyncModal";
import SpeciesFilterSidebar from "./SpeciesFilterSidebar";
import SpeciesTable from "./SpeciesTable";
import { useTheme } from "../../../hooks/useTheme";
import {
  fetchAdminSpeciesList,
  toggleSpeciesVisibility,
  deleteAdminSpecies,
  createAdminSpecies,
  updateAdminSpecies,
} from "../../../services/speciesApi";

// Helper map backend item to table row item
function mapSpeciesFromApi(item) {
  return {
    id: String(item.id),
    code: item.code || `SV${String(item.id).padStart(6, "0")}`,
    name: item.common_name || item.name || item.scientificName || "Sinh vật biển",
    gbifId: item.slug || String(item.id),
    source: item.source_api_id || "Pacific DB",
    location: item.ocean_zones?.name || "Sunlight",
    conservation: item.conservation_statuses?.name || "Ít lo ngại",
    conservationCode: item.conservation_statuses?.code || "LC",
    views: Number(item.view_count) || 0,
    status: item.is_visible ? "Hiển thị" : "Ẩn",
    is_visible: Boolean(item.is_visible),
    scientificName: item.scientificName || item.scientific_name || "Chưa cập nhật",
    classification: item.species_groups?.name || "Động vật biển",
    size:
      item.size_min_cm && item.size_max_cm
        ? `${item.size_min_cm} - ${item.size_max_cm} cm`
        : item.size_min_cm
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
    lifespan: item.lifespan_years ? `${item.lifespan_years} năm` : "Chưa cập nhật",
    groupName: item.species_groups?.name || "Sinh vật biển",
    dateAdded: new Date(item.created_at || Date.now()).toLocaleDateString("vi-VN"),
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
  const { isDark } = useTheme();
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConservation, setSelectedConservation] = useState("all");

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load from Backend API using idiomatic React async effect pattern
  useEffect(() => {
    let ignore = false;

    const startFetching = async () => {
      try {
        const res = await fetchAdminSpeciesList();
        if (!ignore && res?.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapSpeciesFromApi);
          setSpeciesList(mapped);
          if (mapped.length > 0) {
            setSelectedRowId((prev) =>
              prev && mapped.some((m) => m.id === prev) ? prev : null
            );
          } else {
            setSelectedRowId(null);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Lỗi khi tải danh sách sinh vật:", err.message);
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
  }, [refreshKey]);

  // Filtered Species
  const filteredList = (speciesList || []).filter((sp) => {
    if (!sp) return false;
    const nameStr = (sp.name || "").toLowerCase();
    const codeStr = (sp.code || "").toLowerCase();
    const sciStr = (sp.scientificName || sp.scientific_name || "").toLowerCase();
    const term = (searchTerm || "").toLowerCase();

    const matchSearch =
      !term || nameStr.includes(term) || codeStr.includes(term) || sciStr.includes(term);
    const matchCons =
      selectedConservation === "all" || sp.conservationCode === selectedConservation;
    return matchSearch && matchCons;
  });

  const selectedSpecies = selectedRowId
    ? speciesList.find((sp) => sp.id === selectedRowId) || null
    : null;

  // Actions
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
    e.stopPropagation();
    const target = speciesList.find((sp) => sp.id === id);
    if (!target) return;
    const newVis = !target.is_visible;

    try {
      await toggleSpeciesVisibility(id, newVis);
    } catch {
      // Local fallback
    }

    setSpeciesList((prev) =>
      prev.map((sp) =>
        sp.id === id
          ? { ...sp, is_visible: newVis, status: newVis ? "Hiển thị" : "Ẩn" }
          : sp
      )
    );
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh vật này?")) return;

    try {
      await deleteAdminSpecies(id);
    } catch {
      // Local fallback
    }

    setSpeciesList((prev) => prev.filter((sp) => sp.id !== id));
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
          setSpeciesList((prev) => prev.map((sp) => (sp.id === editingSpecies.id ? updated : sp)));
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
            Tra cứu, cập nhật thông tin và đồng bộ hóa danh mục sinh vật biển Thái Bình Dương
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsApiSyncOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
              isDark
                ? "bg-[#284980] hover:bg-[#345ba0] border-white/20 text-white"
                : "bg-white hover:bg-slate-50 border-slate-200 text-indigo-700 shadow-sm"
            }`}
          >
            <RefreshCw size={16} />
            <span>Đồng bộ API ({speciesList.length})</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pacific-blue-bright via-cyan-500 to-pacific-teal hover:brightness-110 text-white text-xs md:text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm sinh vật</span>
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT: FILTER SIDEBAR (LEFT) + TABLE & DETAIL (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-3">
          <SpeciesFilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedConservation={selectedConservation}
            setSelectedConservation={setSelectedConservation}
            speciesCount={filteredList.length}
            totalCount={speciesList.length}
            isDark={isDark}
          />
        </div>

        {/* Right Column: Species Table & Expanded Detail */}
        <div className="lg:col-span-9 space-y-6">
          <SpeciesTable
            isLoading={isLoading}
            filteredList={filteredList}
            totalCount={speciesList.length}
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
    </div>
  );
}
