import { useState, useEffect, Fragment } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronDown,
  Edit,
  EyeOff,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react";
import AddEditSpeciesModal from "./AddEditSpeciesModal";
import ApiSyncModal from "./ApiSyncModal";
import { useTheme } from "../../../hooks/useTheme";
import {
  fetchAdminSpeciesList,
  toggleSpeciesVisibility,
  deleteAdminSpecies,
  createAdminSpecies,
  updateAdminSpecies,
} from "../../../services/speciesApi";

/* Initial Mock Dataset matching user mockup */
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
      "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80",
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
  const [selectedRowId, setSelectedRowId] = useState("1"); // Auto-expand row 1
  const [checkedIds, setCheckedIds] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("info"); // "info" | "stats"

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConservation, setSelectedConservation] = useState("all");

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [isApiSyncOpen, setIsApiSyncOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Group tree open state
  const [isTreeGroupOpen, setIsTreeGroupOpen] = useState(true);

  // Load from Backend API on mount with fallback to MOCK
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
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80",
                  ],
          }));

          const existingIds = new Set(mapped.map((m) => m.id));
          const extraMock = MOCK_SPECIES.filter((m) => !existingIds.has(m.id));
          const combined = [...mapped, ...extraMock];

          setSpeciesList(combined);
          if (combined.length > 0) setSelectedRowId(combined[0].id);
        }
      } catch (err) {
        console.warn("Dùng dữ liệu mẫu do BE offline/chưa có dữ liệu:", err.message);
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
      // Edit mode
      try {
        await updateAdminSpecies(editingSpecies.id, form);
      } catch {
        // Local fallback
      }

      setSpeciesList((prev) =>
        prev.map((sp) =>
          sp.id === editingSpecies.id
            ? {
                ...sp,
                name: form.name,
                scientificName: form.scientificName,
                location: form.oceanZone,
                conservationCode: form.conservationStatus,
                description: form.description,
                images: form.images,
              }
            : sp
        )
      );
    } else {
      // Create mode
      try {
        await createAdminSpecies(form);
      } catch {
        // Local fallback
      }

      const newId = String(Date.now());
      const newSp = {
        id: newId,
        code: `SV${String(speciesList.length + 1).padStart(6, "0")}`,
        name: form.name || "Sinh vật mới",
        gbifId: "2431178",
        source: "GBIF",
        location: form.oceanZone || "Sunlight",
        conservation: "Sắp nguy cấp",
        conservationCode: form.conservationStatus || "VU",
        views: 0,
        status: "Hiển thị",
        is_visible: true,
        scientificName: form.scientificName || "Species sci",
        classification: "Động vật",
        size: "2 - 4 m",
        depth: `${form.depthMin || 0}-${form.depthMax || 100}m`,
        waterTemp: "22°C",
        geoZone: "Thái Bình Dương",
        diet: "Ăn cá nhỏ",
        lifespan: "15 năm",
        groupName: "Kẻ săn mồi",
        dateAdded: new Date().toLocaleDateString("vi-VN"),
        description: form.description || "Mô tả sinh vật...",
        images: form.images,
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
          <h1 className={`text-2xl md:text-3xl font-black font-heading tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}>
            Quản lý sinh vật
          </h1>
          <p className={`text-xs md:text-sm font-medium mt-1 ${
            isDark ? "text-pacific-blue-pale" : "text-slate-500"
          }`}>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan hover:brightness-110 text-white text-xs md:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus size={16} />
            <span>+ Thêm sinh vật mới</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID (LEFT SIDEBAR 300px + RIGHT TABLE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT FILTER SIDEBAR (4 COLS ~ 300px) ── */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1.5 custom-scrollbar sticky top-20">
          {/* Filter Card 1: Tìm kiếm */}
          <div className={`p-4 rounded-2xl border space-y-2 shadow-lg ${
            isDark ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Tìm kiếm
            </h3>
            <div className="relative">
              <Search size={14} className={`absolute left-3 top-3 ${isDark ? "text-white/40" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Theo mã, tên sinh vật..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none transition-all ${
                  isDark
                    ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                }`}
              />
            </div>
          </div>

          {/* Filter Card 2: Loại sinh vật */}
          <div className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
            isDark ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Loại sinh vật
            </h3>
            <div className="space-y-2 text-sm">
              {["Cá", "Động vật có vú", "Động vật không xương", "Bò sát", "Thực vật biển"].map(
                (cat, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-2.5 cursor-pointer transition-colors ${
                      isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={idx === 0}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/10 accent-cyan-400 cursor-pointer"
                    />
                    <span>{cat}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Filter Card 3: Nhóm sinh vật Tree Navigation */}
          <div className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
            isDark ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Nhóm sinh vật
            </h3>
            <div className="relative">
              <Search size={13} className={`absolute left-3 top-2.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Tìm nhóm..."
                className={`w-full pl-8 pr-3 py-1.5 border rounded-xl text-sm focus:outline-none ${
                  isDark
                    ? "bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-cyan-400"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
                }`}
              />
            </div>

            <div className="space-y-1 text-sm pt-1">
              <button
                onClick={() => setIsTreeGroupOpen(!isTreeGroupOpen)}
                className={`w-full flex items-center justify-between py-1 text-left font-bold cursor-pointer ${
                  isDark ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-600 hover:text-cyan-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  {isTreeGroupOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Vùng nước mở</span>
                </div>
              </button>

              {isTreeGroupOpen && (
                <div className={`pl-5 space-y-1.5 border-l ml-2 text-[11px] ${
                  isDark ? "border-cyan-500/30 text-white/70" : "border-cyan-300 text-slate-600"
                }`}>
                  <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Cá tầng giữa</p>
                  <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Cá tầng sâu</p>
                  <p className="hover:text-cyan-400 cursor-pointer transition-colors">• Động vật có vú biển</p>
                </div>
              )}

              <p className={`py-1 pl-1 font-semibold cursor-pointer transition-colors ${
                isDark ? "text-white/80 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-600"
              }`}>
                › Vùng đáy biển
              </p>
              <p className={`py-1 pl-1 font-semibold cursor-pointer transition-colors ${
                isDark ? "text-white/80 hover:text-cyan-300" : "text-slate-700 hover:text-cyan-600"
              }`}>
                › Rạn san hô
              </p>
            </div>
          </div>

          {/* Filter Card 4: Tình trạng bảo tồn */}
          <div className={`p-4 rounded-2xl border space-y-2.5 shadow-lg ${
            isDark ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Tình trạng bảo tồn
            </h3>
            <div className="space-y-1.5 text-sm">
              {[
                { code: "all", label: "Tất cả", color: "bg-white/40" },
                { code: "LC", label: "Ít lo ngại (LC)", color: "bg-emerald-400" },
                { code: "VU", label: "Sắp nguy cấp (VU)", color: "bg-amber-400" },
                { code: "EN", label: "Nguy cấp (EN)", color: "bg-orange-500" },
                { code: "CR", label: "Cực kỳ nguy cấp (CR)", color: "bg-rose-500" },
                { code: "DD", label: "Thiếu dữ liệu (DD)", color: "bg-slate-400" },
                { code: "NE", label: "Chưa đánh giá (NE)", color: "bg-gray-500" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setSelectedConservation(item.code)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-left ${
                    selectedConservation === item.code
                      ? isDark
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                        : "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200"
                      : isDark
                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── RIGHT DATA TABLE AREA (8 COLS ~ 75%) ── */}
        <main className="lg:col-span-8 xl:col-span-9 flex flex-col">
          {/* Main Table Container Card */}
          <div className={`border rounded-3xl overflow-hidden shadow-2xl w-full flex flex-col justify-between h-[calc(100vh-120px)] min-h-[620px] relative transition-colors duration-300 ${
            isDark ? "bg-[#142144]/90 backdrop-blur-xl border-white/15" : "bg-white border-slate-200 shadow-md"
          }`}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className={`absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs ${
                isDark ? "bg-[#142144]/60" : "bg-white/60"
              }`}>
                <Loader2 size={24} className="text-cyan-400 animate-spin" />
              </div>
            )}

            <div className="overflow-x-auto overflow-y-auto w-full flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm border-collapse table-fixed min-w-[850px]">
                {/* Table Header */}
                <thead>
                  <tr className={`font-bold border-b text-sm ${
                    isDark ? "bg-[#1e2f5c] text-white border-white/15" : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}>
                    <th className="p-3.5 w-10 text-center">
                      <button
                        onClick={handleToggleCheckAll}
                        className={`cursor-pointer ${isDark ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}
                      >
                        {checkedIds.length === filteredList.length && filteredList.length > 0 ? (
                          <CheckSquare size={14} className="text-cyan-400" />
                        ) : (
                          <Square size={14} />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5 w-[14%]">Mã sinh vật</th>
                    <th className="p-3.5 w-[20%]">Tên sinh vật</th>
                    <th className="p-3.5 w-[16%]">Mã định danh</th>
                    <th className="p-3.5 w-[11%]">Nguồn dữ liệu</th>
                    <th className="p-3.5 w-[10%]">Vị trí</th>
                    <th className="p-3.5 w-[12%]">Bảo tồn</th>
                    <th className="p-3.5 w-[9%]">Lượt xem</th>
                    <th className="p-3.5 w-[12%] text-right">Trạng thái</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className={`divide-y font-medium ${
                  isDark ? "divide-white/10 text-white/90" : "divide-slate-200 text-slate-800"
                }`}>
                  {filteredList.map((item) => {
                    const isExpanded = selectedRowId === item.id;
                    const isChecked = checkedIds.includes(item.id);

                    return (
                      <Fragment key={item.id}>
                        <tr
                          onClick={() => setSelectedRowId(isExpanded ? null : item.id)}
                          className={`transition-colors cursor-pointer ${
                            isExpanded
                              ? isDark
                                ? "bg-[#25396e] border-l-4 border-cyan-400 font-semibold"
                                : "bg-cyan-50/80 border-l-4 border-cyan-500 font-semibold text-slate-900"
                              : isDark
                              ? "hover:bg-white/5"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="p-3.5 text-center" onClick={(e) => handleToggleCheckRow(item.id, e)}>
                            {isChecked ? (
                              <CheckSquare size={14} className="text-cyan-400" />
                            ) : (
                              <Square size={14} className={isDark ? "text-white/40" : "text-slate-300"} />
                            )}
                          </td>
                          <td className={`p-3.5 font-mono font-bold truncate ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
                            {item.code}
                          </td>
                          <td className={`p-3.5 font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                            {item.name || "Cá mập trắng"}
                          </td>
                          <td className={`p-3.5 font-mono truncate ${isDark ? "text-white/60" : "text-slate-500"}`}>
                            {item.gbifId}
                          </td>
                          <td className="p-3.5 font-semibold truncate">{item.source}</td>
                          <td className="p-3.5 truncate">{item.location}</td>
                          <td className="p-3.5 truncate">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.conservationCode === "CR"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                  : item.conservationCode === "EN"
                                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              }`}
                            >
                              {item.conservation}
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono truncate ${isDark ? "text-white/70" : "text-slate-600"}`}>
                            {(item.views || 0).toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right truncate">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.is_visible
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>

                        {/* ── EXPANDED ROW DETAIL PANEL ── */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} className={`p-0 border-b-2 border-cyan-500/40 ${
                              isDark ? "bg-[#16254e]/95" : "bg-slate-100/90"
                            }`}>
                              <div className="p-5 space-y-4 animate-in fade-in duration-200">
                                {/* Detail Sub-Tabs */}
                                <div className={`flex border-b gap-4 text-sm font-bold ${
                                  isDark ? "border-white/10" : "border-slate-200"
                                }`}>
                                  <button
                                    onClick={() => setActiveDetailTab("info")}
                                    className={`pb-2 transition-all cursor-pointer ${
                                      activeDetailTab === "info"
                                        ? "text-cyan-400 border-b-2 border-cyan-400"
                                        : isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                  >
                                    Thông tin sinh vật
                                  </button>
                                  <button
                                    onClick={() => setActiveDetailTab("stats")}
                                    className={`pb-2 transition-all cursor-pointer ${
                                      activeDetailTab === "stats"
                                        ? "text-cyan-400 border-b-2 border-cyan-400"
                                        : isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                  >
                                    Thống kê hoạt động
                                  </button>
                                </div>

                                {activeDetailTab === "info" ? (
                                  /* EXPANDED PANEL CONTENT */
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                    {/* Left: Main Image + Thumbnails */}
                                    <div className="md:col-span-4 space-y-2.5">
                                      <div className={`w-full h-44 rounded-2xl overflow-hidden border ${
                                        isDark ? "border-white/15 bg-black/40" : "border-slate-200 bg-slate-200"
                                      }`}>
                                        <img
                                          src={
                                            selectedSpecies?.images?.[0] ||
                                            "https://images.unsplash.com/photo-1560275619-4662804300e8?auto=format&fit=crop&w=600&q=80"
                                          }
                                          alt={selectedSpecies?.name || "Species"}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>

                                      {/* Gallery Thumbnails */}
                                      <div className="grid grid-cols-4 gap-1.5">
                                        {(selectedSpecies?.images || []).map((img, idx) => (
                                          <div
                                            key={idx}
                                            className={`h-12 rounded-lg overflow-hidden border ${
                                              isDark ? "border-white/20 bg-black/40" : "border-slate-200 bg-slate-200"
                                            }`}
                                          >
                                            <img
                                              src={img}
                                              alt="Thumb"
                                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      <p className={`text-xs font-medium ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                        Nguồn dữ liệu: <strong className={isDark ? "text-white/80" : "text-slate-800"}>{selectedSpecies.source}</strong>
                                      </p>
                                    </div>

                                    {/* Middle: Biological Attributes List */}
                                    <div className={`md:col-span-4 space-y-1.5 text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>
                                      <p>
                                        Tên sinh vật:{" "}
                                        <strong className={isDark ? "text-white" : "text-slate-900"}>{selectedSpecies.name}</strong>
                                      </p>
                                      <p>
                                        Tên khoa học:{" "}
                                        <em className="text-cyan-500 font-serif font-bold">
                                          {selectedSpecies.scientificName}
                                        </em>
                                      </p>
                                      <p>Phân loại: {selectedSpecies.classification}</p>
                                      <p>Kích thước: {selectedSpecies.size}</p>
                                      <p>Độ sâu sống: {selectedSpecies.depth}</p>
                                      <p>Nhiệt độ nước: {selectedSpecies.waterTemp}</p>
                                      <p>Vùng địa lý: {selectedSpecies.geoZone}</p>
                                      <p>Chế độ ăn & tập tính: {selectedSpecies.diet}</p>
                                      <p>Tuổi thọ: {selectedSpecies.lifespan}</p>
                                    </div>

                                    {/* Right: Metadata + Action Buttons */}
                                    <div className="md:col-span-4 space-y-3">
                                      <div className={`text-sm space-y-1 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                                        <p>
                                          Bảo tồn:{" "}
                                          <span className="text-rose-500 font-bold">
                                            {selectedSpecies.conservation}
                                          </span>
                                        </p>
                                        <p>Nhóm sinh vật: {selectedSpecies.groupName}</p>
                                        <p>Trạng thái: {selectedSpecies.status}</p>
                                        <p>Ngày thêm: {selectedSpecies.dateAdded}</p>
                                      </div>

                                      {/* Description Box */}
                                      <div className={`p-3 rounded-xl border text-xs leading-relaxed max-h-24 overflow-y-auto ${
                                        isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-white border-slate-200 text-slate-700 shadow-xs"
                                      }`}>
                                        {selectedSpecies.description}
                                      </div>

                                      {/* Action Buttons Row */}
                                      <div className="flex items-center gap-2 pt-2">
                                        <button
                                          onClick={(e) => handleOpenEditModal(selectedSpecies, e)}
                                          className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                                        >
                                          <Edit size={14} />
                                          <span>Chỉnh sửa</span>
                                        </button>

                                        <button
                                          onClick={(e) =>
                                            handleToggleVisibility(selectedSpecies.id, e)
                                          }
                                          className={`py-2 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                                            isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                                          }`}
                                        >
                                          {selectedSpecies.is_visible ? (
                                            <>
                                              <EyeOff size={14} />
                                              <span>Ẩn</span>
                                            </>
                                          ) : (
                                            <>
                                              <Eye size={14} />
                                              <span>Hiện</span>
                                            </>
                                          )}
                                        </button>

                                        <button
                                          onClick={(e) => handleDelete(selectedSpecies.id, e)}
                                          className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                                        >
                                          <Trash2 size={14} />
                                          <span>Xóa</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Activity Stats Tab Placeholder */
                                  <div className={`p-6 text-center text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
                                    <p>Thống kê lượt xem và lịch sử cập nhật dữ liệu của sinh vật này.</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Total Count Footer Bar */}
            <div className={`px-6 py-3 border-t flex items-center justify-between text-sm mt-auto transition-colors duration-300 ${
              isDark ? "bg-[#1e2f5c] border-white/10 text-white/70" : "bg-slate-100 border-slate-200 text-slate-600"
            }`}>
              <div className="flex items-center gap-2">
                <button className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                }`}>
                  &lt;&lt;
                </button>
                <button className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                }`}>
                  &lt;
                </button>
                <span className="px-3 py-1 rounded bg-cyan-500 text-white font-bold shadow-sm">1</span>
                <span className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-200 text-slate-600"
                }`}>
                  2
                </span>
                <span className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-200 text-slate-600"
                }`}>
                  3
                </span>
                <button className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                }`}>
                  &gt;
                </button>
                <button className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                  isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-white hover:bg-slate-200 border border-slate-200 text-slate-700"
                }`}>
                  &gt;&gt;
                </button>
              </div>

              <div>
                <span className="font-mono text-cyan-500 font-bold">
                  {filteredList.length}/{speciesList.length}
                </span>{" "}
                sinh vật
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL 1: ADD / EDIT SPECIES ── */}
      <AddEditSpeciesModal
        key={editingSpecies?.id || (isAddEditOpen ? "open-add" : "closed")}
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveSpeciesModal}
        editingSpecies={editingSpecies}
      />

      {/* ── MODAL 2: API SYNC ── */}
      <ApiSyncModal
        isOpen={isApiSyncOpen}
        onClose={() => setIsApiSyncOpen(false)}
        onSyncAll={() => console.log("Done syncing all")}
      />
    </div>
  );
}
