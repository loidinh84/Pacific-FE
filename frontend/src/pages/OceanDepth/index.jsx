import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { OCEAN_ZONES, DEPTH_LANDMARKS, CREATURES_BY_DEPTH } from "./depthData";
import "./OceanDepth.css";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_DEPTH = 11034;
const DEPTH_SCALE = 2; // 1 meter = 2 pixels cuộn
const PAGE_HEIGHT = MAX_DEPTH * DEPTH_SCALE + window.innerHeight;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getZoneAtDepth(depth) {
  return (
    OCEAN_ZONES.find((z) => depth >= z.depthStart && depth < z.depthEnd) ||
    OCEAN_ZONES[OCEAN_ZONES.length - 1]
  );
}

function getPressure(depth) {
  return `${Math.round(1 + depth / 10)} atm`;
}

function getTemperature(depth) {
  if (depth <= 50) return "26–30°C";
  if (depth <= 200) return "15–25°C";
  if (depth <= 500) return "8–15°C";
  if (depth <= 1000) return "4–8°C";
  return "1–4°C";
}

function getLightPercent(depth) {
  if (depth <= 20) return 100;
  if (depth <= 200) return Math.max(1, Math.round(100 - (depth / 200) * 99));
  return 0;
}

function getSeededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

// ─── Thước đo dọc cố định bên trái ──────────────────────────────────────────
const RULER_TICKS = [
  { d: 0,     label: "0m"   },
  { d: 200,   label: "200m" },
  { d: 1000,  label: "1km"  },
  { d: 2000,  label: "2km"  },
  { d: 4000,  label: "4km"  },
  { d: 6000,  label: "6km"  },
  { d: 8000,  label: "8km"  },
  { d: 10000, label: "10km" },
  { d: 11034, label: "11km" },
];

function FixedRuler({ depth }) {
  const pointerPct = Math.min(99, (depth / MAX_DEPTH) * 100);
  const currentZone = getZoneAtDepth(depth);

  return (
    <div className="od-ruler" aria-hidden="true">
      <div className="od-ruler-zones">
        {OCEAN_ZONES.map((z) => (
          <div
            key={z.id}
            className="od-ruler-zone"
            style={{
              top: `${(z.depthStart / MAX_DEPTH) * 100}%`,
              height: `${((z.depthEnd - z.depthStart) / MAX_DEPTH) * 100}%`,
              backgroundColor: z.colorFrom,
            }}
          />
        ))}
      </div>

      {RULER_TICKS.map(({ d, label }) => (
        <div
          key={`rt-${d}`}
          className="od-ruler-tick"
          style={{ top: `${(d / MAX_DEPTH) * 100}%` }}
        >
          <span className="od-ruler-tick-label">{label}</span>
          <div className="od-ruler-tick-line" />
        </div>
      ))}

      <div
        className="od-ruler-pointer"
        style={{ top: `${pointerPct}%`, "--pointer-color": currentZone.colorFrom }}
      />
    </div>
  );
}

