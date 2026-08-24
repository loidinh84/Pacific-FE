import { useNavigate } from "react-router-dom";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";

export function RelatedSpecies({ currentSpeciesId }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const related = SEARCH_SPECIES_CATALOG.filter((s) => s.id !== currentSpeciesId).slice(0, 4);

  return (
    <section className="py-12 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      <h2 className="text-xl md:text-2xl font-bold text-white font-heading mb-8">
        {t("speciesDetail.relatedTitle")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((s) => {
          const name = language === "en" ? s.nameEn : s.nameVi;
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/species/${s.id}`)}
              className="group flex flex-col items-center gap-3 transition-all cursor-pointer"
            >
              {/* Circular Avatar Backdrop */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-600/30 border border-white/15 group-hover:border-cyan-400/50 group-hover:bg-slate-600/50 transition-all flex items-center justify-center p-4 relative overflow-hidden shadow-lg group-hover:scale-105">
                <img
                  src={s.image}
                  alt={name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors rounded-full" />
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="text-white/90 group-hover:text-cyan-300 font-semibold text-xs md:text-sm leading-snug transition-colors line-clamp-1">
                  {name}
                </p>
                <p className="text-slate-400 text-[10px] md:text-[11px] italic mt-0.5 line-clamp-1">
                  {s.sciName}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
