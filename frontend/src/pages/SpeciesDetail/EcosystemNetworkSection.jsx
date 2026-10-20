import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Target,
  ShieldAlert,
  Handshake,
  Home,
  Sprout,
  Zap,
  Layers,
  Compass,
  ArrowUpRight,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { fetchSpeciesEcosystem } from "../../services/ecosystemApi";
import { useLanguage } from "../../hooks/useLanguage";

// Bảng màu & định danh học thuật cho các kiểu quan hệ sinh thái
const ECOLOGICAL_RELATION_META = {
  predator_prey: {
    color: "#f43f5e", // Đỏ hồng san hô / Chuỗi thức ăn
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    labelVi: "Vật dữ - Con mồi",
    labelEn: "Predator - Prey",
    trophicType: "Trophic Web",
    Icon: Target,
  },
  herbivory: {
    color: "#84cc16", // Xanh lục mạ
    glowColor: "rgba(132, 204, 22, 0.4)",
    badgeColor: "text-lime-400 bg-lime-500/10 border-lime-500/30",
    labelVi: "Ăn thực vật",
    labelEn: "Herbivory",
    trophicType: "Herbivorous Link",
    Icon: Sprout,
  },
  symbiosis: {
    color: "#38bdf8", // Xanh cyan dạ quang
    glowColor: "rgba(56, 189, 248, 0.4)",
    badgeColor: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
    labelVi: "Cộng sinh tương hỗ",
    labelEn: "Mutualism",
    trophicType: "Mutualism",
    Icon: Handshake,
  },
  commensalism: {
    color: "#06b6d4", // Xanh ngọc
    glowColor: "rgba(6, 182, 212, 0.4)",
    badgeColor: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    labelVi: "Hội sinh",
    labelEn: "Commensalism",
    trophicType: "Commensalism",
    Icon: Layers,
  },
  habitat_provider: {
    color: "#10b981", // Xanh lục ngọc
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    labelVi: "Kiến tạo sinh cảnh",
    labelEn: "Habitat Provider",
    trophicType: "Habitat Matrix",
    Icon: Home,
  },
  competitor: {
    color: "#f59e0b", // Vàng cam ấm
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    labelVi: "Cạnh tranh sinh thái",
    labelEn: "Competition",
    trophicType: "Competition",
    Icon: Zap,
  },
  parasitism: {
    color: "#a855f7", // Tím dạ quang / Ký sinh
    glowColor: "rgba(168, 85, 247, 0.4)",
    badgeColor: "text-purple-300 bg-purple-500/10 border-purple-500/30",
    labelVi: "Ký sinh",
    labelEn: "Parasitism",
    trophicType: "Parasitic Link",
    Icon: ShieldAlert,
  },
};

// Chuẩn hóa phân hạng Sách Đỏ Việt Nam & IUCN
const RED_LIST_STANDARDS = {
  CR: {
    code: "CR",
    titleVi: "Cực kỳ nguy cấp",
    titleEn: "Critically Endangered",
    style: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    dot: "bg-rose-500",
  },
  EN: {
    code: "EN",
    titleVi: "Nguy cấp",
    titleEn: "Endangered",
    style: "bg-orange-500/15 text-orange-300 border-orange-500/40",
    dot: "bg-orange-500",
  },
  VU: {
    code: "VU",
    titleVi: "Sắp nguy cấp",
    titleEn: "Vulnerable",
    style: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    dot: "bg-amber-500",
  },
  NT: {
    code: "NT",
    titleVi: "Gần bị đe dọa",
    titleEn: "Near Threatened",
    style: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
    dot: "bg-yellow-400",
  },
  LC: {
    code: "LC",
    titleVi: "Ít quan tâm",
    titleEn: "Least Concern",
    style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    dot: "bg-emerald-400",
  },
  DD: {
    code: "DD",
    titleVi: "Thiếu dữ liệu",
    titleEn: "Data Deficient",
    style: "bg-slate-500/15 text-slate-300 border-slate-500/40",
    dot: "bg-slate-400",
  },
  NE: {
    code: "NE",
    titleVi: "Chưa đánh giá",
    titleEn: "Not Evaluated",
    style: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40",
    dot: "bg-zinc-400",
  },
};

