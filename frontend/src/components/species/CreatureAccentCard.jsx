import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { RANDOM_CREATURES_DATA } from "../../mocks/creaturesMock";

export function CreatureAccentCard() {
  const { language } = useLanguage();
  const [creatureIndex, setCreatureIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCreatureIndex((prev) => (prev + 1) % RANDOM_CREATURES_DATA.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentCreature = RANDOM_CREATURES_DATA[creatureIndex];
  const creatureName =
    language === "en" ? currentCreature.nameEn : currentCreature.nameVi;
  const creatureTag =
    language === "en" ? currentCreature.tagEn : currentCreature.tagVi;

  return (
    <div className="relative z-10 pt-4 border-t border-white/10">
      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
        <div className="w-10 h-10 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
          <img
            src={currentCreature.image}
            alt={creatureName}
            className={`w-full h-full object-contain transition-all duration-300 ${
              isFading ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          />
        </div>
        <div
          className={`transition-all duration-300 min-w-0 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-white truncate">
              {creatureName}
            </p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pacific-blue-bright/20 text-pacific-blue-light font-semibold border border-pacific-blue-bright/30 whitespace-nowrap">
              {creatureTag}
            </span>
          </div>
          <p className="text-[11px] text-pacific-blue-pale italic truncate font-light">
            {currentCreature.sciName}
          </p>
        </div>
      </div>
    </div>
  );
}
