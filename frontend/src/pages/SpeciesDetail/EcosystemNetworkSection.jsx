import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import * as echarts from "echarts";
import {
  Network,
  ExternalLink,
  Target,
  ShieldAlert,
  Handshake,
  Home,
  Sprout,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
} from "lucide-react";
import { fetchSpeciesEcosystem } from "../../services/ecosystemApi";
import { useLanguage } from "../../hooks/useLanguage";

// Bảng màu & định danh học thuật cho các kiểu quan hệ sinh thái
const ECOLOGICAL_RELATION_META = {
  predator_prey: {
    color: "#ef4444", // Đỏ cảnh báo / Chuỗi thức ăn
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.3)",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    labelVi: "Vật dữ - Con mồi (Chuỗi thức ăn)",
    labelEn: "Predator - Prey Interaction",
    trophicType: "Trophic Web",
    Icon: Target,
  },
  herbivory: {
    color: "#84cc16", // Xanh lục mạ / Động vật ăn thực vật
    bg: "rgba(132, 204, 22, 0.08)",
    border: "rgba(132, 204, 22, 0.3)",
    badgeColor: "text-lime-400 bg-lime-500/10 border-lime-500/30",
    labelVi: "Ăn thực vật / Tiêu thụ sơ cấp",
    labelEn: "Herbivory / Primary Consumer",
    trophicType: "Herbivorous Link",
    Icon: Sprout,
  },
  symbiosis: {
    color: "#38bdf8", // Xanh dương tươi / Cộng sinh tương hỗ
    bg: "rgba(56, 189, 248, 0.08)",
    border: "rgba(56, 189, 248, 0.3)",
    badgeColor: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
    labelVi: "Cộng sinh tương hỗ (Mutualism)",
    labelEn: "Obligate / Facultative Symbiosis",
    trophicType: "Mutualism",
    Icon: Handshake,
  },
  commensalism: {
    color: "#06b6d4", // Xanh ngọc / Hội sinh
    bg: "rgba(6, 182, 212, 0.08)",
    border: "rgba(6, 182, 212, 0.3)",
    badgeColor: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    labelVi: "Hội sinh (Commensalism)",
    labelEn: "Commensal Interaction",
    trophicType: "Commensalism",
    Icon: Layers,
  },
  habitat_provider: {
    color: "#10b981", // Xanh lục ngọc / Kiến tạo sinh cảnh
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.3)",
    badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    labelVi: "Sinh vật kiến tạo sinh cảnh (Foundation Species)",
    labelEn: "Biogenic Habitat Provider",
    trophicType: "Habitat Matrix",
    Icon: Home,
  },
  competitor: {
    color: "#f97316", // Cam / Cạnh tranh sinh thái
    bg: "rgba(249, 115, 22, 0.08)",
    border: "rgba(249, 115, 22, 0.3)",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    labelVi: "Cạnh tranh ổ sinh thái (Ecological Competition)",
    labelEn: "Niche Competition",
    trophicType: "Competition",
    Icon: Zap,
  },
};

// Chuẩn hóa phân hạng Sách Đỏ Việt Nam (Thông tư 35/2013/TT-BTNMT & IUCN)
const RED_LIST_STANDARDS = {
  CR: {
    code: "CR",
    titleVi: "Cực kỳ nguy cấp (Critically Endangered)",
    titleEn: "Critically Endangered",
    style: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  },
  EN: {
    code: "EN",
    titleVi: "Nguy cấp (Endangered)",
    titleEn: "Endangered",
    style: "bg-orange-500/15 text-orange-300 border-orange-500/40",
  },
  VU: {
    code: "VU",
    titleVi: "Sắp nguy cấp (Vulnerable)",
    titleEn: "Vulnerable",
    style: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  },
  NT: {
    code: "NT",
    titleVi: "Gần bị đe dọa (Near Threatened)",
    titleEn: "Near Threatened",
    style: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  },
  LC: {
    code: "LC",
    titleVi: "Ít quan tâm (Least Concern)",
    titleEn: "Least Concern",
    style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  },
};

