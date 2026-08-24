import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { SharkAnatomy } from "../../assets/Images";

export function AnatomySection({ species, language }) {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const anatomyImg = species.anatomyImage || SharkAnatomy;
  const hotspots = species.anatomy || [];

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white font-heading mb-6">
        Phân tích và giải phẫu
      </h2>

      {/* Anatomy poster illustration */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 bg-stone-900/40 shadow-2xl">
        <img
          src={anatomyImg}
          alt="Sơ đồ phân tích và giải phẫu"
          className="w-full h-auto object-contain rounded-2xl"
          draggable={false}
        />

        {/* Hotspots */}
        {hotspots.map((spot) => {
          const label = language === "en" ? spot.labelEn : spot.labelVi;
          const isActive = activeHotspot?.id === spot.id;

          return (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(isActive ? null : spot)}
              className="absolute group cursor-pointer z-20"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={label}
            >
              {/* Pulse ripple ring */}
              <span
                className={`absolute -inset-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-red-500/50 scale-150 animate-ping"
                    : "bg-red-500/30 group-hover:scale-150 animate-pulse"
                }`}
              />

              {/* Center pointer dot */}
              <span
                className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 text-[10px] font-black transition-all shadow-md ${
                  isActive
                    ? "bg-red-600 border-white text-white scale-125"
                    : "bg-red-500 border-red-200 text-white group-hover:bg-red-600 group-hover:scale-110"
                }`}
              >
                •
              </span>

              {/* Floating label */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2.5 py-1 rounded-md bg-stone-900/90 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap border border-white/20 shadow-lg pointer-events-none transition-all ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Hotspot Info Card */}
      {activeHotspot && (
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/15 backdrop-blur-md flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <h3 className="text-white font-bold text-sm">
                {language === "en" ? activeHotspot.labelEn : activeHotspot.labelVi}
              </h3>
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {language === "en" ? activeHotspot.descEn : activeHotspot.descVi}
            </p>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
