import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import * as Icons from "../../assets/Icons";

export function FeaturedSpeciesSlider() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const featuredList = SEARCH_SPECIES_CATALOG.filter((s) => s.isFeatured);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white font-heading mb-4">
        {t("searchPage.featuredTitle")}
      </h2>

      {/* Horizontal scroll — infinite feel, no wrap */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {featuredList.map((s) => {
          const categoryName = language === "en" ? s.categoryEn : s.categoryVi;
          const statusName = language === "en" ? s.statusEn : s.statusVi;
          const name = language === "en" ? s.nameEn : s.nameVi;
          const desc = language === "en" ? s.descEn : s.descVi;

          return (
            <div
              key={s.id}
              className="flex-shrink-0 w-56 bg-[#0d1f35] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500/50 hover:bg-[#0f2540] transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/species/${s.id}`)}
            >
              {/* Header Tags */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/25 text-sky-300 text-[10px] font-semibold leading-tight truncate max-w-[90px]">
                  {categoryName}
                </span>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold leading-tight ${
                    s.statusType === "danger"
                      ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                      : s.statusType === "warning"
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {statusName}
                </span>
              </div>

              {/* Image */}
              <div className="w-full h-32 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-white/[0.03]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
                <img
                  src={s.image}
                  alt={name}
                  className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-400 relative z-10"
                />
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-bold text-white font-heading group-hover:text-sky-300 transition-colors mb-0.5 line-clamp-1">
                  {name}
                </h3>
                <p className="text-[10px] text-slate-400 italic mb-2 line-clamp-1">
                  {s.sciName}
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed line-clamp-2 mb-3">
                  {desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-white/8 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Icons.Anchor className="w-3.5 h-3.5 text-blue-400" /> {s.depth}
                </span>
                <span className="text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">
                  {t("searchPage.btnDetail")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
