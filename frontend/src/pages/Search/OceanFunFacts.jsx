import { useLanguage } from "../../hooks/useLanguage";
import { OCEAN_FUN_FACTS } from "../../mocks/speciesMock";

export function OceanFunFacts() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <h2 className="text-xl md:text-2xl font-black text-white font-heading mb-6">
        {t("searchPage.funFactsTitle")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {OCEAN_FUN_FACTS.map((fact) => {
          const title = language === "en" ? fact.titleEn : fact.titleVi;
          const desc = language === "en" ? fact.descEn : fact.descVi;
          const badge = language === "en" ? fact.badgeEn : fact.badgeVi;
          const statTitle =
            language === "en" ? fact.statTitleEn : fact.statTitleVi;

          return (
            <div
              key={fact.id}
              className="bg-[#0d1f35] border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/35 hover:bg-[#0f2540] transition-all duration-300 group"
            >
              {/* Top image thumbnail strip */}
              <div className="relative h-32 overflow-hidden bg-white/[0.03]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.12)_0%,transparent_70%)]" />
                <img
                  src={fact.image}
                  alt={title}
                  className="w-full h-full object-contain p-4 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                />
                {/* Emoji badge floating */}
                <span className="absolute top-2.5 right-2.5 text-2xl select-none drop-shadow">
                  {fact.emoji}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/12 border border-cyan-500/25 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                  {badge}
                </span>

                <h3 className="text-sm font-bold text-white font-heading leading-snug mb-2 group-hover:text-sky-300 transition-colors">
                  {title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Stat accent box */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
                  <p className="text-xl md:text-2xl font-black text-cyan-300 font-heading">
                    {fact.statVal}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide mt-1">
                    {statTitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