const STAGE = { w: 640, h: 480 };

export function EcosystemNetworkSection({ species, language: propLang }) {
  const navigate = useNavigate();
  const { language: storeLang } = useLanguage();
  const lang = propLang || storeLang || "vi";
  const isEn = lang === "en";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ecoData, setEcoData] = useState(null);
  const [viewMode, setViewMode] = useState("orbit"); // "orbit" | "pyramid"
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);

  // Responsive scale của khung SVG STAGE
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setScale(Math.min(1, Math.max(0.52, width / STAGE.w)));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const MOCK_SLUG_MAP = {
    "giant-octopus-3": "bach-tuoc-khong-lo",
    octopus: "bach-tuoc-khong-lo",
    "whale-shark": "ca-map-voi-nham-voi",
    "whale-shark-2": "ca-map-voi-nham-voi",
    "bluefin-tuna-1": "ca-ngu-vay-vang-dai-duong",
  };

  const rawIdentifier = species?.slug || species?.id || species?.code;
  const targetIdentifier = MOCK_SLUG_MAP[rawIdentifier] || rawIdentifier;

  const loadEcosystem = () => {
    if (!targetIdentifier) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchSpeciesEcosystem(targetIdentifier)
      .then((data) => {
        if (!cancelled) setEcoData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Không thể tải dữ liệu mạng lưới sinh thái");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  };

  useEffect(() => {
    return loadEcosystem();
  }, [targetIdentifier]);

  // Phân tách các nhóm vai trò sinh thái học thuật
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
      (roles.prey?.length || 0) +
      (roles.predators?.length || 0) +
      (roles.symbionts?.length || 0) +
      (roles.habitats?.length || 0) +
      (roles.competitors?.length || 0)
    );
  }, [roles]);

  // Node trung tâm (Ego Species)
  const centerNode = useMemo(() => {
    const nodes = ecoData?.graph?.nodes || [];
    const centerFromGraph = nodes.find((n) => n.isCenter);
    const centerFromApi = ecoData?.centerSpecies || ecoData?.species;

    const name =
      centerFromGraph?.name ||
      centerFromApi?.name ||
      centerFromApi?.commonName ||
      species?.nameVi ||
      species?.common_name ||
      "Sinh vật trung tâm";

    return {
      id: centerFromGraph?.id || centerFromApi?.id || species?.id || "center",
      name: name.replace(/\s*\([^)]*\)/g, "").trim(),
      scientificName:
        centerFromGraph?.scientificName ||
        centerFromApi?.scientificName ||
        species?.sciName ||
        species?.scientificName ||
        "",
      image:
        centerFromGraph?.image ||
        centerFromApi?.image ||
        species?.image ||
        species?.imageUrl ||
        "",
      redList:
        centerFromGraph?.redList ||
        centerFromApi?.redList ||
        centerFromApi?.vietnamRedListStatus ||
        species?.redList ||
        species?.vietnam_red_list_status ||
        "NE",
      isCenter: true,
    };
  }, [ecoData, species]);

  // Nodes vệ tinh với logic hướng dòng năng lượng chuẩn
  const satelliteNodes = useMemo(() => {
    const nodes = ecoData?.graph?.nodes || [];
    const links = ecoData?.graph?.links || [];
    const nonCenterNodes = nodes.filter((n) => !n.isCenter);

    return nonCenterNodes.map((n, idx) => {
      // Tìm link liên quan đến center
      const relatedLink = links.find(
        (l) => l.source === n.id || l.target === n.id
      );
      const relType = relatedLink?.type || "predator_prey";
      const meta = ECOLOGICAL_RELATION_META[relType] || ECOLOGICAL_RELATION_META.predator_prey;

      // Xác định quan hệ: Con mồi vs Thiên địch vs Cạnh tranh
      const isOutgoing = relatedLink ? relatedLink.source === centerNode.id : true;
      let relationSpecificLabel = meta.labelVi;
      let flow = "none"; // "toCenter" | "fromCenter" | "none"

      if (relType === "predator_prey" || relType === "herbivory") {
        if (isOutgoing) {
          // Center săn bắt n -> n là con mồi
          relationSpecificLabel = `Con mồi của ${centerNode.name}`;
          flow = "toCenter"; // Dòng năng lượng từ con mồi vào kẻ săn mồi
        } else {
          // n săn bắt Center -> n là thiên địch
          relationSpecificLabel = `Thiên địch của ${centerNode.name}`;
          flow = "fromCenter"; // Dòng năng lượng từ Center sang thiên địch
        }
      } else if (relType === "competitor") {
        relationSpecificLabel = `Cạnh tranh với ${centerNode.name}`;
      } else if (relType === "symbiosis" || relType === "commensalism") {
        relationSpecificLabel = `Cộng sinh cùng ${centerNode.name}`;
      } else if (relType === "habitat_provider") {
        relationSpecificLabel = `Sinh cảnh của ${centerNode.name}`;
      }

      return {
        ...n,
        index: idx,
        relationshipType: relType,
        relationSpecificLabel,
        flow,
        meta,
        strength: relatedLink?.strength ?? 1,
        cleanName: (n.name || "").replace(/\s*\([^)]*\)/g, "").trim(),
        cleanScientificName: n.scientificName || "",
      };
    });
  }, [ecoData, centerNode]);

  // Tọa độ hình tròn cho các node vệ tinh (Orbital Coordinates)
  const orbitalNodes = useMemo(() => {
    const count = satelliteNodes.length;
    if (count === 0) return [];

    return satelliteNodes.map((node, i) => {
      // Phân bổ đều theo hình tròn (bắt đầu từ góc -90 độ / 12h)
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      const radiusX = 195;
      const radiusY = 145;
      const x = Math.round(Math.cos(angle) * radiusX);
      const y = Math.round(Math.sin(angle) * radiusY);

      return {
        ...node,
        x,
        y,
        angle,
      };
    });
  }, [satelliteNodes]);

  // Render card thông tin sinh thái
  const renderAcademicRelationCard = (item, typeKey) => {
    const meta =
      ECOLOGICAL_RELATION_META[typeKey] ||
      ECOLOGICAL_RELATION_META[item.relationshipType] ||
      ECOLOGICAL_RELATION_META.predator_prey;
    const redListMeta = RED_LIST_STANDARDS[item.redList] || RED_LIST_STANDARDS.NE;
    const IconComponent = meta.Icon || Target;

    const cleanName = (item.name || "").replace(/\s*\([^)]*\)/g, "").trim();
    const rawLabel = isEn ? meta.labelEn : item.relationshipLabel || meta.labelVi;
    const cleanLabel = (rawLabel || "").replace(/\s*\([^)]*\)/g, "").trim();
    const cleanGroupName = (item.groupName || "").replace(/\s*\([^)]*\)/g, "").trim();

    return (
      <Link
        key={item.relationshipId || item.speciesId}
        to={`/species/${item.slug || item.speciesId}`}
        className="group relative p-4 rounded-2xl bg-gradient-to-b from-[#0b1f38]/80 to-[#071526]/90 border border-white/10 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-950/50 transition-all duration-300 flex flex-col justify-between cursor-pointer block overflow-hidden"
      >
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
          style={{ backgroundColor: meta.color }}
        />

        <div>
          {/* Header Card: Vai trò sinh thái học & Bậc đe dọa Sách Đỏ */}
          <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${meta.badgeColor}`}
            >
              <IconComponent size={12} className="shrink-0" />
              <span>{cleanLabel}</span>
            </span>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${redListMeta.style}`}
              title={isEn ? redListMeta.titleEn : redListMeta.titleVi}
            >
              Sách Đỏ {item.redList || "NE"}
            </span>
          </div>

          {/* Ảnh avatar tròn phát sáng & Tên loài */}
          <div className="flex items-center gap-3.5 mb-3 relative z-10">
            <div
              className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 group-hover:scale-105 shadow-md bg-slate-900"
              style={{
                borderColor: meta.color,
                boxShadow: `0 0 14px ${meta.glowColor}`,
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={cleanName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                  N/A
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1 flex items-center gap-1.5">
                <span>{cleanName}</span>
                <ArrowUpRight
                  size={13}
                  className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                />
              </h4>
              <p className="text-[11px] text-slate-400 italic font-serif line-clamp-1 mt-0.5">
                {item.scientificName}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {cleanGroupName}
              </p>
            </div>
          </div>

          {/* Mô tả cơ chế tương tác sinh thái */}
          {item.description && (
            <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5 line-clamp-3 relative z-10">
              {item.description}
            </p>
          )}
        </div>
      </Link>
    );
  };

  const centerRedListMeta = RED_LIST_STANDARDS[centerNode.redList] || RED_LIST_STANDARDS.NE;

  return (
    <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      {/* ─── 1. HEADER SECTION ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2.5">
            <Network size={22} className="text-cyan-400" />
            {isEn ? "Ecosystem dynamics & trophic web" : "Mạng lưới sinh thái & chuỗi thức ăn"}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {isEn
              ? "Interactive marine trophic linkages & energy flow in the East Sea (Western Pacific margin)"
              : "Khám phá mối tương tác chuỗi thức ăn và dòng truyền năng lượng sinh khối giữa các loài tại Biển Đông"}
          </p>
        </div>

        {/* View Switcher: Mạng lưới đại dương vs Tháp Dinh Dưỡng */}
        <div className="flex items-center gap-1 p-1 bg-[#091a30] border border-white/10 rounded-xl">
          <button
            onClick={() => setViewMode("orbit")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "orbit"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass size={13} />
            <span>{isEn ? "Orbital Web" : "Mạng lưới đại dương"}</span>
          </button>
          <button
            onClick={() => setViewMode("pyramid")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "pyramid"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers size={13} />
            <span>{isEn ? "Trophic Pyramid" : "Tháp dinh dưỡng"}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. BIỂU ĐỒ MẠNG LƯỚI SINH THÁI ĐẠI DƯƠNG ───────── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#061528] via-[#040e1b] to-[#02070f] border border-cyan-500/25 overflow-hidden shadow-2xl shadow-cyan-950/60 mb-12">
        {/* Thanh công cụ khoa học phía trên đồ thị */}
        <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span className="text-xs font-bold text-white tracking-wider">
              {viewMode === "orbit"
                ? isEn
                  ? "Ecosystem Orbital Matrix"
                  : "Mạng lưới quỹ đạo sinh thái"
                : isEn
                ? "Marine Trophic Hierarchy"
                : "Phân tầng tháp dinh dưỡng"}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono">
              {totalRelations} {isEn ? "linkages" : "mối liên kết"}
            </span>
          </div>

          {/* Chú giải dòng năng lượng & liên kết */}
          <div className="flex flex-wrap items-center gap-3.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]" />
              <span>Con mồi (Prey)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]" />
              <span>Cạnh tranh</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
              <span>Cộng sinh</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
              <span>Sinh cảnh</span>
            </div>
          </div>
        </div>

        {/* Khung tương tác chính */}
        {loading ? (
          <div className="h-[460px] flex flex-col items-center justify-center gap-3 text-cyan-400">
            <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400">
              Đang mô phỏng ma trận sinh thái Biển Đông...
            </span>
          </div>
        ) : error ? (
          <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center text-rose-400 gap-3">
            <AlertTriangle size={36} className="text-rose-500/80" />
            <p className="text-sm font-medium text-slate-200">{error}</p>
            <button
              onClick={loadEcosystem}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} />
              <span>Thử lại</span>
            </button>
          </div>
        ) : totalRelations === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2">
            <Compass size={36} className="text-cyan-500/50" />
            <p className="text-sm font-medium text-slate-300">
              Chưa có dữ liệu mạng lưới cụ thể cho loài này
            </p>
          </div>
        ) : viewMode === "orbit" ? (
          /* ─── VIEW 1: BIOLUMINESCENT ORBITAL UNIVERSE (RESIZED SVG STAGE) ─── */
          <div
            ref={containerRef}
            className="relative h-[480px] md:h-[530px] w-full flex items-center justify-center overflow-hidden select-none"
            onClick={() => setActiveNodeId(null)}
          >
            {/* Lớp nền chiều sâu đại dương */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,40,78,0.45)_0%,transparent_70%)] pointer-events-none" />

            {/* STAGE CONTAINER ĐƯỢC CO GIÃN THEO RESIZEOBSERVER */}
            <div
              className="relative flex items-center justify-center shrink-0"
              style={{
                width: STAGE.w,
                height: STAGE.h,
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {/* Sóng xung kích sonar từ tâm (Bioluminescent Sonar Waves) */}
              <div className="absolute w-[270px] h-[270px] rounded-full border border-cyan-500/15 pointer-events-none animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute w-[370px] h-[370px] rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-cyan-400/10 pointer-events-none" />

              {/* SVG CHUẨN TỌA ĐỘ SỐ (0,0 LÀ TÂM ĐỒ THỊ) */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={STAGE.w}
                height={STAGE.h}
                viewBox={`${-STAGE.w / 2} ${-STAGE.h / 2} ${STAGE.w} ${STAGE.h}`}
              >
                <defs>
                  <filter id="glowLine" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {orbitalNodes.map((n) => {
                  const isHovered = hoveredNodeId === n.id || activeNodeId === n.id;
                  const strokeColor = n.meta.color;
                  const strokeWidth = isHovered ? 3.5 : 1.8 + (n.strength ?? 1) * 1.2;

                  // Tọa độ số học chuẩn (gốc 0,0 là tâm)
                  const d = `M 0 0 Q ${n.x * 0.45} ${n.y * 0.55} ${n.x} ${n.y}`;
                  const back = `M ${n.x} ${n.y} Q ${n.x * 0.45} ${n.y * 0.55} 0 0`;
                  const activeMotionPath = n.flow === "toCenter" ? back : d;

                  return (
                    <g key={`link-${n.id}`}>
                      {/* Đường cong năng lượng Bezier */}
                      <path
                        d={d}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={isHovered ? "none" : "6 4"}
                        strokeOpacity={
                          hoveredNodeId || activeNodeId
                            ? isHovered
                              ? 1
                              : 0.18
                            : 0.65
                        }
                        filter={isHovered ? "url(#glowLine)" : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Hạt năng lượng phát sáng chuyển động */}
                      {n.flow !== "none" && (
                        <circle
                          r={isHovered ? 4 : 2.8}
                          fill={strokeColor}
                          opacity={
                            hoveredNodeId || activeNodeId
                              ? isHovered
                                ? 1
                                : 0.15
                              : 0.85
                          }
                        >
                          <animateMotion
                            dur="3.2s"
                            repeatCount="indefinite"
                            path={activeMotionPath}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* NODE TRUNG TÂM (CENTER SPECIES) */}
              <div
                className="absolute z-20 flex flex-col items-center"
                style={{
                  left: STAGE.w / 2,
                  top: STAGE.h / 2,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="relative cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {/* Hào quang dạ quang */}
                  <div className="absolute -inset-3 rounded-full bg-cyan-400/30 blur-xl animate-pulse" />

                  {/* Quả cầu avatar tròn phát sáng */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.7)] bg-[#091b30]">
                    {centerNode.image ? (
                      <img
                        src={centerNode.image}
                        alt={centerNode.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-950 text-cyan-300 font-bold">
                        Center
                      </div>
                    )}
                  </div>

                  {/* Nhãn loài trung tâm kèm huy hiệu Sách Đỏ */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-[#030d1a]/95 border border-cyan-400/60 shadow-lg shadow-cyan-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {centerNode.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${centerRedListMeta.style}`}
                    >
                      {centerNode.redList || "NE"}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* CÁC NODE VỆ TINH TRÒN QUANH QUỸ ĐẠO */}
              {orbitalNodes.map((node) => {
                const isHovered = hoveredNodeId === node.id || activeNodeId === node.id;
                const meta = node.meta;
                const redListMeta =
                  RED_LIST_STANDARDS[node.redList] || RED_LIST_STANDARDS.NE;

                return (
                  <div
                    key={node.id}
                    className="absolute z-20"
                    style={{
                      left: STAGE.w / 2 + node.x,
                      top: STAGE.h / 2 + node.y,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNodeId(activeNodeId === node.id ? null : node.id);
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative cursor-pointer group flex flex-col items-center"
                    >
                      {/* Hào quang khi hover */}
                      <div
                        className={`absolute -inset-1.5 rounded-full blur-md transition-opacity duration-300 ${
                          isHovered ? "opacity-100" : "opacity-30"
                        }`}
                        style={{ backgroundColor: meta.color }}
                      />

                      {/* Quả cầu avatar tròn phát sáng */}
                      <div
                        className="relative w-15 h-15 md:w-17 md:h-17 rounded-full overflow-hidden border-2 bg-[#091b30] shadow-lg transition-all duration-300"
                        style={{
                          borderColor: meta.color,
                          boxShadow: isHovered
                            ? `0 0 24px ${meta.glowColor}`
                            : `0 0 10px ${meta.glowColor}`,
                        }}
                      >
                        {node.image ? (
                          <img
                            src={node.image}
                            alt={node.cleanName}
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs">
                            {node.cleanName.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Huy hiệu Sách Đỏ ở góc quả cầu */}
                      <span
                        className={`absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${redListMeta.style} shadow-md`}
                      >
                        {node.redList || "NE"}
                      </span>

                      {/* Nhãn tên sinh vật bên dưới */}
                      <div
                        className={`mt-2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300 border ${
                          isHovered
                            ? "bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md"
                            : "bg-[#061426]/90 text-slate-200 border-white/10"
                        }`}
                      >
                        {node.cleanName}
                      </div>

                      {/* Tooltip nổi khi Hover hoặc Click chạm */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-60 p-3.5 rounded-2xl bg-[#081b33]/95 backdrop-blur-xl border border-cyan-400/50 shadow-2xl shadow-black/80 text-left z-50 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}
                              >
                                {node.relationSpecificLabel}
                              </span>
                              <span className="text-[10px] text-cyan-300 font-mono">
                                Sách Đỏ {node.redList || "NE"}
                              </span>
                            </div>

                            <h5 className="font-bold text-xs text-white">
                              {node.cleanName}
                            </h5>
                            <p className="text-[10px] text-slate-400 italic font-serif mb-2">
                              {node.cleanScientificName}
                            </p>

                            <Link
                              to={`/species/${node.slug || node.id}`}
                              className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                            >
                              <span>Xem hồ sơ loài chi tiết</span>
                              <ArrowUpRight size={13} />
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Hướng dẫn thao tác góc dưới */}
            <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 flex items-center gap-2 bg-[#04101e]/80 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Nhấp vào bất kỳ quả cầu nào để xem quan hệ và hồ sơ chi tiết</span>
            </div>
          </div>
        ) : (
          /* ─── VIEW 2: THÁP DINH DƯỠNG ĐẠI DƯƠNG (TROPHIC HIERARCHY PYRAMID) ─── */
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono">
                Trophic Level Pyramid • Biển Đông
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                Dòng truyền năng lượng & Bậc dinh dưỡng đại dương
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Theo quy luật sinh thái học đại dương, năng lượng sinh khối được truyền qua các bậc dinh dưỡng từ nguồn sơ cấp lên động vật ăn thịt bậc cao.
              </p>
            </div>

            {/* Tầng 3: Săn mồi đỉnh bảng (Apex Predator) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-rose-900/15 to-transparent border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rose-400 shadow-[0_0_12px_#f43f5e] shrink-0 bg-slate-900">
                  <img
                    src={centerNode.image}
                    alt={centerNode.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Bậc III: Kẻ săn mồi đỉnh bảng (Apex Predator)
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {centerNode.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 italic">
                    {centerNode.scientificName}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-rose-300 font-mono">
                Sách Đỏ: {centerNode.redList || "NE"}
              </div>
            </div>

            {/* Mũi tên năng lượng */}
            <div className="flex justify-center text-slate-500 text-xs font-mono">
              ▲ Dòng năng lượng nuôi dưỡng sinh khối ▲
            </div>

            {/* Tầng 2: Săn mồi bậc trung & Cạnh tranh */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-amber-900/15 to-transparent border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Bậc II: Động vật săn mồi bậc trung & Cạnh tranh sinh thái
                </span>
                <span className="text-xs text-amber-300 font-mono">
                  Mesopredators & Competitors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {satelliteNodes
                  .filter(
                    (n) =>
                      n.relationshipType === "competitor" ||
                      n.cleanName.includes("Bạch Tuộc") ||
                      n.cleanName.includes("Cá Ngừ")
                  )
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={`/species/${item.slug || item.id}`}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-400/50 flex items-center gap-3 transition-colors cursor-pointer group"
                    >
                      <img
                        src={item.image}
                        alt={item.cleanName}
                        className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white group-hover:text-amber-300 line-clamp-1">
                          {item.cleanName}
                        </div>
                        <div className="text-[10px] text-slate-400 italic line-clamp-1">
                          {item.scientificName}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Mũi tên năng lượng */}
            <div className="flex justify-center text-slate-500 text-xs font-mono">
              ▲ Nguồn cung cấp sơ cấp & con mồi cơ sở ▲
            </div>

            {/* Tầng 1: Động vật ăn thực vật & Con mồi đàn */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-emerald-900/15 to-transparent border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Bậc I: Động vật tiêu thụ sơ cấp & Con mồi đàn
                </span>
                <span className="text-xs text-emerald-300 font-mono">
                  Primary Consumers & Prey
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {satelliteNodes
                  .filter(
                    (n) =>
                      n.cleanName.includes("Rùa Xanh") ||
                      n.cleanName.includes("Cá Trích") ||
                      n.relationshipType === "herbivory"
                  )
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={`/species/${item.slug || item.id}`}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/50 flex items-center gap-3 transition-colors cursor-pointer group"
                    >
                      <img
                        src={item.image}
                        alt={item.cleanName}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-400 shrink-0 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white group-hover:text-emerald-300 line-clamp-1">
                          {item.cleanName}
                        </div>
                        <div className="text-[10px] text-slate-400 italic line-clamp-1">
                          {item.scientificName}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. CÁC NHÓM THẺ THÔNG TIN SINH THÁI HỌC THUẬT ─────────────── */}
      <div className="space-y-8">
        {/* 1. Nhóm Con mồi & Nguồn thức ăn */}
        {roles.prey?.length > 0 && (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.prey.map((item) => renderAcademicRelationCard(item, "predator_prey"))}
            </div>
          </div>
        )}

        {/* 2. Nhóm Kẻ săn mồi & Thiên địch */}
        {roles.predators?.length > 0 && (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.predators.map((item) => renderAcademicRelationCard(item, "predator_prey"))}
            </div>
          </div>
        )}

        {/* 3. Nhóm Cộng sinh & Tương hỗ */}
        {roles.symbionts?.length > 0 && (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.symbionts.map((item) => renderAcademicRelationCard(item, "symbiosis"))}
            </div>
          </div>
        )}

        {/* 4. Nhóm Sinh cảnh cư trú & Nơi nương tựa */}
        {roles.habitats?.length > 0 && (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.habitats.map((item) => renderAcademicRelationCard(item, "habitat_provider"))}
            </div>
          </div>
        )}

        {/* 5. Cạnh tranh sinh thái */}
        {roles.competitors?.length > 0 && (
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
