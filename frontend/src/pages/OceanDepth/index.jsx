import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { OCEAN_ZONES, DEPTH_LANDMARKS, CREATURES_BY_DEPTH } from "./depthData";
import { ArrowDown, FlashlightIcon, SunIcon, MapPinIcon, Anchor, WaveIcon } from "../../assets/Icons";
import "./OceanDepth.css";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_DEPTH = 5016; // Rãnh Manila — điểm sâu nhất Biển Đông
const DEPTH_SCALE = 2; // 1 meter = 2 pixels cuộn
const SEABED_BUFFER = 1600; // Đệm đáy biển 1,600px để cuộn thoải mái chạm và vượt mốc 5,016m mà không bị Footer cản
const PAGE_HEIGHT = MAX_DEPTH * DEPTH_SCALE + (typeof window !== "undefined" ? window.innerHeight : 900) + SEABED_BUFFER;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRealisticOceanColor(depth) {
  // Mô phỏng quang phổ tán xạ và hấp thụ ánh sáng thực tế của nước biển Biển Đông:
  // 0 - 30m: Xanh ngọc lam nhiệt đới rực rỡ, ánh nắng xuyên thấu
  // 30 - 100m: Xanh đại dương sâu thẳm, tia đỏ/vàng bị hấp thụ hoàn toàn
  // 100 - 200m: Xanh lam đậm - ranh giới tầng quang hợp
  // 200 - 500m: Vùng chạng vạng xanh chàm huyền bí
  // 500 - 1000m: Nước xanh đen - ánh sáng mặt trời dưới 1%
  // 1000 - 3000m: Vùng nửa đêm - đen tuyền ánh lam sẫm
  // 3000 - 5016m: Vực thẳm Rãnh Manila - tối đen tuyệt đối
  if (depth <= 30) {
    const f = depth / 30;
    return `color-mix(in srgb, #0776ad ${(1 - f) * 100}%, #04527d)`;
  }
  if (depth <= 100) {
    const f = (depth - 30) / 70;
    return `color-mix(in srgb, #04527d ${(1 - f) * 100}%, #033254)`;
  }
  if (depth <= 200) {
    const f = (depth - 100) / 100;
    return `color-mix(in srgb, #033254 ${(1 - f) * 100}%, #021a32)`;
  }
  if (depth <= 500) {
    const f = (depth - 200) / 300;
    return `color-mix(in srgb, #021a32 ${(1 - f) * 100}%, #020f21)`;
  }
  if (depth <= 1000) {
    const f = (depth - 500) / 500;
    return `color-mix(in srgb, #020f21 ${(1 - f) * 100}%, #010815)`;
  }
  if (depth <= 2500) {
    const f = (depth - 1000) / 1500;
    return `color-mix(in srgb, #010815 ${(1 - f) * 100}%, #01040c)`;
  }
  const f = Math.min(1, (depth - 2500) / 2516);
  return `color-mix(in srgb, #01040c ${(1 - f) * 100}%, #000104)`;
}

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
  if (depth <= 30) return "27–30°C";
  if (depth <= 100) return "24–27°C";
  if (depth <= 200) return "18–24°C";
  if (depth <= 500) return "8–18°C";
  if (depth <= 1000) return "5–8°C";
  return "2–5°C";
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
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// ─── Thước đo độ sâu khoa học dọc Biển Đông (0–5,016m) ───────────────────
const RULER_MAJOR_TICKS = [
  { d: 0,    label: "0m",     sub: "Mực nước biển" },
  { d: 200,  label: "200m",   sub: "Ranh giới ánh sáng" },
  { d: 500,  label: "500m",   sub: "" },
  { d: 1000, label: "1,000m", sub: "Vùng nửa đêm" },
  { d: 1500, label: "1,500m", sub: "" },
  { d: 2000, label: "2,000m", sub: "" },
  { d: 3000, label: "3,000m", sub: "" },
  { d: 4000, label: "4,000m", sub: "Vực thẳm" },
  { d: 5016, label: "5,016m", sub: "Rãnh Manila", isMax: true },
];

