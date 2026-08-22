import { useLanguage } from "../../hooks/useLanguage";
import { SPECIES_DATA } from "../../mocks/speciesMock";

export default function SpeciesSection() {
  const { language, t } = useLanguage();

  return (
    <section
      id="species"
      className="bg-pacific-figma-dark pt-12 pb-6 relative overflow-hidden"
    >
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-pacific-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-black text-white font-heading">
            {t("species.title")}
          </h2>
          <p className="text-sm md:text-base text-pacific-blue-pale mt-3 max-w-xl mx-auto font-medium">
            {t("species.subtitle")}
          </p>
        </div>

        {/* Species List */}
        <div className="flex flex-col gap-8 md:gap-10">
          {SPECIES_DATA.map((s) => {
            const tag = language === "en" ? s.tagEn : s.tagVi;
            const name = language === "en" ? s.nameEn : s.nameVi;
            const desc = language === "en" ? s.descEn : s.descVi;

            return (
              <div
                key={s.id}
                className="bg-pacific-figma-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 relative overflow-hidden"
                data-aos={s.aos}
                data-aos-duration="900"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Tag */}
                      <span className="inline-block px-3 py-1.5 bg-pacific-blue-bright/20 border border-pacific-blue-bright/40 text-pacific-blue-light text-sm font-semibold rounded-xl tracking-wider mb-3">
                        {tag}
                      </span>

                      {/* Name & SciName */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white font-heading mb-1">
                        {name}
                      </h3>
                      <p className="text-sm text-pacific-blue-pale italic mb-6">
                        {s.sciName}
                      </p>

                      {/* Description */}
                      <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5">
                        {desc}
                      </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      {s.stats.map((st, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-xl md:text-2xl font-black text-pacific-cyan font-heading whitespace-nowrap">
                            {st.val}
                          </p>
                          <p className="text-xs text-pacific-text-muted mt-1">
                            {language === "en" ? st.labelEn : st.labelVi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Image without glass frame */}
                  <div className="lg:col-span-5 flex justify-center items-center">
                    <div className="relative w-full max-w-sm aspect-square flex justify-center items-center p-4">
                      <img
                        src={s.image}
                        alt={name}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] hover:scale-108 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5" data-aos="fade-up">
          <button className="px-5 py-2.5 rounded-2xl font-bold text-white bg-blue-950 hover:bg-blue-800  active:translate-y-0.5 transition-all cursor-pointer text-sm">
            {t("species.btnViewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
