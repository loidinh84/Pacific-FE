import { useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { resolveSpeciesAnatomy } from "../../utils/anatomyArchetypeEngine";
import { ExplodedAnatomyViewer } from "../../components/species/ExplodedAnatomyViewer";
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
      <div className="mb-6">
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

      {/* ── UNIFIED EXPLODED DISASSEMBLY VIEWER ── */}
      <div className="w-full flex flex-col items-center">
        <ExplodedAnatomyViewer
          species={species}
          language={language}
          archetypeId={archetypeId}
          onSelectPart={setActiveHotspot}
          selectedPartId={activeHotspot?.id}
          parts={parts}
        />
      </div>
    </section>
  );
}
