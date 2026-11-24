import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  ExternalLink,
  Target,
  ShieldAlert,
  Handshake,
  Home,
  ArrowUp,
  ChevronDown,
  Check,
  Compass,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { fetchKnowledgeGraph } from "../../services/ecosystemApi";
import { useLanguage } from "../../hooks/useLanguage";

// Bậc Dinh Dưỡng Chuẩn Sinh Học Biển (Sắp xếp theo thứ tự số học tự nhiên từ 1 đến 5)
const TROPHIC_TIERS = [
  { id: 0, labelVi: "Tất cả bậc dinh dưỡng", labelEn: "All Trophic Tiers" },
  { id: 1, labelVi: "Bậc 1: Sản xuất sơ cấp & Sinh cảnh", labelEn: "Tier 1: Producers & Habitat", color: "#10b981" },
  { id: 2, labelVi: "Bậc 2: Ăn thực vật / Tiêu thụ sơ cấp", labelEn: "Tier 2: Primary Consumers", color: "#84cc16" },
  { id: 3, labelVi: "Bậc 3: Tiêu thụ bậc 2 (Secondary)", labelEn: "Tier 3: Secondary Consumers", color: "#eab308" },
  { id: 4, labelVi: "Bậc 4: Tiêu thụ bậc 3 (Tertiary)", labelEn: "Tier 4: Tertiary Consumers", color: "#f97316" },
  { id: 5, labelVi: "Bậc 5: Săn mồi đỉnh bảng (Apex)", labelEn: "Tier 5: Apex Predators", color: "#ef4444" },
];

// Khu bảo tồn biển Biển Đông
const EAST_SEA_ZONES = [
  { id: "", labelVi: "Toàn bộ Biển Đông", labelEn: "Entire East Sea" },
  { id: "Nha Trang", labelVi: "Vịnh Nha Trang", labelEn: "Nha Trang Bay MPA" },
  { id: "Côn Đảo", labelVi: "Vườn Quốc gia Côn Đảo", labelEn: "Con Dao National Park" },
  { id: "Trường Sa", labelVi: "Quần đảo Hoàng Sa - Trường Sa", labelEn: "Paracel & Spratly Archipelago" },
  { id: "Phú Quốc", labelVi: "Khu bảo tồn biển Phú Quốc", labelEn: "Phu Quoc Marine Reserve" },
];

