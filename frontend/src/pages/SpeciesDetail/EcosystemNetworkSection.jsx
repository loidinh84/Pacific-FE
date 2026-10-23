import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
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

const STAGE = { w: 720, h: 540 };

const MOCK_SLUG_MAP = {
  "giant-octopus-3": "bach-tuoc-khong-lo",
  octopus: "bach-tuoc-khong-lo",
  "whale-shark": "ca-map-voi-nham-voi",
  "whale-shark-2": "ca-map-voi-nham-voi",
  "bluefin-tuna-1": "ca-ngu-vay-vang-dai-duong",
};

export function EcosystemNetworkSection({ species, language: propLang }) {
  const { language: storeLang } = useLanguage();
  const lang = propLang || storeLang || "vi";
  const isEn = lang === "en";

  const rawIdentifier = species?.slug || species?.id || species?.code;
  const targetIdentifier = MOCK_SLUG_MAP[rawIdentifier] || rawIdentifier;

  const [loading, setLoading] = useState(() => Boolean(targetIdentifier));
  const [error, setError] = useState(null);
  const [ecoData, setEcoData] = useState(null);
  const [viewMode, setViewMode] = useState("orbit"); // "orbit" | "pyramid"
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [selectedRelationFilter, setSelectedRelationFilter] = useState("all"); // "all" | "prey" | "competitor" | "symbiosis" | "habitat"

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

  const handleRetry = useCallback(() => {
    if (!targetIdentifier) return;
    setLoading(true);
    setError(null);
    fetchSpeciesEcosystem(targetIdentifier)
      .then((data) => {
        setEcoData(data);
      })
      .catch((err) => {
        setError(err.message || "Không thể tải dữ liệu mạng lưới sinh thái");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [targetIdentifier]);

  useEffect(() => {
    if (!targetIdentifier) return;
    let cancelled = false;

    fetchSpeciesEcosystem(targetIdentifier)
      .then((data) => {
        if (!cancelled) {
          setEcoData(data);
          setError(null);
        }
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
      let relationCategoryLabel = meta.labelVi;
      let relationDescription = `Có quan hệ sinh thái với ${centerNode.name}`;
      let flow = "none"; // "toCenter" | "fromCenter" | "none"

      if (relType === "predator_prey" || relType === "herbivory") {
        if (isOutgoing) {
          // Center săn bắt n -> n là con mồi
          relationCategoryLabel = "Con mồi";
          relationDescription = `Con mồi trong chuỗi thức ăn của ${centerNode.name}`;
          flow = "toCenter"; // Dòng năng lượng từ con mồi vào kẻ săn mồi
        } else {
          // n săn bắt Center -> n là thiên địch
          relationCategoryLabel = "Thiên địch";
          relationDescription = `Thiên địch săn bắt ${centerNode.name}`;
          flow = "fromCenter"; // Dòng năng lượng từ Center sang thiên địch
        }
      } else if (relType === "competitor") {
        relationCategoryLabel = "Cạnh tranh";
        relationDescription = `Cạnh tranh thức ăn & sinh cảnh với ${centerNode.name}`;
      } else if (relType === "symbiosis") {
        relationCategoryLabel = "Cộng sinh";
        relationDescription = `Cộng sinh tương hỗ cùng ${centerNode.name}`;
      } else if (relType === "commensalism") {
        relationCategoryLabel = "Hội sinh";
        relationDescription = `Hội sinh cùng ${centerNode.name}`;
      } else if (relType === "habitat_provider") {
        relationCategoryLabel = "Sinh cảnh";
        relationDescription = `Cung cấp sinh cảnh cho ${centerNode.name}`;
      } else if (relType === "parasitism") {
        relationCategoryLabel = "Ký sinh";
        relationDescription = `Ký sinh trên ${centerNode.name}`;
      }

      return {
        ...n,
        index: idx,
        relationshipType: relType,
        relationCategoryLabel,
        relationDescription,
        flow,
        meta,
        strength: relatedLink?.strength ?? 1,
        cleanName: (n.name || "").replace(/\s*\([^)]*\)/g, "").trim(),
        cleanScientificName: n.scientificName || "",
      };
    });
  }, [ecoData, centerNode]);

  // Tọa độ hình tròn cho các node vệ tinh (Orbital Coordinates) với bán kính mở rộng tránh đè nhãn
  const orbitalNodes = useMemo(() => {
    const count = satelliteNodes.length;
    if (count === 0) return [];

    return satelliteNodes.map((node, i) => {
      // Phân bổ đều theo hình tròn (bắt đầu từ góc -90 độ / 12h)
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      const radiusX = 230;
      const radiusY = 165;
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

  // Bộ đếm cho thanh lọc chú giải tương tác
  const filterCounts = useMemo(() => {
    let prey = 0;
    let competitor = 0;
    let symbiosis = 0;
    let habitat = 0;

    satelliteNodes.forEach((n) => {
      if (
        n.flow === "toCenter" ||
        n.relationshipType === "predator_prey" ||
        n.relationshipType === "herbivory"
      ) {
        prey++;
      } else if (n.relationshipType === "competitor") {
        competitor++;
      } else if (
        n.relationshipType === "symbiosis" ||
        n.relationshipType === "commensalism"
      ) {
        symbiosis++;
      } else if (n.relationshipType === "habitat_provider") {
        habitat++;
      }
    });

    return { prey, competitor, symbiosis, habitat };
  }, [satelliteNodes]);

  // Kiểm tra node có thỏa mãn bộ lọc chú giải đang chọn hay không
  const isNodeMatchingFilter = useCallback(
    (node) => {
      if (selectedRelationFilter === "all") return true;
      if (selectedRelationFilter === "prey") {
        return (
          node.flow === "toCenter" ||
          node.relationshipType === "predator_prey" ||
          node.relationshipType === "herbivory"
        );
      }
      if (selectedRelationFilter === "competitor") {
        return node.relationshipType === "competitor";
      }
      if (selectedRelationFilter === "symbiosis") {
        return (
          node.relationshipType === "symbiosis" ||
          node.relationshipType === "commensalism"
        );
      }
      if (selectedRelationFilter === "habitat") {
        return node.relationshipType === "habitat_provider";
      }
      return true;
    },
    [selectedRelationFilter]
  );

  // Phân tầng Tháp Dinh Dưỡng tự động theo sinh thái học thực thụ (Dynamic Trophic Hierarchy)
  const pyramidTiers = useMemo(() => {
    const hasPredators = roles.predators && roles.predators.length > 0;
    const hasPrey = roles.prey && roles.prey.length > 0;

    const formatCardItem = (item, roleBadge, borderColor) => ({
      id: item.speciesId || item.id,
      slug: item.slug || item.speciesId || item.id,
      name: (item.name || item.commonName || "").replace(/\s*\([^)]*\)/g, "").trim(),
      scientificName: item.scientificName || item.cleanScientificName || "",
      image: item.image || item.species_media?.[0]?.url || "",
      redList: item.redList || item.vietnamRedListStatus || "NE",
      roleBadge,
      borderColor,
    });

    if (hasPredators) {
      // Trường hợp 1: Loài khảo sát có thiên địch săn bắt nó (Mesopredator hoặc Con mồi)
      return {
        apex: {
          level: isEn ? "Rank III / IV" : "Bậc III / IV",
          titleVi: "Kẻ săn mồi đỉnh bảng & Thiên địch",
          titleEn: "Apex Predators & Trophic Threats",
          subVi: "Kiểm soát quần thể sinh vật từ đỉnh chuỗi thức ăn",
          subEn: "Top-down trophic regulators",
          color: "#f43f5e",
          bgGradient: "from-rose-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-rose-500/40",
          badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          items: roles.predators.map((p) =>
            formatCardItem(p, isEn ? "Apex Threat" : "Thiên địch đỉnh", "#f43f5e")
          ),
        },
        middle: {
          level: isEn ? "Rank II" : "Bậc II",
          titleVi: "Sinh vật khảo sát & Đối thủ cạnh tranh",
          titleEn: "Focal Species & Ecological Competitors",
          subVi: "Động vật tiêu thụ bậc trung trong mạng lưới sinh thái",
          subEn: "Mesopredators transferring kinetic biomass",
          color: "#f59e0b",
          bgGradient: "from-amber-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-amber-500/40",
          badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          items: [
            {
              ...centerNode,
              roleBadge: isEn ? "Focal Species" : "Sinh vật khảo sát",
              borderColor: "#38bdf8",
              isCenter: true,
            },
            ...(roles.competitors || []).map((c) =>
              formatCardItem(c, isEn ? "Competitor" : "Cạnh tranh", "#f59e0b")
            ),
          ],
        },
        bottom: {
          level: isEn ? "Rank I" : "Bậc I",
          titleVi: "Nguồn thức ăn & Sinh cảnh cơ sở",
          titleEn: "Primary Food Sources & Biogenic Habitat",
          subVi: "Năng lượng nuôi dưỡng quần thể từ tầng dưới",
          subEn: "Energy foundation sustaining the trophic chain",
          color: "#10b981",
          bgGradient: "from-emerald-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-emerald-500/40",
          badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          items: (hasPrey ? roles.prey : roles.habitats || []).map((p) =>
            formatCardItem(
              p,
              hasPrey
                ? isEn
                  ? "Food Source"
                  : "Nguồn thức ăn"
                : isEn
                ? "Habitat"
                : "Sinh cảnh",
              "#10b981"
            )
          ),
        },
      };
    } else {
      // Trường hợp 2: Loài khảo sát là Kẻ săn mồi đỉnh bảng (Apex Predator)
      const mesopredators = [];
      const primaryPrey = [];

      satelliteNodes.forEach((node) => {
        if (node.relationshipType === "competitor") {
          mesopredators.push(
            formatCardItem(node, isEn ? "Competitor" : "Cạnh tranh", "#f59e0b")
          );
        } else if (node.relationshipType === "predator_prey") {
          const name = node.cleanName.toLowerCase();
          const isMeso =
            name.includes("ngừ") ||
            name.includes("bạch tuộc") ||
            name.includes("nhám") ||
            name.includes("mực") ||
            name.includes("heo") ||
            node.groupName?.includes("Cá sụn") ||
            node.groupName?.includes("Thân mềm");

          if (isMeso) {
            mesopredators.push(
              formatCardItem(node, isEn ? "Mesopredator" : "Săn mồi bậc II", "#f59e0b")
            );
          } else {
            primaryPrey.push(
              formatCardItem(node, isEn ? "Forage Prey" : "Con mồi đàn / Sơ cấp", "#10b981")
            );
          }
        } else if (node.relationshipType === "herbivory") {
          primaryPrey.push(
            formatCardItem(node, isEn ? "Herbivore" : "Ăn thực vật", "#10b981")
          );
        } else if (
          node.relationshipType === "symbiosis" ||
          node.relationshipType === "commensalism"
        ) {
          primaryPrey.push(
            formatCardItem(node, isEn ? "Symbiont" : "Cộng sinh / Hội sinh", "#38bdf8")
          );
        }
      });

      if (mesopredators.length === 0 && primaryPrey.length > 2) {
        mesopredators.push(
          ...primaryPrey.splice(0, Math.ceil(primaryPrey.length / 2))
        );
      }

      return {
        apex: {
          level: isEn ? "Rank III / IV" : "Bậc III / IV",
          titleVi: "Kẻ săn mồi đỉnh bảng (Apex Predator)",
          titleEn: "Apex Predator (Top Trophic Rank)",
          subVi: "Đỉnh chóp chuỗi thức ăn, không có thiên địch tự nhiên trong đại dương",
          subEn: "Top trophic rank with zero natural apex predators",
          color: "#f43f5e",
          bgGradient: "from-rose-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-rose-500/40",
          badgeStyle: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          items: [
            {
              ...centerNode,
              roleBadge: isEn ? "Apex Predator" : "Kẻ săn mồi đỉnh bảng",
              borderColor: "#f43f5e",
              isCenter: true,
            },
          ],
        },
        middle: {
          level: isEn ? "Rank II" : "Bậc II",
          titleVi: "Động vật săn mồi bậc trung & Cạnh tranh sinh thái",
          titleEn: "Mesopredators & Trophic Competitors",
          subVi: "Động vật ăn thịt thứ cấp, điều phối sinh khối và cạnh tranh thức ăn",
          subEn: "Secondary carnivores transferring kinetic biomass",
          color: "#f59e0b",
          bgGradient: "from-amber-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-amber-500/40",
          badgeStyle: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          items: mesopredators,
        },
        bottom: {
          level: isEn ? "Rank I" : "Bậc I",
          titleVi: "Động vật tiêu thụ sơ cấp & Con mồi sinh khối",
          titleEn: "Primary Consumers & Forage Biomass",
          subVi: "Nguồn thức ăn cơ sở dồi dào, hấp thụ năng lượng quang hợp & thực vật",
          subEn: "Foundational forage prey sustaining higher trophic ranks",
          color: "#10b981",
          bgGradient: "from-emerald-950/40 via-[#0a1829] to-[#040c17]",
          borderColor: "border-emerald-500/40",
          badgeStyle: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          items: primaryPrey,
        },
      };
    }
  }, [roles, centerNode, satelliteNodes, isEn]);

  // Định vị tooltip/modal thông minh luôn hướng vào khoảng trống trung tâm, tránh bị che khuất
  const getTooltipPositionClass = (x, y) => {
    // Nếu node ở nửa trên đồ thị (y < -30) -> mở xuống dưới để không tràn viền trên
    const verticalClass = y < -30 ? "top-full mt-3" : "bottom-full mb-3";

    // Nếu node ở bên trái (x < -50) -> mở lệch sang phải (vào tâm)
    // Nếu node ở bên phải (x > 50) -> mở lệch sang trái (vào tâm)
    let horizontalClass = "left-1/2 -translate-x-1/2";
    if (x < -50) {
      horizontalClass = "left-0";
    } else if (x > 50) {
      horizontalClass = "right-0";
    }

    return `${verticalClass} ${horizontalClass}`;
  };

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
        className="group relative p-4 rounded-2xl bg-[#081729]/80 hover:bg-[#0c2038]/90 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between cursor-pointer block"
      >
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

          {/* Ảnh avatar tròn & Tên loài */}
          <div className="flex items-center gap-3.5 mb-3 relative z-10">
            <div
              className="w-13 h-13 rounded-full overflow-hidden shrink-0 border transition-all duration-300 group-hover:scale-105 bg-slate-900"
              style={{
                borderColor: `${meta.color}99`,
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
              ? "Interactive marine trophic linkages & energy flow in the East Sea"
              : "Khám phá mối tương tác chuỗi thức ăn và dòng truyền năng lượng sinh khối giữa các loài tại Biển Đông"}
          </p>
        </div>

        {/* View Switcher: Mạng lưới đại dương vs Tháp Dinh Dưỡng */}
        <div className="flex items-center gap-1 p-1 bg-[#091a30] border border-white/10 rounded-xl">
          <button
            onClick={() => setViewMode("orbit")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "orbit"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
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
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers size={13} />
            <span>{isEn ? "Trophic Pyramid" : "Tháp dinh dưỡng"}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. BIỂU ĐỒ MẠNG LƯỚI SINH THÁI ĐẠI DƯƠNG ───────── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#061528] via-[#040e1b] to-[#02070f] border border-cyan-500/25 overflow-hidden mb-12 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Thanh công cụ khoa học phía trên đồ thị */}
        <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
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

          {/* Chú giải & Bộ lọc tương tác (Interactive Filter Chips) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedRelationFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedRelationFilter === "all"
                  ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm"
                  : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
              }`}
            >
              <span>{isEn ? "All" : "Tất cả"}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-white/10 font-mono font-bold">
                {satelliteNodes.length}
              </span>
            </button>

            {filterCounts.prey > 0 && (
              <button
                onClick={() =>
                  setSelectedRelationFilter(
                    selectedRelationFilter === "prey" ? "all" : "prey"
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRelationFilter === "prey"
                    ? "bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-sm"
                    : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                <span>{isEn ? "Prey" : "Con mồi"}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {filterCounts.prey}
                </span>
              </button>
            )}

            {filterCounts.competitor > 0 && (
              <button
                onClick={() =>
                  setSelectedRelationFilter(
                    selectedRelationFilter === "competitor" ? "all" : "competitor"
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRelationFilter === "competitor"
                    ? "bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm"
                    : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>{isEn ? "Competitors" : "Cạnh tranh"}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {filterCounts.competitor}
                </span>
              </button>
            )}

            {filterCounts.symbiosis > 0 && (
              <button
                onClick={() =>
                  setSelectedRelationFilter(
                    selectedRelationFilter === "symbiosis" ? "all" : "symbiosis"
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRelationFilter === "symbiosis"
                    ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm"
                    : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                <span>{isEn ? "Symbiosis" : "Cộng sinh"}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {filterCounts.symbiosis}
                </span>
              </button>
            )}

            {filterCounts.habitat > 0 && (
              <button
                onClick={() =>
                  setSelectedRelationFilter(
                    selectedRelationFilter === "habitat" ? "all" : "habitat"
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedRelationFilter === "habitat"
                    ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-sm"
                    : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span>{isEn ? "Habitat" : "Sinh cảnh"}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {filterCounts.habitat}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Khung tương tác chính */}
        {loading ? (
          <div className="h-[480px] flex flex-col items-center justify-center gap-3 text-cyan-400">
            <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400">
              {isEn
                ? "Simulating East Sea marine ecological matrix..."
                : "Đang mô phỏng ma trận sinh thái Biển Đông..."}
            </span>
          </div>
        ) : error ? (
          <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center text-rose-400 gap-3">
            <AlertTriangle size={36} className="text-rose-500/80" />
            <p className="text-sm font-medium text-slate-200">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={13} />
              <span>{isEn ? "Retry" : "Thử lại"}</span>
            </button>
          </div>
        ) : totalRelations === 0 ? (
          <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2">
            <Compass size={36} className="text-cyan-500/50" />
            <p className="text-sm font-medium text-slate-300">
              {isEn
                ? "No specific trophic network data recorded for this species"
                : "Chưa có dữ liệu mạng lưới cụ thể cho loài này"}
            </p>
          </div>
        ) : viewMode === "orbit" ? (
          /* ─── VIEW 1: BIOLUMINESCENT ORBITAL UNIVERSE (RESIZED SVG STAGE) ─── */
          <div
            ref={containerRef}
            className="relative h-[500px] md:h-[550px] w-full flex items-center justify-center overflow-hidden select-none"
            onClick={() => setActiveNodeId(null)}
          >
            {/* Lớp nền chiều sâu đại dương với lưới tọa độ trắc đạc */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,40,78,0.55)_0%,transparent_75%)] pointer-events-none" />

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
              {/* Quét Radar Sonar đại dương xoay tròn dịu nhẹ (Oceanic Sonar Sweep) */}
              <div className="absolute w-[460px] h-[460px] rounded-full pointer-events-none overflow-hidden opacity-25 animate-[spin_12s_linear_infinite]">
                <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0_310deg,rgba(56,189,248,0.22)_360deg)]" />
              </div>

              {/* Sóng xung kích sonar đồng tâm từ tâm */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-500/15 pointer-events-none animate-[ping_7s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <div className="absolute w-[390px] h-[390px] rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute w-[490px] h-[490px] rounded-full border border-dashed border-cyan-400/15 pointer-events-none" />

              {/* Trục tọa độ hải dương học vi mô */}
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />

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
                  const isMatch = isNodeMatchingFilter(n);
                  const strokeColor = n.meta.color;
                  const strokeWidth = isHovered ? 3.5 : 1.8 + (n.strength ?? 1) * 1.1;

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
                          !isMatch
                            ? 0.05
                            : hoveredNodeId || activeNodeId
                            ? isHovered
                              ? 1
                              : 0.12
                            : 0.65
                        }
                        filter={isHovered ? "url(#glowLine)" : undefined}
                        className="transition-all duration-300"
                      />

                      {/* Hạt năng lượng phát sáng chuyển động */}
                      {n.flow !== "none" && isMatch && (
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
                  whileHover={{ scale: 1.04 }}
                  className="relative cursor-pointer group flex flex-col items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {/* Vành xoay radar khoa học quanh quả cầu trung tâm */}
                  <div className="absolute -inset-2.5 rounded-full border border-cyan-400/30 border-dashed animate-[spin_24s_linear_infinite] pointer-events-none" />
                  <div className="absolute -inset-1 rounded-full bg-cyan-400/10 blur-md pointer-events-none" />

                  {/* Quả cầu avatar tròn tinh tế */}
                  <div className="relative w-24 h-24 md:w-26 md:h-26 rounded-full overflow-hidden border-2 border-cyan-400/90 bg-[#091b30] shadow-[0_0_25px_rgba(56,189,248,0.35)]">
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

                  {/* Nhãn loài trung tâm kèm huy hiệu Sách Đỏ - Đặt ngay sát đáy quả cầu */}
                  <div className="mt-2.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#030d1a]/95 border border-cyan-400/50 shadow-lg flex items-center gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {centerNode.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${centerRedListMeta.style}`}
                    >
                      {centerNode.redList || "NE"}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* CÁC NODE VỆ TINH TRÒN QUANH QUỸ ĐẠO */}
              {orbitalNodes.map((node) => {
                const isHovered = hoveredNodeId === node.id || activeNodeId === node.id;
                const isMatch = isNodeMatchingFilter(node);
                const meta = node.meta;
                const RoleIcon = meta.Icon || Target;
                const redListMeta =
                  RED_LIST_STANDARDS[node.redList] || RED_LIST_STANDARDS.NE;

                return (
                  <div
                    key={node.id}
                    className={`absolute transition-all duration-300 ${
                      isHovered ? "z-50" : "z-15"
                    }`}
                    style={{
                      left: STAGE.w / 2 + node.x,
                      top: STAGE.h / 2 + node.y,
                      transform: "translate(-50%, -50%)",
                      opacity: isMatch ? 1 : 0.22,
                      filter: isMatch ? "none" : "grayscale(0.85) contrast(0.85)",
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNodeId(activeNodeId === node.id ? null : node.id);
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: isMatch ? 1.08 : 1 }}
                      whileTap={{ scale: 0.96 }}
                      className="relative cursor-pointer flex flex-col items-center"
                    >
                      {/* Quả cầu avatar tròn tinh tế */}
                      <div
                        className="relative w-15 h-15 md:w-16 md:h-16 rounded-full overflow-hidden border-2 bg-[#091b30] transition-all duration-300 shadow-md"
                        style={{
                          borderColor: isHovered ? meta.color : `${meta.color}bb`,
                          boxShadow: isHovered ? `0 0 16px ${meta.color}66` : undefined,
                        }}
                      >
                        {node.image ? (
                          <img
                            src={node.image}
                            alt={node.cleanName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

                      {/* Micro-badge vai trò sinh thái góc trên bên trái */}
                      <span
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center border shadow-md"
                        style={{
                          backgroundColor: "#051323",
                          borderColor: meta.color,
                        }}
                        title={node.relationCategoryLabel}
                      >
                        <RoleIcon size={11} style={{ color: meta.color }} />
                      </span>

                      {/* Huy hiệu Sách Đỏ ở góc trên bên phải */}
                      <span
                        className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${redListMeta.style}`}
                      >
                        {node.redList || "NE"}
                      </span>

                      {/* Nhãn tên sinh vật và vai trò bên dưới */}
                      <div
                        className={`mt-2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 border flex items-center gap-1.5 shadow-md ${
                          isHovered
                            ? "bg-cyan-500/20 text-cyan-200 border-cyan-400/80 scale-105"
                            : "bg-[#061426]/95 text-slate-200 border-white/10"
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="text-[11px] font-medium text-slate-300">
                          {node.relationCategoryLabel}:
                        </span>
                        <span className="font-bold text-white">
                          {node.cleanName}
                        </span>
                      </div>
                    </motion.div>

                    {/* Tooltip nổi khi Hover hoặc Click chạm */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute ${getTooltipPositionClass(
                            node.x,
                            node.y
                          )} w-64 p-3.5 rounded-2xl bg-[#07172b]/95 backdrop-blur-xl border border-cyan-400/40 shadow-xl shadow-black/40 text-left z-50 cursor-default pointer-events-auto select-text`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.badgeColor}`}
                            >
                              <RoleIcon size={11} />
                              <span>{node.relationCategoryLabel}</span>
                            </span>
                            <span className="text-[10px] text-cyan-300 font-mono">
                              Sách Đỏ {node.redList || "NE"}
                            </span>
                          </div>

                          <h5 className="font-bold text-xs text-white">
                            {node.cleanName}
                          </h5>
                          {node.cleanScientificName && (
                            <p className="text-[10px] text-slate-400 italic font-serif mb-1.5">
                              {node.cleanScientificName}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                            {node.relationDescription}
                          </p>

                          <Link
                            to={`/species/${node.slug || node.id}`}
                            className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer group/link"
                          >
                            <span className="group-hover/link:underline">
                              {isEn ? "View species profile" : "Xem hồ sơ loài chi tiết"}
                            </span>
                            <ArrowUpRight
                              size={13}
                              className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                            />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Hướng dẫn thao tác góc dưới */}
            <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 flex items-center gap-2 bg-[#04101e]/85 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>
                {isEn
                  ? "Click any orb or filter tag to inspect trophic relationships"
                  : "Nhấp vào quả cầu hoặc thẻ lọc để xem tương tác sinh thái chi tiết"}
              </span>
            </div>
          </div>
        ) : (
          /* ─── VIEW 2: THÁP DINH DƯỠNG ĐẠI DƯƠNG (TROPHIC HIERARCHY PYRAMID) ─── */
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono">
                Trophic Level Pyramid • Biển Đông
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                {isEn
                  ? "Oceanic Biomass Flow & Trophic Energy Hierarchy"
                  : "Dòng truyền năng lượng & Bậc dinh dưỡng đại dương"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isEn
                  ? "According to Lindeman's 10% ecological efficiency law, biomass energy attenuates as it moves up from primary producers to apex marine carnivores."
                  : "Theo quy luật sinh thái học đại dương của Lindeman, năng lượng sinh khối được chuyển đổi khoảng 10% qua mỗi bậc dinh dưỡng từ con mồi cơ sở lên động vật ăn thịt bậc cao."}
              </p>
            </div>

            {/* KIẾN TRÚC KIM TỰ THÁP BẬC THANG (STEPPED TRAPEZOID PYRAMID) */}
            <div className="flex flex-col items-center space-y-3">
              {/* TẦNG ĐỈNH: Kẻ săn mồi đỉnh bảng (Apex Predator) - Max-Width Hẹp nhất */}
              {pyramidTiers.apex.items.length > 0 && (
                <div
                  className={`max-w-xl w-full mx-auto p-4 md:p-5 rounded-2xl bg-gradient-to-b ${pyramidTiers.apex.bgGradient} border ${pyramidTiers.apex.borderColor} shadow-[0_8px_30px_rgba(244,63,94,0.12)] transition-all relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pyramidTiers.apex.badgeStyle}`}
                      >
                        {pyramidTiers.apex.level}
                      </span>
                      <h4 className="text-xs md:text-sm font-bold text-white">
                        {isEn ? pyramidTiers.apex.titleEn : pyramidTiers.apex.titleVi}
                      </h4>
                    </div>
                    <span className="text-[10px] text-rose-300 font-mono">
                      {isEn ? "Apex Predator" : "Đỉnh chuỗi thức ăn"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3 italic">
                    {isEn ? pyramidTiers.apex.subEn : pyramidTiers.apex.subVi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pyramidTiers.apex.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/species/${item.slug || item.id}`}
                        className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-rose-400/50 flex items-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                      >
                        <div
                          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2"
                          style={{ borderColor: item.borderColor }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-300 line-clamp-1 transition-colors">
                              {item.name}
                            </span>
                            {item.isCenter && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                                {isEn ? "Focal" : "Loài này"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 italic line-clamp-1 font-serif">
                            {item.scientificName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-300">
                              {item.roleBadge}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 font-semibold">
                              Sách Đỏ {item.redList || "NE"}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight
                          size={13}
                          className="text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ĐẦU NỐI DÒNG NĂNG LƯỢNG TRUYỀN LÊN: LINDEMAN 10% RULE */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-900/90 border border-rose-500/30 text-rose-300 shadow-md">
                  <span className="inline-block animate-bounce text-xs">▲</span>
                  <span className="font-mono text-[11px] font-bold">
                    {isEn
                      ? "~10% Biomass Transfer (Lindeman's 10% Rule)"
                      : "~10% Hiệu suất truyền sinh khối (Quy luật 10% Lindeman)"}
                  </span>
                  <span className="text-[10px] text-slate-400 border-l border-white/10 pl-2 hidden sm:inline">
                    {isEn
                      ? "90% energy lost to respiration & motion"
                      : "90% tiêu hao trao đổi chất & vận động"}
                  </span>
                </div>
                <div className="w-0.5 h-4 bg-gradient-to-t from-amber-400 to-rose-400 my-0.5" />
              </div>

              {/* TẦNG GIỮA: Săn mồi bậc trung & Cạnh tranh - Max-Width Trung Bình */}
              {pyramidTiers.middle.items.length > 0 && (
                <div
                  className={`max-w-3xl w-full mx-auto p-4 md:p-5 rounded-2xl bg-gradient-to-b ${pyramidTiers.middle.bgGradient} border ${pyramidTiers.middle.borderColor} shadow-[0_8px_30px_rgba(245,158,11,0.12)] transition-all relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pyramidTiers.middle.badgeStyle}`}
                      >
                        {pyramidTiers.middle.level}
                      </span>
                      <h4 className="text-xs md:text-sm font-bold text-white">
                        {isEn ? pyramidTiers.middle.titleEn : pyramidTiers.middle.titleVi}
                      </h4>
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {isEn ? "Mesopredators & Competitors" : "Săn mồi bậc trung & Cạnh tranh"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3 italic">
                    {isEn ? pyramidTiers.middle.subEn : pyramidTiers.middle.subVi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {pyramidTiers.middle.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/species/${item.slug || item.id}`}
                        className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/50 flex items-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                      >
                        <div
                          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2"
                          style={{ borderColor: item.borderColor }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 line-clamp-1 transition-colors">
                              {item.name}
                            </span>
                            {item.isCenter && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                                {isEn ? "Focal" : "Loài này"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 italic line-clamp-1 font-serif">
                            {item.scientificName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-300">
                              {item.roleBadge}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 font-semibold">
                              Sách Đỏ {item.redList || "NE"}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight
                          size={13}
                          className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ĐẦU NỐI DÒNG NĂNG LƯỢNG TRUYỀN LÊN: CON MỒI -> BẬC TRUNG */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 shadow-md">
                  <span className="inline-block animate-bounce text-xs">▲</span>
                  <span className="font-mono text-[11px] font-bold">
                    {isEn
                      ? "Primary Trophic Fuel & Forage Abundance"
                      : "Nguồn cung cấp sơ cấp & Sinh khối nuôi dưỡng cơ sở"}
                  </span>
                  <span className="text-[10px] text-slate-400 border-l border-white/10 pl-2 hidden sm:inline">
                    {isEn
                      ? "Benthic & pelagic energy foundation"
                      : "Dòng dinh dưỡng gốc đại dương"}
                  </span>
                </div>
                <div className="w-0.5 h-4 bg-gradient-to-t from-emerald-400 to-amber-400 my-0.5" />
              </div>

              {/* TẦNG ĐÁY: Tiêu thụ sơ cấp, Ăn thực vật & Con mồi đàn - Rộng nhất (100% Max-Width) */}
              {pyramidTiers.bottom.items.length > 0 && (
                <div
                  className={`max-w-5xl w-full mx-auto p-4 md:p-5 rounded-2xl bg-gradient-to-b ${pyramidTiers.bottom.bgGradient} border ${pyramidTiers.bottom.borderColor} shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-all relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pyramidTiers.bottom.badgeStyle}`}
                      >
                        {pyramidTiers.bottom.level}
                      </span>
                      <h4 className="text-xs md:text-sm font-bold text-white">
                        {isEn ? pyramidTiers.bottom.titleEn : pyramidTiers.bottom.titleVi}
                      </h4>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-mono">
                      {isEn ? "Primary Consumers & Forage Biomass" : "Tiêu thụ sơ cấp & Con mồi đàn"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3 italic">
                    {isEn ? pyramidTiers.bottom.subEn : pyramidTiers.bottom.subVi}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {pyramidTiers.bottom.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/species/${item.slug || item.id}`}
                        className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/50 flex items-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                      >
                        <div
                          className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2"
                          style={{ borderColor: item.borderColor }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 line-clamp-1 transition-colors">
                              {item.name}
                            </span>
                            {item.isCenter && (
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                                 {isEn ? "Focal" : "Loài này"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 italic line-clamp-1 font-serif">
                            {item.scientificName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-300">
                              {item.roleBadge}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 font-semibold">
                              Sách Đỏ {item.redList || "NE"}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight
                          size={13}
                          className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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
