import { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  X,
  Compass,
} from "lucide-react";
import {
  CHONDRICHTHYES_PARTS,
  OSTEICHTHYES_PARTS,
  CEPHALOPOD_PARTS,
  TURTLE_PARTS,
  MAMMAL_PARTS,
} from "./explodedAnatomyData";

export function ExplodedAnatomyViewer({
  species = {},
  language = "vi",
  onSelectPart,
  selectedPartId = null,
  parts = CHONDRICHTHYES_PARTS,
  archetypeId = "chondrichthyes",
}) {
  const [explodePercent, setExplodePercent] = useState(0); // 0 to 100
  const [hoveredId, _setHoveredId] = useState(null);
  const [inspectedId, setInspectedId] = useState(selectedPartId);
  const [prevSelectedPartId, setPrevSelectedPartId] = useState(selectedPartId);

  // Sync external selectedPartId during render if prop changes
  if (selectedPartId !== prevSelectedPartId) {
    setPrevSelectedPartId(selectedPartId);
    if (selectedPartId) {
      setInspectedId(selectedPartId);
    }
  }

  const setHoveredId = (id) => {
    _setHoveredId(id);
    if (id) {
      setInspectedId(id);
    }
  };

  const isOsteichthyes =
    archetypeId === "osteichthyes" ||
    parts === OSTEICHTHYES_PARTS ||
    (Array.isArray(parts) && parts[0]?.id?.startsWith("ost_"));

  const isMammal =
    archetypeId === "marine_mammals" ||
    parts === MAMMAL_PARTS ||
    (Array.isArray(parts) && parts[0]?.id?.startsWith("mam_"));

  const isTurtle =
    archetypeId === "marine_reptiles" ||
    parts === TURTLE_PARTS ||
    (Array.isArray(parts) && parts[0]?.id?.startsWith("tur_"));

  const isCephalopod =
    archetypeId === "cephalopods" ||
    parts === CEPHALOPOD_PARTS ||
    (Array.isArray(parts) && parts[0]?.id?.startsWith("cep_"));
  // Factor: 0.0 -> 1.0
  const f = Math.max(0, Math.min(100, explodePercent)) / 100;

  const handlePartClick = (part) => {
    if (!part) return;
    setInspectedId(part.id);
    onSelectPart?.(part);
  };

  const handlePartClickById = (partId) => {
    const part = parts.find((p) => p.id === partId);
    if (part) handlePartClick(part);
  };

  const handleClearSelection = () => {
    _setHoveredId(null);
    setInspectedId(null);
    onSelectPart?.(null);
  };

  const activePart = parts.find(
    (p) => p.id === (hoveredId || inspectedId || selectedPartId),
  );



  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      {/* ── Top Sleek Toolbar ── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/20 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] mb-4">
        {/* Left: Mode Title & Specimen Identification */}
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Compass size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-normal font-heading">
                {language === "vi"
                  ? "Mô hình bóc tách giải phẫu sinh học"
                  : "Biological Disassembly Model"}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-medium">
                {explodePercent === 0
                  ? language === "vi"
                    ? "Lắp ráp hoàn chỉnh"
                    : "Assembled"
                  : explodePercent === 100
                    ? language === "vi"
                      ? "Bóc tách tối đa"
                      : "Fully exploded"
                    : `${Math.round(explodePercent)}% bóc tách`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {species?.nameVi || species?.commonName ? (
                <span className="text-cyan-400 font-medium mr-1.5">
                  {species.nameVi || species.commonName} •
                </span>
              ) : null}
              {language === "vi"
                ? "Kéo thanh trượt để tách rời các bộ phận sinh học dọc theo trục giải phẫu"
                : "Drag slider to separate biological anatomical structures"}
            </p>
          </div>
        </div>

        {/* Right: Controls (Slider + Assemble reset) */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Slider */}
          <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-white/10 min-w-[210px]">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              {language === "vi" ? "Mức độ" : "Ratio"}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={explodePercent}
              onChange={(e) => setExplodePercent(Number(e.target.value))}
              className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${explodePercent}%, #334155 ${explodePercent}%, #334155 100%)`,
              }}
            />
            <span className="text-xs font-semibold text-cyan-300 font-mono w-9 text-right">
              {Math.round(explodePercent)}%
            </span>
          </div>

          {/* Quick 0% Reset */}
          <button
            onClick={() => setExplodePercent(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              explodePercent === 0
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
            title="Lắp ráp hoàn chỉnh"
          >
            <RotateCcw size={12} />
            <span>{language === "vi" ? "Thu gọn" : "Assemble"}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN STUDIO VIEWPORT ── */}
      <div
        onClick={handleClearSelection}
        className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.25)] min-h-[480px] md:min-h-[520px] flex items-center justify-center p-2 cursor-pointer"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 45%, #0d2847 0%, #061528 50%, #020712 100%)",
        }}
        title={
          language === "vi"
            ? "Bấm vào khoảng trống để hủy chọn bộ phận"
            : "Click background to deselect"
        }
      >
        {/* Soft Ethereal Caustic Underwater Backlight */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_90%_50%_at_50%_15%,rgba(56,189,248,0.25),transparent_70%)]" />

        {/* Biometric Measurement Rings in Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
          <div className="w-[650px] h-[340px] rounded-full border border-cyan-400/30" />
          <div className="absolute w-[450px] h-[220px] rounded-full border border-dashed border-cyan-300/20" />
        </div>

        {/* Soft Floor Shadow / Specimen Studio Stage */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* SVG Canvas with Luminous, Vibrant Biological Rendering */}
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-auto max-h-[500px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Biological Tissue Drop Shadows */}
            <filter
              id="organDropShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="6"
                floodColor="#010409"
                floodOpacity="0.8"
              />
            </filter>
            <filter
              id="cartilageShadow"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#020617"
                floodOpacity="0.7"
              />
            </filter>

            {/* Luminous Bioluminescent Crystal Skin Envelope */}
            <linearGradient id="crystalBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#0369a1" stopOpacity="0.12" />
              <stop offset="80%" stopColor="#0ea5e9" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.22" />
            </linearGradient>

            {/* Luminous Body Outline */}
            <linearGradient
              id="biometricOutline"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>

            {/* Vibrant Deep Ocean Fin Foils */}
            <linearGradient
              id="finOceanFoil"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#0369a1" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#075985" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing Amber Squalene Liver */}
            <linearGradient id="liverAmber" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.95" />
            </linearGradient>

            {/* Vivid Crimson Muscular Ventricle */}
            <radialGradient id="heartRubyVentricle" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.98" />
              <stop offset="40%" stopColor="#e11d48" stopOpacity="0.92" />
              <stop offset="75%" stopColor="#be123c" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4c0519" stopOpacity="0.95" />
            </radialGradient>

            {/* Pearl Ivory Cartilage */}
            <linearGradient
              id="cartilagePearl"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Warm Digestive Mucosa Cream */}
            <linearGradient
              id="stomachCream"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a16207" stopOpacity="0.85" />
            </linearGradient>

            {/* Luminous Emerald Spiral Valve */}
            <linearGradient
              id="spiralValveEmerald"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#059669" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
            </linearGradient>

            {/* Vibrant Myoglobin Salmon-Pink Myomeres */}
            <linearGradient id="myomereRuby" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#fb7185" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#f43f5e" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#9f1239" stopOpacity="0.95" />
            </linearGradient>

            {/* Golden Neural Brain */}
            <linearGradient id="brainGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#fde047" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#eab308" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a16207" stopOpacity="0.9" />
            </linearGradient>

            {/* Luminous Bioluminescent Crystal Envelope for Osteichthyes */}
            <linearGradient
              id="crystalBodyOsteichthyes"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.12" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
            </linearGradient>

            {/* Hydrostatic Swim Bladder Pearl Gradient */}
            <linearGradient
              id="swimBladderPearl"
              x1="10%"
              y1="10%"
              x2="90%"
              y2="90%"
            >
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.92" />
            </linearGradient>

            {/* Bony Opercular Plate Silver Gradient */}
            <linearGradient
              id="operculumSilver"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#94a3b8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.95" />
            </linearGradient>

            {/* Osteichthyes Fin Rays Gradient */}
            <linearGradient
              id="finRayOsteichthyes"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>

            {/* Luminous Bioluminescent Crystal Mantle for Cephalopods */}
            <radialGradient id="octopusMantleRadial" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#ea580c" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#0d9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.4" />
            </radialGradient>

            {/* Cephalopod Outer Mantle Shading */}
            <linearGradient
              id="octopusMantleOutline"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
            </linearGradient>

            {/* Cephalopod Muscular Arm Volume Gradient */}
            <linearGradient
              id="octopusArmVolume"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#c2410c" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#0f766e" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.9" />
            </linearGradient>

            {/* Suction Cup 3D Radial Gradient */}
            <radialGradient id="sucker3DDisc" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#a5f3fc" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
            </radialGradient>

            {/* Octopus Eye Golden Iris */}
            <radialGradient id="octopusEyeIris" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#1e293b" />
            </radialGradient>

            {/* Umbrella Web Translucency */}
            <linearGradient
              id="umbrellaWebGrad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
            </linearGradient>

            {/* Hemocyanin Blue Blood Heart Radial Gradient */}
            <radialGradient id="blueBloodHeart" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.92" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </radialGradient>

            {/* Deep Melanin Ink Sac Radial Gradient */}
            <radialGradient id="inkSacDark" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* Chitin Parrot Beak Gradient */}
            <linearGradient
              id="beakChitinAmber"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Cephalopod Tentacle Arm Glow Gradient */}
            <linearGradient id="armGlowTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
            </linearGradient>

            {/* Organic Cephalopod Skin Gradient - Dorsal Terracotta Rust */}
            <linearGradient
              id="octopusDermalOrganic"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#c2410c" stopOpacity="0.92" />
              <stop offset="70%" stopColor="#9a3412" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.98" />
            </linearGradient>

            {/* Ventral Oral Surface Cream-Gold Gradient */}
            <linearGradient
              id="octopusVentralOral"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fde68a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.85" />
            </linearGradient>

            {/* Buccal Mass Muscular Crimson Ball */}
            <radialGradient id="octopusBuccalMass" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.98" />
              <stop offset="40%" stopColor="#e11d48" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#9f1239" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#4c0519" stopOpacity="1" />
            </radialGradient>

            {/* Razor Chitin Beak Obsidian to Amber */}
            <linearGradient
              id="octopusBeakObsidian"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#d97706" />
              <stop offset="60%" stopColor="#451a03" />
              <stop offset="90%" stopColor="#090503" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Convoluted Brain Cortex Gold */}
            <radialGradient id="octopusBrainLobed" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>

            {/* Eye Eyeball 3D Volume */}
            <radialGradient id="octopusEyeBulb" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#1e293b" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* 3D Suction Cup with Pedicel Shading */}
            <radialGradient id="sucker3DOptimized" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#bae6fd" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#075985" stopOpacity="1" />
            </radialGradient>

            {/* ── Sea Turtle Marine Reptile Gradients & Filters ── */}
            <radialGradient id="turtleCarapaceGrad" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#10b981" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#047857" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="turtlePlastronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="turtleLungGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#be123c" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="turtleHeartGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="1" />
              <stop offset="50%" stopColor="#dc2626" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="turtleFlipperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0d9488" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#115e59" stopOpacity="1" />
            </linearGradient>
            <radialGradient id="turtleSaltGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#e9d5ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#6b21a8" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="turtleBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" stopOpacity="1" />
              <stop offset="60%" stopColor="#ca8a04" stopOpacity="1" />
              <stop offset="100%" stopColor="#713f12" stopOpacity="1" />
            </linearGradient>

            {/* ── Marine Mammal (Dolphin / Cetacean) Gradients ── */}
            <linearGradient id="dolphinSkinDorsum" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#0369a1" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#024e7a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="dolphinSkinVenter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="dolphinMelonGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f3e8ff" stopOpacity="1" />
              <stop offset="45%" stopColor="#c084fc" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#7e22ce" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="dolphinHeartGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="1" />
              <stop offset="45%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#b91c1c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="dolphinLungGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fb7185" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {isCephalopod ? (
            /* ── CEPHALOPODS (OCTOPUS) REALISTIC EXPLODED 3D MORPHOLOGY ── */
            <>
              {/* ── 2. KHỐI GAN TỤY & DẠ DÀY TIÊU HÓA (Upper Mantle Cavity) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${70 * f}, ${-45 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_digestive_gland");
                }}
                onMouseEnter={() => setHoveredId("cep_digestive_gland")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Organic bilobed digestive gland */}
                <path
                  d="M 450 115 C 440 85, 470 65, 500 70 C 530 65, 560 85, 550 115 C 545 138, 525 152, 500 152 C 475 152, 455 138, 450 115 Z"
                  fill="url(#spiralValveEmerald)"
                  stroke={
                    hoveredId === "cep_digestive_gland" ? "#ffffff" : "#059669"
                  }
                  strokeWidth={
                    hoveredId === "cep_digestive_gland" ? "2.5" : "1.2"
                  }
                />
                {/* Stomach pouch & caecum spiral */}
                <ellipse
                  cx="480"
                  cy="135"
                  rx="18"
                  ry="12"
                  fill="#10b981"
                  stroke="#047857"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <ellipse
                  cx="520"
                  cy="135"
                  rx="16"
                  ry="11"
                  fill="#34d399"
                  stroke="#059669"
                  strokeWidth="1"
                  opacity="0.9"
                />
                {/* Archimedean digestive spiral folds */}
                <path
                  d="M 515 135 Q 520 128 526 134 Q 522 140 516 135"
                  fill="none"
                  stroke="#a7f3d0"
                  strokeWidth="1.4"
                />
              </g>

              {/* ── 3. TÚI MỰC PHÒNG THỦ MELANIN (Visceral Cavity) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${85 * f}, ${45 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_ink_sac");
                }}
                onMouseEnter={() => setHoveredId("cep_ink_sac")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Pyriform melanin reservoir */}
                <path
                  d="M 518 170 C 535 160, 555 170, 552 195 C 550 215, 530 222, 518 210 C 508 200, 508 180, 518 170 Z"
                  fill="url(#inkSacDark)"
                  stroke={hoveredId === "cep_ink_sac" ? "#ffffff" : "#818cf8"}
                  strokeWidth={hoveredId === "cep_ink_sac" ? "2.5" : "1.4"}
                />
                {/* Ink duct running towards siphon */}
                <path
                  d="M 522 195 Q 490 220 445 240"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Specular sheen */}
                <ellipse
                  cx="532"
                  cy="185"
                  rx="10"
                  ry="6"
                  fill="#c7d2fe"
                  opacity="0.35"
                />
              </g>

              {/* ── 4. ĐÔI CUNG MANG LÔNG CHIM CTENIDIA (Lateral Mantle Walls) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-65 * f}, ${-25 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_ctenidia");
                }}
                onMouseEnter={() => setHoveredId("cep_ctenidia")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Ctenidium Plume */}
                <g>
                  <path
                    d="M 425 125 C 415 155, 418 185, 432 205"
                    fill="none"
                    stroke={
                      hoveredId === "cep_ctenidia" ? "#ffffff" : "#38bdf8"
                    }
                    strokeWidth="2.2"
                  />
                  {[135, 145, 155, 165, 175, 185, 195].map((gy, i) => (
                    <path
                      key={`lgill-${i}`}
                      d={`M 420 ${gy} L 398 ${gy + 3} M 423 ${gy} L 442 ${gy - 3}`}
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
                {/* Right Ctenidium Plume */}
                <g>
                  <path
                    d="M 575 125 C 585 155, 582 185, 568 205"
                    fill="none"
                    stroke={
                      hoveredId === "cep_ctenidia" ? "#ffffff" : "#38bdf8"
                    }
                    strokeWidth="2.2"
                  />
                  {[135, 145, 155, 165, 175, 185, 195].map((gy, i) => (
                    <path
                      key={`rgill-${i}`}
                      d={`M 580 ${gy} L 602 ${gy + 3} M 577 ${gy} L 558 ${gy - 3}`}
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  ))}
                </g>
              </g>

              {/* ── 5. HỆ 3 QUẢ TIM & MÁU XANH HEMOCYANIN (Center Visceral Core) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-35 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_three_hearts");
                }}
                onMouseEnter={() => setHoveredId("cep_three_hearts")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hemocyanin vascular branches */}
                <g stroke="#38bdf8" strokeWidth="2.2" fill="none" opacity="0.9">
                  <path d="M 440 175 Q 470 185 500 180" />
                  <path d="M 560 175 Q 530 185 500 180" />
                  <path d="M 500 168 L 500 135" />
                  <path d="M 500 188 Q 500 230 460 250" />
                  <path d="M 500 188 Q 500 230 540 250" />
                </g>
                {/* Central Systemic Heart */}
                <ellipse
                  cx="500"
                  cy="180"
                  rx="22"
                  ry="16"
                  fill="url(#blueBloodHeart)"
                  stroke={
                    hoveredId === "cep_three_hearts" ? "#ffffff" : "#67e8f9"
                  }
                  strokeWidth={hoveredId === "cep_three_hearts" ? "2.5" : "1.5"}
                />
                {/* Left Branchial Heart */}
                <circle
                  cx="438"
                  cy="175"
                  r="12"
                  fill="url(#blueBloodHeart)"
                  stroke="#67e8f9"
                  strokeWidth="1.3"
                />
                {/* Right Branchial Heart */}
                <circle
                  cx="562"
                  cy="175"
                  r="12"
                  fill="url(#blueBloodHeart)"
                  stroke="#67e8f9"
                  strokeWidth="1.3"
                />
              </g>

              {/* ── 6. NÃO VÀNH KHUYÊN & SỢI TRỤC KHỔNG LỒ (Head / Cranium) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-55 * f}, ${-65 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_brain_ring");
                }}
                onMouseEnter={() => setHoveredId("cep_brain_ring")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Circum-esophageal donut ring */}
                <ellipse
                  cx="500"
                  cy="245"
                  rx="24"
                  ry="17"
                  fill="url(#brainGold)"
                  stroke={
                    hoveredId === "cep_brain_ring" ? "#ffffff" : "#ca8a04"
                  }
                  strokeWidth={hoveredId === "cep_brain_ring" ? "2.5" : "1.4"}
                />
                {/* Esophagus canal hole */}
                <ellipse
                  cx="500"
                  cy="245"
                  rx="8"
                  ry="6"
                  fill="#0b1728"
                  stroke="#78350f"
                  strokeWidth="1.2"
                />
                {/* Massive Optic Lobes connecting to both eyes */}
                <circle
                  cx="468"
                  cy="245"
                  r="12"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                <circle
                  cx="532"
                  cy="245"
                  r="12"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                {/* Giant Axon Fibers radiating into arms */}
                <g
                  stroke="#fef08a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M 480 255 Q 450 280 430 305" />
                  <path d="M 500 258 L 500 310" />
                  <path d="M 520 255 Q 550 280 570 305" />
                </g>
              </g>

              {/* ── 7. CẶP MẮT QUANG HỌC KHÔNG ĐIỂM MÙ (Lateral Head Sides) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-85 * f}, ${-20 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_eyes");
                }}
                onMouseEnter={() => setHoveredId("cep_eyes")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Eye */}
                <g>
                  <ellipse
                    cx="395"
                    cy="250"
                    rx="20"
                    ry="18"
                    fill="#020617"
                    stroke={hoveredId === "cep_eyes" ? "#ffffff" : "#fbbf24"}
                    strokeWidth={hoveredId === "cep_eyes" ? "2.5" : "1.8"}
                  />
                  <circle
                    cx="395"
                    cy="250"
                    r="14"
                    fill="url(#octopusEyeIris)"
                  />
                  {/* Horizontal slit pupil */}
                  <rect
                    x="385"
                    y="247"
                    width="20"
                    height="6"
                    rx="3"
                    fill="#020617"
                  />
                  <circle cx="391" cy="248" r="2.5" fill="#ffffff" />
                </g>
                {/* Right Eye */}
                <g>
                  <ellipse
                    cx="605"
                    cy="250"
                    rx="20"
                    ry="18"
                    fill="#020617"
                    stroke={hoveredId === "cep_eyes" ? "#ffffff" : "#fbbf24"}
                    strokeWidth={hoveredId === "cep_eyes" ? "2.5" : "1.8"}
                  />
                  <circle
                    cx="605"
                    cy="250"
                    r="14"
                    fill="url(#octopusEyeIris)"
                  />
                  {/* Horizontal slit pupil */}
                  <rect
                    x="595"
                    y="247"
                    width="20"
                    height="6"
                    rx="3"
                    fill="#020617"
                  />
                  <circle cx="601" cy="248" r="2.5" fill="#ffffff" />
                </g>
              </g>

              {/* ── 8. MỎ VẸT CHITIN & LƯỠI BÀO RADULA (Center of Oral Web) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${55 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_beak_radula");
                }}
                onMouseEnter={() => setHoveredId("cep_beak_radula")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Spherical muscular buccal mass */}
                <circle
                  cx="500"
                  cy="290"
                  r="19"
                  fill="#fda4af"
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                {/* Upper chitin beak rostrum */}
                <path
                  d="M 490 282 C 504 266, 520 274, 524 290 C 510 294, 498 290, 490 282 Z"
                  fill="url(#beakChitinAmber)"
                  stroke={
                    hoveredId === "cep_beak_radula" ? "#ffffff" : "#451a03"
                  }
                  strokeWidth={hoveredId === "cep_beak_radula" ? "2.5" : "1.2"}
                />
                {/* Lower chitin beak rostrum */}
                <path
                  d="M 488 288 C 502 298, 520 304, 528 294 C 522 314, 498 314, 488 288 Z"
                  fill="url(#beakChitinAmber)"
                  stroke="#451a03"
                  strokeWidth="1.2"
                />
                {/* Radula denticles */}
                <path
                  d="M 500 288 L 512 290"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeDasharray="2 1"
                />
              </g>

              {/* ── 9. ỐNG PHỄU ĐẨY NƯỚC PHẢN LỰC SIPHON (Collar Jet) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-85 * f}, ${50 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_siphon");
                }}
                onMouseEnter={() => setHoveredId("cep_siphon")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Conical jet nozzle */}
                <path
                  d="M 435 235 L 350 285 L 372 312 L 452 262 Z"
                  fill="url(#crystalBodyOsteichthyes)"
                  stroke={hoveredId === "cep_siphon" ? "#ffffff" : "#38bdf8"}
                  strokeWidth={hoveredId === "cep_siphon" ? "2.5" : "1.5"}
                />
                {/* Jet aperture opening */}
                <ellipse
                  cx="360"
                  cy="298"
                  rx="14"
                  ry="8"
                  transform="rotate(-30, 360, 298)"
                  fill="#071326"
                  stroke="#38bdf8"
                  strokeWidth="1.6"
                />
                {/* Muscle retractor bands */}
                <path
                  d="M 385 268 L 402 288 M 410 252 L 428 272"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                />
              </g>

              {/* ── 10. 8 TAY XÚC TU VÀ HÀNG TRĂM GIÁC HÚT (Muscular Appendages & Web) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${95 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_arms_suckers");
                }}
                onMouseEnter={() => setHoveredId("cep_arms_suckers")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Interbrachial umbrella web (màng da nối giữa các gốc tay) */}
                <path
                  d="M 370 295 Q 430 330 460 305 Q 480 335 500 310 Q 520 335 540 305 Q 570 330 630 295 C 590 340 410 340 370 295 Z"
                  fill="url(#umbrellaWebGrad)"
                  stroke="rgba(45,212,191,0.5)"
                  strokeWidth="1.2"
                />

                {/* 8 Thick, Muscular, Tapering Anatomical Arms */}
                <g
                  fill="url(#octopusArmVolume)"
                  stroke={
                    hoveredId === "cep_arms_suckers" ? "#2dd4bf" : "#c2410c"
                  }
                  strokeWidth={hoveredId === "cep_arms_suckers" ? "2" : "1"}
                >
                  {/* Arm 1 (Far Left Crown - sweeping up-left and curling) */}
                  <path d="M 425 285 C 340 260 220 250 140 280 C 80 305 40 350 60 380 C 75 400 110 395 120 370 C 130 340 180 305 260 295 C 330 288 410 298 435 305 Z" />
                  {/* Arm 2 (Left Lateral - sweeping down-left) */}
                  <path d="M 440 295 C 360 310 250 330 170 380 C 110 420 80 460 105 475 C 125 480 150 460 170 435 C 220 390 310 355 410 335 C 435 325 448 310 440 295 Z" />
                  {/* Arm 3 (Left Front Ventral) */}
                  <path d="M 465 305 C 410 340 330 390 250 440 C 200 470 190 480 215 480 C 240 480 290 450 350 410 C 410 370 460 345 480 320 Z" />
                  {/* Arm 4 (Inner Left Ventral) */}
                  <path d="M 485 312 C 455 360 420 410 380 455 C 350 480 370 480 395 470 C 435 435 470 385 500 330 Z" />
                  {/* Arm 5 (Inner Right Ventral) */}
                  <path d="M 515 312 C 545 360 580 410 620 455 C 650 480 630 480 605 470 C 565 435 530 385 500 330 Z" />
                  {/* Arm 6 (Right Front Ventral) */}
                  <path d="M 535 305 C 590 340 670 390 750 440 C 800 470 810 480 785 480 C 760 480 710 450 650 410 C 590 370 540 345 520 320 Z" />
                  {/* Arm 7 (Right Lateral - sweeping down-right) */}
                  <path d="M 560 295 C 640 310 750 330 830 380 C 890 420 920 460 895 475 C 875 480 850 460 830 435 C 780 390 690 355 590 335 C 565 325 552 310 560 295 Z" />
                  {/* Arm 8 (Far Right Crown - sweeping up-right and curling) */}
                  <path d="M 575 285 C 660 260 780 250 860 280 C 920 305 960 350 940 380 C 925 400 890 395 880 370 C 870 340 820 305 740 295 C 670 288 590 298 565 305 Z" />
                </g>

                {/* 3D Sculpted Suction Cups Lining the Arms */}
                <g>
                  {/* Arm 1 Suckers */}
                  {[
                    [80, 375, 4.5],
                    [110, 360, 5],
                    [145, 335, 5.5],
                    [190, 305, 6],
                    [240, 285, 6.5],
                    [300, 275, 7],
                    [360, 270, 7.5],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck1-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 2 Suckers */}
                  {[
                    [120, 465, 4.5],
                    [150, 440, 5],
                    [190, 405, 5.5],
                    [245, 365, 6],
                    [310, 335, 6.5],
                    [375, 318, 7],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck2-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 3 Suckers */}
                  {[
                    [225, 470, 5],
                    [270, 435, 5.5],
                    [325, 395, 6],
                    [385, 360, 6.5],
                    [435, 330, 7],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck3-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 4 Suckers */}
                  {[
                    [375, 465, 5],
                    [410, 425, 5.5],
                    [445, 385, 6],
                    [475, 345, 6.5],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck4-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 5 Suckers */}
                  {[
                    [625, 465, 5],
                    [590, 425, 5.5],
                    [555, 385, 6],
                    [525, 345, 6.5],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck5-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 6 Suckers */}
                  {[
                    [775, 470, 5],
                    [730, 435, 5.5],
                    [675, 395, 6],
                    [615, 360, 6.5],
                    [565, 330, 7],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck6-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 7 Suckers */}
                  {[
                    [880, 465, 4.5],
                    [850, 440, 5],
                    [810, 405, 5.5],
                    [755, 365, 6],
                    [690, 335, 6.5],
                    [625, 318, 7],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck7-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}

                  {/* Arm 8 Suckers */}
                  {[
                    [920, 375, 4.5],
                    [890, 360, 5],
                    [855, 335, 5.5],
                    [810, 305, 6],
                    [760, 285, 6.5],
                    [700, 275, 7],
                    [640, 270, 7.5],
                  ].map(([sx, sy, sr], i) => (
                    <g key={`suck8-${i}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={sr}
                        fill="url(#sucker3DDisc)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <circle cx={sx} cy={sy} r={sr * 0.45} fill="#082f49" />
                    </g>
                  ))}
                </g>
              </g>

              {/* ── 11. LỚP ÁO CƠ BẮP & TẾ BÀO SẮC TỐ MANTLE (Authentic Pear-Shaped Dome) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-125 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("cep_mantle");
                }}
                onMouseEnter={() => setHoveredId("cep_mantle")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* True pear-shaped muscular visceral mantle */}
                <path
                  d="M 415 220 C 365 155, 420 75, 500 42 C 580 75, 635 155, 585 220 C 545 232, 455 232, 415 220 Z"
                  fill="url(#octopusMantleRadial)"
                  stroke={
                    hoveredId === "cep_mantle"
                      ? "#ffffff"
                      : "url(#octopusMantleOutline)"
                  }
                  strokeWidth={hoveredId === "cep_mantle" ? "2.8" : "2"}
                />
                {/* Muscular pallial collar rim */}
                <path
                  d="M 415 220 C 455 234, 545 234, 585 220"
                  stroke="#2dd4bf"
                  strokeWidth="2.2"
                  fill="none"
                  opacity={Math.max(0.4, 0.9 - f * 0.4)}
                />
                {/* Longitudinal & circular mantle muscle striations */}
                <g
                  fill="none"
                  stroke="rgba(251,146,60,0.35)"
                  strokeWidth="1"
                  opacity={Math.max(0.3, 0.85 - f * 0.4)}
                >
                  <path d="M 445 100 C 430 140, 435 180, 440 215" />
                  <path d="M 475 70 C 470 120, 470 170, 470 220" />
                  <path d="M 500 52 L 500 222" />
                  <path d="M 525 70 C 530 120, 530 170, 530 220" />
                  <path d="M 555 100 C 570 140, 565 180, 560 215" />
                  <path
                    d="M 400 140 Q 500 160 600 140"
                    stroke="rgba(45,212,191,0.25)"
                  />
                  <path
                    d="M 410 180 Q 500 200 590 180"
                    stroke="rgba(45,212,191,0.25)"
                  />
                </g>
                {/* Natural chromatophore pigment clusters */}
                <g opacity={Math.max(0.35, 0.9 - f * 0.4)}>
                  {[
                    [450, 80, 2.5, "#ea580c"],
                    [480, 65, 3, "#fb7185"],
                    [515, 60, 2.8, "#facc15"],
                    [545, 75, 3.2, "#ea580c"],
                    [430, 110, 3.5, "#facc15"],
                    [465, 100, 4, "#fb7185"],
                    [500, 95, 3.5, "#ea580c"],
                    [535, 105, 3.8, "#2dd4bf"],
                    [570, 115, 3.2, "#facc15"],
                    [415, 150, 3.2, "#ea580c"],
                    [450, 140, 3.6, "#2dd4bf"],
                    [490, 135, 4.2, "#fb7185"],
                    [520, 140, 3.8, "#facc15"],
                    [555, 150, 3.5, "#ea580c"],
                    [585, 160, 3, "#fb7185"],
                    [430, 185, 3.5, "#2dd4bf"],
                    [470, 180, 4, "#ea580c"],
                    [510, 175, 3.8, "#fb7185"],
                    [545, 180, 3.5, "#facc15"],
                    [575, 190, 3.2, "#2dd4bf"],
                  ].map(([cx, cy, cr, col], idx) => (
                    <circle
                      key={`chroma-${idx}`}
                      cx={cx}
                      cy={cy}
                      r={cr}
                      fill={col}
                    />
                  ))}
                </g>
              </g>
            </>
          ) : isTurtle ? (
            /* ── MARINE REPTILES (GREEN SEA TURTLE) EXPLODED 3D MORPHOLOGY ── */
            <>
              {/* ── 1. VENTRAL PLASTRON (Yếm bụng bảo vệ đáy) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (68 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_plastron");
                }}
                onMouseEnter={() => setHoveredId("tur_plastron")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Plastron Shield Base */}
                <path
                  d="M 465 170 C 485 162, 515 162, 535 170 C 560 190, 565 275, 540 315 C 520 328, 480 328, 460 315 C 435 275, 440 190, 465 170 Z"
                  fill="url(#turtlePlastronGrad)"
                  stroke={hoveredId === "tur_plastron" ? "#ffffff" : "#f59e0b"}
                  strokeWidth={hoveredId === "tur_plastron" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_plastron" ? 0.35 : 0.92}
                />
                {/* Plastron Scute Sutures (Gular, Pectoral, Abdominal, Femoral) */}
                <path
                  d="M 500 165 L 500 325 M 450 205 L 550 205 M 445 250 L 555 250 M 455 290 L 545 290"
                  stroke="#78350f"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                  opacity="0.75"
                />
                {/* Lateral Bridges to Carapace */}
                <path d="M 442 215 L 430 225 M 442 270 L 430 260 M 558 215 L 570 225 M 558 270 L 570 260" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
              </g>

              {/* ── 2. PAPILLATED DIGESTIVE TRACT (Thực quản gai & Dạ dày) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (42 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_digestive");
                }}
                onMouseEnter={() => setHoveredId("tur_digestive")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Esophagus Tube */}
                <path
                  d="M 500 120 C 500 150, 490 180, 485 210"
                  stroke={hoveredId === "tur_digestive" ? "#ffffff" : "#eab308"}
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                  opacity={hoveredId && hoveredId !== "tur_digestive" ? 0.35 : 0.9}
                />
                {/* Backward-pointing Esophageal Papillae (Gai nhọn giữ sứa) */}
                {[-10, 0, 10].map((dx, i) => (
                  <path
                    key={i}
                    d={'M ' + (495 + dx) + ' ' + (145 + i * 18) + ' L ' + (500 + dx) + ' ' + (155 + i * 18) + ' L ' + (490 + dx) + ' ' + (155 + i * 18) + ' Z'}
                    fill="#fef08a"
                    opacity="0.8"
                  />
                ))}
                {/* J-Shaped Stomach */}
                <path
                  d="M 485 210 C 475 225, 465 245, 475 265 C 485 280, 510 275, 515 255 C 520 235, 495 225, 485 210 Z"
                  fill="#ca8a04"
                  stroke={hoveredId === "tur_digestive" ? "#ffffff" : "#fef08a"}
                  strokeWidth={hoveredId === "tur_digestive" ? "2" : "1"}
                  opacity={hoveredId && hoveredId !== "tur_digestive" ? 0.35 : 0.9}
                />
                {/* Coiled Intestinal Loop */}
                <path
                  d="M 515 255 C 525 270, 505 295, 495 285 C 485 275, 510 305, 500 315"
                  stroke="#a16207"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>

              {/* ── 3. THREE-CHAMBERED SHUNTING HEART (Tim 3 ngăn & Quai động mạch) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (18 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_heart");
                }}
                onMouseEnter={() => setHoveredId("tur_heart")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left & Right Aortic Arches */}
                <path
                  d="M 500 215 C 480 195, 460 210, 470 230 M 500 215 C 520 195, 540 210, 530 230"
                  stroke="#ef4444"
                  strokeWidth="3.5"
                  fill="none"
                  opacity="0.8"
                />
                {/* Right Atrium */}
                <ellipse cx="492" cy="220" rx="9" ry="7" fill="#dc2626" opacity="0.9" />
                {/* Left Atrium */}
                <ellipse cx="508" cy="220" rx="9" ry="7" fill="#dc2626" opacity="0.9" />
                {/* Single Incompletely Partitioned Ventricle */}
                <path
                  d="M 485 222 C 485 240, 500 248, 500 248 C 500 248, 515 240, 515 222 Z"
                  fill="url(#turtleHeartGrad)"
                  stroke={hoveredId === "tur_heart" ? "#ffffff" : "#ef4444"}
                  strokeWidth={hoveredId === "tur_heart" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_heart" ? 0.35 : 1}
                />
                {/* Shunt vessel glowing highlight */}
                <circle cx="500" cy="228" r="3.5" fill="#fca5a5" className="animate-pulse" />
              </g>

              {/* ── 4. CHASSIS SKELETON: SPINAL COLUMN, PECTORAL & PELVIC GIRDLES ── */}
              <g
                filter="url(#cartilageShadow)"
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_skeleton");
                }}
                onMouseEnter={() => setHoveredId("tur_skeleton")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Central Vertebral Column */}
                <path
                  d="M 500 130 L 500 340"
                  stroke={hoveredId === "tur_skeleton" ? "#38bdf8" : "#cbd5e1"}
                  strokeWidth={hoveredId === "tur_skeleton" ? "4" : "2.5"}
                  opacity={hoveredId && hoveredId !== "tur_skeleton" ? 0.35 : 0.85}
                />
                {/* Stacked Vertebral Centra */}
                {[150, 175, 200, 225, 250, 275, 300, 320].map((y) => (
                  <ellipse
                    key={y}
                    cx="500"
                    cy={y}
                    rx="6"
                    ry="3.5"
                    fill="#f8fafc"
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />
                ))}
                {/* Tri-radiate Pectoral Girdle (Đai vai 3 chạc nằm bên trong lồng ngực) */}
                <path
                  d="M 500 185 L 450 170 M 500 185 L 455 210 M 500 185 L 550 170 M 500 185 L 545 210"
                  stroke="#e2e8f0"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Pelvic Girdle (Đai hông liên kết chi sau) */}
                <path
                  d="M 500 310 L 465 325 M 500 310 L 535 325"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Tail Skeleton */}
                <path d="M 500 340 L 500 365" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2,2" opacity="0.7" />
              </g>

              {/* ── 5. HIND-FLIPPERS (Chi bơi sau bánh lái điều hướng) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (35 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_flippers_hind");
                }}
                onMouseEnter={() => setHoveredId("tur_flippers_hind")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Hind-Flipper */}
                <path
                  d="M 445 310 C 420 330, 395 365, 395 385 C 415 395, 445 380, 460 345 C 465 330, 455 315, 445 310 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke={hoveredId === "tur_flippers_hind" ? "#ffffff" : "#0d9488"}
                  strokeWidth={hoveredId === "tur_flippers_hind" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_flippers_hind" ? 0.35 : 0.9}
                />
                {/* Right Hind-Flipper */}
                <path
                  d="M 555 310 C 580 330, 605 365, 605 385 C 585 395, 555 380, 540 345 C 535 330, 545 315, 555 310 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke={hoveredId === "tur_flippers_hind" ? "#ffffff" : "#0d9488"}
                  strokeWidth={hoveredId === "tur_flippers_hind" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_flippers_hind" ? 0.35 : 0.9}
                />
                {/* Short Tail Skin */}
                <path d="M 495 338 Q 500 368 505 338 Z" fill="#0d9488" stroke="#047857" strokeWidth="1" opacity="0.8" />
              </g>

              {/* ── 6. MASSIVE HYDRODYNAMIC FORE-FLIPPERS (Đôi cánh mái chèo trước) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-15 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_flippers_fore");
                }}
                onMouseEnter={() => setHoveredId("tur_flippers_fore")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Fore-Flipper Hydrofoil Wing */}
                <path
                  d="M 445 180 C 380 155, 270 145, 190 160 C 175 163, 170 178, 185 185 C 265 218, 345 235, 430 220 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke={hoveredId === "tur_flippers_fore" ? "#ffffff" : "#06b6d4"}
                  strokeWidth={hoveredId === "tur_flippers_fore" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_flippers_fore" ? 0.35 : 0.95}
                />
                {/* Left Flipper Skeletal Phalanges (5 ngón tay kéo dài dạng khung cánh) */}
                <path
                  d="M 430 190 L 220 168 M 428 195 L 210 176 M 425 200 L 230 186 M 420 205 L 270 198 M 415 210 L 320 208"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="3,2"
                  opacity="0.6"
                />
                {/* Right Fore-Flipper Hydrofoil Wing */}
                <path
                  d="M 555 180 C 620 155, 730 145, 810 160 C 825 163, 830 178, 815 185 C 735 218, 655 235, 570 220 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke={hoveredId === "tur_flippers_fore" ? "#ffffff" : "#06b6d4"}
                  strokeWidth={hoveredId === "tur_flippers_fore" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_flippers_fore" ? 0.35 : 0.95}
                />
                {/* Right Flipper Skeletal Phalanges */}
                <path
                  d="M 570 190 L 780 168 M 572 195 L 790 176 M 575 200 L 770 186 M 580 205 L 730 198 M 585 210 L 680 208"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="3,2"
                  opacity="0.6"
                />
                {/* Leading Edge Swimming Scutes */}
                {[220, 260, 300, 340, 380].map((x) => (
                  <circle key={x} cx={x} cy={160 - (x - 300) * 0.08} r="2.5" fill="#bae6fd" opacity="0.7" />
                ))}
                {[780, 740, 700, 660, 620].map((x) => (
                  <circle key={x} cx={x} cy={160 + (x - 700) * 0.08} r="2.5" fill="#bae6fd" opacity="0.7" />
                ))}
              </g>

              {/* ── 7. SPONGY HIGH-CAPACITY LUNGS (Hai lá phổi bám sát vòm mai) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-22 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_lungs");
                }}
                onMouseEnter={() => setHoveredId("tur_lungs")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Lung Lobe */}
                <path
                  d="M 490 180 C 450 180, 435 215, 438 260 C 445 280, 485 275, 490 250 Z"
                  fill="url(#turtleLungGrad)"
                  stroke={hoveredId === "tur_lungs" ? "#ffffff" : "#f43f5e"}
                  strokeWidth={hoveredId === "tur_lungs" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_lungs" ? 0.35 : 0.88}
                />
                {/* Left Lung Spongy Alveoli Network */}
                <path d="M 450 205 Q 470 215 485 210 M 445 230 Q 465 240 488 235 M 452 250 Q 472 255 488 252" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
                
                {/* Right Lung Lobe */}
                <path
                  d="M 510 180 C 550 180, 565 215, 562 260 C 555 280, 515 275, 510 250 Z"
                  fill="url(#turtleLungGrad)"
                  stroke={hoveredId === "tur_lungs" ? "#ffffff" : "#f43f5e"}
                  strokeWidth={hoveredId === "tur_lungs" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_lungs" ? 0.35 : 0.88}
                />
                {/* Right Lung Spongy Alveoli Network */}
                <path d="M 550 205 Q 530 215 515 210 M 555 230 Q 535 240 512 235 M 548 250 Q 528 255 512 252" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
              </g>

              {/* ── 8. HEAD, ANAPSID SKULL & REPTILIAN BEAK (Đầu rùa, Hộp sọ & Mỏ sừng) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-40 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_skull");
                }}
                onMouseEnter={() => setHoveredId("tur_skull")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 1. Streamlined Muscular Neck (Cổ da bò sát to bè nối từ lõm mai) */}
                <path
                  d="M 474 142 C 472 120, 476 102, 480 92 L 520 92 C 524 102, 528 120, 526 142 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke="#047857"
                  strokeWidth="1"
                  opacity={hoveredId && hoveredId !== "tur_skull" ? 0.35 : 0.95}
                />
                {/* Neck skin fold lines */}
                <path
                  d="M 478 128 Q 500 134 522 128 M 479 112 Q 500 118 521 112"
                  stroke="#0f766e"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.6"
                />

                {/* 2. Aerodynamic Reptilian Head Contour (Đầu thuôn mượt đồng màu da xanh ngọc) */}
                <path
                  d="M 500 62 C 484 62, 474 76, 474 92 C 474 106, 485 114, 500 114 C 515 114, 526 106, 526 92 C 526 76, 516 62, 500 62 Z"
                  fill="url(#turtleFlipperGrad)"
                  stroke={hoveredId === "tur_skull" ? "#38bdf8" : "#0d9488"}
                  strokeWidth={hoveredId === "tur_skull" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "tur_skull" ? 0.35 : 1}
                />

                {/* 3. Anapsid Cranium Internal Bone Architecture (Khung xương sọ anapsid mờ bên trong) */}
                <path
                  d="M 500 68 C 488 68, 480 80, 480 92 C 480 102, 488 108, 500 108 C 512 108, 520 102, 520 92 C 520 80, 512 68, 500 68 Z"
                  fill={hoveredId === "tur_skull" ? "rgba(241, 245, 249, 0.4)" : "none"}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity={hoveredId === "tur_skull" ? 0.9 : 0.35}
                />

                {/* 4. Cranial Scutes (Hoa văn tấm vảy sừng hình học trên đỉnh đầu) */}
                {/* Frontal Scute */}
                <polygon points="500,72 506,78 504,88 496,88 494,78" fill="#047857" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.8" />
                {/* Parietal Scutes */}
                <polygon points="494,89 500,90 496,104 488,102" fill="#065f46" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.75" />
                <polygon points="506,89 500,90 504,104 512,102" fill="#065f46" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.75" />
                <polygon points="500,91 503,103 497,103" fill="#047857" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.8" />

                {/* 5. Natural Hooked Keratin Beak (Mỏ sừng nhọn khoằm tự nhiên) */}
                <path
                  d="M 500 58 C 493 62, 492 68, 494 72 C 497 70, 503 70, 506 72 C 508 68, 507 62, 500 58 Z"
                  fill="url(#turtleBeakGrad)"
                  stroke="#78350f"
                  strokeWidth="0.9"
                />
                {/* Beak shear cutting edge line */}
                <path d="M 494 70 Q 500 64 506 70" stroke="#451a03" strokeWidth="0.8" fill="none" />

                {/* 6. Realistic Lateral Marine Eyes (Mắt bò sát biển tinh tế hai bên góc đầu) */}
                {/* Left Eye */}
                <ellipse cx="481" cy="84" rx="4" ry="5" fill="#020617" stroke="#ca8a04" strokeWidth="1" />
                <circle cx="481" cy="83" r="2.2" fill="#eab308" />
                <circle cx="481" cy="83" r="1.2" fill="#020617" />
                <circle cx="480.5" cy="82" r="0.6" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse cx="519" cy="84" rx="4" ry="5" fill="#020617" stroke="#ca8a04" strokeWidth="1" />
                <circle cx="519" cy="83" r="2.2" fill="#eab308" />
                <circle cx="519" cy="83" r="1.2" fill="#020617" />
                <circle cx="518.5" cy="82" r="0.6" fill="#ffffff" />
              </g>

              {/* ── 9. LACHRYMAL SALT-SECRETING GLANDS (Tuyến muối siêu lọc gọn gàng sau hốc mắt) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-70 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_saltgland");
                }}
                onMouseEnter={() => setHoveredId("tur_saltgland")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Left Salt Gland (Nằm gọn bên trong sau hốc mắt trái) */}
                <ellipse
                  cx="486"
                  cy="92"
                  rx="4"
                  ry="6"
                  fill="url(#turtleSaltGrad)"
                  stroke={hoveredId === "tur_saltgland" ? "#ffffff" : "#c084fc"}
                  strokeWidth={hoveredId === "tur_saltgland" ? "2" : "0.8"}
                  opacity={hoveredId === "tur_saltgland" ? 1 : f > 0 ? 0.9 : 0.5}
                />
                {/* Right Salt Gland (Nằm gọn bên trong sau hốc mắt phải) */}
                <ellipse
                  cx="514"
                  cy="92"
                  rx="4"
                  ry="6"
                  fill="url(#turtleSaltGrad)"
                  stroke={hoveredId === "tur_saltgland" ? "#ffffff" : "#c084fc"}
                  strokeWidth={hoveredId === "tur_saltgland" ? "2" : "0.8"}
                  opacity={hoveredId === "tur_saltgland" ? 1 : f > 0 ? 0.9 : 0.5}
                />
                {/* Micro duct connector to eye */}
                <path d="M 485 89 L 483 86 M 515 89 L 517 86" stroke="#e9d5ff" strokeWidth="1" strokeDasharray="1,1" opacity={f > 0.1 || hoveredId === "tur_saltgland" ? 0.8 : 0.2} />
              </g>

              {/* ── 10. DORSAL CARAPACE (Mai rùa xương giáp & Tấm sừng mỹ miều) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-65 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("tur_carapace");
                }}
                onMouseEnter={() => setHoveredId("tur_carapace")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Outer Hydrodynamic Dome Contour */}
                <path
                  d="M 500 135 C 575 135, 605 200, 600 275 C 595 320, 550 355, 500 360 C 450 355, 405 320, 400 275 C 395 200, 425 135, 500 135 Z"
                  fill="url(#turtleCarapaceGrad)"
                  stroke={hoveredId === "tur_carapace" ? "#ffffff" : "#34d399"}
                  strokeWidth={hoveredId === "tur_carapace" ? "3" : "1.5"}
                  opacity={hoveredId && hoveredId !== "tur_carapace" ? 0.35 : 0.95}
                />

                {/* Marginal Perimeter Scutes (Vành sừng viền mai) */}
                <path
                  d="M 500 138 C 570 138, 598 200, 594 272 C 589 315, 546 348, 500 354 C 454 348, 411 315, 406 272 C 402 200, 430 138, 500 138 Z"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Vertebral Scutes (5 tấm vảy xương dọc sống lưng hình lục giác) */}
                {/* V1: Nuchal / First Vertebral */}
                <polygon points="500,140 520,155 515,180 485,180 480,155" fill="#059669" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.9" />
                {/* V2: Second Vertebral */}
                <polygon points="500,180 528,198 522,230 478,230 472,198" fill="#047857" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.9" />
                {/* V3: Third Vertebral (Central) */}
                <polygon points="500,230 532,250 525,285 475,285 468,250" fill="#059669" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.9" />
                {/* V4: Fourth Vertebral */}
                <polygon points="500,285 525,302 518,330 482,330 475,302" fill="#047857" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.9" />
                {/* V5: Pygal / Supracaudal */}
                <polygon points="500,330 512,342 500,356 488,342" fill="#065f46" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.9" />

                {/* Lateral Costal Scutes (4 cặp tấm vảy sườn hai bên) */}
                {/* Left Costals */}
                <polygon points="480,165 435,175 425,215 475,200" fill="#047857" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="475,202 422,218 418,260 470,250" fill="#065f46" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="470,252 418,262 425,305 476,288" fill="#047857" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="476,290 427,308 450,338 480,328" fill="#065f46" stroke="#34d399" strokeWidth="1" opacity="0.85" />

                {/* Right Costals */}
                <polygon points="520,165 565,175 575,215 525,200" fill="#047857" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="525,202 578,218 582,260 530,250" fill="#065f46" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="530,252 582,262 575,305 524,288" fill="#047857" stroke="#34d399" strokeWidth="1" opacity="0.85" />
                <polygon points="524,290 573,308 550,338 520,328" fill="#065f46" stroke="#34d399" strokeWidth="1" opacity="0.85" />

                {/* Radial Glow lines along shell ridge */}
                <path d="M 500 145 Q 500 250 500 355" stroke="#a7f3d0" strokeWidth="1.5" opacity="0.4" />
              </g>
            </>
          ) : isMammal ? (
            /* ── MARINE MAMMALS (PACIFIC BOTTLENOSE DOLPHIN) EXPLODED 3D MORPHOLOGY ── */
            <>
              {/* ── 1. THREE-CHAMBERED STOMACH & DIGESTIVE TRACT ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (45 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_digestive");
                }}
                onMouseEnter={() => setHoveredId("mam_digestive")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Forestomach (Tiền dạ dày nghiền cơ học) */}
                <ellipse cx="430" cy="245" rx="22" ry="15" fill="#ca8a04" opacity="0.9" />
                {/* Main Stomach (Dạ dày chính tiết acid) */}
                <ellipse cx="465" cy="250" rx="18" ry="13" fill="#eab308" opacity="0.9" />
                {/* Pyloric Stomach & Duodenum (Dạ dày môn vị) */}
                <path d="M 480 252 C 500 256, 515 248, 525 255" stroke="#fef08a" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Coiled Intestines */}
                <path d="M 525 255 C 545 262, 530 275, 555 270 C 575 268, 565 285, 595 275" stroke="#a16207" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
                {/* Outline selection */}
                <path
                  d="M 410 240 C 430 225, 490 235, 525 252 C 555 265, 595 270, 595 275"
                  stroke={hoveredId === "mam_digestive" ? "#ffffff" : "transparent"}
                  strokeWidth="2.5"
                  fill="none"
                />
              </g>

              {/* ── 2. FOUR-CHAMBERED HEART & RETE MIRABILE ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (24 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_heart");
                }}
                onMouseEnter={() => setHoveredId("mam_heart")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Aortic Arch & Carotid Arteries */}
                <path d="M 335 235 C 330 215, 305 210, 275 220" stroke="#ef4444" strokeWidth="4" fill="none" opacity="0.85" />
                <path d="M 335 235 C 350 218, 410 220, 520 225" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.8" />
                {/* Thoracic Rete Mirabile Vascular Mesh */}
                <path d="M 320 222 Q 350 215 380 220 M 325 226 Q 355 219 385 224" stroke="#fca5a5" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.75" />
                {/* Muscular Ventricles (Tâm thất trái & phải) */}
                <path
                  d="M 320 238 C 315 258, 335 272, 342 272 C 352 272, 362 255, 355 238 Z"
                  fill="url(#dolphinHeartGrad)"
                  stroke={hoveredId === "mam_heart" ? "#ffffff" : "#ef4444"}
                  strokeWidth={hoveredId === "mam_heart" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "mam_heart" ? 0.35 : 1}
                />
                {/* Left & Right Atria */}
                <circle cx="328" cy="235" r="7.5" fill="#b91c1c" />
                <circle cx="344" cy="235" r="7" fill="#b91c1c" />
              </g>

              {/* ── 3. MAMMALIAN AXIAL SKELETON (Cột sống 65 đốt, xương sườn đàn hồi & hộp sọ) ── */}
              <g
                filter="url(#cartilageShadow)"
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_skeleton");
                }}
                onMouseEnter={() => setHoveredId("mam_skeleton")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Long Undulating Spinal Column */}
                <path
                  d="M 255 208 C 320 210, 420 212, 540 220 C 640 228, 730 236, 815 238"
                  stroke={hoveredId === "mam_skeleton" ? "#38bdf8" : "#cbd5e1"}
                  strokeWidth={hoveredId === "mam_skeleton" ? "4.5" : "3"}
                  fill="none"
                  opacity={hoveredId && hoveredId !== "mam_skeleton" ? 0.35 : 0.9}
                />
                {/* Vertebral Spines / Centra Nodes */}
                {[270, 305, 340, 375, 410, 445, 480, 515, 550, 585, 620, 655, 690, 725, 760, 795].map((x) => (
                  <circle key={x} cx={x} cy={206 + (x - 270) * 0.06} r="2.8" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
                ))}
                {/* Neural Dorsal Spines along back */}
                {[340, 375, 410, 445, 480, 515, 550].map((x) => (
                  <line key={x} x1={x} y1={212 + (x - 340) * 0.05} x2={x - 4} y2={198 + (x - 340) * 0.05} stroke="#94a3b8" strokeWidth="1.2" />
                ))}
                {/* Flexible Thoracic Ribs (12-14 cặp xương sườn uốn cong lồng ngực) */}
                {[315, 335, 355, 375, 395, 415, 435, 455].map((x, i) => (
                  <path
                    key={x}
                    d={'M ' + x + ' ' + (212 + i * 1.5) + ' C ' + (x + 8) + ' ' + (235 + i * 2) + ', ' + (x - 5) + ' 265, ' + (x - 18) + ' ' + (268 - i * 1.5)}
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.85"
                  />
                ))}
                {/* Cranium Skull Bone & Extended Rostrum Beak */}
                <path
                  d="M 148 236 L 245 228 C 265 210, 265 195, 245 190 C 220 188, 205 210, 152 232 Z"
                  fill="#f1f5f9"
                  stroke={hoveredId === "mam_skeleton" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth="1.4"
                  opacity={hoveredId && hoveredId !== "mam_skeleton" ? 0.35 : 0.95}
                />
                {/* Homodont Conical Teeth Rows */}
                {[155, 168, 180, 192, 204, 216, 228].map((tx) => (
                  <circle key={tx} cx={tx} cy={236} r="1" fill="#ffffff" />
                ))}
                {/* Pelvic Bone Vestige (Xương chậu thoái hóa treo tự do) */}
                <line x1="610" y1="262" x2="628" y2="260" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
              </g>

              {/* ── 4. FORELIMB PECTORAL FLIPPERS (Vây ngực 5 ngón tổ tiên) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(' + (-15 * f) + ', ' + (38 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_flippers");
                }}
                onMouseEnter={() => setHoveredId("mam_flippers")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Flipper Skin Outline */}
                <path
                  d="M 320 240 C 330 260, 355 305, 385 325 C 388 322, 382 305, 372 285 C 362 265, 350 250, 340 242 Z"
                  fill="#0369a1"
                  stroke={hoveredId === "mam_flippers" ? "#ffffff" : "#0284c7"}
                  strokeWidth={hoveredId === "mam_flippers" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "mam_flippers" ? 0.35 : 0.95}
                />
                {/* Pentadactyl 5-Finger Bone Structure (Xương 5 ngón chim/thú ngầm) */}
                <path
                  d="M 330 248 L 372 312 M 333 252 L 368 305 M 335 255 L 362 295 M 336 258 L 356 285 M 337 260 L 350 275"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                  opacity="0.65"
                />
              </g>

              {/* ── 5. HIGH-EFFICIENCY LUNGS & BLOWHOLE AIRWAY ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-28 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_lungs");
                }}
                onMouseEnter={() => setHoveredId("mam_lungs")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Airway Trachea from Blowhole */}
                <path d="M 252 178 C 262 195, 280 205, 310 215" stroke="#fda4af" strokeWidth="4.5" fill="none" opacity="0.9" />
                {/* Expansive Marine Mammal Lung (Phổi chịu áp lực cao) */}
                <path
                  d="M 310 205 C 370 195, 460 205, 480 225 C 470 242, 380 248, 315 235 Z"
                  fill="url(#dolphinLungGrad)"
                  stroke={hoveredId === "mam_lungs" ? "#ffffff" : "#f43f5e"}
                  strokeWidth={hoveredId === "mam_lungs" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "mam_lungs" ? 0.35 : 0.92}
                />
                {/* Bronchial Tree & Alveolar Network */}
                <path d="M 330 216 Q 380 212 450 220 M 345 224 Q 400 222 460 228 M 360 230 Q 410 232 455 236" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
              </g>

              {/* ── 6. ACOUSTIC MELON & SONAR ECHOLOCATION COMPLEX ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(' + (-35 * f) + ', ' + (-35 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_melon");
                }}
                onMouseEnter={() => setHoveredId("mam_melon")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Lipid Melon Lens (Khối mỡ dưa trán hội tụ sóng) */}
                <path
                  d="M 160 230 C 160 212, 185 188, 225 185 C 242 188, 248 205, 230 225 C 200 232, 175 234, 160 230 Z"
                  fill="url(#dolphinMelonGrad)"
                  stroke={hoveredId === "mam_melon" ? "#ffffff" : "#c084fc"}
                  strokeWidth={hoveredId === "mam_melon" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "mam_melon" ? 0.35 : 0.95}
                />
                {/* Ultrasonic Sonar Projection Waves (Chùm sóng siêu âm phát xạ) */}
                <path d="M 145 205 C 135 200, 135 220, 145 215" stroke="#e9d5ff" strokeWidth="1.5" fill="none" opacity={f > 0.1 || hoveredId === "mam_melon" ? 0.9 : 0.3} />
                <path d="M 130 198 C 115 190, 115 228, 130 220" stroke="#e9d5ff" strokeWidth="1.8" fill="none" opacity={f > 0.1 || hoveredId === "mam_melon" ? 0.7 : 0.15} />
                <path d="M 115 190 C 95 180, 95 236, 115 226" stroke="#e9d5ff" strokeWidth="2" fill="none" opacity={f > 0.1 || hoveredId === "mam_melon" ? 0.5 : 0.05} />
                {/* Blowhole Valve (Lỗ thở đỉnh đầu) */}
                <ellipse cx="252" cy="174" rx="4.5" ry="2" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
              </g>

              {/* ── 7. HORIZONTAL CAUDAL FLUKES (Vây đuôi ngang đập sóng) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(' + (45 * f) + ', 0)'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_flukes");
                }}
                onMouseEnter={() => setHoveredId("mam_flukes")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Upper and Lower Fluke Blades with Median Notch */}
                <path
                  d="M 805 238 C 825 225, 860 175, 875 178 C 875 195, 860 225, 848 238 C 860 250, 875 280, 875 298 C 860 300, 825 250, 805 238 Z"
                  fill="#0369a1"
                  stroke={hoveredId === "mam_flukes" ? "#ffffff" : "#10b981"}
                  strokeWidth={hoveredId === "mam_flukes" ? "2.5" : "1.2"}
                  opacity={hoveredId && hoveredId !== "mam_flukes" ? 0.35 : 0.95}
                />
                {/* Dense Collagenous Fibers Mesh */}
                <path d="M 815 238 L 865 190 M 825 238 L 862 210 M 815 238 L 865 285 M 825 238 L 862 265" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                {/* Median Notch (Khe xẻ trung tâm đuôi thú biển) */}
                <circle cx="848" cy="238" r="2.5" fill="#071324" />
              </g>

              {/* ── 8. HYDRODYNAMIC EPIDERMIS & BLUBBER LAYER (Lớp da ngoài & Mỡ cách nhiệt) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={'translate(0, ' + (-65 * f) + ')'}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("mam_blubber");
                }}
                onMouseEnter={() => setHoveredId("mam_blubber")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Dorsal Body Silhouette (Lưng cá heo với vây lưng falcate) */}
                <path
                  d="M 142 238 C 165 210, 205 185, 252 174 C 330 160, 435 155, 515 135 C 522 108, 532 98, 538 98 C 536 112, 530 135, 542 142 C 640 165, 730 215, 810 238 C 730 255, 630 288, 515 292 C 405 295, 295 275, 220 258 C 175 250, 150 242, 142 238 Z"
                  fill="url(#dolphinSkinDorsum)"
                  stroke={hoveredId === "mam_blubber" ? "#ffffff" : "#38bdf8"}
                  strokeWidth={hoveredId === "mam_blubber" ? "2.5" : "1.4"}
                  opacity={hoveredId && hoveredId !== "mam_blubber" ? 0.35 : 0.92}
                />
                {/* Ventral Countershading (Bụng trắng sáng thủy động) */}
                <path
                  d="M 175 245 C 240 255, 330 270, 440 272 C 550 275, 660 255, 760 240 C 650 278, 540 288, 440 285 C 330 282, 230 265, 175 245 Z"
                  fill="url(#dolphinSkinVenter)"
                  opacity="0.85"
                />
                {/* Marine Eye */}
                <ellipse cx="238" cy="225" rx="5" ry="4" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="237.5" cy="224" r="1.5" fill="#ffffff" />
                {/* Mouth Smile Crease (Đường cười đặc trưng của cá heo) */}
                <path d="M 142 238 C 180 240, 215 236, 230 234" stroke="#024e7a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            </>
          ) : isOsteichthyes ? (
            /* ── OSTEICHTHYES (BONY FISH) EXPLODED 3D MORPHOLOGY ── */
            <>
              {/* ── 2. CENTRAL OSSIFIED SKELETON CHASSIS (Fixed Skull, Ribs & Spine) ── */}
              <g
                filter="url(#cartilageShadow)"
                className="cursor-pointer transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_skeleton");
                }}
                onMouseEnter={() => setHoveredId("ost_skeleton")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Neurocranium: Bony skull */}
                <path
                  d="M 170 220 C 195 180, 250 168, 305 172 C 325 178, 335 190, 335 218 C 335 235, 300 240, 250 240 C 210 240, 180 230, 170 220 Z"
                  fill="url(#cartilagePearl)"
                  stroke={hoveredId === "ost_skeleton" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={hoveredId === "ost_skeleton" ? "2.5" : "1.2"}
                />
                {/* Bony Eye Orbit */}
                <ellipse
                  cx="240"
                  cy="195"
                  rx="15"
                  ry="13"
                  fill="#071326"
                  stroke="#64748b"
                  strokeWidth="1.2"
                />
                {/* Upper jaw premaxilla */}
                <path
                  d="M 172 215 C 190 216, 218 220, 240 228 L 236 235 C 210 228, 185 224, 168 220 Z"
                  fill="#f1f5f9"
                  stroke="#64748b"
                  strokeWidth="1"
                />
                {/* Lower jaw dentary */}
                <path
                  d="M 175 225 C 195 228, 220 236, 238 248 L 230 254 C 205 242, 185 235, 170 230 Z"
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="1"
                />
                {/* Teeth */}
                <g fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5">
                  <polygon points="172,217 176,222 180,217" />
                  <polygon points="182,218 186,223 190,218" />
                  <polygon points="192,219 196,224 200,219" />
                  <polygon points="202,220 206,225 210,220" />
                  <polygon points="175,227 179,222 183,227" />
                  <polygon points="185,228 189,223 193,228" />
                  <polygon points="195,229 199,224 203,229" />
                </g>
                {/* Segmented ossified vertebral column */}
                <g stroke="#cbd5e1" strokeWidth="1.2">
                  <path
                    d="M 335 208 C 490 205, 680 212, 840 222"
                    stroke="url(#cartilagePearl)"
                    strokeWidth="6"
                    strokeDasharray="10 3"
                    fill="none"
                  />
                  {/* Neural spines */}
                  <path
                    d="M 345 205 L 348 182 M 375 205 L 380 180 M 405 205 L 412 178 M 435 206 L 444 176 M 465 207 L 476 175 M 495 208 L 508 175 M 525 209 L 540 176 M 555 210 L 572 178 M 585 211 L 604 180 M 615 212 L 636 182 M 645 213 L 668 185 M 675 214 L 700 188 M 705 215 L 732 192 M 735 217 L 764 196 M 765 218 L 794 202 M 795 220 L 824 208"
                    stroke="#cbd5e1"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Pleural Ribs */}
                  <path
                    d="M 360 210 C 362 238, 370 258, 375 270 M 390 210 C 393 242, 404 262, 412 274 M 420 211 C 425 244, 438 265, 448 276 M 450 212 C 456 246, 472 266, 484 276 M 480 213 C 488 246, 506 266, 520 275 M 510 214 C 518 245, 538 264, 554 272 M 540 215 C 548 244, 568 262, 586 268 M 570 216 C 578 242, 598 258, 616 264 M 600 217 C 608 238, 626 252, 644 258"
                    stroke="#94a3b8"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Hemal spines */}
                  <path
                    d="M 640 218 L 655 245 M 670 219 L 688 246 M 700 220 L 720 246 M 730 221 L 752 245 M 760 222 L 784 242 M 790 223 L 814 238 M 820 224 L 836 234"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Hypural bone plates */}
                  <polygon
                    points="840,222 865,206 875,222 865,238"
                    fill="url(#cartilagePearl)"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                  />
                  {/* Spinal cord */}
                  <path
                    d="M 335 204 C 490 201, 680 208, 840 218"
                    stroke="#fde047"
                    strokeWidth="2.2"
                    fill="none"
                    opacity="0.9"
                  />
                </g>
              </g>

              {/* ── 3. BÓNG HƠI THỦY TĨNH (Hydrostatic Swim Bladder) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-65 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_swim_bladder");
                }}
                onMouseEnter={() => setHoveredId("ost_swim_bladder")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 380 196 C 420 180, 520 180, 610 192 C 618 206, 560 218, 490 218 C 425 218, 375 210, 380 196 Z"
                  fill="url(#swimBladderPearl)"
                  stroke={
                    hoveredId === "ost_swim_bladder" ? "#ffffff" : "#38bdf8"
                  }
                  strokeWidth={hoveredId === "ost_swim_bladder" ? "2.5" : "1.4"}
                />
                <ellipse
                  cx="580"
                  cy="198"
                  rx="35"
                  ry="14"
                  fill="url(#swimBladderPearl)"
                  stroke="#2563eb"
                  strokeWidth="1"
                  opacity="0.7"
                />
                {/* Rete Mirabile mao mạch trao đổi khí */}
                <path
                  d="M 395 200 Q 420 208 445 204 M 400 205 Q 425 213 450 208"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                {/* Tuyến khí */}
                <ellipse
                  cx="422"
                  cy="207"
                  rx="10"
                  ry="5"
                  fill="#f43f5e"
                  stroke="#be123c"
                  strokeWidth="1"
                />
                {/* Ánh sáng phát quang */}
                <ellipse
                  cx="480"
                  cy="198"
                  rx="65"
                  ry="8"
                  fill="#ffffff"
                  opacity="0.35"
                />
              </g>

              {/* ── 4. NẮP MANG XƯƠNG & CUNG MANG ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-65 * f}, ${30 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_gills_operculum");
                }}
                onMouseEnter={() => setHoveredId("ost_gills_operculum")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {[275, 290, 305, 320].map((gx, i) => (
                  <g key={i}>
                    <path
                      d={`M ${gx} 190 C ${gx - 8} 210, ${gx - 6} 230, ${gx} 244`}
                      fill="none"
                      stroke={
                        hoveredId === "ost_gills_operculum"
                          ? "#ffffff"
                          : "#cbd5e1"
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${gx} 192 L ${gx + 7} 196 M ${gx - 3} 201 L ${gx + 6} 205 M ${gx - 5} 210 L ${gx + 5} 214 M ${gx - 5} 219 L ${gx + 5} 223 M ${gx - 3} 228 L ${gx + 6} 232 M ${gx} 238 L ${gx + 7} 240`}
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
                {/* Operculum plate */}
                <path
                  d="M 270 182 C 305 180, 345 195, 348 230 C 350 252, 320 262, 290 256 C 275 250, 265 220, 270 182 Z"
                  fill="url(#operculumSilver)"
                  stroke={
                    hoveredId === "ost_gills_operculum" ? "#38bdf8" : "#64748b"
                  }
                  strokeWidth={
                    hoveredId === "ost_gills_operculum" ? "2.5" : "1.4"
                  }
                />
                <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
                  <path d="M 285 190 Q 315 210 338 230" />
                  <path d="M 282 205 Q 310 225 330 245" />
                  <path d="M 280 220 Q 300 238 318 252" />
                </g>
              </g>

              {/* ── 5. GAN VÀ TÚI MẬT CÁ XƯƠNG ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-20 * f}, ${95 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_liver");
                }}
                onMouseEnter={() => setHoveredId("ost_liver")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 360 225 C 410 218, 470 224, 490 245 C 475 272, 420 275, 375 265 C 350 258, 345 240, 360 225 Z"
                  fill="url(#liverAmber)"
                  stroke={hoveredId === "ost_liver" ? "#ffffff" : "#b45309"}
                  strokeWidth={hoveredId === "ost_liver" ? "2.5" : "1.2"}
                />
                <ellipse
                  cx="430"
                  cy="252"
                  rx="12"
                  ry="7"
                  fill="#10b981"
                  stroke="#065f46"
                  strokeWidth="1.2"
                />
                <path
                  d="M 380 238 Q 420 242 460 246 M 400 242 Q 425 255 450 260"
                  fill="none"
                  stroke="rgba(127,29,29,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 6. DẠ DÀY & MANH TRÀNG MÔN VỊ ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${45 * f}, ${90 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_stomach");
                }}
                onMouseEnter={() => setHoveredId("ost_stomach")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 450 215 C 485 212, 530 220, 545 242 C 540 268, 500 272, 470 258 C 445 248, 438 230, 450 215 Z"
                  fill="url(#stomachCream)"
                  stroke={hoveredId === "ost_stomach" ? "#ffffff" : "#ca8a04"}
                  strokeWidth={hoveredId === "ost_stomach" ? "2.5" : "1.2"}
                />
                <g
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                >
                  <path d="M 535 245 Q 555 240 565 246" />
                  <path d="M 538 248 Q 560 248 570 256" />
                  <path d="M 535 252 Q 558 258 568 266" />
                  <path d="M 530 255 Q 548 266 558 274" />
                  <path d="M 525 258 Q 540 272 548 278" />
                </g>
                <path
                  d="M 530 255 C 560 258, 595 252, 608 265 C 612 276, 580 282, 550 278 L 545 288"
                  fill="none"
                  stroke="#ca8a04"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 7. TIM 2 NGĂN & HÀNH ĐỘNG MẠCH ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-85 * f}, ${75 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_heart");
                }}
                onMouseEnter={() => setHoveredId("ost_heart")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ellipse
                  cx="315"
                  cy="255"
                  rx="12"
                  ry="10"
                  fill="#7c3aed"
                  stroke="#581c87"
                  strokeWidth="1.2"
                />
                <path
                  d="M 298 262 C 298 252, 318 252, 324 262 C 328 274, 314 282, 308 284 C 300 282, 294 272, 298 262 Z"
                  fill="url(#heartRubyVentricle)"
                  stroke={hoveredId === "ost_heart" ? "#ffffff" : "#be123c"}
                  strokeWidth={hoveredId === "ost_heart" ? "2.5" : "1.2"}
                />
                <path
                  d="M 295 258 L 285 240 L 297 236 L 303 255 Z"
                  fill="#fecdd3"
                  stroke="#e11d48"
                  strokeWidth="1.2"
                />
                <path
                  d="M 289 238 L 278 226"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 8. NÃO BỘ & THÙY THỊ GIÁC ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-45 * f}, ${-85 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_brain");
                }}
                onMouseEnter={() => setHoveredId("ost_brain")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 195 182 L 220 180"
                  stroke="#fef08a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="192"
                  cy="182"
                  r="4"
                  fill="#facc15"
                  stroke="#ca8a04"
                />
                <ellipse
                  cx="225"
                  cy="178"
                  rx="8"
                  ry="6"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                <circle
                  cx="242"
                  cy="177"
                  r="9"
                  fill="url(#brainGold)"
                  stroke={hoveredId === "ost_brain" ? "#ffffff" : "#ca8a04"}
                  strokeWidth={hoveredId === "ost_brain" ? "1.8" : "1.2"}
                />
                <circle
                  cx="256"
                  cy="177"
                  r="8"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="270"
                  cy="175"
                  rx="7"
                  ry="5"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                />
                <path
                  d="M 276 178 L 295 182"
                  stroke="#fde047"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 9. VÂY LƯNG GAI CỨNG & MỀM ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-100 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_dorsal_fin");
                }}
                onMouseEnter={() => setHoveredId("ost_dorsal_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 410 142 L 418 68 Q 450 55 490 60 Q 540 68 590 92 Q 620 115 635 145 Z"
                  fill="url(#finRayOsteichthyes)"
                  fillOpacity="0.4"
                  stroke={
                    hoveredId === "ost_dorsal_fin" ? "#38bdf8" : "#0284c7"
                  }
                  strokeWidth={hoveredId === "ost_dorsal_fin" ? "2.5" : "1.2"}
                />
                <g stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round">
                  <line x1="410" y1="142" x2="418" y2="68" />
                  <line x1="432" y1="140" x2="442" y2="60" />
                  <line x1="455" y1="138" x2="466" y2="58" />
                  <line x1="480" y1="139" x2="492" y2="62" />
                  <line x1="505" y1="141" x2="518" y2="70" />
                </g>
                <g
                  stroke="#38bdf8"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.9"
                >
                  <path d="M 530 142 Q 542 110 550 80" />
                  <path d="M 552 142 Q 564 115 572 90" />
                  <path d="M 574 143 Q 588 120 594 102" />
                  <path d="M 596 144 Q 608 128 614 116" />
                  <path d="M 618 145 Q 628 135 632 130" />
                </g>
              </g>

              {/* ── 10. CẶP VÂY NGỰC & VÂY BỤNG ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-60 * f}, ${95 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_pectoral_pelvic_fin");
                }}
                onMouseEnter={() => setHoveredId("ost_pectoral_pelvic_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 345 240 C 365 270, 400 320, 430 345 C 442 340, 452 325, 448 312 C 430 285, 395 250, 375 235 Z"
                  fill="url(#finRayOsteichthyes)"
                  fillOpacity="0.45"
                  stroke={
                    hoveredId === "ost_pectoral_pelvic_fin"
                      ? "#38bdf8"
                      : "#0284c7"
                  }
                  strokeWidth={
                    hoveredId === "ost_pectoral_pelvic_fin" ? "2.5" : "1.2"
                  }
                />
                <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none">
                  <path d="M 358 245 L 420 335" />
                  <path d="M 368 245 L 432 322" />
                  <path d="M 378 244 L 440 305" />
                </g>
                <path
                  d="M 425 275 C 438 295, 455 320, 470 330 C 476 325, 478 315, 472 305 C 460 290, 445 278, 435 272 Z"
                  fill="url(#finRayOsteichthyes)"
                  fillOpacity="0.4"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
              </g>

              {/* ── 11. VÂY ĐUÔI ĐỐI XỨNG HOMOCERCAL ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${115 * f}, 0)`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_caudal_fin");
                }}
                onMouseEnter={() => setHoveredId("ost_caudal_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 845 220 C 875 190, 915 155, 960 125 C 955 160, 930 200, 912 220 C 930 240, 955 280, 960 315 C 915 285, 875 250, 845 225 Z"
                  fill="url(#finRayOsteichthyes)"
                  stroke={
                    hoveredId === "ost_caudal_fin" ? "#38bdf8" : "#0284c7"
                  }
                  strokeWidth={hoveredId === "ost_caudal_fin" ? "2.5" : "1.4"}
                  strokeLinejoin="round"
                />
                <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none">
                  <path d="M 855 220 L 950 140" />
                  <path d="M 855 220 L 945 165" />
                  <path d="M 855 221 L 935 190" />
                  <path d="M 855 222 L 912 220" />
                  <path d="M 855 223 L 935 250" />
                  <path d="M 855 224 L 945 275" />
                  <path d="M 855 225 L 950 300" />
                </g>
              </g>

              {/* ── 12. THÂN CÁ XƯƠNG PHÁT QUANG VÀ ĐƯỜNG BÊN ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-38 * f})`}
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("ost_body");
                }}
                onMouseEnter={() => setHoveredId("ost_body")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 160 225 C 200 175, 300 138, 480 135 C 660 132, 770 170, 840 220 C 770 270, 660 295, 480 292 C 300 288, 200 265, 160 225 Z"
                  fill="url(#crystalBodyOsteichthyes)"
                  stroke="url(#biometricOutline)"
                  strokeWidth={hoveredId === "ost_body" ? "2.5" : "1.8"}
                />
                <path
                  d="M 335 185 C 345 220, 335 255, 320 265"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  fill="none"
                  opacity={Math.max(0.4, 0.9 - f * 0.4)}
                />
                <path
                  d="M 340 215 C 500 210, 680 218, 830 222"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity={Math.max(0.3, 0.85 - f * 0.4)}
                />
                <g stroke="rgba(56,189,248,0.2)" strokeWidth="0.8" fill="none">
                  <path d="M 400 160 Q 408 175 400 190" />
                  <path d="M 425 158 Q 433 175 425 192" />
                  <path d="M 450 156 Q 458 175 450 194" />
                  <path d="M 475 155 Q 483 175 475 195" />
                  <path d="M 500 155 Q 508 175 500 195" />
                  <path d="M 525 156 Q 533 175 525 194" />
                  <path d="M 550 158 Q 558 175 550 192" />
                  <path d="M 575 160 Q 583 175 575 190" />
                  <path d="M 600 165 Q 608 178 600 190" />
                </g>
              </g>
            </>
          ) : (
            /* ── CHONDRICHTHYES (SHARK) EXPLODED 3D MORPHOLOGY ── */
            <>
              {/* ── 2. CENTRAL CARTILAGINOUS SKELETON CHASSIS (Fixed Backbone, Skull & Jaws) ── */}
              <g
                filter="url(#cartilageShadow)"
                className="cursor-pointer transition-all duration-300 group"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_chassis");
                }}
                onMouseEnter={() => setHoveredId("part_chassis")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Chondrocranium: Sọ sụn cá mập điêu khắc tự nhiên */}
                <path
                  d="M 125 210 C 150 175, 205 160, 260 165 C 275 168, 285 180, 285 215 C 285 230, 250 235, 200 235 C 160 235, 135 225, 125 210 Z"
                  fill="url(#cartilagePearl)"
                  stroke={hoveredId === "part_chassis" ? "#38bdf8" : "#94a3b8"}
                  strokeWidth={hoveredId === "part_chassis" ? "2.5" : "1.2"}
                />
                {/* Hốc mắt sọ sụn */}
                <ellipse
                  cx="195"
                  cy="180"
                  rx="14"
                  ry="11"
                  fill="#0b1728"
                  stroke="#475569"
                  strokeWidth="1.2"
                />

                {/* Sụn hàm trên Palatoquadrate */}
                <path
                  d="M 160 220 C 190 222, 230 226, 260 238 L 255 248 C 220 238, 180 232, 150 226 Z"
                  fill="#f1f5f9"
                  stroke="#64748b"
                  strokeWidth="1"
                />
                {/* Sụn hàm dưới Meckel's */}
                <path
                  d="M 165 232 C 195 236, 230 245, 255 258 L 245 264 C 215 252, 185 244, 155 238 Z"
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Răng cưa tam giác sắc nhọn */}
                <g fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5">
                  <polygon points="168,223 173,230 178,224" />
                  <polygon points="180,224 185,232 190,225" />
                  <polygon points="192,225 197,233 202,226" />
                  <polygon points="204,227 209,235 214,228" />
                  <polygon points="216,229 221,237 226,230" />
                  <polygon points="228,231 233,239 238,232" />
                  {/* Hàng dưới */}
                  <polygon points="170,233 175,226 180,234" />
                  <polygon points="182,235 187,227 192,236" />
                  <polygon points="194,237 199,228 204,238" />
                  <polygon points="206,239 211,230 216,240" />
                </g>

                {/* Trục cột sống sụn phân đoạn */}
                <g stroke="#cbd5e1" strokeWidth="1.2">
                  <path
                    d="M 285 195 C 450 190, 680 205, 880 220"
                    stroke="url(#cartilagePearl)"
                    strokeWidth="7"
                    strokeDasharray="14 4"
                    fill="none"
                  />
                  {/* Gai đốt sống */}
                  <path
                    d="M 290 192 L 290 178 M 320 191 L 320 176 M 350 190 L 350 174 M 380 189 L 380 172 M 410 188 L 410 170 M 440 188 L 440 168 M 470 188 L 470 168 M 500 189 L 500 170 M 530 190 L 530 172 M 560 192 L 560 174 M 590 195 L 590 178 M 620 198 L 620 182 M 650 202 L 650 186 M 680 206 L 680 192 M 710 210 L 710 196 M 740 214 L 740 200 M 770 216 L 770 204 M 800 218 L 800 207 M 830 219 L 830 210 M 860 220 L 860 212"
                    stroke="#cbd5e1"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  {/* Dải tủy sống vàng óng ánh */}
                  <path
                    d="M 285 186 C 450 181, 680 196, 880 216"
                    stroke="#fde047"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.9"
                  />
                </g>
              </g>

              {/* ── 3. LÁ GAN DẦU SQUALENE KHỔNG LỒ (Explodes Down-Forward) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-25 * f}, ${110 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_liver");
                }}
                onMouseEnter={() => setHoveredId("part_liver")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thùy gan lớn 1 */}
                <path
                  d="M 360 205 C 440 195, 540 205, 640 225 C 620 260, 520 265, 430 255 C 380 250, 350 230, 360 205 Z"
                  fill="url(#liverAmber)"
                  stroke={hoveredId === "part_liver" ? "#ffffff" : "#b45309"}
                  strokeWidth={hoveredId === "part_liver" ? "2.5" : "1.2"}
                />
                {/* Thùy gan phụ 2 */}
                <path
                  d="M 375 220 C 450 215, 530 222, 600 240 C 580 268, 500 270, 420 262 C 385 258, 365 242, 375 220 Z"
                  fill="url(#liverAmber)"
                  fillOpacity="0.9"
                  stroke="#92400e"
                  strokeWidth="1"
                />
                {/* Túi mật ngọc bích */}
                <ellipse
                  cx="445"
                  cy="235"
                  rx="14"
                  ry="7"
                  fill="#10b981"
                  stroke="#065f46"
                  strokeWidth="1.2"
                />
                {/* Mạch máu gan */}
                <path
                  d="M 390 220 Q 430 225 480 228 M 480 228 Q 520 230 570 238 M 450 227 Q 470 245 490 252 M 520 232 Q 540 248 560 255"
                  fill="none"
                  stroke="rgba(127,29,29,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 4. DẠ DÀY & RUỘT VAN XOẮN ỐC (Explodes Down-Rear) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${75 * f}, ${95 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_spiral_valve");
                }}
                onMouseEnter={() => setHoveredId("part_spiral_valve")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Dạ dày chữ J */}
                <path
                  d="M 460 215 C 500 210, 560 215, 580 240 C 570 270, 520 275, 480 260 C 450 250, 440 230, 460 215 Z"
                  fill="url(#stomachCream)"
                  stroke={
                    hoveredId === "part_spiral_valve" ? "#ffffff" : "#ca8a04"
                  }
                  strokeWidth={
                    hoveredId === "part_spiral_valve" ? "2.5" : "1.2"
                  }
                />
                {/* Nếp gấp niêm mạc */}
                <path
                  d="M 475 228 Q 515 228 555 240 M 470 240 Q 510 242 545 255"
                  fill="none"
                  stroke="rgba(161,98,7,0.5)"
                  strokeWidth="1.5"
                />

                {/* Van xoắn ruột ốc Archimedes */}
                <ellipse
                  cx="640"
                  cy="238"
                  rx="46"
                  ry="22"
                  fill="url(#spiralValveEmerald)"
                  stroke={
                    hoveredId === "part_spiral_valve" ? "#ffffff" : "#059669"
                  }
                  strokeWidth={
                    hoveredId === "part_spiral_valve" ? "2.5" : "1.2"
                  }
                />
                {/* Cánh xoắn Archimedes */}
                <g
                  stroke="#ecfdf5"
                  strokeWidth="1.6"
                  fill="none"
                  opacity="0.95"
                >
                  <path d="M 605 238 Q 622 222 640 238 Q 658 254 675 238" />
                  <path d="M 615 238 Q 632 224 648 238 Q 664 252 680 238" />
                  <path d="M 625 238 Q 640 226 655 238" />
                </g>
                {/* Tuyến trực tràng */}
                <path
                  d="M 685 242 C 700 240, 715 245, 715 252 C 715 258, 700 255, 685 248 Z"
                  fill="#e11d48"
                  stroke="#9f1239"
                  strokeWidth="1"
                />
              </g>

              {/* ── 5. TIM 2 NGĂN & HÀNH ĐỘNG MẠCH (Explodes Down-Left) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-95 * f}, ${65 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_heart");
                }}
                onMouseEnter={() => setHoveredId("part_heart")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Tâm nhĩ máu tĩnh mạch */}
                <ellipse
                  cx="295"
                  cy="235"
                  rx="14"
                  ry="11"
                  fill="#7c3aed"
                  stroke="#581c87"
                  strokeWidth="1.2"
                />

                {/* Tâm thất dày khỏe */}
                <path
                  d="M 275 245 C 275 235, 295 235, 305 245 C 310 260, 295 270, 285 272 C 275 270, 268 258, 275 245 Z"
                  fill="url(#heartRubyVentricle)"
                  stroke={hoveredId === "part_heart" ? "#ffffff" : "#be123c"}
                  strokeWidth={hoveredId === "part_heart" ? "2.5" : "1.2"}
                />
                {/* Hành động mạch */}
                <path
                  d="M 278 238 L 270 215 L 282 212 L 286 235 Z"
                  fill="#fecdd3"
                  stroke="#e11d48"
                  strokeWidth="1.2"
                />
                {/* Các vòng van bán nguyệt */}
                <line
                  x1="272"
                  y1="230"
                  x2="284"
                  y2="228"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <line
                  x1="271"
                  y1="223"
                  x2="283"
                  y2="221"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <line
                  x1="270"
                  y1="216"
                  x2="282"
                  y2="214"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>

              {/* ── 6. 5 CUNG MANG SỤN & PHIẾN MANG ĐỎ (Explodes Down-Left) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-55 * f}, ${30 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_gills");
                }}
                onMouseEnter={() => setHoveredId("part_gills")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {[275, 290, 305, 320, 335].map((gx, i) => (
                  <g key={i}>
                    {/* Cung sụn nâng đỡ */}
                    <path
                      d={`M ${gx} 190 C ${gx - 10} 210, ${gx - 8} 235, ${gx} 248`}
                      fill="none"
                      stroke={
                        hoveredId === "part_gills" ? "#ffffff" : "#cbd5e1"
                      }
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    {/* Phiến mang đỏ tươi trao đổi khí */}
                    <path
                      d={`M ${gx} 192 L ${gx + 8} 196 M ${gx - 4} 202 L ${gx + 6} 206 M ${gx - 6} 212 L ${gx + 5} 216 M ${gx - 6} 222 L ${gx + 5} 226 M ${gx - 4} 232 L ${gx + 6} 236 M ${gx} 242 L ${gx + 8} 244`}
                      stroke="#f43f5e"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </g>

              {/* ── 7. BỘ NÃO & DÂY THẦN KINH KHỨU GIÁC (Explodes Up-Left) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-55 * f}, ${-90 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_brain");
                }}
                onMouseEnter={() => setHoveredId("part_brain")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Dây thần kinh khứu giác */}
                <path
                  d="M 140 185 C 160 182, 190 178, 215 178"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Hoa khứu giác */}
                <ellipse
                  cx="138"
                  cy="186"
                  rx="10"
                  ry="7"
                  fill="#facc15"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />

                {/* Bán cầu não */}
                <ellipse
                  cx="225"
                  cy="178"
                  rx="11"
                  ry="8"
                  fill="url(#brainGold)"
                  stroke={hoveredId === "part_brain" ? "#ffffff" : "#ca8a04"}
                  strokeWidth="1.5"
                />
                {/* Thùy thị giác */}
                <circle
                  cx="238"
                  cy="176"
                  r="7"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                {/* Tiểu não nếp gấp */}
                <ellipse
                  cx="252"
                  cy="173"
                  rx="10"
                  ry="7"
                  fill="url(#brainGold)"
                  stroke="#ca8a04"
                  strokeWidth="1.2"
                />
                {/* Hành tủy */}
                <path
                  d="M 260 176 L 285 180"
                  stroke="#fde047"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              {/* ── 8. KHỐI CƠ VẬN ĐỘNG MYOMERES CHỮ W (Explodes Up-Right) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${45 * f}, ${-85 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_myomeres");
                }}
                onMouseEnter={() => setHoveredId("part_myomeres")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Khối cơ vận động uốn lượn chữ W */}
                <path
                  d="M 320 172 Q 345 152 375 168 Q 405 152 435 168 Q 465 152 495 168 Q 525 152 555 168 Q 585 152 615 168 Q 645 152 675 168 Q 705 152 735 172 Q 765 160 790 185 L 785 208 C 650 205, 480 200, 320 202 Z"
                  fill="url(#myomereRuby)"
                  stroke={hoveredId === "part_myomeres" ? "#ffffff" : "#be123c"}
                  strokeWidth={hoveredId === "part_myomeres" ? "2.5" : "1.2"}
                />
                {/* Vách gân cơ myosepta màu bạc sáng */}
                <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none">
                  <path d="M 350 170 L 365 185 L 355 200" />
                  <path d="M 400 168 L 415 185 L 405 200" />
                  <path d="M 450 168 L 465 185 L 455 200" />
                  <path d="M 500 168 L 515 185 L 505 200" />
                  <path d="M 550 168 L 565 185 L 555 200" />
                  <path d="M 600 168 L 615 185 L 605 200" />
                  <path d="M 650 170 L 665 185 L 655 200" />
                  <path d="M 700 174 L 715 188 L 705 202" />
                </g>
              </g>

              {/* ── 9. VÂY LƯNG CHÍNH (Explodes Upwards) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-115 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_dorsal_fin");
                }}
                onMouseEnter={() => setHoveredId("part_dorsal_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 445 142 C 475 110, 500 70, 515 38 C 522 55, 532 95, 545 125 C 555 128, 570 135, 565 142 C 530 144, 490 144, 445 142 Z"
                  fill="url(#finOceanFoil)"
                  stroke={
                    hoveredId === "part_dorsal_fin" ? "#38bdf8" : "#0284c7"
                  }
                  strokeWidth={hoveredId === "part_dorsal_fin" ? "2.5" : "1.5"}
                  strokeLinejoin="round"
                />
                {/* Tia sụn vây phát quang mảnh */}
                <g stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none">
                  <path d="M 500 65 L 485 138" />
                  <path d="M 510 65 L 500 138" />
                  <path d="M 520 80 L 515 138" />
                  <path d="M 530 98 L 530 138" />
                </g>
              </g>

              {/* ── 10. CẶP VÂY NGỰC NÂNG ĐỠ (Explodes Down-Left) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-75 * f}, ${115 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_pectoral_fin");
                }}
                onMouseEnter={() => setHoveredId("part_pectoral_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 330 242 C 345 285, 385 345, 425 385 C 445 378, 465 352, 462 342 C 440 310, 410 270, 385 238 Z"
                  fill="url(#finOceanFoil)"
                  stroke={
                    hoveredId === "part_pectoral_fin" ? "#38bdf8" : "#0284c7"
                  }
                  strokeWidth={
                    hoveredId === "part_pectoral_fin" ? "2.5" : "1.5"
                  }
                  strokeLinejoin="round"
                />
                {/* Tia sụn xòe quạt */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none">
                  <path d="M 355 250 L 415 365" />
                  <path d="M 370 250 L 430 350" />
                  <path d="M 380 250 L 442 335" />
                </g>
              </g>

              {/* ── 11. VÂY ĐUÔI TRỢ LỰC (Explodes Right-Back) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${125 * f}, ${-10 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_caudal_fin");
                }}
                onMouseEnter={() => setHoveredId("part_caudal_fin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                <path
                  d="M 875 220 C 905 185, 940 130, 985 75 C 980 92, 975 105, 982 110 C 960 145, 945 185, 935 220 C 948 255, 965 295, 960 335 C 935 290, 905 250, 875 228 Z"
                  fill="url(#finOceanFoil)"
                  stroke={
                    hoveredId === "part_caudal_fin" ? "#38bdf8" : "#0284c7"
                  }
                  strokeWidth={hoveredId === "part_caudal_fin" ? "2.5" : "1.5"}
                  strokeLinejoin="round"
                />
                {/* Cột sống đuôi uốn chếch */}
                <path
                  d="M 878 221 C 910 180, 945 130, 975 88"
                  stroke="#fde047"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.9"
                />
                {/* Khía đuôi phụ */}
                <circle cx="980" cy="106" r="3" fill="#030712" />
              </g>

              {/* ── 12. TÚI THỤ CẢM LORENZINI & MẮT (Explodes Up-Left) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(${-105 * f}, ${-50 * f})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_ampullae");
                }}
                onMouseEnter={() => setHoveredId("part_ampullae")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Mắt cá mập tinh anh */}
                <circle
                  cx="195"
                  cy="180"
                  r="11"
                  fill="#020617"
                  stroke="#ca8a04"
                  strokeWidth="2"
                />
                <circle cx="195" cy="180" r="5" fill="#facc15" />
                <circle cx="193" cy="178" r="1.5" fill="#ffffff" />

                {/* Chùm lỗ thụ cảm Lorenzini quanh mõm */}
                <g fill="#f59e0b">
                  <circle cx="120" cy="202" r="3" />
                  <circle cx="132" cy="198" r="2.8" />
                  <circle cx="145" cy="205" r="3" />
                  <circle cx="158" cy="195" r="2.6" />
                  <circle cx="168" cy="208" r="3" />
                  <circle cx="180" cy="200" r="2.8" />
                  <circle cx="190" cy="210" r="3" />
                </g>
                {/* Ống dẫn gel sinh học */}
                <g stroke="#fef08a" strokeWidth="1" opacity="0.8" fill="none">
                  <path d="M 120 202 Q 135 190 150 185" />
                  <path d="M 145 205 Q 160 195 175 190" />
                  <path d="M 168 208 Q 180 200 192 196" />
                </g>
              </g>

              {/* ── 13. VỎ BỌC THÂN TRONG SUỐT PHÁT QUANG (Elevates upward smoothly) ── */}
              <g
                filter="url(#organDropShadow)"
                transform={`translate(0, ${-42 * f})`}
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePartClickById("part_skin");
                }}
                onMouseEnter={() => setHoveredId("part_skin")}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Thân cá mập tinh thể phát quang */}
                <path
                  d="M 105 215 C 130 190, 180 155, 300 145 C 440 135, 620 145, 750 180 C 820 200, 850 215, 875 220 C 850 228, 810 245, 750 260 C 640 285, 480 275, 340 260 C 240 250, 160 240, 105 215 Z"
                  fill="url(#crystalBody)"
                  stroke="url(#biometricOutline)"
                  strokeWidth={hoveredId === "part_skin" ? "2.5" : "1.8"}
                />
                {/* 5 Khe mang sắc nét */}
                <g
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity={Math.max(0.4, 0.9 - f * 0.4)}
                >
                  <line x1="280" y1="192" x2="272" y2="242" />
                  <line x1="294" y1="192" x2="286" y2="244" />
                  <line x1="308" y1="192" x2="300" y2="246" />
                  <line x1="322" y1="192" x2="314" y2="246" />
                  <line x1="336" y1="192" x2="328" y2="244" />
                </g>
                {/* Đường bên cảm thụ áp suất */}
                <path
                  d="M 230 198 C 450 192, 680 206, 860 218"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity={Math.max(0.3, 0.85 - f * 0.4)}
                />
              </g>
            </>
          )}

          {/* Floating Organ Name Tooltip over hovered part */}
          {hoveredId && activePart && (
            <g pointerEvents="none">
              {(() => {
                const tx = activePart.vector ? activePart.vector[0] * f : 0;
                const ty = activePart.vector ? activePart.vector[1] * f : 0;
                const ox = activePart.origin[0] + tx;
                const oy = activePart.origin[1] + ty;
                return (
                  <>
                    <rect
                      x={ox - 65}
                      y={oy - 42}
                      width="130"
                      height="26"
                      rx="13"
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={activePart.color}
                      strokeWidth="1.2"
                    />
                    <text
                      x={ox}
                      y={oy - 25}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {language === "vi"
                        ? activePart.labelVi
                        : activePart.labelEn}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* ── Active Component HUD Inspection Drawer ── */}
      {activePart ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full mt-4 p-5 rounded-2xl border backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 select-text cursor-auto animate-fadeIn selection:bg-cyan-500/30 selection:text-cyan-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,27,62,0.95) 0%, rgba(7,16,35,0.98) 100%)",
            borderColor: `${activePart.color}55`,
          }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: `${activePart.color}20`,
                    color: activePart.color,
                    borderColor: `${activePart.color}55`,
                  }}
                >
                  {activePart.system}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white font-heading select-text cursor-text">
                {language === "vi" ? activePart.nameVi : activePart.nameEn}
              </h3>
              <p className="text-xs text-cyan-300 italic font-serif mt-0.5 select-text cursor-text">
                {activePart.latinName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearSelection}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Đóng bảng chi tiết"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Morphological Description */}
            <div className="md:col-span-2 space-y-2 select-text cursor-text">
              <h4 className="text-xs font-semibold text-slate-300 tracking-normal">
                {language === "vi"
                  ? "Đặc điểm giải phẫu và chức năng sinh học"
                  : "Morphology & Biological Function"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed select-text cursor-text">
                {language === "vi" ? activePart.descVi : activePart.descEn}
              </p>
              {activePart.medicalData?.functionVi && (
                <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 select-text cursor-text">
                  <span className="font-medium text-cyan-300">
                    {language === "vi"
                      ? "Chức năng chính: "
                      : "Primary function: "}
                  </span>
                  {language === "vi"
                    ? activePart.medicalData.functionVi
                    : activePart.medicalData.functionEn}
                </div>
              )}
            </div>

            {/* Medical / Biomimetic Application */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/20 space-y-2 select-text cursor-text">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 tracking-normal">
                <Sparkles size={14} />
                <span>
                  {language === "vi"
                    ? "Ứng dụng y sinh và phỏng sinh học"
                    : "Biomedical & Tech Transfer"}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed select-text cursor-text">
                {language === "vi"
                  ? activePart.medicalUseVi
                  : activePart.medicalUseEn}
              </p>
              {activePart.medicalData?.weightEstimate && (
                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400 select-text cursor-text">
                  <span>
                    {language === "vi" ? "Tỷ lệ khối lượng:" : "Mass ratio:"}
                  </span>
                  <span className="text-cyan-300 font-medium">
                    {activePart.medicalData.weightEstimate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