function FixedRuler({ depth }) {
  const pointerPct = Math.min(99.5, Math.max(0.5, (depth / MAX_DEPTH) * 100));
  const currentZone = getZoneAtDepth(depth);
  const { language } = useLanguageStore();

  const scrollToDepth = (targetDepth) => {
    const targetScrollY = window.innerHeight + targetDepth * DEPTH_SCALE;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  // Tạo các vạch chia chi tiết (mỗi 100m)
  const minorTicks = useMemo(() => {
    const ticks = [];
    for (let d = 0; d <= 5000; d += 100) {
      const isMajor = RULER_MAJOR_TICKS.some((m) => m.d === d);
      if (!isMajor) {
        ticks.push({
          d,
          isMedium: d % 500 === 0,
        });
      }
    }
    return ticks;
  }, []);

  return (
    <aside className="od-ruler" aria-label="Thước đo độ sâu Biển Đông">
      {/* Tiêu đề thước đo */}
      <div className="od-ruler-header">
        <span className="od-ruler-header-tag">{language === "en" ? "Depth" : "Độ sâu"}</span>
        <span className="od-ruler-header-unit">{language === "en" ? "Meters" : "Mét"}</span>
      </div>

      {/* Thân thước đo với dải phân tầng và vạch chia */}
      <div className="od-ruler-body">
        {/* Dải gradient màu các tầng nước Biển Đông */}
        <div className="od-ruler-track">
          {OCEAN_ZONES.map((z) => (
            <div
              key={z.id}
              className="od-ruler-zone-segment"
              title={`${z.nameVi} (${z.depthStart}m - ${z.depthEnd}m)`}
              onClick={() => scrollToDepth(z.depthStart)}
              style={{
                top: `${(z.depthStart / MAX_DEPTH) * 100}%`,
                height: `${((z.depthEnd - z.depthStart) / MAX_DEPTH) * 100}%`,
                background: `linear-gradient(to bottom, ${z.colorFrom}, ${z.colorTo})`,
              }}
            />
          ))}

          {/* Trục kẻ kim loại trung tâm */}
          <div className="od-ruler-axis" />
        </div>

        {/* Vạch chia nhỏ (minor & medium ticks) */}
        <div className="od-ruler-subticks" aria-hidden="true">
          {minorTicks.map(({ d, isMedium }) => (
            <div
              key={`st-${d}`}
              className={`od-ruler-subtick ${isMedium ? "is-medium" : "is-minor"}`}
              style={{ top: `${(d / MAX_DEPTH) * 100}%` }}
            />
          ))}
        </div>

        {/* Vạch chia chính (Major ticks có nhãn số và có thể bấm để cuộn đến) */}
        <div className="od-ruler-major-ticks">
          {RULER_MAJOR_TICKS.map(({ d, label, sub, isMax }) => {
            const isPassed = depth >= d;
            return (
              <button
                key={`rt-${d}`}
                type="button"
                className={`od-ruler-tick-btn ${isPassed ? "is-passed" : ""} ${isMax ? "is-max" : ""}`}
                style={{ top: `${(d / MAX_DEPTH) * 100}%` }}
                onClick={() => scrollToDepth(d)}
                title={`Nhảy tới độ sâu ${label}${sub ? ` (${sub})` : ""}`}
              >
                <span className="od-ruler-tick-line" />
                <span className="od-ruler-tick-text">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Con trỏ định vị độ sâu trực tiếp (Live Cursor) */}
        <div
          className="od-ruler-cursor"
          style={{
            top: `${pointerPct}%`,
            "--cursor-color": currentZone.colorFrom,
          }}
        >
          {/* Mũi tên chỉ vạch */}
          <div className="od-ruler-cursor-needle" />
          {/* Huy hiệu hiển thị độ sâu tức thời */}
          <div className="od-ruler-cursor-badge">
            <span className="od-ruler-cursor-dot" />
            <span className="od-ruler-cursor-val">{depth.toLocaleString()}m</span>
          </div>
          {/* Tia laser quét độ sâu sang ngang */}
          <div className="od-ruler-cursor-beam" />
        </div>
      </div>

      {/* Chân thước đo: Tên vùng sâu nhất */}
      <div className="od-ruler-footer" onClick={() => scrollToDepth(5016)} title="Đáy sâu nhất Biển Đông: Rãnh Manila (5,016m)">
        <span className="od-ruler-footer-label">5,016m MAX</span>
      </div>
    </aside>
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
          title={
            collapsed
              ? (language === "en" ? "Expand" : "Mở rộng")
              : (language === "en" ? "Collapse" : "Thu gọn")
          }
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronDown
            size={13}
            className={`od-hud-collapse-icon ${collapsed ? "" : "rotate-180"}`}
          />
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
  const isAbyssal = depth > 700;

  // Hạt mô phỏng đại dương:
  // < 250m: Bọt khí li ti nổi lên
  // > 150m: Tuyết biển (marine snow) chìm chậm
  // > 600m: Đốm lân tinh phát quang sinh học nhấp nháy
  const particles = useMemo(() => {
    const list = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const r1 = getSeededRandom(`p-type-${i}-${isDeep ? 1 : 0}-${isAbyssal ? 1 : 0}`);
      const r2 = getSeededRandom(`p-size-${i}`);
      const r3 = getSeededRandom(`p-left-${i}`);
      const r4 = getSeededRandom(`p-delay-${i}`);
      const r5 = getSeededRandom(`p-duration-${i}`);

      let type = "snow";
      if (!isDeep && r1 < 0.6) {
        type = "bubble";
      } else if (isAbyssal && r1 < 0.45) {
        type = "biolum";
      }
      list.push({
        id: i,
        type,
        size:
          type === "bubble"
            ? r2 * 8 + 4
            : type === "biolum"
            ? r2 * 4 + 2
            : r2 * 3 + 1.5,
        left: r3 * 100,
        delay: r4 * 6,
        duration:
          type === "bubble"
            ? r5 * 5 + 4
            : type === "biolum"
            ? r5 * 8 + 6
            : r5 * 12 + 10,
      });
    }
    return list;
  }, [isDeep, isAbyssal]);

  return (
    <div className="od-particles" aria-hidden="true">
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

export default function OceanDepth() {
  const navigate = useNavigate();
  const [depth, setDepth] = useState(0);
  const containerRef = useRef(null);
  const { t, language } = useLanguageStore();
  // Helper: chọn đúng trường theo ngôn ngữ
  const loc = (vi, en) => language === "en" ? en : vi;

  const currentZone = getZoneAtDepth(depth);
  const realisticOceanColor = getRealisticOceanColor(depth);

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

      {/* Thước đo dọc khoa học cố định bên trái */}
      <FixedRuler depth={depth} />

      {/* HUD kéo thả hiển thị thông số */}
      <DraggableHUD depth={depth} currentZone={currentZone} />

      {/* Nền nước biển chân thật cố định (Realistic Dynamic Ocean Viewport) */}
      <div
        className="od-ocean-viewport-bg"
        style={{ backgroundColor: realisticOceanColor }}
        aria-hidden="true"
      >
        {/* Tia nắng mặt trời khúc xạ qua mặt nước (Sun Rays / God Rays) */}
        <div
          className="od-sun-rays"
          style={{ opacity: Math.max(0, (220 - depth) / 220) }}
        />

        {/* Gợn sóng lấp lánh tầng nông (Water Caustics) */}
        <div
          className="od-water-caustics"
          style={{ opacity: Math.max(0, (140 - depth) / 140) }}
        />

        {/* Sương mờ quang học đại dương (Underwater Depth Fog) */}
        <div
          className="od-water-depth-fog"
          style={{ opacity: Math.min(0.85, depth / 400) }}
        />

        {/* Bóng tối thực tế tăng dần theo độ sâu (Physical Darkness Attenuation) */}
        <div
          className="od-depth-darkness"
          style={{ opacity: Math.min(0.96, Math.max(0, (depth - 40) / 1400)) }}
        />

        {/* Đèn pha tàu thám hiểm ROV khi xuống tầng tối (> 500m) */}
        {depth >= 500 && (
          <div
            className="od-subsea-spotlight"
            style={{ opacity: Math.min(0.7, (depth - 500) / 800) }}
          />
        )}
      </div>

      <EnvironmentParticles depth={depth} />

      {/* Container Cuộn Toàn Phần */}
      <div
        ref={containerRef}
        className="od-scroll-container"
        style={{
          height: `${PAGE_HEIGHT}px`,
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

        {/* Nội dung các tầng */}
        {renderZoneLabels()}
        {renderLandmarks()}
        {renderCreatures()}

        {/* Vùng Đáy Biển Rãnh Manila (5,016m) — Điểm sâu nhất Biển Đông */}
        <div
          className="od-seabed-zone"
          style={{
            top: `${window.innerHeight + MAX_DEPTH * DEPTH_SCALE}px`,
            minHeight: `${SEABED_BUFFER}px`,
          }}
        >
          {/* Địa hình kiến tạo vách đá rãnh Manila & miệng phun thủy nhiệt */}
          <div className="od-seabed-terrain" aria-hidden="true">
            <div className="od-seabed-ridge od-seabed-ridge-left" />
            <div className="od-seabed-ridge od-seabed-ridge-right" />
            <div className="od-seabed-floor" />
            <div className="od-hydrothermal-vent">
              <div className="od-vent-smoke" />
              <div className="od-vent-smoke s2" />
              <div className="od-vent-chimney" />
              <span className="od-vent-tag">{language === "en" ? "Deep-sea Hydrothermal Vent (5,016m)" : "Miệng thủy nhiệt đáy biển (5,016m)"}</span>
            </div>
          </div>

          {/* Thẻ vinh danh hoàn thành thám hiểm Rãnh Manila */}
          <div className="od-seabed-badge-card">
            <div className="od-seabed-badge-header">
              <span className="od-seabed-badge-trophy">
                <Anchor className="od-seabed-badge-trophy-icon" />
              </span>
              <div>
                <h2 className="od-seabed-badge-title">
                  {language === "en" ? "MANILA TRENCH SEABED REACHED" : "CHẠM ĐÁY BIỂN ĐÔNG — RÃNH MANILA"}
                </h2>
                <p className="od-seabed-badge-subtitle">
                  {language === "en"
                    ? "You have completed the full vertical descent of the East Sea to 5,016 meters"
                    : "Bạn đã hoàn thành chuyến thám hiểm trọn vẹn toàn bộ cột nước Biển Đông tới độ sâu 5,016 mét"}
                </p>
              </div>
            </div>

            <div className="od-seabed-stats-grid">
              <div className="od-seabed-stat-box">
                <span className="od-seabed-stat-k">
                  <ArrowDown className="od-seabed-stat-icon" />
                  {language === "en" ? "Max depth" : "Độ sâu tối đa"}
                </span>
                <span className="od-seabed-stat-v">5,016 m</span>
              </div>
              <div className="od-seabed-stat-box">
                <span className="od-seabed-stat-k">
                  <FlashlightIcon className="od-seabed-stat-icon" />
                  {language === "en" ? "Seabed pressure" : "Áp suất đáy"}
                </span>
                <span className="od-seabed-stat-v">502 atm</span>
              </div>
              <div className="od-seabed-stat-box">
                <span className="od-seabed-stat-k">
                  <SunIcon className="od-seabed-stat-icon" />
                  {language === "en" ? "Seabed temp." : "Nhiệt độ đáy"}
                </span>
                <span className="od-seabed-stat-v">1.4°C</span>
              </div>
              <div className="od-seabed-stat-box">
                <span className="od-seabed-stat-k">
                  <MapPinIcon className="od-seabed-stat-icon" />
                  {language === "en" ? "Trench coords." : "Tọa độ rãnh"}
                </span>
                <span className="od-seabed-stat-v">15°N 119°E</span>
              </div>
            </div>

            <p className="od-seabed-badge-desc">
              {language === "en"
                ? "The Manila Trench was formed by the subduction of the East Sea plate beneath the Philippine Mobile Belt. It is the only true deep oceanic trench in this semi-enclosed sea."
                : "Rãnh Manila hình thành do sự hút chìm của mảng kiến tạo đáy Biển Đông. Đây là rãnh hút chìm sâu duy nhất và là ranh giới kiến tạo quan trọng bậc nhất tạo nên điểm sâu nhất của vùng biển này."}
            </p>

            <button
              type="button"
              className="od-seabed-back-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <WaveIcon className="od-seabed-back-icon" />
              {language === "en" ? "Return to Sea Surface" : "Trở về mặt biển"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer nằm trọn vẹn bên dưới vùng đáy biển, không bao giờ che khuất điểm 5,016m */}
      <Footer />
    </>
  );
}
