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

const MOCK_SPECIES = [
  {
    id: "1",
    code: "SV000001",
    name: "Cá mập trắng",
    gbifId: "2431178",
    source: "GBIF",
    location: "Sunlight",
    conservation: "Hiếm",
    conservationCode: "VU",
    views: 1023,
    status: "Hiển thị",
    is_visible: true,
    scientificName: "Carcharodon carcharias",
    classification: "Động vật",
    size: "4 - 6 m",
    depth: "100m",
    waterTemp: "20°C",
    geoZone: "Tầng giữa",
    diet: "Ăn cá nhỏ",
    lifespan: "10 năm",
    groupName: "Kẻ săn mồi",
    dateAdded: "7/5/2026",
    description:
      "Cá mập trắng lớn là loài sinh vật biển săn mồi đỉnh bảng với thính giác và thị giác vô cùng nhạy bén.",
    images: [
      "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "2",
    code: "SV000002",
    name: "Bạch tuộc khổng lồ",
    gbifId: "2289410",
    source: "GBIF",
    location: "Twilight",
    conservation: "Hiếm",
    conservationCode: "EN",
    views: 854,
    status: "Hiển thị",
    is_visible: true,
    scientificName: "Enteroctopus dofleini",
    classification: "Động vật thân mềm",
    size: "3 - 5 m",
    depth: "750m",
    waterTemp: "12°C",
    geoZone: "Thái Bình Dương Bắc",
    diet: "Tôm cua cá nhỏ",
    lifespan: "5 năm",
    groupName: "Thân mềm",
    dateAdded: "12/4/2026",
    description:
      "Bạch tuộc khổng lồ Thái Bình Dương là loài bạch tuộc lớn nhất thế giới với trí thông minh nổi bật.",
    images: [
      "https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "3",
    code: "SV000003",
    name: "Cá voi xanh",
    gbifId: "2440735",
    source: "iNaturalist",
    location: "Sunlight",
    conservation: "Cực kỳ nguy cấp",
    conservationCode: "CR",
    views: 2410,
    status: "Hiển thị",
    is_visible: true,
    scientificName: "Balaenoptera musculus",
    classification: "Động vật có vú",
    size: "25 - 30 m",
    depth: "200m",
    waterTemp: "15°C",
    geoZone: "Đại dương mở",
    diet: "Loài giáp xác nhỏ (Krill)",
    lifespan: "80 - 90 năm",
    groupName: "Động vật có vú",
    dateAdded: "1/1/2026",
    description: "Cá voi xanh là loài động vật lớn nhất từng tồn tại trên Trái Đất.",
    images: [
      "https://images.unsplash.com/photo-1568430460464-02e1dc605b12?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

export default function SpeciesManagement() {
  const { isDark } = useTheme();
  const [speciesList, setSpeciesList] = useState(MOCK_SPECIES);
  const [selectedRowId, setSelectedRowId] = useState("1");
  const [checkedIds, setCheckedIds] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConservation, setSelectedConservation] = useState("all");

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load from Backend API on mount
  useEffect(() => {
    const loadBackendData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchAdminSpeciesList();
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: String(item.id),
            code: item.code || `SV${String(item.id).padStart(6, "0")}`,
            name: item.name || item.vietnamese_name || item.common_name || "Cá mập trắng",
            gbifId: item.slug || "2431178",
            source: "GBIF",
            location: item.ocean_zones?.name || "Sunlight",
            conservation: item.conservation_statuses?.name || "Sắp nguy cấp",
            conservationCode: item.conservation_statuses?.code || "VU",
            views: item.view_count || 1023,
            status: item.is_visible ? "Hiển thị" : "Ẩn",
            is_visible: item.is_visible,
            scientificName: item.scientific_name || "Carcharodon carcharias",
            classification: "Động vật",
            size: "4 - 6 m",
            depth: "100m",
            waterTemp: "20°C",
            geoZone: "Tầng giữa",
            diet: "Ăn cá nhỏ",
            lifespan: "10 năm",
            groupName: item.species_groups?.name || "Kẻ săn mồi",
            dateAdded: new Date(item.created_at || Date.now()).toLocaleDateString("vi-VN"),
            description: item.description || "Dữ liệu sinh vật biển được đồng bộ từ PostgreSQL.",
            images:
              item.species_media && item.species_media.length > 0
                ? item.species_media.map((m) => m.url)
                : [
                    "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80",
                  ],
          }));

          setSpeciesList(mapped);
          if (mapped.length > 0) setSelectedRowId(mapped[0].id);
        }
      } catch (err) {
        console.warn("Dùng dữ liệu mẫu do offline/chưa có dữ liệu:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendData();
  }, []);

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

  const selectedSpecies =
    speciesList.find((sp) => sp.id === selectedRowId) ||
    filteredList[0] ||
    speciesList[0] ||
    MOCK_SPECIES[0];

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
      let updatedData = null;
      try {
        const res = await updateAdminSpecies(editingSpecies.id, form);
        if (res?.success && res?.data) {
          updatedData = res.data;
        }
      } catch (err) {
        console.warn("Backend update API fallback:", err.message);
      }

      setSpeciesList((prev) =>
        prev.map((sp) =>
          sp.id === editingSpecies.id
            ? {
                ...sp,
                name: form.name || sp.name,
                scientificName: form.scientificName || sp.scientificName,
                location: form.oceanZone || sp.location,
                conservationCode: form.conservationStatus || sp.conservationCode,
                description: form.description || sp.description,
                images: form.images || sp.images,
                depth: `${form.depthMin || 0}-${form.depthMax || 100}m`,
                size: `${form.sizeMinCm || 100} - ${form.sizeMaxCm || 400} cm`,
                diet: form.diet || sp.diet,
                lifespan: `${form.lifespanYears || 20} năm`,
                model3dUrl: form.model3dUrl,
                soundUrl: form.soundUrl,
                ...(updatedData
                  ? {
                      code: updatedData.code || sp.code,
                      name: updatedData.common_name || form.name,
                      scientificName: updatedData.scientificName || form.scientificName,
                    }
                  : {}),
              }
            : sp
        )
      );
    } else {
      let createdData = null;
      try {
        const res = await createAdminSpecies(form);
        if (res?.success && res?.data) {
          createdData = res.data;
        }
      } catch (err) {
        console.warn("Backend create API fallback:", err.message);
      }

      const newId = createdData?.id ? String(createdData.id) : String(Date.now());
      const newSp = {
        id: newId,
        code: createdData?.code || `SV${String(speciesList.length + 1).padStart(6, "0")}`,
        name: createdData?.common_name || form.name || "Sinh vật mới",
        gbifId: createdData?.slug || "2431178",
        source: "GBIF",
        location: form.oceanZone || "Sunlight",
        conservation: "Sắp nguy cấp",
        conservationCode: form.conservationStatus || "VU",
        views: 0,
        status: "Hiển thị",
        is_visible: true,
        scientificName: createdData?.scientificName || form.scientificName || "Species sci",
        classification: "Động vật",
        size: `${form.sizeMinCm || 100} - ${form.sizeMaxCm || 400} cm`,
        depth: `${form.depthMin || 0}-${form.depthMax || 100}m`,
        waterTemp: `${form.tempMinC || 10}-${form.tempMaxC || 25}°C`,
        geoZone: "Thái Bình Dương",
        diet: form.diet || "Kẻ săn mồi",
        lifespan: `${form.lifespanYears || 20} năm`,
        groupName: "Kẻ săn mồi",
        dateAdded: new Date().toLocaleDateString("vi-VN"),
        description: form.description || "Mô tả sinh vật...",
        images: form.images || [],
        model3dUrl: form.model3dUrl,
        soundUrl: form.soundUrl,
      };
      setSpeciesList([newSp, ...speciesList]);
      setSelectedRowId(newId);
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
            <RefreshCw size={15} />
            <span>Đồng bộ API</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan hover:brightness-110 text-white text-xs md:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus size={16} />
            <span>Thêm sinh vật mới</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. LEFT FILTER SIDEBAR */}
        <SpeciesFilterSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedConservation={selectedConservation}
          setSelectedConservation={setSelectedConservation}
        />

        {/* 2. RIGHT DATA TABLE AREA */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <SpeciesTable
            isLoading={isLoading}
            filteredList={filteredList}
            totalCount={speciesList.length}
            selectedRowId={selectedRowId}
            setSelectedRowId={setSelectedRowId}
            checkedIds={checkedIds}
            handleToggleCheckAll={handleToggleCheckAll}
            handleToggleCheckRow={handleToggleCheckRow}
            selectedSpecies={selectedSpecies}
            activeDetailTab={activeDetailTab}
            setActiveDetailTab={setActiveDetailTab}
            handleOpenEditModal={handleOpenEditModal}
            handleToggleVisibility={handleToggleVisibility}
            handleDelete={handleDelete}
          />
        </main>
      </div>

      {/* ── MODALS ── */}
      <AddEditSpeciesModal
        key={editingSpecies?.id || (isAddEditOpen ? "open-add" : "closed")}
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveSpeciesModal}
        editingSpecies={editingSpecies}
      />

      <ApiSyncModal
        isOpen={isApiSyncOpen}
        onClose={() => setIsApiSyncOpen(false)}
        onSyncAll={() => console.log("Done syncing all")}
      />
    </div>
  );
}