// ─── HUD có thể kéo thả + thu gọn ────────────────────────────────────────────
function DraggableHUD({ depth, currentZone }) {
  const [pos, setPos] = useState({
    x: Math.max(0, window.innerWidth - 288),
    y: 84,
  });
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hudRef = useRef(null);
  const { t, language } = useLanguageStore();
  const loc = (vi, en) => language === "en" ? en : vi;

  const onMouseDown = useCallback((e) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    setDragging(true);
    dragOffset.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y };
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const hudW = hudRef.current ? hudRef.current.offsetWidth  : 260;
    const hudH = hudRef.current ? hudRef.current.offsetHeight : 220;

    const onMouseMove = (e) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - hudW, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - hudH, e.clientY - dragOffset.current.y)),
      });
    };
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - hudW, touch.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - hudH, touch.clientY - dragOffset.current.y)),
      });
    };
    const stop = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   stop);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  stop);
    };
  }, [dragging]);

  // Visibility label
  const visLabel = depth <= 20
    ? t("oceanDepth.visGood")
    : depth <= 200
    ? t("oceanDepth.visPoor")
    : t("oceanDepth.visNone");

  return (
    <div
      ref={hudRef}
      className={`od-hud ${collapsed ? "od-hud--collapsed" : ""} ${dragging ? "od-hud--dragging" : ""}`}
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Thanh tiêu đề — kéo ở đây */}
      <div
        className="od-hud-titlebar"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <span className="od-hud-titlebar-grip">⠿</span>
        <span className="od-hud-titlebar-name">{t("oceanDepth.hudTitle")}</span>
        <button
          className="od-hud-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "▲" : "▼"}
        >
          {collapsed ? "▲" : "▼"}
        </button>
      </div>

      {/* Nội dung — ẩn khi collapsed */}
      {!collapsed && (
        <>
          <div className="od-hud-depth-wrapper">
            <div className="od-hud-depth">
              {depth.toLocaleString()}
              <span className="od-hud-depth-unit">m</span>
            </div>
          </div>

          <div className="od-hud-zone">
            <span className="od-hud-zone-icon"><currentZone.icon /></span>
            <span className="od-hud-zone-name">{loc(currentZone.nameVi, currentZone.nameEn)}</span>
          </div>

          <div className="od-hud-stats">
            <div className="od-hud-stat">
              <span className="od-hud-stat-label">{t("oceanDepth.pressure")}</span>
              <span className="od-hud-stat-val">{getPressure(depth)}</span>
            </div>
            <div className="od-hud-stat">
              <span className="od-hud-stat-label">{t("oceanDepth.temperature")}</span>
              <span className="od-hud-stat-val">{getTemperature(depth)}</span>
            </div>
            <div className="od-hud-stat">
              <span className="od-hud-stat-label">{t("oceanDepth.light")}</span>
              <span className="od-hud-stat-val">{getLightPercent(depth)}%</span>
            </div>
            <div className="od-hud-stat">
              <span className="od-hud-stat-label">{t("oceanDepth.visibility")}</span>
              <span className="od-hud-stat-val">{visLabel}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────
function EnvironmentParticles({ depth }) {
  const isDeep = depth > 200;
  const count = isDeep ? 20 : 15;
  const type = isDeep ? "snow" : "bubble";

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: type === "snow" ? Math.random() * 3 + 2 : Math.random() * 8 + 4,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: type === "snow" ? Math.random() * 10 + 10 : Math.random() * 4 + 4,
    }));
  }, [count, type]);

  return (
    <div className="od-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={`${type}-${p.id}`}
          className={`od-particle ${type}`}
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

export default function OceanDepth() {
  const navigate = useNavigate();
  const [depth, setDepth] = useState(0);
  const containerRef = useRef(null);
  const { t, language } = useLanguageStore();
  // Helper: chọn đúng trường theo ngôn ngữ
  const loc = (vi, en) => language === "en" ? en : vi;

  const currentZone = getZoneAtDepth(depth);
  const bgOpacity = Math.min(1, depth / 2000);
  const bgColor = `color-mix(in srgb, ${currentZone.colorFrom} ${Math.max(10, 100 - depth / 50)}%, #000000)`;

  useEffect(() => {
    const handleScroll = () => {
      // Trừ đi chiều cao hero (window.innerHeight) để depth=0 bắt đầu từ vạch mực nước
      const scrollY = Math.max(0, window.scrollY - window.innerHeight);
      const calculatedDepth = Math.max(0, Math.min(MAX_DEPTH, Math.round(scrollY / DEPTH_SCALE)));
      setDepth(calculatedDepth);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.remove("hidden");
          }
        });
      },
      { rootMargin: "-50px 0px -50px 0px" }
    );
    const nodes = document.querySelectorAll(".od-node");
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  // ── Landmarks: cố định bên PHẢI (68% → 90%) ──────────────────────────────
  const renderLandmarks = () => {
    return DEPTH_LANDMARKS.map((lm) => {
      // Cộng window.innerHeight để bắt đầu sau phần Hero (100vh)
      const top = window.innerHeight + lm.depth * DEPTH_SCALE;
      // Phân bố trong dải 68%-89% theo hàm seed
      const left = 68 + getSeededRandom(lm.labelVi) * 21;
      const label = loc(lm.labelVi, lm.labelEn);
      const desc  = loc(lm.descVi,  lm.descEn);

      return (
        <div
          key={`lm-${lm.depth}`}
          className="od-node od-landmark-node hidden"
          style={{ top: `${top}px`, left: `${left}%`, "--lm-color": lm.color }}
        >
          <div className="od-landmark-connector" />
          <div className="od-landmark-header">
            <span className="od-landmark-icon"><lm.icon /></span>
            <span className="od-landmark-title">{label}</span>
          </div>
          <p className="od-landmark-desc">{desc}</p>
          <div className="od-landmark-depth-badge">{lm.depth.toLocaleString()}m</div>
        </div>
      );
    });
  };

  // ── Creatures: vùng GIỮA (18% → 62%) ────────────────────────────────────
  const renderCreatures = () => {
    return CREATURES_BY_DEPTH.map((c) => {
      const avgDepth = (c.depthMin + c.depthMax) / 2;
      // Cộng window.innerHeight để bắt đầu sau phần Hero (100vh)
      const top = window.innerHeight + avgDepth * DEPTH_SCALE;
      // Phân bố trong dải 18%-62% theo hàm seed
      const left = 18 + getSeededRandom(c.id) * 44;
      const name = loc(c.nameVi, c.nameEn);

      return (
        <div
          key={`c-${c.id}`}
          className="od-node od-creature-node hidden"
          style={{ top: `${top}px`, left: `${left}%` }}
          onClick={() => navigate(`/species/${c.id}`)}
          title={t("oceanDepth.clickDetail")}
        >
          <span className="od-creature-emoji"><c.emoji /></span>
          <div className="od-creature-info">
            <span className="od-creature-name">{name}</span>
            <span className="od-creature-depth">{c.depthMin}m – {c.depthMax}m</span>
          </div>
        </div>
      );
    });
  };

  // ── Zone labels (watermark) ───────────────────────────────────────────────
  const renderZoneLabels = () => {
    return OCEAN_ZONES.map((z) => (
      <div key={`zone-${z.id}`}>
        <div
          className="od-zone-divider"
          style={{ top: `${window.innerHeight + z.depthStart * DEPTH_SCALE}px` }}
        />
        <div
          className="od-zone-label"
          style={{
            top: `${window.innerHeight + (z.depthStart + (z.depthEnd - z.depthStart) / 2) * DEPTH_SCALE}px`,
          }}
        >
          {loc(z.nameVi, z.nameEn)}
        </div>
      </div>
    ));
  };

  // ── Đường dọc phân cách giữa / phải ─────────────────────────────────────
  const renderDividerLine = () => (
    <div className="od-column-divider" />
  );

  return (
    <>
      <Navbar />

      {/* Thước đo dọc cố định */}
      <FixedRuler depth={depth} />

      {/* HUD kéo thả */}
      <DraggableHUD depth={depth} currentZone={currentZone} />

      <div className="od-darkness-overlay" style={{ opacity: bgOpacity }} />
      <EnvironmentParticles depth={depth} />

      {/* Container Cuộn */}
      <div
        ref={containerRef}
        className="od-scroll-container"
        style={{
          height: `${PAGE_HEIGHT}px`,
          backgroundColor: bgColor,
        }}
      >
        {/* Hero */}
        <div className="od-hero">
          <h1 className="od-hero-title">{t("oceanDepth.heroTitle")}</h1>
          <p className="od-hero-subtitle">{t("oceanDepth.heroSubtitle")}</p>
          <div className="od-scroll-prompt">
            <div className="od-scroll-icon">
              <div className="od-scroll-wheel" />
            </div>
            <span>{t("oceanDepth.scrollDown")}</span>
          </div>
        </div>

        {/* Mực nước biển */}
        <div className="od-surface-line">
          <div className="od-surface-label">{t("oceanDepth.seaLevel")}</div>
        </div>

        {/* Đường phân chia cột */}
        {renderDividerLine()}

        {/* Nội dung */}
        {renderZoneLabels()}
        {renderLandmarks()}
        {renderCreatures()}
      </div>

      <Footer />
    </>
  );
}
