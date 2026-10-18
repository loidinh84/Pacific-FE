import { useState, useMemo } from "react";
import { Zap, Layers, Box } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { resolveSpeciesAnatomy } from "../../utils/anatomyArchetypeEngine";
import { ExplodedAnatomyViewer } from "../../components/species/ExplodedAnatomyViewer";
import { Interactive3DAnatomyViewer } from "../../components/species/Interactive3DAnatomyViewer";
import {
  CHONDRICHTHYES_PARTS,
  OSTEICHTHYES_PARTS,
  CEPHALOPOD_PARTS,
  TURTLE_PARTS,
  MAMMAL_PARTS,
} from "../../components/species/explodedAnatomyData";

const EXPLODED_PARTS_MAP = {
  chondrichthyes: CHONDRICHTHYES_PARTS,
  osteichthyes: OSTEICHTHYES_PARTS,
  cephalopods: CEPHALOPOD_PARTS,
  marine_reptiles: TURTLE_PARTS,
  marine_mammals: MAMMAL_PARTS,
};

export function AnatomySection({ species }) {
  const { language, t } = useLanguage();
  const [viewMode, setViewMode] = useState("2d"); // "2d" | "3d"

  // 1. Resolve taxonomy archetype dynamically
  const resolvedAnatomy = useMemo(
    () => resolveSpeciesAnatomy(species),
    [species],
  );

  const archetypeId = resolvedAnatomy?.archetypeId || "osteichthyes";
  const [activeHotspot, setActiveHotspot] = useState(null);

  /* ─── Guard: Safe render only AFTER all hooks are called ──────── */
  if (!resolvedAnatomy) {
    return null;
  }

  const parts =
    EXPLODED_PARTS_MAP[archetypeId] ||
    EXPLODED_PARTS_MAP.osteichthyes;

  /* ─── Render ──────────────────────────────────────────────────── */
  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans">
      {/* ── Top Header & Title ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Zap size={22} className="text-cyan-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
              {t("speciesDetail.anatomyTitle") ||
                "Mô Hình Giải Phẫu Học & Cấu Trúc Sinh Học"}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            {language === "en"
              ? "Interactive biological anatomical model & physiological analysis"
              : "Mô hình giải phẫu tương tác & phân tích chức năng sinh lý học"}
          </p>
        </div>

        {/* Dual Mode Switcher (2D Vector ⇄ 3D WebGL) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-md">
          <button
            onClick={() => setViewMode("2d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "2d"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={13} />
            <span>{language === "vi" ? "2D Bóc tách" : "2D Exploded"}</span>
          </button>

          <button
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "3d"
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Box size={13} />
            <span>{language === "vi" ? "3D Không gian thực" : "True 3D Studio"}</span>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-mono">
              360°
            </span>
          </button>
        </div>
      </div>

      {/* ── UNIFIED EXPLODED DISASSEMBLY VIEWER (2D OR 3D) ── */}
      <div className="w-full flex flex-col items-center">
        {viewMode === "3d" ? (
          <Interactive3DAnatomyViewer
            species={species}
            language={language}
            onSelectPart={setActiveHotspot}
            selectedPartId={activeHotspot?.id}
          />
        ) : (
          <ExplodedAnatomyViewer
            species={species}
            language={language}
            archetypeId={archetypeId}
            onSelectPart={setActiveHotspot}
            selectedPartId={activeHotspot?.id}
            parts={parts}
          />
        )}
      </div>
    </section>
  );
}
