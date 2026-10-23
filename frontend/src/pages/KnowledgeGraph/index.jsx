import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import * as echarts from "echarts";
import {
  Network,
  Search,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Sparkles,
  Compass,
  Target,
  ShieldAlert,
  Handshake,
  Home,
  Sprout,
  Zap,
  Layers,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { fetchKnowledgeGraph } from "../../services/ecosystemApi";
import { useLanguage } from "../../hooks/useLanguage";

// Bảng màu & danh mục quan hệ sinh thái chuẩn học thuật
const RELATION_TYPES = {
  all: { labelVi: "Tất cả mối liên kết", labelEn: "All Ecological Links", color: "#38bdf8" },
  predator_prey: { labelVi: "Vật dữ - Con mồi", labelEn: "Predator - Prey", color: "#ef4444", Icon: Target },
  herbivory: { labelVi: "Ăn thực vật / Tiêu thụ sơ cấp", labelEn: "Herbivory / Consumer", color: "#84cc16", Icon: Sprout },
  symbiosis: { labelVi: "Cộng sinh tương hỗ", labelEn: "Symbiosis / Mutualism", color: "#38bdf8", Icon: Handshake },
  commensalism: { labelVi: "Hội sinh", labelEn: "Commensalism", color: "#06b6d4", Icon: Layers },
  habitat_provider: { labelVi: "Kiến tạo nơi ở / Sinh cảnh", labelEn: "Biogenic Habitat", color: "#10b981", Icon: Home },
  competitor: { labelVi: "Cạnh tranh sinh thái", labelEn: "Niche Competition", color: "#f97316", Icon: Zap },
};

// 8 Khu bảo tồn biển (MPAs) đặc thù Biển Đông
const EAST_SEA_ZONES = [
  { id: "", labelVi: "Tất cả vùng biển", labelEn: "All Marine Protected Areas" },
  { id: "Hoàng Sa - Trường Sa", labelVi: "Quần đảo Hoàng Sa - Trường Sa", labelEn: "Paracel & Spratly Archipelago" },
  { id: "Côn Đảo", labelVi: "Vườn Quốc gia Côn Đảo", labelEn: "Con Dao National Park" },
  { id: "Nha Trang", labelVi: "Khu bảo tồn biển Vịnh Nha Trang", labelEn: "Nha Trang Bay MPA" },
  { id: "Phú Quốc", labelVi: "Khu bảo tồn biển Phú Quốc", labelEn: "Phu Quoc Marine Reserve" },
  { id: "Cù Lao Chàm", labelVi: "Khu bảo tồn Cù Lao Chàm", labelEn: "Cu Lao Cham MPA" },
  { id: "Cần Giờ", labelVi: "Khu dự trữ sinh quyển Cần Giờ", labelEn: "Can Gio Biosphere Reserve" },
  { id: "Bạch Long Vĩ", labelVi: "Đảo Bạch Long Vĩ (Vịnh Bắc Bộ)", labelEn: "Bach Long Vi Island" },
];

// Phân hạng Sách Đỏ Việt Nam & IUCN
const RED_LIST_OPTIONS = [
  { id: "", labelVi: "Tất cả bậc đe dọa", labelEn: "All Red List Categories" },
  { id: "CR", labelVi: "CR - Cực kỳ nguy cấp (Critically Endangered)", labelEn: "CR - Critically Endangered", color: "#f43f5e" },
  { id: "EN", labelVi: "EN - Nguy cấp (Endangered)", labelEn: "EN - Endangered", color: "#f97316" },
  { id: "VU", labelVi: "VU - Sắp nguy cấp (Vulnerable)", labelEn: "VU - Vulnerable", color: "#f59e0b" },
  { id: "NT", labelVi: "NT - Gần bị đe dọa (Near Threatened)", labelEn: "NT - Near Threatened", color: "#eab308" },
  { id: "LC", labelVi: "LC - Ít quan tâm (Least Concern)", labelEn: "LC - Least Concern", color: "#10b981" },
];

// Phân loại học thuật (Taxonomic Groups)
const TAXONOMIC_GROUPS = [
  { id: 1, nameVi: "Cá biển (Teleostei & Chondrichthyes)", nameEn: "Marine Fishes", color: "#38bdf8" },
  { id: 2, nameVi: "Thú biển (Cetacea & Sirenia)", nameEn: "Marine Mammals", color: "#a855f7" },
  { id: 3, nameVi: "Bò sát biển (Chelonioidea)", nameEn: "Marine Reptiles", color: "#f59e0b" },
  { id: 4, nameVi: "Thân mềm & Giáp xác (Mollusca & Crustacea)", nameEn: "Mollusks & Crustaceans", color: "#ec4899" },
  { id: 5, nameVi: "San hô & Thực vật (Anthozoa & Seagrass)", nameEn: "Corals & Marine Plants", color: "#10b981" },
  { id: 6, nameVi: "Sinh vật biển sâu (Deep Sea Fauna)", nameEn: "Deep Sea Organisms", color: "#6366f1" },
];

const GROUP_COLOR_MAP = {
  1: "#38bdf8",
  2: "#a855f7",
  3: "#f59e0b",
  4: "#ec4899",
  5: "#10b981",
  6: "#6366f1",
};

export default function KnowledgeGraph() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // States bộ lọc
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRedList, setSelectedRedList] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // States dữ liệu & UI
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tải dữ liệu đồ thị tri thức theo bộ lọc API
  useEffect(() => {
    let ignore = false;

    const fetchGraph = async () => {
      try {
        const params = {};
        if (selectedZone) params.zone = selectedZone;
        if (selectedRedList) params.redList = selectedRedList;
        if (selectedType && selectedType !== "all") params.type = selectedType;

        const res = await fetchKnowledgeGraph(params);
        if (!ignore) {
          if (res) {
            setGraphData(res);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load knowledge graph:", err);
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchGraph();
    return () => {
      ignore = true;
    };
  }, [selectedZone, selectedRedList, selectedType]);

  // Bộ lọc tìm kiếm tên loài thời gian thực
  const filteredGraph = useMemo(() => {
    if (!searchQuery.trim()) return graphData;
    const q = searchQuery.toLowerCase().trim();

    const matchedNodes = graphData.nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        (n.scientificName && n.scientificName.toLowerCase().includes(q)) ||
        (n.eastSeaZone && n.eastSeaZone.toLowerCase().includes(q)) ||
        (n.code && n.code.toLowerCase().includes(q))
    );

    const matchedNodeIds = new Set(matchedNodes.map((n) => n.id));

    const matchedLinks = graphData.links.filter(
      (l) => matchedNodeIds.has(l.source) && matchedNodeIds.has(l.target)
    );

    return {
      nodes: matchedNodes,
      links: matchedLinks,
    };
  }, [graphData, searchQuery]);

  // Thống kê số lượng phục vụ phân tích
  const stats = useMemo(() => {
    const threatenedCount = graphData.nodes.filter((n) =>
      ["CR", "EN", "VU"].includes(n.redList)
    ).length;

    return {
      totalSpecies: graphData.nodes.length,
      totalLinks: graphData.links.length,
      threatenedCount,
    };
  }, [graphData]);

  // Trích xuất các liên kết liên quan tới Node đang được chọn trong Drawer
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return { prey: [], predators: [], symbionts: [], habitats: [], others: [] };

    const nodeId = selectedNode.id.toString();
    const prey = [];
    const predators = [];
    const symbionts = [];
    const habitats = [];
    const others = [];

    for (const link of graphData.links) {
      const isSrc = link.source === nodeId;
      const isTgt = link.target === nodeId;

      if (!isSrc && !isTgt) continue;

      const otherId = isSrc ? link.target : link.source;
      const otherNode = graphData.nodes.find((n) => n.id === otherId);
      if (!otherNode) continue;

      const connectionInfo = {
        node: otherNode,
        link,
        direction: isSrc ? "outgoing" : "incoming",
      };

      if (link.type === "predator_prey" || link.type === "herbivory") {
        if (isSrc) prey.push(connectionInfo);
        else predators.push(connectionInfo);
      } else if (link.type === "symbiosis" || link.type === "commensalism") {
        symbionts.push(connectionInfo);
      } else if (link.type === "habitat_provider") {
        habitats.push(connectionInfo);
      } else {
        others.push(connectionInfo);
      }
    }

    return { prey, predators, symbionts, habitats, others };
  }, [selectedNode, graphData]);

  // Khởi tạo và đồng bộ hóa đồ thị tương tác ECharts
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, "dark");

      chartInstance.current.on("click", (params) => {
        if (params.dataType === "node") {
          setSelectedNode(params.data.raw);
        }
      });
    }

    const { nodes = [], links = [] } = filteredGraph;

    const categories = TAXONOMIC_GROUPS.map((g) => ({
      name: isEn ? g.nameEn : g.nameVi,
    }));

    const chartNodes = nodes.map((node) => {
      const isCR = node.redList === "CR";
      const isEN = node.redList === "EN";
      const isVU = node.redList === "VU";

      const borderColor = isCR
        ? "#f43f5e"
        : isEN
        ? "#f97316"
        : isVU
        ? "#f59e0b"
        : GROUP_COLOR_MAP[node.groupId] || "#38bdf8";

      // Rút gọn tên hiển thị trực tiếp trên nút để tránh tràn chữ và che khuất liên kết
      const displayName = (node.name || "").split("(")[0].trim();

      return {
        id: node.id,
        name: displayName,
        value: node.scientificName,
        category: Math.min(categories.length - 1, Math.max(0, (node.groupId || 1) - 1)),
        // Hiển thị ảnh đại diện cho từng sinh vật biển
        symbol: node.image ? `image://${node.image}` : "circle",
        symbolSize: isCR ? 50 : isEN ? 46 : 40,
        itemStyle: {
          borderColor,
          borderWidth: isCR ? 3.5 : isEN ? 2.5 : 2,
          shadowBlur: isCR ? 18 : 10,
          shadowColor: borderColor,
        },
        label: {
          show: true,
          position: "bottom",
          distance: 9,
          color: "#f1f5f9",
          fontSize: 12,
          fontWeight: "600",
          backgroundColor: "rgba(7, 19, 36, 0.88)",
          padding: [4, 8],
          borderRadius: 6,
          borderColor: "rgba(56, 189, 248, 0.3)",
          borderWidth: 1,
          formatter: "{b}",
        },
        raw: node,
      };
    });

    const chartLinks = links.map((link) => {
      const meta = RELATION_TYPES[link.type] || {};
      const isSymbiosis = link.type === "symbiosis" || link.type === "commensalism";

      return {
        source: link.source,
        target: link.target,
        value: isEn ? meta.labelEn : meta.labelVi,
        lineStyle: {
          color: meta.color || link.lineColor || "#64748b",
          width: Math.max(1.8, (link.strength || 1) * 2.8),
          type: isSymbiosis ? "dashed" : "solid",
          curveness: 0.16,
        },
        raw: link,
      };
    });

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(7, 21, 38, 0.95)",
        borderColor: "rgba(56, 189, 248, 0.4)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#f8fafc" },
        formatter: (params) => {
          if (params.dataType === "node") {
            const raw = params.data.raw;
            return `
              <div style="font-family: inherit; font-size: 13px; line-height: 1.5; min-width: 240px; max-width: 320px;">
                <div style="font-size: 15px; font-weight: 700; color: #38bdf8; margin-bottom: 3px;">
                  ${raw?.name || params.name}
                </div>
                <div style="font-style: italic; color: #94a3b8; font-size: 12px; margin-bottom: 8px;">
                  ${raw?.scientificName || ""}
                </div>
                <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
                  <span style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); color: #7dd3fc; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    ${raw?.eastSeaZone || "Biển Đông"}
                  </span>
                  <span style="background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.3); color: #fda4af; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                    Sách Đỏ: ${raw?.redList || "LC"}
                  </span>
                </div>
                <div style="color: #64748b; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
                  ${isEn ? "Click node to inspect ecological profile" : "Click để mở hồ sơ quan hệ sinh thái chi tiết"}
                </div>
              </div>
            `;
          } else if (params.dataType === "edge") {
            const raw = params.data.raw;
            const meta = RELATION_TYPES[raw?.type] || {};
            return `
              <div style="font-family: inherit; font-size: 13px; line-height: 1.45; max-width: 300px;">
                <div style="font-weight: 700; color: ${meta.color || "#38bdf8"}; margin-bottom: 4px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">
                  ${isEn ? meta.labelEn : meta.labelVi}
                </div>
                ${raw?.description ? `<div style="color: #cbd5e1; font-size: 12px; margin-bottom: 4px; line-height: 1.45;">${raw.description}</div>` : ""}
                ${raw?.ecologicalImpact ? `<div style="color: #94a3b8; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;"><strong>Ý nghĩa sinh thái:</strong> ${raw.ecologicalImpact}</div>` : ""}
              </div>
            `;
          }
          return "";
        },
      },
      series: [
        {
          name: "Mạng Lưới Sinh Thái",
          type: "graph",
          layout: "force",
          data: chartNodes,
          links: chartLinks,
          categories,
          roam: true,
          draggable: true,
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: [4, 8],
          cursor: "pointer",
          force: {
            repulsion: 680,
            edgeLength: [135, 250],
            gravity: 0.08,
            friction: 0.6,
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 5,
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [filteredGraph, isEn]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  const handleResetFilters = () => {
    setSelectedZone("");
    setSelectedRedList("");
    setSelectedType("");
    setSearchQuery("");
    chartInstance.current?.dispatchAction({ type: "restore" });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      chartInstance.current?.resize();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#071324] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Main container với pt-28 để không bị che bởi fixed Navbar */}
      <main className="flex-1 px-4 md:px-8 pt-28 pb-16 max-w-7xl mx-auto w-full">
        {/* ─── 1. HEADER SECTION CHUẨN KHOA HỌC ─────────────────────── */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold tracking-wider mb-2">
              <Network size={14} />
              <span>{isEn ? "East Sea marine knowledge platform" : "Hệ thống tri thức sinh thái Biển Đông"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-heading tracking-tight leading-snug">
              {isEn ? "East Sea marine ecosystem knowledge graph" : "Đồ thị tri thức đa dạng sinh thái Biển Đông"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              {isEn
                ? "Trophic energy flows, biogenic habitat matrices, and symbiotic networks across 8 Marine Protected Areas (MPAs) of Vietnam."
                : "Mô hình hóa chuỗi thức ăn, quan hệ cộng sinh tương hỗ và cấu trúc sinh cảnh của 25 loài sinh vật đặc trưng tại 8 Khu bảo tồn biển (MPAs) Việt Nam."}
            </p>
          </div>

          {/* Bảng số liệu thống kê nhanh */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-[#0e1f38] border border-cyan-500/20 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">{stats.totalSpecies}</div>
              <div className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">
                {isEn ? "Species" : "Loài"}
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-[#0e1f38] border border-cyan-500/20 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{stats.totalLinks}</div>
              <div className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">
                {isEn ? "Links" : "Liên kết"}
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-[#0e1f38] border border-rose-500/30 text-center min-w-[90px]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">{stats.threatenedCount}</div>
              <div className="text-xs font-medium text-rose-300 tracking-wide mt-0.5">
                {isEn ? "Threatened" : "Nguy cấp"}
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. THANH BỘ LỌC ĐA TIÊU CHÍ (FILTER TOOLBAR) ─────────── */}
        <div className="p-4 rounded-2xl bg-[#0e1f38]/90 border border-white/10 mb-6 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Ô tìm kiếm tức thời */}
            <div className="relative min-w-[210px] flex-1 sm:max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search species, scientific name, MPA..." : "Tìm loài, tên khoa học, vùng biển..."}
                className="w-full bg-[#152a4a] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Lọc theo Phân vùng Biển Đông */}
            <div className="min-w-[180px]">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-[#152a4a] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                {EAST_SEA_ZONES.map((z) => (
                  <option key={z.id} value={z.id} className="bg-[#0b1c33] text-white">
                    {isEn ? z.labelEn : z.labelVi}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo Phân hạng Sách Đỏ */}
            <div className="min-w-[160px]">
              <select
                value={selectedRedList}
                onChange={(e) => setSelectedRedList(e.target.value)}
                className="w-full bg-[#152a4a] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                {RED_LIST_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#0b1c33] text-white">
                    {isEn ? r.labelEn : r.labelVi}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo Loại quan hệ sinh thái */}
            <div className="min-w-[170px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#152a4a] border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                {Object.entries(RELATION_TYPES).map(([key, meta]) => (
                  <option key={key} value={key} className="bg-[#0b1c33] text-white">
                    {isEn ? meta.labelEn : meta.labelVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút đặt lại bộ lọc */}
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shrink-0"
            title={isEn ? "Reset all filters" : "Đặt lại tất cả bộ lọc"}
          >
            <RotateCcw size={14} />
            <span>{isEn ? "Reset" : "Đặt lại"}</span>
          </button>
        </div>

        {/* ─── 3. KHU VỰC VẼ CANVAS ECHARTS FORCE GRAPH ───────────────── */}
        <div
          className={`relative rounded-3xl bg-gradient-to-b from-[#081a30] to-[#040e1b] border border-cyan-500/25 overflow-hidden shadow-2xl transition-all duration-300 ${
            isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : "h-[630px] md:h-[700px]"
          }`}
        >
          {/* Thanh trạng thái phía trên canvas */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
            <span className="px-3 py-1.5 rounded-full bg-cyan-950/85 border border-cyan-500/40 text-cyan-300 text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{isEn ? "Force-directed simulation" : "Mô phỏng trọng lực sinh thái"}</span>
            </span>

            {/* Chú giải liên kết */}
            <div className="hidden sm:flex items-center gap-3.5 px-3.5 py-1.5 rounded-full bg-[#051120]/85 border border-white/10 backdrop-blur-md text-xs font-medium text-slate-300 shadow-md">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Ăn thịt</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]" /> Ăn cỏ</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> Cộng sinh</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Sinh cảnh</span>
            </div>
          </div>

          {/* Công cụ góc trên bên phải */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => chartInstance.current?.dispatchAction({ type: "restore" })}
              className="p-2 rounded-xl bg-[#091b33]/85 hover:bg-[#0d274a] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              title={isEn ? "Reset Viewport" : "Đặt lại góc nhìn"}
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#091b33]/85 hover:bg-[#0d274a] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              title={isFullscreen ? (isEn ? "Exit Fullscreen" : "Thu nhỏ") : (isEn ? "Fullscreen" : "Toàn màn hình")}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#040e1b]/80 backdrop-blur-sm text-cyan-400">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold">
                {isEn ? "Computing East Sea trophic matrix..." : "Đang tổng hợp Đồ thị Tri thức Biển Đông..."}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredGraph.nodes.length === 0 && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-3">
              <Compass size={40} className="text-cyan-500/60" />
              <p className="text-base font-bold text-white">
                {isEn ? "No species found matching the current filters" : "Không tìm thấy sinh vật phù hợp với bộ lọc"}
              </p>
              <p className="text-xs max-w-sm text-slate-400">
                {isEn
                  ? "Try resetting filters to display the complete East Sea marine knowledge graph."
                  : "Hãy thử chọn 'Tất cả vùng biển' hoặc đặt lại bộ lọc để hiển thị toàn bộ mạng lưới sinh thái."}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? "Reset Filters" : "Đặt lại bộ lọc"}
              </button>
            </div>
          )}

          {/* ECharts Canvas */}
          <div ref={chartRef} className="w-full h-full" />

          {/* Hướng dẫn thao tác góc dưới */}
          <div className="absolute bottom-3 left-4 pointer-events-none text-xs text-slate-300 bg-[#040e1b]/85 px-3.5 py-1.5 rounded-lg border border-white/10 shadow-md">
            * Kéo chuột để di chuyển • Cuộn để Zoom • <strong className="text-cyan-400">Click vào sinh vật</strong> để mở bảng phân tích sinh thái
          </div>

          {/* ─── 4. SLIDE-OVER DRAWER CHI TIẾT HỌC THUẬT KHI CLICK NODE ── */}
          {selectedNode && (
            <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[390px] md:w-[440px] bg-[#07192f]/95 border-l border-cyan-500/30 backdrop-blur-xl z-30 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
              <div>
                {/* Header Drawer */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>{isEn ? "Ecological dossier" : "Hồ sơ quan hệ sinh thái"}</span>
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Thông tin đại diện loài */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-cyan-500/40 shrink-0 shadow-lg shadow-cyan-950/50">
                    {selectedNode.image ? (
                      <img
                        src={selectedNode.image}
                        alt={selectedNode.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        NO IMG
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white font-heading leading-snug mb-1">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 italic font-serif mb-2.5">
                      {selectedNode.scientificName}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Sách Đỏ: {selectedNode.redList || "LC"}
                      </span>
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {selectedNode.eastSeaZone || "Biển Đông"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bảng thông số sinh thái học chi tiết */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-5 bg-white/[0.03] p-3.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-400 block text-xs tracking-wider mb-0.5">Mã định danh:</span>
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{selectedNode.code || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs tracking-wider mb-0.5">Độ sâu sinh sống:</span>
                    <span className="font-mono text-cyan-300 text-xs sm:text-sm font-semibold">
                      {selectedNode.depthMin || 0}m - {selectedNode.depthMax || 50}m
                    </span>
                  </div>
                </div>

                {/* Danh sách các mối liên kết sinh thái trong mạng lưới */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200">
                      Mối liên kết trong mạng lưới
                    </span>
                    <span className="text-cyan-400 font-mono text-xs sm:text-sm font-bold">
                      {nodeConnections.prey.length +
                        nodeConnections.predators.length +
                        nodeConnections.symbionts.length +
                        nodeConnections.habitats.length +
                        nodeConnections.others.length}{" "}
                      liên kết
                    </span>
                  </div>

                  {/* 1. Con mồi */}
                  {nodeConnections.prey.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <Target size={14} className="text-rose-400" />
                        <span>Săn bắt / Nguồn thức ăn ({nodeConnections.prey.length}):</span>
                      </div>
                      {nodeConnections.prey.map(({ node, link }) => (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs sm:text-sm flex items-center justify-between"
                        >
                          <span className="font-semibold text-white">{node.name}</span>
                          <span className="text-xs text-slate-400 italic line-clamp-1 max-w-[160px]">
                            {link.description || "Con mồi"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 2. Kẻ săn mồi */}
                  {nodeConnections.predators.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-red-400" />
                        <span>Động vật ăn thịt đe dọa ({nodeConnections.predators.length}):</span>
                      </div>
                      {nodeConnections.predators.map(({ node, link }) => (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-xs sm:text-sm flex items-center justify-between"
                        >
                          <span className="font-semibold text-white">{node.name}</span>
                          <span className="text-xs text-slate-400 italic line-clamp-1 max-w-[160px]">
                            {link.description || "Thiên địch"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Cộng sinh */}
                  {nodeConnections.symbionts.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                        <Handshake size={14} className="text-sky-400" />
                        <span>Cộng sinh & Tương hỗ ({nodeConnections.symbionts.length}):</span>
                      </div>
                      {nodeConnections.symbionts.map(({ node, link }) => (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-lg bg-sky-950/20 border border-sky-500/20 text-xs sm:text-sm flex items-center justify-between"
                        >
                          <span className="font-semibold text-white">{node.name}</span>
                          <span className="text-xs text-sky-300/80 italic line-clamp-1 max-w-[160px]">
                            {link.description || "Cộng sinh"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Sinh cảnh */}
                  {nodeConnections.habitats.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Home size={14} className="text-emerald-400" />
                        <span>Sinh cảnh cư trú & Bãi ươm ({nodeConnections.habitats.length}):</span>
                      </div>
                      {nodeConnections.habitats.map(({ node, link }) => (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs sm:text-sm flex items-center justify-between"
                        >
                          <span className="font-semibold text-white">{node.name}</span>
                          <span className="text-xs text-emerald-300/80 italic line-clamp-1 max-w-[160px]">
                            {link.description || "Sinh cảnh"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Nút Điều hướng tới Hồ sơ chi tiết */}
              <div className="pt-4 border-t border-white/10 mt-6">
                <Link
                  to={`/species/${selectedNode.slug || selectedNode.id}`}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
                >
                  <span>Xem Hồ Sơ Sinh Học Chi Tiết</span>
                  <ExternalLink size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
