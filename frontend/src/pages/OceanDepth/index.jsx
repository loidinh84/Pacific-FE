import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { OCEAN_ZONES, CREATURES_BY_DEPTH } from "./depthData";
import { fetchDepthDistribution } from "../../services/speciesApi";
import { WaveIcon } from "../../assets/Icons";
import "./OceanDepth.css";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_DEPTH = 5016; // Rãnh Manila — điểm sâu nhất Biển Đông
const DEPTH_SCALE = 2; // 1 meter = 2 pixels cuộn
const SEABED_BUFFER = 1600; // Đệm đáy biển tránh bị footer che
const PAGE_HEIGHT = MAX_DEPTH * DEPTH_SCALE + (typeof window !== "undefined" ? window.innerHeight : 900) + SEABED_BUFFER;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRealisticOceanColor(depth) {
  // Neal.fun inspired: bright teal-green at surface, darkening to near-black abyss
  // 0 - 30m  : Teal nhiệt đới rực rỡ — ánh nắng xuyên thấu
  // 30 - 100m: Teal-xanh đậm — tia đỏ/vàng bị hấp thụ
  // 100-200m : Xanh-lam sâu — ranh giới tầng quang hợp
  // 200-500m : Xanh chàm huyền bí
  // 500-1000m: Xanh đen — ánh sáng < 1%
  // 1000+m   : Vực tối tuyệt đối
  if (depth <= 30) {
    const f = depth / 30;
    return `color-mix(in srgb, #1a9898 ${(1 - f) * 100}%, #11807a)`;
  }
  if (depth <= 100) {
    const f = (depth - 30) / 70;
    return `color-mix(in srgb, #11807a ${(1 - f) * 100}%, #0b5e6e)`;
  }
  if (depth <= 200) {
    const f = (depth - 100) / 100;
    return `color-mix(in srgb, #0b5e6e ${(1 - f) * 100}%, #073e52)`;
  }
  if (depth <= 500) {
    const f = (depth - 200) / 300;
    return `color-mix(in srgb, #073e52 ${(1 - f) * 100}%, #031f30)`;
  }
  if (depth <= 1000) {
    const f = (depth - 500) / 500;
    return `color-mix(in srgb, #031f30 ${(1 - f) * 100}%, #010d1c)`;
  }
  if (depth <= 2500) {
    const f = (depth - 1000) / 1500;
    return `color-mix(in srgb, #010d1c ${(1 - f) * 100}%, #01060e)`;
  }
  const f = Math.min(1, (depth - 2500) / 2516);
  return `color-mix(in srgb, #01060e ${(1 - f) * 100}%, #000204)`;
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
    hash = Math.imul(31, hash) + seedStr.charCodeAt(i) | 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// Thước đo độ sâu Biển Đông
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

  // Tạo các vạch chia chi tiết
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

        {/* Vạch chia nhỏ */}
        <div className="od-ruler-subticks" aria-hidden="true">
          {minorTicks.map(({ d, isMedium }) => (
            <div
              key={`st-${d}`}
              className={`od-ruler-subtick ${isMedium ? "is-medium" : "is-minor"}`}
              style={{ top: `${(d / MAX_DEPTH) * 100}%` }}
            />
          ))}
        </div>

        {/* Vạch chia chính */}
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

        {/* Con trỏ độ sâu */}
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
        </div>
      </div>

      {/* Chân thước đo: Tên vùng sâu nhất */}
      <div
        className="od-ruler-footer"
        onClick={() => scrollToDepth(5016)}
        title={
          language === "en"
            ? "Deepest point in East Sea: Manila Trench (5,016m)"
            : "Đáy sâu nhất Biển Đông: Rãnh Manila (5,016m)"
        }
      >
        <span className="od-ruler-footer-label">5,016m MAX</span>
      </div>
    </aside>
  );
}

