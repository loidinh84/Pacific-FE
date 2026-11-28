import { useLanguage } from "../../hooks/useLanguage";
import { RANDOM_CREATURES_DATA } from "../../mocks/creaturesMock";

export function CreatureAccentCard() {
  const { language } = useLanguage();
  const currentCreature = RANDOM_CREATURES_DATA[0];
  const creatureName =
    language === "en" ? currentCreature.nameEn : currentCreature.nameVi;
  const creatureTag =
    language === "en" ? currentCreature.tagEn : currentCreature.tagVi;

  return (
    <div className="relative z-10 pt-4 border-t border-[#0f172a]/10">
      <div className="flex items-center gap-3 p-2.5 rounded-2xl liquid-glass-subtle">
        <div className="w-10 h-10 rounded-xl bg-sky-600/10 border border-sky-600/20 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
          <img
            src={currentCreature.image}
            alt={creatureName}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-[#0f172a] truncate">
              {creatureName}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-600/10 text-[#0284c7] font-medium border border-sky-600/20 whitespace-nowrap">
              {creatureTag}
            </span>
          </div>
          <p className="text-[11px] text-[#475569] italic truncate font-mono">
            {currentCreature.sciName}
          </p>
        </div>
      </div>
    </div>
  );
}
