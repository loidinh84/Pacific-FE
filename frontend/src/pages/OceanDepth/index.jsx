import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Compass,
  Gauge,
  Sun,
  Thermometer,
  ChevronDown,
  Play,
  Pause,
  Flashlight,
  Layers,
  Eye,
  Clock,
  RotateCcw,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { OCEAN_ZONES, CREATURES_BY_DEPTH } from "./depthData";
import { fetchDepthDistribution } from "../../services/speciesApi";
import { WaveIcon } from "../../assets/Icons";
import DiveQuickDrawer from "./DiveQuickDrawer";
import ZoneSpeciesDrawer from "./ZoneSpeciesDrawer";
import "./OceanDepth.css";

// ─── Oceanographic Depth Scale (Piecewise Linear for Balanced Pacing) ────────
const MAX_DEPTH = 5016;
const DIVE_ORIGIN_OFFSET = 156;
const SEABED_HEIGHT = 900;

const DEPTH_SEGMENTS = [
  { d0: 0,    d1: 200,  px0: 0,    px1: 1200 }, // 6.0 px/m — Sunlight Zone
  { d0: 200,  d1: 1000, px0: 1200, px1: 3200 }, // 2.5 px/m — Twilight Zone
  { d0: 1000, d1: 4000, px0: 3200, px1: 7400 }, // 1.4 px/m — Midnight Zone
  { d0: 4000, d1: 5016, px0: 7400, px1: 9229 }, // 1.8 px/m — Abyssal & Manila Trench
];
const TOTAL_DIVE_PX = DEPTH_SEGMENTS[DEPTH_SEGMENTS.length - 1].px1;

function depthToPx(depth) {
  const d = Math.max(0, Math.min(MAX_DEPTH, depth));
  for (const s of DEPTH_SEGMENTS) {
    if (d <= s.d1) {
      const t = (d - s.d0) / (s.d1 - s.d0);
      return s.px0 + t * (s.px1 - s.px0);
    }
  }
  return TOTAL_DIVE_PX;
}

function pxToDepth(px) {
  const p = Math.max(0, Math.min(TOTAL_DIVE_PX, px));
  for (const s of DEPTH_SEGMENTS) {
    if (p <= s.px1) {
      const t = (p - s.px0) / (s.px1 - s.px0);
      return Math.round(s.d0 + t * (s.d1 - s.d0));
    }
  }
  return MAX_DEPTH;
}

function depthToRulerPct(depth) {
  return (depthToPx(depth) / TOTAL_DIVE_PX) * 100;
}

// ─── Synchronized Pacific Ocean Color Ramp (Sunlit Azure → Pacific Abyss) ────
function getRealisticOceanColor(depth) {
  if (depth <= 30) {
    const f = depth / 30;
    return `color-mix(in srgb, #0ea5e9 ${(1 - f) * 100}%, #0284c7)`;
  }
  if (depth <= 120) {
    const f = (depth - 30) / 90;
    return `color-mix(in srgb, #0284c7 ${(1 - f) * 100}%, #0369a1)`;
  }
  if (depth <= 260) {
    const f = (depth - 120) / 140;
    return `color-mix(in srgb, #0369a1 ${(1 - f) * 100}%, #07406b)`;
  }
  if (depth <= 650) {
    const f = (depth - 260) / 390;
    return `color-mix(in srgb, #07406b ${(1 - f) * 100}%, #0b2545)`;
  }
  if (depth <= 1400) {
    const f = (depth - 650) / 750;
    return `color-mix(in srgb, #0b2545 ${(1 - f) * 100}%, #08203e)`;
  }
  if (depth <= 3000) {
    const f = (depth - 1400) / 1600;
    return `color-mix(in srgb, #08203e ${(1 - f) * 100}%, #040f22)`;
  }
  const f = Math.min(1, (depth - 3000) / 2016);
  return `color-mix(in srgb, #040f22 ${(1 - f) * 100}%, #020611)`;
}

// ─── Real-Time East Sea Physical Oceanography Estimates ──────────────────────
function getWaterPressureLabel(depth) {
  const atm = 1 + depth / 10;
  return `${atm >= 100 ? Math.round(atm).toLocaleString() : atm.toFixed(1)} atm`;
}

function getWaterTempLabel(depth) {
  let temp;
  if (depth <= 50) {
    temp = 28.5 - (depth / 50) * 2.5;
  } else if (depth <= 200) {
    temp = 26.0 - ((depth - 50) / 150) * 10.8;
  } else if (depth <= 1000) {
    temp = 15.2 - ((depth - 200) / 800) * 10.4;
  } else if (depth <= 2500) {
    temp = 4.8 - ((depth - 1000) / 1500) * 2.5;
  } else {
    temp = 2.3 - Math.min(1, (depth - 2500) / 2516) * 0.9;
  }
  return `${temp.toFixed(1)}°C`;
}

function getWaterLightLabel(depth) {
  if (depth <= 2) return "100%";
  if (depth <= 200) {
    const pct = Math.max(1, Math.round(100 * Math.exp(-depth / 43.4)));
    return `${pct}%`;
  }
  if (depth < 500) return "< 1%";
  return "0%";
}

function getZoneAtDepth(depth) {
  return (
    OCEAN_ZONES.find((z) => depth >= z.depthStart && depth < z.depthEnd) ||
    OCEAN_ZONES[OCEAN_ZONES.length - 1]
  );
}

function getSeededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function formatRedListCode(redList) {
  if (!redList) return null;
  const code = String(redList).trim().toUpperCase().split(/\s+/)[0];
  if (code === "CR" || code === "EN") return { code, tone: "is-critical" };
  if (code === "VU" || code === "NT") return { code, tone: "is-vulnerable" };
  return null;
}

function formatDuration(sec) {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Ruler Tick Definitions ──────────────────────────────────────────────────
const RULER_MAJOR_TICKS = [
  { d: 0,    label: "0m",     sub: "Mực nước biển" },
  { d: 200,  label: "200m",   sub: "Ranh giới ánh sáng" },
  { d: 500,  label: "500m",   sub: "" },
  { d: 1000, label: "1,000m", sub: "Vùng nửa đêm" },
  { d: 2000, label: "2,000m", sub: "" },
  { d: 3000, label: "3,000m", sub: "" },
  { d: 4000, label: "4,000m", sub: "Vực thẳm" },
  { d: 5016, label: "5,016m", sub: "Rãnh Manila", isMax: true },
];

// ─── Floating Adaptive Depth Ruler ───────────────────────────────────────────
function FixedRuler({ depth, isSurface, isHidden, onJumpDepth }) {
  const pointerPct = Math.min(99.5, Math.max(0.5, depthToRulerPct(depth)));
  const { language } = useLanguageStore();

  const minorTicks = useMemo(() => {
    const ticks = [];
    for (let d = 50; d <= 5000; d += 100) {
      const isMajor = RULER_MAJOR_TICKS.some((m) => m.d === d);
      if (!isMajor) {
        ticks.push({ d, isMedium: d % 500 === 0 });
      }
    }
    return ticks;
  }, []);

  return (
    <aside
      className={`od-ruler ${isSurface ? "is-surface" : "is-submerged"} ${isHidden ? "is-hidden" : ""}`}
      aria-label={language === "en" ? "East Sea Depth Ruler" : "Thước đo độ sâu Biển Đông"}
    >
      <div className="od-ruler-header">
        <span className="od-ruler-header-tag">
          {language === "en" ? "Depth" : "Độ sâu"}
        </span>
        <span className="od-ruler-header-unit">
          {language === "en" ? "meters" : "đơn vị: mét"}
        </span>
      </div>

      <div className="od-ruler-body">
        <div className="od-ruler-track">
          {OCEAN_ZONES.map((z) => {
            const topPct = depthToRulerPct(z.depthStart);
            const bottomPct = depthToRulerPct(z.depthEnd);
            return (
              <div
                key={z.id}
                className="od-ruler-zone-segment"
                title={`${language === "en" ? z.nameEn : z.nameVi} (${z.depthStart}m–${z.depthEnd}m)`}
                onClick={() => onJumpDepth(z.depthStart)}
                style={{
                  top: `${topPct}%`,
                  height: `${Math.max(1, bottomPct - topPct)}%`,
                  background: `linear-gradient(to bottom, ${z.colorFrom}, ${z.colorTo})`,
                }}
              />
            );
          })}
        </div>

        <div className="od-ruler-subticks" aria-hidden="true">
          {minorTicks.map(({ d, isMedium }) => (
            <div
              key={`st-${d}`}
              className={`od-ruler-subtick ${isMedium ? "is-medium" : ""}`}
              style={{ top: `${depthToRulerPct(d)}%` }}
            />
          ))}
        </div>

        <div className="od-ruler-major-ticks">
          {RULER_MAJOR_TICKS.map(({ d, label, sub, isMax }) => {
            const isPassed = depth >= d;
            return (
              <button
                key={`rt-${d}`}
                type="button"
                className={`od-ruler-tick-btn ${isPassed ? "is-passed" : ""} ${isMax ? "is-max" : ""}`}
                style={{ top: `${depthToRulerPct(d)}%` }}
                onClick={() => onJumpDepth(d)}
                title={`${language === "en" ? "Jump to" : "Nhảy tới"} ${label}${sub ? ` (${sub})` : ""}`}
              >
                <span className="od-ruler-tick-line" />
                <span className="od-ruler-tick-text">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="od-ruler-cursor" style={{ top: `${pointerPct}%` }}>
          <div className="od-ruler-cursor-needle" />
          <div className="od-ruler-cursor-badge">
            <span className="od-ruler-cursor-dot" />
            <span className="od-ruler-cursor-val">{depth.toLocaleString()}m</span>
          </div>
        </div>
      </div>

      <div
        className="od-ruler-footer"
        onClick={() => onJumpDepth(MAX_DEPTH)}
        title={
          language === "en"
            ? "Deepest point in East Sea: Manila Trench (5,016m)"
            : "Điểm sâu nhất Biển Đông: Rãnh Manila (5.016m)"
        }
      >
        <span className="od-ruler-footer-label">
          {language === "en" ? "5,016m Max" : "Đáy 5.016m"}
        </span>
      </div>
    </aside>
  );
}

// ─── Ambient Suspended Ocean Particles ───────────────────────────────────────
function EnvironmentParticles({ depth, isHidden }) {
  const isDeep = depth > 220;
  const isAbyssal = depth > 750;

  const particles = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const r1 = getSeededRandom(`p-type-${i}-${isDeep ? 1 : 0}-${isAbyssal ? 1 : 0}`);
      const r2 = getSeededRandom(`p-size-${i}`);
      const r3 = getSeededRandom(`p-left-${i}`);
      const r4 = getSeededRandom(`p-delay-${i}`);
      const r5 = getSeededRandom(`p-duration-${i}`);

      let type = "snow";
      if (!isDeep && r1 < 0.62) {
        type = "bubble";
      } else if (isAbyssal && r1 < 0.42) {
        type = "biolum";
      }
      list.push({
        id: i,
        type,
        size:
          type === "bubble"
            ? r2 * 7 + 4
            : type === "biolum"
            ? r2 * 4 + 2.5
            : r2 * 2.8 + 1.4,
        left: r3 * 100,
        delay: r4 * 6,
        duration:
          type === "bubble"
            ? r5 * 5 + 4.5
            : type === "biolum"
            ? r5 * 8 + 6
            : r5 * 12 + 10,
      });
    }
    return list;
  }, [isDeep, isAbyssal]);

  return (
    <div
      className={`od-particles ${isHidden ? "is-hidden" : ""}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={`${p.type}-${p.id}`}
          className={`od-particle ${p.type}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Top-Center Adaptive Liquid Glass Zone Navigation Pill ───────────────────
function QuickZoneBar({ currentDepth, isSurface, isHidden, onJumpDepth }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const ZONES_NAV = [
    { depth: 0,    dot: "#38bdf8", labelVi: "Mặt nước",    labelEn: "Surface" },
    { depth: 200,  dot: "#0ea5e9", labelVi: "Chạng vạng",  labelEn: "Twilight" },
    { depth: 1000, dot: "#3b82f6", labelVi: "Nửa đêm",     labelEn: "Midnight" },
    { depth: 4000, dot: "#60a5fa", labelVi: "Vực thẳm",    labelEn: "Abyss" },
    { depth: 5016, dot: "#93c5fd", labelVi: "Rãnh Manila", labelEn: "Manila Trench" },
  ];

  return (
    <nav
      className={`od-quick-jump-bar ${isSurface ? "is-surface" : "is-submerged"} ${isHidden ? "is-hidden" : ""}`}
      aria-label={isEn ? "Quick ocean zone navigation" : "Điều hướng nhanh các tầng biển"}
    >
      {ZONES_NAV.map((z) => {
        const isActive =
          z.depth === 5016
            ? currentDepth >= 4750
            : z.depth === 4000
            ? currentDepth >= 3900 && currentDepth < 4750
            : z.depth === 1000
            ? currentDepth >= 950 && currentDepth < 3900
            : z.depth === 200
            ? currentDepth >= 180 && currentDepth < 950
            : currentDepth < 180;

        return (
          <button
            key={z.depth}
            type="button"
            onClick={() => onJumpDepth(z.depth)}
            className={`od-quick-jump-btn ${isActive ? "is-active" : ""}`}
          >
            <span
              className="od-quick-jump-dot"
              style={{ backgroundColor: z.dot }}
            />
            <span>{isEn ? z.labelEn : z.labelVi}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Bottom-Center Floating Telemetry & Expedition Command Dock ──────────────
function DiveTelemetryDock({
  depth,
  currentZone,
  isVisible,
  seenCount,
  totalCount,
  zoneSpeciesCount,
  isAutoDiving,
  diveSpeed,
  isRovLightOn,
  onToggleAutoDive,
  onCycleDiveSpeed,
  onToggleRovLight,
  onOpenZoneCatalog,
  onBackToTop,
}) {
  const { language, t } = useLanguageStore();
  const isEn = language === "en";
  const isDeepEnoughForRov = depth >= 900;

  return (
    <div
      className={`od-telemetry-dock ${!isVisible ? "is-hidden" : ""}`}
      role="region"
      aria-label={t("oceanDepth.hudTitle")}
    >
      {/* Zone & Live Depth */}
      <div className="od-telemetry-zone">
        <span
          className="od-telemetry-zone-dot"
          style={{
            backgroundColor: currentZone.accent || "#38bdf8",
            color: currentZone.accent || "#38bdf8",
          }}
        />
        <span className="od-telemetry-zone-name">
          {isEn ? currentZone.nameEn : currentZone.nameVi}
        </span>
      </div>

      <span className="od-telemetry-sep" />

      <span className="od-telemetry-depth">
        {depth.toLocaleString()} m
      </span>

      {/* Physical Oceanography Readouts */}
      <div className="od-telemetry-metrics">
        <span className="od-telemetry-sep" />
        <span className="od-telemetry-metric" title={t("oceanDepth.pressure")}>
          <Gauge size={13} />
          <span>{getWaterPressureLabel(depth)}</span>
        </span>
        <span className="od-telemetry-metric" title={t("oceanDepth.temperature")}>
          <Thermometer size={13} />
          <span>{getWaterTempLabel(depth)}</span>
        </span>
        <span className="od-telemetry-metric" title={t("oceanDepth.light")}>
          <Sun size={13} />
          <span>{getWaterLightLabel(depth)}</span>
        </span>
      </div>

      <span className="od-telemetry-sep" />

      {/* Dive Log Counter Pill (#6) */}
      <span
        className="od-dock-log-pill"
        title={
          isEn
            ? `Encountered ${seenCount} of ${totalCount} signature depth species`
            : `Đã bắt gặp ${seenCount}/${totalCount} loài đặc trưng theo độ sâu`
        }
      >
        <Eye size={12} />
        <span>
          {seenCount}/{totalCount}
        </span>
      </span>

      {/* Live Zone DB Species Catalog Button (#5) */}
      <button
        type="button"
        className="od-dock-catalog-btn"
        onClick={onOpenZoneCatalog}
        title={
          isEn
            ? `Browse all ${zoneSpeciesCount} database species in this zone`
            : `Xem tất cả ${zoneSpeciesCount} loài trong CSDL ở tầng này`
        }
      >
        <Layers size={13} />
        <span>
          {zoneSpeciesCount > 0
            ? `${zoneSpeciesCount.toLocaleString()} ${isEn ? "species" : "loài"}`
            : isEn
            ? "Catalog"
            : "Tầng này"}
        </span>
      </button>

      {/* Interactive Command Controls (Auto-Dive, ROV Spotlight, Top) */}
      <div className="od-dock-controls">
        <button
          type="button"
          className={`od-dock-icon-btn ${isAutoDiving ? "is-active is-pulsing" : ""}`}
          onClick={onToggleAutoDive}
          title={
            isAutoDiving
              ? isEn
                ? "Pause Auto-Dive"
                : "Tạm dừng lặn tự động"
              : isEn
              ? "Auto-Dive Cruise Mode"
              : "Lặn tự động (Auto-Dive)"
          }
          aria-label={isAutoDiving ? "Pause Auto-Dive" : "Start Auto-Dive"}
        >
          {isAutoDiving ? <Pause size={13} /> : <Play size={13} />}
        </button>

        {isAutoDiving && (
          <button
            type="button"
            className="od-dock-speed-btn"
            onClick={onCycleDiveSpeed}
            title={isEn ? "Change dive speed" : "Đổi tốc độ lặn"}
          >
            {diveSpeed}x
          </button>
        )}

        <button
          type="button"
          className={`od-dock-icon-btn ${isRovLightOn && isDeepEnoughForRov ? "is-active" : ""} ${!isRovLightOn ? "is-muted" : ""}`}
          onClick={onToggleRovLight}
          title={
            isEn
              ? `ROV Spotlight (${isRovLightOn ? "On" : "Off"} • Active below 900m)`
              : `Đèn tàu lặn ROV theo chuột (${isRovLightOn ? "Bật" : "Tắt"} • Hoạt động từ 900m)`
          }
          aria-label="Toggle ROV Spotlight"
        >
          <Flashlight size={13} />
        </button>

        <button
          type="button"
          className="od-dock-icon-btn"
          onClick={onBackToTop}
          title={isEn ? "Return to surface" : "Trở về mặt biển"}
          aria-label={isEn ? "Return to surface" : "Trở về mặt biển"}
        >
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main OceanDepth Page ────────────────────────────────────────────────────
export default function OceanDepth() {
  const containerRef = useRef(null);
  const rovSpotlightRef = useRef(null);
  const { t, language } = useLanguageStore();
  const isEn = language === "en";
  const loc = (vi, en) => (isEn ? en : vi);

  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900
  );
  const [depth, setDepth] = useState(0);
  const [isSurface, setIsSurface] = useState(true);
  const [isInFooter, setIsInFooter] = useState(false);
  const [apiCreatures, setApiCreatures] = useState([]);

  // Feature #1: ROV Interactive Cursor Spotlight
  const [isRovLightOn, setIsRovLightOn] = useState(true);

  // Feature #2: Quick Dive Inspector Drawer
  const [selectedCreature, setSelectedCreature] = useState(null);

  // Feature #4: Auto-Dive Cruise Mode
  const [isAutoDiving, setIsAutoDiving] = useState(false);
  const [diveSpeed, setDiveSpeed] = useState(1);

  // Feature #5: Live PostgreSQL Zone Species Catalog Drawer
  const [isZoneCatalogOpen, setIsZoneCatalogOpen] = useState(false);

  // Feature #6: Dive Log & Expedition Stats
  const [seenIds, setSeenIds] = useState(() => new Set());
  const [maxDepthReached, setMaxDepthReached] = useState(0);
  const [diveDurationSec, setDiveDurationSec] = useState(0);
  const diveStartRef = useRef(null);

  const seabedTop = viewportHeight + DIVE_ORIGIN_OFFSET + TOTAL_DIVE_PX;
  const pageHeight = seabedTop + SEABED_HEIGHT;

  // Keep viewport height reactive on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load full visible species distribution from PostgreSQL (1,300+ species)
  useEffect(() => {
    let isMounted = true;
    fetchDepthDistribution()
      .then((res) => {
        if (!isMounted || !res) return;
        if (res.species && res.species.length > 0) {
          setApiCreatures(res.species);
        }
      })
      .catch((err) => {
        console.warn("Lỗi tải phân bố sinh vật theo độ sâu từ API:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Feature #1: 60fps Pointer-following ROV Spotlight (zero React re-renders)
  useEffect(() => {
    if (!isRovLightOn) return undefined;

    let targetX = typeof window !== "undefined" ? window.innerWidth * 0.5 : 640;
    let targetY = typeof window !== "undefined" ? window.innerHeight * 0.48 : 420;
    let curX = targetX;
    let curY = targetY;
    let rafId = null;

    const handleMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      if (rovSpotlightRef.current) {
        rovSpotlightRef.current.style.setProperty("--rov-x", `${curX.toFixed(1)}px`);
        rovSpotlightRef.current.style.setProperty("--rov-y", `${curY.toFixed(1)}px`);
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isRovLightOn]);

  // Feature #4: Auto-Dive Smooth Cruise Loop (auto-pauses on manual scroll or seabed arrival)
  useEffect(() => {
    if (!isAutoDiving) return undefined;

    let rafId = null;
    let lastTs = performance.now();
    const stopTargetY = viewportHeight + TOTAL_DIVE_PX + 120;

    const step = (now) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const pxPerSec = diveSpeed === 2 ? 235 : 115;
      const nextY = window.scrollY + pxPerSec * dt;

      if (nextY >= stopTargetY) {
        window.scrollTo(0, stopTargetY);
        setIsAutoDiving(false);
        return;
      }

      window.scrollTo(0, nextY);
      rafId = requestAnimationFrame(step);
    };

    const cancelOnManualInput = () => setIsAutoDiving(false);
    const cancelOnKey = (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " "].includes(e.key)) {
        setIsAutoDiving(false);
      }
    };

    window.addEventListener("wheel", cancelOnManualInput, { passive: true });
    window.addEventListener("touchstart", cancelOnManualInput, { passive: true });
    window.addEventListener("keydown", cancelOnKey);
    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", cancelOnManualInput);
      window.removeEventListener("touchstart", cancelOnManualInput);
      window.removeEventListener("keydown", cancelOnKey);
    };
  }, [isAutoDiving, diveSpeed, viewportHeight]);

  // Merge curated transparent PNG cutouts with live DB species metadata
  const displayCreatures = useMemo(() => {
    if (!apiCreatures || apiCreatures.length === 0) {
      return CREATURES_BY_DEPTH;
    }

    const apiMap = new Map();
    apiCreatures.forEach((sp) => {
      if (sp.slug) apiMap.set(sp.slug, sp);
      if (sp.code) apiMap.set(sp.code, sp);
    });

    return CREATURES_BY_DEPTH.map((c) => {
      const dbMatch = apiMap.get(c.slug) || apiMap.get(c.id);
      if (!dbMatch) return c;
      return {
        ...c,
        nameVi: dbMatch.nameVi || c.nameVi,
        nameEn: dbMatch.nameEn || c.nameEn,
        sciName: dbMatch.sciName || c.sciName,
        descVi: dbMatch.descVi || c.descVi,
        descEn: dbMatch.descEn || c.descEn,
        redList: dbMatch.redList,
        soundUrl: dbMatch.soundUrl || null,
        eastSeaZone: dbMatch.eastSeaZone || "Biển Đông",
        depthText: dbMatch.depthText,
      };
    });
  }, [apiCreatures]);

  // Synchronize live depth, surface glass mode, footer fade-out, and Dive Log (#6)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const divePx = Math.max(0, y - viewportHeight);
      const calculatedDepth = pxToDepth(divePx);

      setDepth(calculatedDepth);
      setIsSurface(y < viewportHeight * 0.68);
      setIsInFooter(y + viewportHeight > pageHeight + 90);

      if (calculatedDepth > 5) {
        if (!diveStartRef.current) {
          diveStartRef.current = Date.now();
        }
        setMaxDepthReached((prev) => (calculatedDepth > prev ? calculatedDepth : prev));
        setDiveDurationSec(Math.floor((Date.now() - diveStartRef.current) / 1000));

        // Record encountered signature species whose depth is within the viewport band
        const maxVisibleDepth = pxToDepth(divePx + viewportHeight * 0.55);
        const minVisibleDepth = pxToDepth(Math.max(0, divePx - 120));
        const newlySeen = [];
        for (const c of CREATURES_BY_DEPTH) {
          if (c.depth >= minVisibleDepth && c.depth <= maxVisibleDepth) {
            newlySeen.push(c.id);
          }
        }
        if (newlySeen.length > 0) {
          setSeenIds((prev) => {
            let changed = false;
            for (const id of newlySeen) {
              if (!prev.has(id)) {
                changed = true;
                break;
              }
            }
            if (!changed) return prev;
            const next = new Set(prev);
            newlySeen.forEach((id) => next.add(id));
            return next;
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewportHeight, pageHeight]);

  // Keep dive timer ticking gently while user is actively submerged
  useEffect(() => {
    if (isSurface || isInFooter) return undefined;
    const timer = setInterval(() => {
      if (diveStartRef.current) {
        setDiveDurationSec(Math.floor((Date.now() - diveStartRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSurface, isInFooter]);

  const scrollToDepth = useCallback(
    (targetDepth) => {
      setIsAutoDiving(false);
      if (targetDepth <= 0) {
        window.scrollTo({ top: viewportHeight + 4, behavior: "smooth" });
        return;
      }
      const targetScrollY = viewportHeight + depthToPx(targetDepth);
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    },
    [viewportHeight]
  );

  const scrollToTop = useCallback(() => {
    setIsAutoDiving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleAutoDive = useCallback(() => {
    if (isAutoDiving) {
      setIsAutoDiving(false);
      return;
    }
    // If still in Hero, gently step into the water first
    if (window.scrollY < viewportHeight * 0.85) {
      window.scrollTo({ top: viewportHeight + 20, behavior: "instant" });
    }
    setIsAutoDiving(true);
  }, [isAutoDiving, viewportHeight]);

  const handleResetExpedition = useCallback(() => {
    setSeenIds(new Set());
    setMaxDepthReached(0);
    setDiveDurationSec(0);
    diveStartRef.current = null;
    scrollToTop();
  }, [scrollToTop]);

  const currentZone = getZoneAtDepth(depth);
  const realisticOceanColor = getRealisticOceanColor(depth);
  const isRovActive = isRovLightOn && depth >= 900 && !isInFooter;
  const rovStrength = Math.min(1, Math.max(0, (depth - 900) / 700));

  // Live count of PostgreSQL species residing in user's active ocean zone (#5)
  const currentZoneSpeciesCount = useMemo(() => {
    if (!apiCreatures.length) return 0;
    return apiCreatures.filter((sp) => {
      const minD = Number(sp.depthMin ?? sp.depth ?? 0);
      const maxD = Number(sp.depthMax ?? sp.depth ?? minD);
      return maxD >= currentZone.depthStart && minD < currentZone.depthEnd;
    }).length;
  }, [apiCreatures, currentZone]);

  // Render free-swimming marine creatures strictly inside their zone's safe corridor
  const renderCreatures = () => {
    const lastTopInLane = [-9999, -9999, -9999, -9999];
    let lastGlobalTop = -9999;

    return displayCreatures.map((c, idx) => {
      const left = Math.max(22, Math.min(80, c.left || 45));
      const lane = left < 35 ? 0 : left < 52 ? 1 : left < 68 ? 2 : 3;

      const zone = getZoneAtDepth(c.depth);
      const zoneStartPx = depthToPx(zone.depthStart);
      const zoneEndPx = depthToPx(zone.depthEnd);
      const safeStart = zoneStartPx + 70;
      const safeEnd = Math.max(safeStart + 100, zoneEndPx - 75);
      const ratio =
        zone.depthEnd > zone.depthStart
          ? Math.max(
              0,
              Math.min(1, (c.depth - zone.depthStart) / (zone.depthEnd - zone.depthStart))
            )
          : 0;

      const naturalTop =
        viewportHeight + DIVE_ORIGIN_OFFSET + safeStart + ratio * (safeEnd - safeStart);

      const zoneFloor = viewportHeight + DIVE_ORIGIN_OFFSET + safeEnd;
      const spacedTop = Math.max(
        naturalTop,
        lastTopInLane[lane] + 190,
        lastGlobalTop + 52
      );
      const top = Math.min(spacedTop, zoneFloor);
      lastTopInLane[lane] = top;
      lastGlobalTop = top;

      const displayName = loc(c.nameVi, c.nameEn);
      const redListBadge = formatRedListCode(c.redList);
      const floatDelay = -((idx * 1.37) % 6.5);
      const isDeepBiolum = c.depth >= 900;

      return (
        <div
          key={`c-${c.id}`}
          className={`od-node od-creature-item ${isDeepBiolum ? "is-biolum" : ""}`}
          style={{ top: `${top}px`, left: `${left}%` }}
          onClick={() => {
            setIsAutoDiving(false);
            setSelectedCreature({ ...c, isCutout: true });
          }}
          title={`${displayName} (${c.depth}m) — ${loc(c.descVi, c.descEn)}`}
        >
          <div
            className="od-creature-float"
            style={{ animationDelay: `${floatDelay.toFixed(2)}s` }}
          >
            <img
              src={c.image}
              alt={displayName}
              className="od-creature-img"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.opacity = "0.6";
              }}
            />
            <div className="od-creature-label">
              <span className="od-creature-title">{displayName}</span>
              {c.sciName && (
                <span className="od-creature-sciname">{c.sciName}</span>
              )}
              <div className="od-creature-meta">
                <span className="od-creature-meter">
                  {c.depth.toLocaleString()}m
                </span>
                {redListBadge && (
                  <span className={`od-creature-redlist ${redListBadge.tone}`}>
                    {redListBadge.code}
                  </span>
                )}
                <span className="od-creature-cta">
                  {isEn ? "Inspect →" : "Soi nhanh →"}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  // Render minimal zone divider hairlines & subtle mid-zone watermarks
  const renderZoneLabels = () => {
    return OCEAN_ZONES.map((z) => {
      const startY = viewportHeight + DIVE_ORIGIN_OFFSET + depthToPx(z.depthStart);
      const midY =
        viewportHeight +
        DIVE_ORIGIN_OFFSET +
        (depthToPx(z.depthStart) + depthToPx(z.depthEnd)) / 2;

      return (
        <div key={`zone-${z.id}`}>
          {z.depthStart > 0 && (
            <div className="od-zone-divider" style={{ top: `${startY}px` }} />
          )}
          <div className="od-zone-watermark" style={{ top: `${midY}px` }}>
            {loc(z.nameVi, z.nameEn)}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />

      {/* Top-Center Adaptive Liquid Glass Zone Navigation */}
      <QuickZoneBar
        currentDepth={depth}
        isSurface={isSurface}
        isHidden={isInFooter}
        onJumpDepth={scrollToDepth}
      />

      {/* Left Floating Adaptive Depth Ruler */}
      <FixedRuler
        depth={depth}
        isSurface={isSurface}
        isHidden={isInFooter}
        onJumpDepth={scrollToDepth}
      />

      {/* Bottom-Center Telemetry + Expedition Command Dock */}
      <DiveTelemetryDock
        depth={depth}
        currentZone={currentZone}
        isVisible={!isSurface && !isInFooter}
        seenCount={seenIds.size}
        totalCount={displayCreatures.length}
        zoneSpeciesCount={currentZoneSpeciesCount}
        isAutoDiving={isAutoDiving}
        diveSpeed={diveSpeed}
        isRovLightOn={isRovLightOn}
        onToggleAutoDive={handleToggleAutoDive}
        onCycleDiveSpeed={() => setDiveSpeed((s) => (s === 1 ? 2 : 1))}
        onToggleRovLight={() => setIsRovLightOn((v) => !v)}
        onOpenZoneCatalog={() => {
          setIsAutoDiving(false);
          setSelectedCreature(null);
          setIsZoneCatalogOpen(true);
        }}
        onBackToTop={scrollToTop}
      />

      {/* Dynamic Realistic Ocean Water Viewport */}
      <div
        className="od-ocean-viewport-bg"
        style={{ backgroundColor: realisticOceanColor }}
        aria-hidden="true"
      >
        <div
          className="od-sun-rays"
          style={{ opacity: Math.max(0, (220 - depth) / 220) }}
        />
        <div
          className="od-water-caustics"
          style={{ opacity: Math.max(0, (150 - depth) / 150) }}
        />
        <div
          className="od-water-depth-fog"
          style={{ opacity: Math.min(0.82, depth / 480) }}
        />
        <div
          className="od-depth-darkness"
          style={{
            opacity: Math.min(0.92, Math.max(0, (depth - 80) / 1600)),
          }}
        />
      </div>

      {/* Feature #1: Pointer-Following ROV Submarine Spotlight (Depth >= 900m) */}
      <div
        ref={rovSpotlightRef}
        className="od-rov-spotlight-layer"
        style={{
          opacity: isRovActive ? rovStrength : 0,
        }}
        aria-hidden="true"
      />

      <EnvironmentParticles depth={depth} isHidden={isSurface || isInFooter} />

      {/* Full Dive Scroll Container */}
      <div
        ref={containerRef}
        className="od-scroll-container"
        style={{ height: `${pageHeight}px` }}
      >
        {/* Flagship Sunlit Azure & Liquid Glass Hero */}
        <header
          className="od-hero"
          style={{ height: `${viewportHeight}px` }}
        >
          <div className="od-hero-sky" aria-hidden="true" />

          <div className="od-hero-inner">
            <div className="od-hero-eyebrow">
              <span className="od-hero-eyebrow-dot" />
              <span>
                {isEn
                  ? "East Sea Oceanography • 0m → 5,016m"
                  : "Hải Dương Học Biển Đông • 0m → 5.016m"}
              </span>
            </div>

            <h1 className="od-hero-title">
              {isEn ? (
                <>
                  Explore the{" "}
                  <span className="od-hero-title-accent">East Sea Depth</span>
                </>
              ) : (
                <>
                  Thám Hiểm{" "}
                  <span className="od-hero-title-accent">Độ Sâu Biển Đông</span>
                </>
              )}
            </h1>

            <p className="od-hero-subtitle">
              {t("oceanDepth.heroSubtitle")}
            </p>

            {/* Liquid Glass Key Metrics */}
            <div className="od-hero-stats">
              <div className="od-hero-stat-card">
                <div className="od-hero-stat-val">5,016 m</div>
                <div className="od-hero-stat-label">
                  {isEn ? "Manila Trench Max" : "Rãnh Manila sâu nhất"}
                </div>
              </div>
              <div className="od-hero-stat-card">
                <div className="od-hero-stat-val">
                  {isEn ? "4 Zones" : "4 Tầng"}
                </div>
                <div className="od-hero-stat-label">
                  {isEn ? "Sunlight to Abyss" : "Ánh sáng → Vực thẳm"}
                </div>
              </div>
              <div className="od-hero-stat-card">
                <div className="od-hero-stat-val">
                  {apiCreatures.length > 0
                    ? `${apiCreatures.length.toLocaleString()}+`
                    : `${displayCreatures.length}`}
                </div>
                <div className="od-hero-stat-label">
                  {isEn ? "East Sea Species DB" : "Loài theo độ sâu"}
                </div>
              </div>
            </div>

            {/* Hero Actions */}
            <div className="od-hero-actions">
              <button
                type="button"
                className="od-hero-btn-primary"
                onClick={() => scrollToDepth(0)}
              >
                <ArrowDown size={17} />
                <span>
                  {isEn ? "Start Diving" : "Bắt đầu lặn khám phá"}
                </span>
              </button>
              <button
                type="button"
                className="od-hero-btn-secondary"
                onClick={handleToggleAutoDive}
              >
                <Play size={15} />
                <span>
                  {isEn ? "Auto-Dive Tour" : "Chế độ lặn tự động"}
                </span>
              </button>
            </div>
          </div>

          <div className="od-hero-scroll-cue" aria-hidden="true">
            <span>{t("oceanDepth.scrollDown")}</span>
            <ChevronDown size={15} />
          </div>

          {/* Synchronized Azure Multi-Layer Wave Transition into #0ea5e9 Surface Water */}
          <div className="od-hero-wave" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,44 C180,18 340,68 540,42 C740,16 920,66 1120,38 C1260,20 1360,48 1440,36 L1440,100 L0,100 Z"
                fill="#38bdf8"
                opacity="0.45"
              />
              <path
                d="M0,52 C200,82 380,22 600,52 C820,82 1020,24 1220,54 C1320,68 1390,48 1440,52 L1440,100 L0,100 Z"
                fill="#0284c7"
                opacity="0.32"
              />
              <path
                d="M0,48 C160,76 340,18 520,52 C700,86 880,24 1060,56 C1220,84 1340,36 1440,48 L1440,100 L0,100 Z"
                fill="#0ea5e9"
              />
              <path
                d="M0,45 C160,73 340,15 520,49 C700,83 880,21 1060,53 C1220,81 1340,33 1440,45 L1440,51 C1340,40 1220,88 1060,59 C880,27 700,89 520,55 C340,21 160,79 0,51 Z"
                fill="rgba(255, 255, 255, 0.78)"
              />
            </svg>
          </div>
        </header>

        {/* Minimal Zone Dividers & Free-Swimming Fauna */}
        {renderZoneLabels()}
        {renderCreatures()}

        {/* Manila Trench Seabed Finale (5,016m) + Expedition Dive Log Summary (#6) */}
        <section
          className="od-seabed-zone"
          style={{
            top: `${seabedTop}px`,
            minHeight: `${SEABED_HEIGHT}px`,
          }}
        >
          <div className="od-seabed-terrain" aria-hidden="true">
            <div className="od-seabed-ridge od-seabed-ridge-left" />
            <div className="od-seabed-ridge od-seabed-ridge-right" />
            <div className="od-seabed-floor" />
            <div className="od-hydrothermal-vent">
              <div className="od-vent-smoke" />
              <div className="od-vent-smoke s2" />
              <div className="od-vent-chimney" />
              <span className="od-vent-tag">
                {isEn
                  ? "Hydrothermal Vent • 5,016m"
                  : "Miệng phun thủy nhiệt • 5.016m"}
              </span>
            </div>
          </div>

          <div className="od-seabed-summary-card">
            <span className="od-seabed-eyebrow">
              {isEn
                ? "Deepest Point of the East Sea • 15°N 119°E"
                : "Điểm Sâu Nhất Biển Đông • 15°B 119°Đ"}
            </span>

            <h2 className="od-seabed-summary-title">
              {isEn ? "Manila Trench — 5,016m" : "Rãnh Manila — 5.016m"}
            </h2>

            <p className="od-seabed-summary-desc">
              {isEn
                ? "The Manila Trench is the sole oceanic subduction trench in the East Sea, formed where the oceanic plate subducts beneath the Philippine Mobile Belt. At 5,016 meters, extreme pressures reach 503 atmospheres and water chills to 1.4°C."
                : "Rãnh hút chìm đại dương duy nhất và là ranh giới kiến tạo trọng yếu tạo nên vực sâu nhất của Biển Đông (5.016m). Dưới đáy rãnh, áp suất lên tới 503 atm và nền nước lạnh giá chỉ 1,4°C."}
            </p>

            <div className="od-seabed-stats-grid">
              <div className="od-seabed-stat-tile">
                <span className="od-seabed-meta-label">
                  {isEn ? "Max Depth" : "Độ sâu"}
                </span>
                <span className="od-seabed-meta-value">5,016 m</span>
              </div>
              <div className="od-seabed-stat-tile">
                <span className="od-seabed-meta-label">
                  {t("oceanDepth.pressure")}
                </span>
                <span className="od-seabed-meta-value">503 atm</span>
              </div>
              <div className="od-seabed-stat-tile">
                <span className="od-seabed-meta-label">
                  {t("oceanDepth.temperature")}
                </span>
                <span className="od-seabed-meta-value">1.4°C</span>
              </div>
              <div className="od-seabed-stat-tile">
                <span className="od-seabed-meta-label">
                  {isEn ? "Coordinates" : "Tọa độ"}
                </span>
                <span className="od-seabed-meta-value">15°N 119°E</span>
              </div>
            </div>

            {/* Expedition Dive Log Bar (#6) */}
            <div className="od-expedition-log">
              <div className="od-expedition-log-head">
                <span className="od-expedition-log-title">
                  {isEn ? "Your Dive Log" : "Nhật ký chuyến lặn của bạn"}
                </span>
                <button
                  type="button"
                  className="od-expedition-reset-btn"
                  onClick={handleResetExpedition}
                >
                  <RotateCcw size={12} />
                  <span>{isEn ? "Restart Dive" : "Lặn lại từ đầu"}</span>
                </button>
              </div>
              <div className="od-expedition-log-metrics">
                <div className="od-expedition-metric">
                  <Eye size={14} />
                  <span>
                    <strong>{seenIds.size}</strong> / {displayCreatures.length}{" "}
                    {isEn ? "species encountered" : "loài đã bắt gặp"}
                  </span>
                </div>
                <div className="od-expedition-metric">
                  <Gauge size={14} />
                  <span>
                    {isEn ? "Reached" : "Độ sâu đạt"}{" "}
                    <strong>{Math.max(maxDepthReached, depth).toLocaleString()} m</strong>
                  </span>
                </div>
                <div className="od-expedition-metric">
                  <Clock size={14} />
                  <span>
                    {isEn ? "Dive time" : "Thời gian"}{" "}
                    <strong>{formatDuration(diveDurationSec)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="od-seabed-actions">
              <button
                type="button"
                className="od-seabed-back-btn"
                onClick={scrollToTop}
              >
                <WaveIcon className="od-seabed-back-icon" />
                <span>{isEn ? "Return to surface" : "Trở về mặt biển"}</span>
              </button>
              <Link to="/search" className="od-seabed-explore-link">
                <Compass size={16} />
                <span>
                  {isEn
                    ? "Explore full species catalog"
                    : "Khám phá danh mục sinh vật"}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Feature #2: Quick Dive Inspector Drawer (Species + Audio + Food Web) */}
      <DiveQuickDrawer
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
        onSelectRelated={(relSpecies) => setSelectedCreature(relSpecies)}
      />

      {/* Feature #5: Live PostgreSQL Zone Species Catalog Drawer */}
      {isZoneCatalogOpen && (
        <ZoneSpeciesDrawer
          key={currentZone.id}
          isOpen={isZoneCatalogOpen}
          initialZoneId={currentZone.id}
          apiCreatures={apiCreatures}
          onClose={() => setIsZoneCatalogOpen(false)}
          onInspectSpecies={(sp) => {
            setIsZoneCatalogOpen(false);
            setSelectedCreature(sp);
          }}
        />
      )}

      {/* Elevated Footer Shell so Fixed Ocean Background Never Bleeds Through */}
      <div className="od-footer-shell">
        <Footer />
      </div>
    </>
  );
}