export function EcosystemNetworkSection({ species, language: propLang }) {
  const { language: storeLang } = useLanguage();
  const lang = propLang || storeLang || "vi";
  const isEn = lang === "en";

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [loading, setLoading] = useState(true);
  const [ecoData, setEcoData] = useState(null);

  const targetIdentifier = species?.slug || species?.id || species?.code;

  useEffect(() => {
    let isMounted = true;
    const loadEcosystem = async () => {
      if (!targetIdentifier) return;
      setLoading(true);
      const data = await fetchSpeciesEcosystem(targetIdentifier);
      if (isMounted) {
        setEcoData(data);
        setLoading(false);
      }
    };

    loadEcosystem();
    return () => {
      isMounted = false;
    };
  }, [targetIdentifier]);

  // Phân tách 4 nhóm vai trò sinh thái học thuật
  const roles = useMemo(() => {
    return (
      ecoData?.ecologicalRoles || {
        prey: [],
        predators: [],
        symbionts: [],
        habitats: [],
        competitors: [],
      }
    );
  }, [ecoData]);

  const totalRelations = useMemo(() => {
    return (
      roles.prey.length +
      roles.predators.length +
      roles.symbionts.length +
      roles.habitats.length +
      roles.competitors.length
    );
  }, [roles]);

  // Khởi tạo và đồng bộ hóa biểu đồ mạng lưới sinh thái Ego Graph ECharts
  useEffect(() => {
    if (!chartRef.current || !ecoData?.graph) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, "dark");
    }

    const { nodes = [], links = [] } = ecoData.graph;

    const formattedNodes = nodes.map((node) => {
      const isCenter = node.isCenter;
      const redListMeta = RED_LIST_STANDARDS[node.redList] || RED_LIST_STANDARDS.LC;
      const displayName = (node.name || "").split("(")[0].trim();

      return {
        id: node.id,
        name: displayName,
        value: node.scientificName,
        // Sử dụng ảnh đại diện dạng tròn nếu có, giúp đồ thị chân thực và mang tính khoa học
        symbol: node.image ? `image://${node.image}` : "circle",
        symbolSize: isCenter ? 68 : 46,
        itemStyle: {
          borderColor: isCenter
            ? "#38bdf8"
            : node.redList === "CR"
            ? "#f43f5e"
            : node.redList === "EN"
            ? "#f97316"
            : "rgba(56, 189, 248, 0.6)",
          borderWidth: isCenter ? 4 : 2.5,
          shadowBlur: isCenter ? 25 : 12,
          shadowColor: isCenter ? "rgba(56, 189, 248, 0.9)" : "rgba(14, 165, 233, 0.4)",
        },
        label: {
          show: true,
          position: "bottom",
          distance: 10,
          color: isCenter ? "#38bdf8" : "#e2e8f0",
          fontSize: isCenter ? 13 : 11,
          fontWeight: isCenter ? "bold" : "600",
          backgroundColor: "rgba(7, 19, 36, 0.85)",
          padding: [3, 7],
          borderRadius: 4,
          borderColor: isCenter ? "rgba(56, 189, 248, 0.5)" : "rgba(255, 255, 255, 0.15)",
          borderWidth: 1,
          formatter: "{b}",
        },
        raw: {
          ...node,
          redListTitle: isEn ? redListMeta.titleEn : redListMeta.titleVi,
        },
      };
    });

    const formattedLinks = links.map((link) => {
      const meta = ECOLOGICAL_RELATION_META[link.type] || {};
      const isSymbiosis = link.type === "symbiosis" || link.type === "commensalism";

      return {
        source: link.source,
        target: link.target,
        value: isEn ? meta.labelEn : meta.labelVi,
        lineStyle: {
          color: meta.color || link.lineColor || "#64748b",
          width: Math.max(2, (link.strength || 1) * 3),
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
        backgroundColor: "rgba(8, 22, 42, 0.95)",
        borderColor: "rgba(56, 189, 248, 0.4)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#f8fafc" },
        formatter: (params) => {
          if (params.dataType === "node") {
            const raw = params.data.raw;
            return `
              <div style="font-family: inherit; font-size: 12px; line-height: 1.5; min-width: 220px; max-width: 280px;">
                <div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 2px;">
                  ${raw?.name || params.name}
                </div>
                <div style="font-style: italic; color: #94a3b8; font-size: 11px; margin-bottom: 8px;">
                  ${raw?.scientificName || ""}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #94a3b8;">Sách Đỏ VN:</span>
                    <span style="font-weight: 600; color: #f43f5e;">${raw?.redList || "LC"}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #94a3b8;">Phân vùng:</span>
                    <span style="color: #cbd5e1;">${raw?.eastSeaZone || "Biển Đông"}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #94a3b8;">Mã định danh:</span>
                    <span style="font-family: monospace; color: #38bdf8;">${raw?.code || "N/A"}</span>
                  </div>
                </div>
              </div>
            `;
          } else if (params.dataType === "edge") {
            const raw = params.data.raw;
            const meta = ECOLOGICAL_RELATION_META[raw?.type] || {};
            return `
              <div style="font-family: inherit; font-size: 12px; line-height: 1.4; max-width: 290px;">
                <div style="font-weight: 700; color: ${meta.color || "#38bdf8"}; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.3px;">
                  ${isEn ? meta.labelEn : meta.labelVi}
                </div>
                ${raw?.description ? `<div style="color: #e2e8f0; font-size: 11px; margin-bottom: 6px; line-height: 1.45;">${raw.description}</div>` : ""}
                ${raw?.ecologicalImpact ? `<div style="color: #94a3b8; font-size: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;"><strong>Vai trò sinh thái:</strong> ${raw.ecologicalImpact}</div>` : ""}
              </div>
            `;
          }
          return "";
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: formattedNodes,
          links: formattedLinks,
          roam: true,
          draggable: true,
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: [4, 9],
          cursor: "pointer",
          force: {
            repulsion: 580,
            edgeLength: [120, 220],
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
  }, [ecoData, isEn]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  const handleResetZoom = () => {
    chartInstance.current?.dispatchAction({ type: "restore" });
  };

  // Helper render card sinh thái chuẩn học thuật
  const renderAcademicRelationCard = (item, typeKey) => {
    const meta = ECOLOGICAL_RELATION_META[typeKey] || ECOLOGICAL_RELATION_META[item.relationshipType] || {};
    const redListMeta = RED_LIST_STANDARDS[item.redList] || RED_LIST_STANDARDS.LC;
    const IconComponent = meta.Icon || Target;

    return (
      <div
        key={item.relationshipId || item.speciesId}
        className="group relative p-4 rounded-xl bg-[#091a30]/85 border border-white/10 hover:border-cyan-400/50 hover:bg-[#0c2342] transition-all duration-300 shadow-md shadow-black/25 flex flex-col justify-between"
      >
        <div>
          {/* Header Card: Vai trò sinh thái học & Bậc đe dọa Sách Đỏ */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 border ${meta.badgeColor}`}
            >
              <IconComponent size={13} className="shrink-0" />
              <span>{isEn ? meta.labelEn : item.relationshipLabel || meta.labelVi}</span>
            </span>

            {item.redList && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${redListMeta.style}`}
                title={isEn ? redListMeta.titleEn : redListMeta.titleVi}
              >
                Sách Đỏ {item.redList}
              </span>
            )}
          </div>

          {/* Ảnh thumbnail & Tên khoa học */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border border-white/15 shrink-0 group-hover:border-cyan-400 transition-colors shadow-inner">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                  NO IMG
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/species/${item.slug || item.speciesId}`}
                className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 flex items-center gap-1"
              >
                <span>{item.name}</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
              <p className="text-[11px] text-slate-400 italic font-serif line-clamp-1 mt-0.5">
                {item.scientificName}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {item.groupName}
              </p>
            </div>
          </div>

          {/* Mô tả cơ chế tương tác sinh thái */}
          {item.description && (
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-2.5 rounded-lg border border-white/5 mb-2 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Tác động cân bằng sinh thái học */}
        {item.ecologicalImpact && (
          <div className="pt-2.5 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-cyan-300/80">
            <Sparkles size={12} className="shrink-0 text-cyan-400" />
            <span className="line-clamp-1 italic">{item.ecologicalImpact}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      {/* ─── 1. HEADER SECTION ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
            <Network size={22} className="text-cyan-400" />
            {isEn ? "Ecosystem dynamics & trophic matrix" : "Mạng lưới sinh thái & chuỗi thức ăn"}
          </h2>
        </div>
      </div>

      {/* ─── 2. BIỂU ĐỒ EGO NETWORK GRAPH (ECHARTS CHÂN THỰC) ───────── */}
      <div className="relative rounded-2xl bg-[#081a30]/90 border border-cyan-500/20 overflow-hidden shadow-2xl shadow-cyan-950/40 mb-10">
        {/* Thanh công cụ khoa học phía trên đồ thị */}
        <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider">
              {isEn ? "Ego trophic web" : "Mạng lưới sinh thái"}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
              {totalRelations} {isEn ? "interactions" : "mối liên kết"}
            </span>
          </div>

          {/* Chú giải dòng năng lượng & liên kết */}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>Ăn thịt</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
              <span>Ăn thực vật</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <span>Cộng sinh</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Sinh cảnh</span>
            </div>

            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isEn ? "Reset Viewport" : "Đặt lại góc nhìn"}
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        {/* Khung vẽ Canvas ECharts */}
        <div className="relative h-[390px] md:h-[470px] w-full bg-gradient-to-b from-[#081a30] to-[#040e1b]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-cyan-400">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">
                {isEn ? "Synthesizing ecological relationships..." : "Đang tính toán ma trận sinh thái học..."}
              </span>
            </div>
          ) : totalRelations === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2">
              <Compass size={36} className="text-cyan-500/50" />
              <p className="text-sm font-semibold text-slate-300">
                Chưa có dữ liệu mối quan hệ mạng lưới cụ thể cho loài này
              </p>
              <p className="text-xs max-w-md text-slate-500">
                Dữ liệu chuỗi thức ăn đang tiếp tục được cập nhật từ các đề tài Viện Hải dương học Nha Trang và Viện Tài nguyên Môi trường Biển Hải Phòng.
              </p>
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-full" />
          )}

          {/* Ghi chú điều hướng tương tác */}
          <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-300 bg-[#040e1b]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-md">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {isEn ? "Scroll to zoom" : "Cuộn để phóng to"}
            </span>
            <span className="text-white/20">•</span>
            <span>{isEn ? "Drag to pan" : "Kéo để di chuyển"}</span>
            <span className="text-white/20">•</span>
            <span>{isEn ? "Hover node for info" : "Rê chuột xem chi tiết"}</span>
          </div>
        </div>
      </div>

      {/* ─── 3. 4 NHÓM THẺ THÔNG TIN SINH THÁI HỌC THUẬT ─────────────── */}
      <div className="space-y-8">
        {/* 1. Nhóm Con mồi & Nguồn thức ăn */}
        {roles.prey.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                  <Target size={15} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white font-heading">
                    {isEn ? "Prey & dietary base" : "Con mồi & nguồn dinh dưỡng"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Các loài sinh vật là thức ăn trực tiếp, cung cấp dòng năng lượng nuôi dưỡng loài này
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-bold">
                {roles.prey.length} loài
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.prey.map((item) => renderAcademicRelationCard(item, "predator_prey"))}
            </div>
          </div>
        )}

        {/* 2. Nhóm Kẻ săn mồi & Thiên địch */}
        {roles.predators.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                  <ShieldAlert size={15} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white font-heading">
                    {isEn ? "Trophic predators & apex threats" : "Động vật ăn thịt & thiên địch"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Các loài săn bắt loài này, giữ vai trò kiểm soát kích thước quần thể trong chuỗi thức ăn
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-mono font-bold">
                {roles.predators.length} loài
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.predators.map((item) => renderAcademicRelationCard(item, "predator_prey"))}
            </div>
          </div>
        )}

        {/* 3. Nhóm Cộng sinh & Tương hỗ */}
        {roles.symbionts.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400">
                  <Handshake size={15} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white font-heading">
                    {isEn ? "Symbiotic & mutualistic network" : "Cộng sinh tương hỗ & hội sinh"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mối liên kết hai bên cùng có lợi hoặc nương tựa sinh thái giúp tăng khả năng sinh tồn
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono font-bold">
                {roles.symbionts.length} loài
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.symbionts.map((item) => renderAcademicRelationCard(item, "symbiosis"))}
            </div>
          </div>
        )}

        {/* 4. Nhóm Sinh cảnh cư trú & Nơi nương tựa */}
        {roles.habitats.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Home size={15} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white font-heading">
                    {isEn ? "Biogenic habitat & nursery foundation" : "Sinh cảnh kiến tạo & nơi nương tựa"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Rạn san hô, thảm cỏ biển và rừng ngập mặn cung cấp bãi đẻ, bãi ươm và nơi ẩn náu
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
                {roles.habitats.length} sinh cảnh
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.habitats.map((item) => renderAcademicRelationCard(item, "habitat_provider"))}
            </div>
          </div>
        )}

        {/* 5. Cạnh tranh sinh thái */}
        {roles.competitors.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Zap size={15} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white font-heading">
                    {isEn ? "Niche competition" : "Cạnh tranh ổ sinh thái"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cạnh tranh nguồn thức ăn và không gian sống trong cùng phân vùng sinh thái
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold">
                {roles.competitors.length} loài
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.competitors.map((item) => renderAcademicRelationCard(item, "competitor"))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default EcosystemNetworkSection;
