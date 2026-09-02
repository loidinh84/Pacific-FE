import { useState, useCallback, useRef, useEffect } from "react";
import { X, Sparkles, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { InteractiveSharkSVG } from "../../components/species/InteractiveSharkSVG";

/* ─── Accent colour map ───────────────────────────────────────── */
const ACCENT = {
  cyan:  { dot: "bg-cyan-400",  ring: "bg-cyan-400/30",  border: "border-cyan-400/60",  text: "text-cyan-300",  badge: "bg-cyan-500/15 border-cyan-400/40",  icon: "text-cyan-400",  step: "bg-cyan-500",  zoomBtn: "from-cyan-900/70 to-teal-900/70 border-cyan-400/30 hover:from-cyan-800 hover:to-teal-800" },
  amber: { dot: "bg-amber-400", ring: "bg-amber-400/30", border: "border-amber-400/60", text: "text-amber-300", badge: "bg-amber-500/15 border-amber-400/40", icon: "text-amber-400", step: "bg-amber-500", zoomBtn: "from-amber-900/70 to-yellow-900/70 border-amber-400/30 hover:from-amber-800 hover:to-yellow-800" },
  rose:  { dot: "bg-rose-400",  ring: "bg-rose-400/30",  border: "border-rose-400/60",  text: "text-rose-300",  badge: "bg-rose-500/15 border-rose-400/40",  icon: "text-rose-400",  step: "bg-rose-500",  zoomBtn: "from-rose-900/70 to-pink-900/70 border-rose-400/30 hover:from-rose-800 hover:to-pink-800" },
  blue:  { dot: "bg-blue-400",  ring: "bg-blue-400/30",  border: "border-blue-400/60",  text: "text-blue-300",  badge: "bg-blue-500/15 border-blue-400/40",  icon: "text-blue-400",  step: "bg-blue-500",  zoomBtn: "from-blue-900/70 to-indigo-900/70 border-blue-400/30 hover:from-blue-800 hover:to-indigo-800" },
  slate: { dot: "bg-slate-300", ring: "bg-slate-400/30", border: "border-slate-400/60", text: "text-slate-300", badge: "bg-slate-500/15 border-slate-400/40", icon: "text-slate-400", step: "bg-slate-500", zoomBtn: "from-slate-800/70 to-zinc-800/70 border-slate-400/30 hover:from-slate-700 hover:to-zinc-700" },
};

export function AnatomySection({ species }) {
  const { language, t } = useLanguage();

  const layers = species.anatomyLayers || null;

  /* ─── State ───────────────────────────────────────────────────── */
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);
  const [isZooming, setIsZooming]           = useState(false);
  const [zoomDir, setZoomDir]               = useState("in");
  const [activeHotspot, setActiveHotspot]   = useState(null);
  const scrollCooldown                      = useRef(false);
  const imgContainerRef                     = useRef(null);

  /* ─── Derived ─────────────────────────────────────────────────── */
  /* Nếu không có dữ liệu các lớp giải phẫu thì ẩn hẳn phần này */
  if (!layers) return null;

  const currentLayer = layers[activeLayerIdx];
  const accent       = ACCENT[currentLayer.accent] || ACCENT.cyan;
  const label        = language === "en" ? currentLayer.labelEn : currentLayer.labelVi;
  const desc         = language === "en" ? currentLayer.descEn  : currentLayer.descVi;

  /* ─── Transition helper ───────────────────────────────────────── */
  const goToLayer = useCallback((nextIdx, dir = "in") => {
    if (nextIdx === activeLayerIdx || isZooming) return;
    setZoomDir(dir);
    setIsZooming(true);
    setActiveHotspot(null);
    setTimeout(() => {
      setActiveLayerIdx(nextIdx);
      setIsZooming(false);
    }, 260);
  }, [activeLayerIdx, isZooming]);

  const zoomIn  = () => goToLayer(Math.min(activeLayerIdx + 1, layers.length - 1), "in");
  const zoomOut = () => goToLayer(Math.max(activeLayerIdx - 1, 0), "out");

  /* Scroll wheel — native listener với passive:false để chặn cuộn trang */
  useEffect(() => {
    const el = imgContainerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (scrollCooldown.current) return;
      scrollCooldown.current = true;
      setTimeout(() => { scrollCooldown.current = false; }, 420);
      if (e.deltaY > 0) {
        setActiveLayerIdx((prev) => {
          const next = Math.min(prev + 1, layers.length - 1);
          if (next !== prev) { setZoomDir("in"); setIsZooming(true); setActiveHotspot(null); setTimeout(() => setIsZooming(false), 260); }
          return next;
        });
      } else {
        setActiveLayerIdx((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev) { setZoomDir("out"); setIsZooming(true); setActiveHotspot(null); setTimeout(() => setIsZooming(false), 260); }
          return next;
        });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [layers.length]);

  /* ─── Render ──────────────────────────────────────────────────── */
  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      {/* ── Title ── */}
      <div className="flex items-center gap-2.5 mb-6">
        <Layers size={20} className={accent.icon} />
        <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
          {t("speciesDetail.anatomyTitle")}
        </h2>
      </div>

      {/* ── Current layer info badge ── */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 transition-all ${accent.badge} ${accent.text}`}>
        <span className="font-black">{currentLayer.percent}%</span>
        <span>•</span>
        <span>{label}</span>
        <span className="text-white/40 font-normal">{desc}</span>
      </div>

      {/* ── Main image viewer ── */}
      <div
        ref={imgContainerRef}
        className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${accent.border} bg-stone-900/40 cursor-ns-resize flex items-center justify-center`}
      >
        <div 
          className="w-full h-full transition-all"
          style={{
            transform: isZooming ? zoomDir === "in" ? "scale(1.05)" : "scale(0.95)" : "scale(1)",
            opacity: isZooming ? 0 : 1,
            transition: "transform 260ms cubic-bezier(0.4,0,0.2,1), opacity 240ms ease"
          }}
        >
          <InteractiveSharkSVG 
            activeLayerIdx={activeLayerIdx}
            activeHotspotId={activeHotspot?.id}
            onHover={(id) => {
              if (isZooming) return;
              if (id) {
                const spot = currentLayer.hotspots.find(h => h.id === id);
                if (spot) setActiveHotspot(spot);
              } else {
                setActiveHotspot(null);
              }
            }}
            onClick={(id) => {
              if (isZooming) return;
              const spot = currentLayer.hotspots.find(h => h.id === id);
              if (spot) setActiveHotspot(activeHotspot?.id === id ? null : spot);
            }}
          />
        </div>

        {/* Percent watermark */}
        <div className={`absolute top-3 right-3 text-5xl font-black opacity-10 pointer-events-none select-none ${accent.text} transition-all duration-500`}>
          {currentLayer.percent}%
        </div>

        {/* Scroll hint overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none select-none">
          {activeLayerIdx === 0 && (
            <span className="flex items-center gap-1.5 text-[11px] text-white/50 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 animate-pulse">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              {language === "en" ? "Scroll down to zoom in" : "Lăn chuột xuống để phóng sâu hơn"}
            </span>
          )}
          {activeLayerIdx === layers.length - 1 && (
            <span className="flex items-center gap-1.5 text-[11px] text-white/50 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 animate-pulse">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              {language === "en" ? "Scroll up to zoom out" : "Lăn chuột lên để thu lại"}
            </span>
          )}
        </div>
      </div>

      {/* ── Mini zoom controls ── */}
      <div className="flex items-center justify-between mt-3 gap-3">
        <button
          onClick={zoomOut}
          disabled={activeLayerIdx === 0 || isZooming}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${ activeLayerIdx === 0 ? "opacity-25 cursor-not-allowed bg-white/3 border-white/8 text-white/30" : `cursor-pointer bg-gradient-to-r ${accent.zoomBtn} text-white`}`}
        >
          <ChevronLeft size={14} />
          <span>{language === "en" ? "Shallower" : "Nông hơn"}</span>
        </button>

        <span className="text-white/25 text-[11px] font-medium tracking-wider">
          {activeLayerIdx + 1} / {layers.length}
          <span className="ml-1.5 text-white/20">·</span>
          <span className="ml-1.5">{language === "en" ? "scroll to navigate" : "lăn chuột để chuyển lớp"}</span>
        </span>

        <button
          onClick={zoomIn}
          disabled={activeLayerIdx === layers.length - 1 || isZooming}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${ activeLayerIdx === layers.length - 1 ? "opacity-25 cursor-not-allowed bg-white/3 border-white/8 text-white/30" : `cursor-pointer bg-gradient-to-r ${accent.zoomBtn} text-white`}`}
        >
          <span>{language === "en" ? "Deeper" : "Sâu hơn"}</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Active hotspot info card ── */}
      {activeHotspot && (
        <div className={`mt-4 p-4 rounded-xl border backdrop-blur-md flex items-start justify-between gap-4 transition-all ${accent.badge}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className={accent.icon} />
              <h3 className="text-white font-bold text-sm">
                {language === "en" ? (activeHotspot.labelEn || activeHotspot.labelVi) : activeHotspot.labelVi}
              </h3>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${accent.badge} ${accent.text}`}>
                {currentLayer.percent}%
              </span>
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {language === "en" ? (activeHotspot.descEn || activeHotspot.descVi) : activeHotspot.descVi}
            </p>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