// ─── Components ──────────────────────────────────────────────────────────────
function EnvironmentParticles({ depth }) {
  const isDeep = depth > 200;
  const isAbyssal = depth > 700;

  // Hạt mô phỏng đại dương:
  // < 250m: Bọt khí li ti nổi lên
  // Tuyết biển chìm chậm ở tầng sâu
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

// ─── Thanh điều hướng nhanh 5 tầng nước đại dương ───────────────────────────
function QuickZoneBar({ currentDepth }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const ZONES_NAV = [
    { depth: 0, labelVi: "Mặt nước", labelEn: "Surface" },
    { depth: 200, labelVi: "Chạng vạng", labelEn: "Twilight" },
    { depth: 1000, labelVi: "Nửa đêm", labelEn: "Midnight" },
    { depth: 4000, labelVi: "Vực thẳm", labelEn: "Abyss" },
    { depth: 5016, labelVi: "Rãnh Manila", labelEn: "Manila Trench" },
  ];

  const handleJump = (targetDepth) => {
    const targetScrollY = window.innerHeight + targetDepth * DEPTH_SCALE;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  return (
    <nav className="od-quick-jump-bar" aria-label="Điều hướng nhanh độ sâu">
      {ZONES_NAV.map((z) => {
        const isActive =
          z.depth === 5016
            ? currentDepth >= 4600
            : z.depth === 4000
            ? currentDepth >= 3500 && currentDepth < 4600
            : z.depth === 1000
            ? currentDepth >= 700 && currentDepth < 3500
            : z.depth === 200
            ? currentDepth >= 120 && currentDepth < 700
            : currentDepth < 120;

        return (
          <button
            key={z.depth}
            type="button"
            onClick={() => handleJump(z.depth)}
            className={`od-quick-jump-btn ${isActive ? "is-active" : ""}`}
          >
            {isEn ? z.labelEn : z.labelVi}
          </button>
        );
      })}
    </nav>
  );
}

export default function OceanDepth() {
  const navigate = useNavigate();
  const [depth, setDepth] = useState(0);
  const containerRef = useRef(null);
  const { t, language } = useLanguageStore();
  // Helper: chọn đúng trường theo ngôn ngữ
  const loc = (vi, en) => language === "en" ? en : vi;

  const [apiCreatures, setApiCreatures] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Tải dữ liệu 319 sinh vật theo độ sâu đại dương thực tế từ CSDL
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
      })
      .finally(() => {
        if (isMounted) setIsLoadingApi(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentZone = getZoneAtDepth(depth);
  const realisticOceanColor = getRealisticOceanColor(depth);

  useEffect(() => {
    const handleScroll = () => {
      // Trừ chiều cao hero để mốc độ sâu bắt đầu từ mực nước
      const scrollY = Math.max(0, window.scrollY - window.innerHeight);
      const calculatedDepth = Math.max(0, Math.min(MAX_DEPTH, Math.round(scrollY / DEPTH_SCALE)));
      setDepth(calculatedDepth);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ưu tiên hiển thị 32 sinh vật biển tự nhiên có ảnh tách nền chuẩn (transparent cutouts),
  // được làm giàu thông tin phân loại và tình trạng bảo tồn từ CSDL PostgreSQL
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
      };
    });
  }, [apiCreatures]);

  // ── Sinh vật biển: Thả tự do trực tiếp trong nước theo phong cách Neal.fun ───
  const renderCreatures = () => {
    const lastTopInLane = [-9999, -9999, -9999, -9999];
    let lastGlobalTop = -9999;

    return displayCreatures.map((c) => {
      const left = c.left || 40;
      const lane = left < 33 ? 0 : left < 50 ? 1 : left < 67 ? 2 : 3;

      // Chiều sâu tự nhiên theo tỉ lệ 1m = 2px
      const naturalTop = window.innerHeight + 80 + c.depth * DEPTH_SCALE;

      // Giãn cách trong cùng làn tối thiểu 180px và toàn cục 45px để tránh chồng chéo
      const top = Math.max(naturalTop, lastTopInLane[lane] + 180, lastGlobalTop + 45);
      lastTopInLane[lane] = top;
      lastGlobalTop = top;
      const name = loc(c.nameVi, c.nameEn);
      const displayName = language === "en" ? (c.nameEn || name) : (c.nameVi || name);

      return (
        <div
          key={`c-${c.id}`}
          className="od-node od-creature-item"
          style={{ top: `${top}px`, left: `${left}%` }}
          onClick={() => navigate(`/species/${c.slug || c.id}`)}
          title={`${name} (${c.depth}m) - ${loc(c.descVi, c.descEn)}`}
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
              <span className="od-creature-sciname">
                {c.sciName}
              </span>
            )}
            <span className="od-creature-meter">{c.depth}m</span>
          </div>
        </div>
      );
    });
  };

  // Nhãn tên tầng nước
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

  return (
    <>
      <Navbar />

      {/* Thanh điều hướng nhảy nhanh các tầng nước đại dương */}
      <QuickZoneBar currentDepth={depth} />

      {/* Thước đo dọc khoa học cố định bên trái */}
      <FixedRuler depth={depth} />

      {/* Nền nước biển */}
      <div
        className="od-ocean-viewport-bg"
        style={{ backgroundColor: realisticOceanColor }}
        aria-hidden="true"
      >
        {/* Tia nắng mặt trời */}
        <div
          className="od-sun-rays"
          style={{ opacity: Math.max(0, (220 - depth) / 220) }}
        />

        {/* Gợn sóng tầng nông */}
        <div
          className="od-water-caustics"
          style={{ opacity: Math.max(0, (140 - depth) / 140) }}
        />

        {/* Sương mờ đại dương */}
        <div
          className="od-water-depth-fog"
          style={{ opacity: Math.min(0.85, depth / 400) }}
        />

        {/* Hiệu ứng bóng tối theo độ sâu */}
        <div
          className="od-depth-darkness"
          style={{ opacity: Math.min(0.96, Math.max(0, (depth - 40) / 1400)) }}
        />

        {/* Đèn pha tàu thám hiểm */}
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
          {/* Nền trời — gradient Neal.fun style */}
          <div className="od-hero-sky" aria-hidden="true" />

          <h1 className="od-hero-title">{t("oceanDepth.heroTitle")}</h1>

          {/* Sóng mặt nước hữu cơ — Neal.fun style wave separator */}
          <div className="od-hero-wave" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 90"
              preserveAspectRatio="none"
            >
              {/* Lớp teal đại dương chính */}
              <path
                d="M0,38 C160,72 320,8 480,46 C640,84 800,16 960,54 C1120,90 1300,30 1440,44 L1440,90 L0,90 Z"
                fill="#1a9898"
              />
              {/* Lớp teal sáng phía sau tạo chiều sâu */}
              <path
                d="M0,48 C120,28 280,62 440,40 C600,18 760,58 960,36 C1100,22 1280,50 1440,38 L1440,90 L0,90 Z"
                fill="#229090"
                opacity="0.5"
              />
              {/* Bong bóng sóng trắng — foam */}
              <path
                d="M0,34 C160,68 320,4 480,42 C640,80 800,12 960,50 C1120,86 1300,26 1440,40 L1440,48 C1300,36 1120,94 960,58 C800,20 640,88 480,50 C320,12 160,76 0,42 Z"
                fill="rgba(255,255,255,0.82)"
              />
            </svg>
          </div>
        </div>

        {/* Nội dung các tầng & sinh vật biển tự do */}
        {renderZoneLabels()}
        {renderCreatures()}

        {/* Vùng đáy biển Rãnh Manila */}
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

          {/* Thông tin Rãnh Manila (Đáy sâu nhất Biển Đông) */}
          <div className="od-seabed-summary-card">
            <h2 className="od-seabed-summary-title">
              {language === "en" ? "Manila Trench (5,016m)" : "Rãnh Manila (5.016m)"}
            </h2>
            <p className="od-seabed-summary-desc">
              {language === "en"
                ? "The Manila Trench is the only oceanic subduction trench in the East Sea, formed where the oceanic crust subducts beneath the Philippine Mobile Belt. At 5,016 meters, the seabed experiences an extreme pressure of 502 atmospheres and a near-freezing temperature of 1.4°C."
                : "Rãnh hút chìm sâu duy nhất và là ranh giới kiến tạo quan trọng bậc nhất tạo nên điểm sâu nhất của Biển Đông (5.016m). Áp suất nền đáy đạt 502 atm và nhiệt độ 1,4°C."}
            </p>

            <div className="od-seabed-meta-row">
              <span className="od-seabed-meta-item">
                <span className="od-seabed-meta-label">{language === "en" ? "Depth" : "Độ sâu"}:</span>
                <span className="od-seabed-meta-value">5,016 m</span>
              </span>
              <span className="od-seabed-meta-divider">•</span>
              <span className="od-seabed-meta-item">
                <span className="od-seabed-meta-label">{language === "en" ? "Pressure" : "Áp suất"}:</span>
                <span className="od-seabed-meta-value">502 atm</span>
              </span>
              <span className="od-seabed-meta-divider">•</span>
              <span className="od-seabed-meta-item">
                <span className="od-seabed-meta-label">{language === "en" ? "Temperature" : "Nhiệt độ"}:</span>
                <span className="od-seabed-meta-value">1.4°C</span>
              </span>
              <span className="od-seabed-meta-divider">•</span>
              <span className="od-seabed-meta-item">
                <span className="od-seabed-meta-label">{language === "en" ? "Coords" : "Tọa độ"}:</span>
                <span className="od-seabed-meta-value">15°N 119°E</span>
              </span>
            </div>

            <button
              type="button"
              className="od-seabed-back-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <WaveIcon className="od-seabed-back-icon" />
              {language === "en" ? "Return to surface" : "Trở về mặt biển"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer trang */}
      <Footer />
    </>
  );
}