// Component Custom Dropdown chuẩn Unslop (Thay thế hoàn toàn thẻ select mặc định của trình duyệt)
function CustomDropdown({ value, onChange, options, isEn }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0d2238] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-left text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
      >
        <span className="truncate">{isEn ? selectedOption.labelEn : selectedOption.labelVi}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#0a1a2c] border border-white/15 rounded-xl py-1 shadow-xl max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? "bg-sky-500/15 text-sky-300 font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="truncate">{isEn ? opt.labelEn : opt.labelVi}</span>
                {isSelected && <Check size={12} className="text-sky-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function KnowledgeGraph() {
  const { language } = useLanguage();
  const isEn = language === "en";

  // States dữ liệu & Bộ lọc
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTier, setSelectedTier] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Loài tâm điểm được chọn hiện tại
  const [focalSpeciesId, setFocalSpeciesId] = useState(null);

  // Tải dữ liệu đồ thị tri thức
  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const params = { limit: 5000 };
        if (selectedZone) params.zone = selectedZone;

        const res = await fetchKnowledgeGraph(params);
        if (!ignore && res) {
          setGraphData(res);
          if (res.nodes && res.nodes.length > 0) {
            setFocalSpeciesId(res.nodes[0].id.toString());
          }
        }
        if (!ignore) setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sinh thái:", err);
        if (!ignore) setLoading(false);
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, [selectedZone]);

  // Phân tích Bậc dinh dưỡng (Trophic Level) cho từng loài
  const enrichedNodesMap = useMemo(() => {
    const { nodes = [], links = [] } = graphData;
    const foodOf = new Map();
    const eatenBy = new Map();

    for (const n of nodes) {
      foodOf.set(n.id.toString(), new Set());
      eatenBy.set(n.id.toString(), new Set());
    }

    for (const l of links) {
      const src = l.source.toString();
      const tgt = l.target.toString();
      if (l.type === "predator_prey" || l.type === "herbivory") {
        if (foodOf.has(src)) foodOf.get(src).add(tgt);
        if (eatenBy.has(tgt)) eatenBy.get(tgt).add(src);
      }
    }

    const trophicMap = new Map();

    for (const node of nodes) {
      const gId = Number(node.groupId || 1);
      const name = (node.name || "").toLowerCase();

      let baseTrophic = 3.0;
      if (gId === 5) {
        baseTrophic = 1.0;
      } else if (gId === 4) {
        if (name.includes("hải sâm") || name.includes("nghêu") || name.includes("sò") || name.includes("tai tượng")) {
          baseTrophic = 1.8;
        } else if (name.includes("mực") || name.includes("bạch tuộc") || name.includes("cua")) {
          baseTrophic = 3.2;
        } else {
          baseTrophic = 2.2;
        }
      } else if (gId === 3) {
        if (name.includes("rùa xanh") || name.includes("vích")) baseTrophic = 2.0;
        else if (name.includes("rắn biển")) baseTrophic = 4.0;
        else baseTrophic = 3.2;
      } else if (gId === 2) {
        if (name.includes("bò biển") || name.includes("dugong")) baseTrophic = 2.0;
        else if (name.includes("sát thủ") || name.includes("hổ kình")) baseTrophic = 5.0;
        else baseTrophic = 4.2;
      } else if (gId === 6) {
        baseTrophic = 3.6;
      } else {
        if (name.includes("mập") || name.includes("nhám")) baseTrophic = 5.0;
        else if (name.includes("ngừ") || name.includes("cờ") || name.includes("thu") || name.includes("mú")) baseTrophic = 4.2;
        else if (name.includes("bướm") || name.includes("vẹt") || name.includes("hề")) baseTrophic = 2.6;
        else baseTrophic = 3.4;
      }

      trophicMap.set(node.id.toString(), baseTrophic);
    }

    for (let i = 0; i < 3; i++) {
      for (const node of nodes) {
        if (node.groupId === 5) continue;
        const nId = node.id.toString();
        const preys = Array.from(foodOf.get(nId) || []);
        if (preys.length > 0) {
          const preyLevels = preys.map((pId) => trophicMap.get(pId) || 2.0);
          const avgPrey = preyLevels.reduce((a, b) => a + b, 0) / preyLevels.length;
          const calculated = Math.min(5.0, Math.max(2.0, avgPrey + 1.0));
          trophicMap.set(nId, (trophicMap.get(nId) + calculated) / 2);
        }
      }
    }

    const map = new Map();
    for (const node of nodes) {
      const nId = node.id.toString();
      const rawTL = trophicMap.get(nId) || 3.0;

      let tier = 3;
      if (rawTL >= 4.4) tier = 5;
      else if (rawTL >= 3.6) tier = 4;
      else if (rawTL >= 2.5) tier = 3;
      else if (rawTL >= 1.7) tier = 2;
      else tier = 1;

      map.set(nId, {
        ...node,
        trophicLevel: Number(rawTL.toFixed(1)),
        trophicTier: tier,
      });
    }

    return map;
  }, [graphData]);

  // Danh sách loài sau khi lọc ở Cột 1
  const filteredSpeciesList = useMemo(() => {
    const list = Array.from(enrichedNodesMap.values());
    return list.filter((sp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (sp.name || "").toLowerCase().includes(q);
        const matchSci = (sp.scientificName || "").toLowerCase().includes(q);
        const matchZone = (sp.eastSeaZone || "").toLowerCase().includes(q);
        if (!matchName && !matchSci && !matchZone) return false;
      }
      if (selectedTier > 0 && sp.trophicTier !== selectedTier) {
        return false;
      }
      return true;
    });
  }, [enrichedNodesMap, searchQuery, selectedTier]);

  // Thông tin loài tâm điểm hiện tại
  const focalSpecies = useMemo(() => {
    if (!focalSpeciesId) return null;
    return enrichedNodesMap.get(focalSpeciesId.toString()) || null;
  }, [enrichedNodesMap, focalSpeciesId]);

  // Mối quan hệ xoay quanh Loài tâm điểm
  const focalRelationships = useMemo(() => {
    if (!focalSpecies) return { preys: [], predators: [], symbionts: [], habitats: [] };

    const fId = focalSpecies.id.toString();
    const preys = [];
    const predators = [];
    const symbionts = [];
    const habitats = [];

    for (const link of graphData.links) {
      const isSrc = link.source.toString() === fId;
      const isTgt = link.target.toString() === fId;

      if (!isSrc && !isTgt) continue;

      const otherId = isSrc ? link.target.toString() : link.source.toString();
      const otherSpecies = enrichedNodesMap.get(otherId);
      if (!otherSpecies) continue;

      const item = {
        species: otherSpecies,
        link,
        direction: isSrc ? "outgoing" : "incoming",
      };

      if (link.type === "predator_prey" || link.type === "herbivory") {
        if (isSrc) preys.push(item);
        else predators.push(item);
      } else if (link.type === "symbiosis" || link.type === "commensalism") {
        symbionts.push(item);
      } else if (link.type === "habitat_provider") {
        habitats.push(item);
      }
    }

    return { preys, predators, symbionts, habitats };
  }, [focalSpecies, graphData.links, enrichedNodesMap]);

  const handleSelectFocal = useCallback((id) => {
    setFocalSpeciesId(id.toString());
  }, []);

  return (
    <div className="min-h-screen bg-[#07192f] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 pt-28 pb-16 max-w-7xl mx-auto w-full">
        {/* ─── 1. HEADER SECTION CHUẨN UNSLOP (KHÔNG CHỮ DƯ THỪA, KHÔNG HUY HIỆU RỐI) ─── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isEn ? "Food Chain & Trophic Flow" : "Chuỗi thức ăn & Dòng năng lượng"}
          </h1>

          {/* Số liệu thống kê tối giản dạng inline */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>
              <strong className="text-white font-mono">{graphData.nodes?.length || 0}</strong> {isEn ? "species" : "loài"}
            </span>
            <span className="text-white/20">•</span>
            <span>
              <strong className="text-white font-mono">{graphData.links?.length || 0}</strong> {isEn ? "links" : "liên kết"}
            </span>
            <span className="text-white/20">•</span>
            <span>
              <strong className="text-rose-400 font-mono">
                {graphData.nodes?.filter((n) => ["CR", "EN", "VU"].includes(n.redList)).length || 0}
              </strong>{" "}
              {isEn ? "threatened" : "nguy cấp"}
            </span>
          </div>
        </div>

        {/* ─── 2. BỐ CỤC DASHBOARD 3 CỘT (3-COLUMN SCALE-FREE ARCHITECTURE) ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ═════ CỘT 1: BỘ LỌC & DANH SÁCH LOÀI (3/12 COLS) ═════ */}
          <div className="lg:col-span-3 rounded-2xl bg-[#0b2038] border border-white/10 p-4 flex flex-col h-[720px]">
            <div className="mb-3 space-y-2">
              <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>{isEn ? "Species catalog" : "Danh mục loài"}</span>
                <span className="text-slate-300 font-mono text-xs">{filteredSpeciesList.length}</span>
              </div>

              {/* Ô tìm kiếm */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search species..." : "Tìm kiếm loài..."}
                  className="w-full bg-[#0d2238] border border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Custom Dropdown: Khu bảo tồn biển */}
              <CustomDropdown
                value={selectedZone}
                onChange={setSelectedZone}
                options={EAST_SEA_ZONES}
                isEn={isEn}
              />

              {/* Custom Dropdown: Bậc dinh dưỡng */}
              <CustomDropdown
                value={selectedTier}
                onChange={setSelectedTier}
                options={TROPHIC_TIERS}
                isEn={isEn}
              />
            </div>

            {/* Danh sách loài cuộn êm ái */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
              {loading && (
                <div className="text-center py-10 text-xs text-slate-400">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>{isEn ? "Loading species..." : "Đang tải danh sách..."}</span>
                </div>
              )}

              {!loading && filteredSpeciesList.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-400">
                  <p className="mb-2">{isEn ? "No species found" : "Không tìm thấy loài phù hợp"}</p>
                  <button
                    onClick={() => {
                      setSelectedZone("");
                      setSelectedTier(0);
                      setSearchQuery("");
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    {isEn ? "Reset filters" : "Đặt lại bộ lọc"}
                  </button>
                </div>
              )}

              {!loading &&
                filteredSpeciesList.map((sp) => {
                  const isSelected = focalSpeciesId === sp.id.toString();
                  const tierColor =
                    sp.trophicTier === 5
                      ? "#ef4444"
                      : sp.trophicTier === 4
                      ? "#f97316"
                      : sp.trophicTier === 3
                      ? "#eab308"
                      : sp.trophicTier === 2
                      ? "#84cc16"
                      : "#10b981";

                  return (
                    <div
                      key={sp.id}
                      onClick={() => handleSelectFocal(sp.id)}
                      className={`p-2 rounded-xl transition-colors flex items-center justify-between gap-2.5 cursor-pointer border ${
                        isSelected
                          ? "bg-sky-950/60 border-sky-400/50 text-white"
                          : "bg-[#0d2238]/60 hover:bg-[#0d2238] border-white/5 text-slate-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                          {sp.image ? (
                            <img
                              src={sp.image}
                              alt={sp.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-500">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate leading-tight">{sp.name}</div>
                          <div className="text-[11px] text-slate-400 italic truncate font-serif">
                            {sp.scientificName}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-0.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            backgroundColor: `${tierColor}15`,
                            color: tierColor,
                            border: `1px solid ${tierColor}30`,
                          }}
                        >
                          Bậc {sp.trophicTier}
                        </span>
                        {["CR", "EN", "VU"].includes(sp.redList) && (
                          <span className="text-[10px] text-rose-400 font-mono">{sp.redList}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ═════ CỘT 2: SƠ ĐỒ DÒNG CHẢY SINH THÁI 3 TẦNG (6/12 COLS) ═════ */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0b2038] border border-white/10 p-5 flex flex-col h-[720px] overflow-y-auto custom-scrollbar">
            {!focalSpecies ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Compass size={28} className="text-slate-500" />
                <p className="text-xs">{isEn ? "Select a species to inspect its food chain" : "Chọn một loài từ danh mục bên trái để bắt đầu phân tích"}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* ─── TẦNG ĐỈNH: THIÊN ĐỊCH & KẺ SĂN MỒI (BẬC CAO HƠN) ─── */}
                <div className="p-3 rounded-xl bg-[#0d2238] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert size={13} className="text-rose-400" />
                      <span>{isEn ? "Predators & higher consumers" : "Thiên địch & kẻ săn mồi"} ({focalRelationships.predators.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isEn ? "Higher trophic tier" : "Bậc tiêu thụ cao hơn"}
                    </span>
                  </div>

                  {focalRelationships.predators.length === 0 ? (
                    <div className="py-2.5 px-3 rounded-lg bg-black/20 text-xs text-slate-400 italic text-center">
                      {focalSpecies.trophicTier === 5
                        ? isEn
                          ? "Apex predator (top-down regulator, no natural predators in ecosystem)"
                          : "Động vật săn mồi đỉnh bảng (Apex predator, không có thiên địch tự nhiên)"
                        : isEn
                          ? "No recorded predators in the current zone"
                          : "Chưa ghi nhận thiên địch săn bắt loài này trong phân hệ hiện tại"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {focalRelationships.predators.map(({ species, link }) => (
                        <div
                          key={species.id}
                          onClick={() => handleSelectFocal(species.id)}
                          className="p-2 rounded-lg bg-[#112a44] hover:bg-[#163657] border border-rose-500/20 hover:border-rose-400/40 transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-800 shrink-0">
                              {species.image ? (
                                <img src={species.image} alt={species.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px]">IMG</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white group-hover:text-rose-300 truncate">
                                {species.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {link.description || "Thiên địch"}
                              </div>
                            </div>
                          </div>
                          <span className="text-rose-400 text-xs font-medium shrink-0">Bậc {species.trophicTier}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── DÒNG CHUYỂN TIẾP LÊN ĐỈNH THÁP ─── */}
                <div className="flex items-center justify-center gap-1.5 py-0.5 text-xs text-slate-400">
                  <ArrowUp size={13} className="text-slate-400" />
                  <span>{isEn ? "Energy transferred to higher consumers" : "Năng lượng chuyển tiếp lên bậc cao hơn"}</span>
                </div>

                {/* ─── TẦNG TÂM ĐIỂM: LOÀI ĐANG CHỌN ─── */}
                <div className="p-4 rounded-xl bg-[#0e2744] border border-sky-400/30">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-sky-400/30 shrink-0">
                      {focalSpecies.image ? (
                        <img src={focalSpecies.image} alt={focalSpecies.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">NO IMG</div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <h3 className="text-base font-bold text-white leading-snug">
                        {focalSpecies.name}
                      </h3>
                      <p className="text-xs text-slate-400 italic font-serif mb-2">
                        {focalSpecies.scientificName}
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs">
                        <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/25">
                          Bậc dinh dưỡng {focalSpecies.trophicTier} (TL {focalSpecies.trophicLevel})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {focalSpecies.eastSeaZone || "Biển Đông"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
                          Sách Đỏ: {focalSpecies.redList || "LC"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── DÒNG CHUYỂN TIẾP TỪ CHÂN ĐẾ LÊN ─── */}
                <div className="flex items-center justify-center gap-1.5 py-0.5 text-xs text-slate-400">
                  <ArrowUp size={13} className="text-slate-400" />
                  <span>{isEn ? "Energy absorbed from food base" : "Năng lượng hấp thu từ nguồn thức ăn bên dưới"}</span>
                </div>

                {/* ─── TẦNG CHÂN ĐẾ: NGUỒN DINH DƯỠNG & CON MỒI ─── */}
                <div className="p-3 rounded-xl bg-[#0d2238] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Target size={13} className="text-emerald-400" />
                      <span>{isEn ? "Prey & energy sources" : "Nguồn thức ăn & con mồi"} ({focalRelationships.preys.length})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isEn ? "Direct inputs" : "Nguồn cấp trực tiếp"}
                    </span>
                  </div>

                  {focalRelationships.preys.length === 0 ? (
                    <div className="py-2.5 px-3 rounded-lg bg-black/20 text-xs text-slate-400 italic text-center">
                      {focalSpecies.groupId === 5
                        ? isEn
                          ? "Primary producer (fixes sunlight and nutrients, does not prey on fauna)"
                          : "Loài sản xuất sơ cấp (quang hợp và hấp thụ dinh dưỡng hòa tan, không săn mồi)"
                        : isEn
                          ? "No recorded prey within the selected zone"
                          : "Chưa ghi nhận liên kết con mồi trong phạm vi phân hệ này"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {focalRelationships.preys.map(({ species, link }) => (
                        <div
                          key={species.id}
                          onClick={() => handleSelectFocal(species.id)}
                          className="p-2 rounded-lg bg-[#112a44] hover:bg-[#163657] border border-emerald-500/20 hover:border-emerald-400/40 transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-800 shrink-0">
                              {species.image ? (
                                <img src={species.image} alt={species.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px]">IMG</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white group-hover:text-emerald-300 truncate">
                                {species.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {link.description || "Con mồi"}
                              </div>
                            </div>
                          </div>
                          <span className="text-emerald-400 text-xs font-medium shrink-0">Bậc {species.trophicTier}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── PHẦN MỞ RỘNG: QUAN HỆ TƯƠNG HỖ & SINH CẢNH ─── */}
                {(focalRelationships.symbionts.length > 0 || focalRelationships.habitats.length > 0) && (
                  <div className="p-3 rounded-xl bg-[#091a2e] border border-white/10">
                    <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                      <Handshake size={13} className="text-sky-400" />
                      <span>{isEn ? "Mutualism & biogenic habitats" : "Quan hệ tương hỗ & sinh cảnh"}</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {focalRelationships.symbionts.map(({ species, link }) => (
                        <div
                          key={species.id}
                          onClick={() => handleSelectFocal(species.id)}
                          className="p-2 rounded-lg bg-[#0e243d] hover:bg-[#143254] border border-sky-500/20 transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Handshake size={13} className="text-sky-400 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white truncate">{species.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{link.label || "Cộng sinh"}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {focalRelationships.habitats.map(({ species, link }) => (
                        <div
                          key={species.id}
                          onClick={() => handleSelectFocal(species.id)}
                          className="p-2 rounded-lg bg-[#0e243d] hover:bg-[#143254] border border-emerald-500/20 transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Home size={13} className="text-emerald-400 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-white truncate">{species.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{link.label || "Nơi ở"}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═════ CỘT 3: HỒ SƠ SINH THÁI HỌC & ĐÁNH GIÁ RỦI RO (3/12 COLS) ═════ */}
          <div className="lg:col-span-3 rounded-2xl bg-[#0b2038] border border-white/10 p-4 flex flex-col justify-between h-[720px] overflow-y-auto custom-scrollbar">
            {!focalSpecies ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Compass size={28} className="text-slate-500" />
                <p className="text-xs">{isEn ? "Select a species to view profile" : "Chọn loài để xem hồ sơ chi tiết"}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2.5">
                    {isEn ? "Ecological profile" : "Hồ sơ sinh học"}
                  </div>

                  {/* Ảnh và thông số nhận dạng */}
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-800 border border-white/10 mb-3">
                    {focalSpecies.image ? (
                      <img src={focalSpecies.image} alt={focalSpecies.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">NO IMAGE</div>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-tight mb-0.5">{focalSpecies.name}</h4>
                  <p className="text-xs text-slate-400 italic font-serif mb-3">{focalSpecies.scientificName}</p>

                  {/* Bảng thông số */}
                  <div className="space-y-1.5 text-xs bg-[#0d2238] p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isEn ? "Trophic level:" : "Bậc dinh dưỡng:"}</span>
                      <span className="font-medium text-sky-300">Bậc {focalSpecies.trophicTier} ({focalSpecies.trophicLevel})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isEn ? "Depth range:" : "Độ sâu sinh sống:"}</span>
                      <span className="font-mono text-white">{focalSpecies.depthMin || 0}m - {focalSpecies.depthMax || 50}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isEn ? "Red list:" : "Sách Đỏ:"}</span>
                      <span className="font-medium text-rose-400">{focalSpecies.redList || "LC"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isEn ? "Distribution:" : "Phân bố:"}</span>
                      <span className="text-slate-200 text-right truncate max-w-[130px]">{focalSpecies.eastSeaZone || "Biển Đông"}</span>
                    </div>
                  </div>
                </div>

                {/* Đánh giá rủi ro sinh thái thực tế */}
                <div className="p-3 rounded-xl bg-[#0d2238] border border-white/10 text-xs">
                  <div className="text-slate-300 font-medium mb-1">
                    {isEn ? "Trophic impact assessment" : "Đánh giá rủi ro sinh thái"}
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {focalSpecies.trophicTier === 5
                      ? "Là loài săn mồi đỉnh bảng kiểm soát cấu trúc quần xã từ trên xuống. Sự suy giảm của loài có thể khiến các loài ăn thịt cỡ trung bùng nổ mất kiểm soát (Mesopredator Release), gián tiếp làm cạn kiệt cá nhỏ và động vật ăn cỏ."
                      : focalSpecies.groupId === 5
                      ? "Là loài sinh cảnh nền tảng của hệ sinh thái. Sự suy giảm của loài sẽ trực tiếp phá hủy bãi đẻ và nơi ẩn náu của cá rạn con, làm lung lay chân đế của toàn bộ tháp dinh dưỡng."
                      : focalRelationships.predators.length === 0
                      ? "Loài bảo tồn biểu tượng (Umbrella species), giữ vai trò gặm tỉa duy trì độ thông thoáng và sức tái sinh của thảm cỏ biển. Sự suy giảm của loài sẽ dẫn đến bồi lắng già cỗi bãi cỏ, làm mất bãi đẻ của tôm cá con."
                      : `Loài này là mắt xích chuyển hóa năng lượng trung gian cho ${focalRelationships.predators.length} loài thiên địch phía trên. Sự suy giảm của nó sẽ gây thiếu hụt nguồn thức ăn trực tiếp.`}
                  </p>
                </div>

                {/* Nút điều hướng hồ sơ sinh vật đầy đủ */}
                <div className="pt-1">
                  <Link
                    to={`/species/${focalSpecies.slug || focalSpecies.id}`}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{isEn ? "View biological profile" : "Xem hồ sơ sinh học"}</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
