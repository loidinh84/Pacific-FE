import { useState } from "react";
import { Zap, Sparkles } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { Interactive3DAnatomyViewer } from "../../components/species/Interactive3DAnatomyViewer";

export function AnatomySection({ species }) {
  const { language, t } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState(null);

  if (!species) {
    return null;
  }

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
              ? "Interactive 3D biological anatomical model & physiological analysis"
              : "Mô hình giải phẫu 3D tương tác thực tế & phân tích sinh lý học biển sâu"}
          </p>
        </div>

        {/* 3D Realtime WebGL Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 backdrop-blur-md shadow-sm">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span className="font-medium">
            {language === "en" ? "3D Realtime WebGL Studio" : "Không Gian Giải Phẫu 3D Thực Tế"}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 font-mono">
            360°
          </span>
        </div>
      </div>

      {/* ── 3D INTERACTIVE ANATOMY VIEWER ── */}
      <div className="w-full flex flex-col items-center">
        <Interactive3DAnatomyViewer
          species={species}
          language={language}
          onSelectPart={setActiveHotspot}
          selectedPartId={activeHotspot?.id}
          model3dUrl={species?.model3dUrl || species?.model3D || "/models/shark.glb"}
        />
      </div>
    </section>
  );
}
