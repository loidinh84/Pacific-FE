import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { SPECIES_DATA } from "../../mocks/speciesMock";
import { fetchSpeciesList } from "../../services/speciesApi";
import { FishHidden } from "../../assets/Images";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

export default function SpeciesSection() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [speciesList, setSpeciesList] = useState(SPECIES_DATA);

  useEffect(() => {
    let isMounted = true;
    fetchSpeciesList({ limit: 4, sortBy: "views" })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((s, idx) => ({
            id: s.id,
            slug: s.slug || s.id,
            tagVi: s.group?.name || "Sinh vật biển",
            tagEn: getLocalizedCategory(s.group?.name, "en"),
            nameVi: s.commonName,
            nameEn: getLocalizedSpeciesName(s, "en"),
            sciName: s.scientificName,
            image: s.image,
            stats: [
              {
                val: s.sizeMaxCm ? `${(s.sizeMaxCm / 100).toFixed(1)}m` : null,
                labelVi: "Chiều dài",
                labelEn: "Length",
              },
              {
                val: s.weightMaxKg ? `${s.weightMaxKg}kg` : null,
                labelVi: "Cân nặng",
                labelEn: "Weight",
              },
              {
                val: s.lifespanYears ? s.lifespanYears : null,
                isYears: true,
                labelVi: "Tuổi thọ",
                labelEn: "Lifespan",
              },
            ],
            descVi:
              s.description ||
              (s.diet ? `Tập tính ăn: ${s.diet}.` : "") ||
              `Sinh vật đặc hữu phân bố tại vùng biển ${s.eastSeaZone || "Biển Đông"}.`,
            descEn:
              s.description ||
              `Endemic marine creature found in ${s.eastSeaZone || "East Sea"}.`,
            reverse: idx % 2 !== 0,
            aos: idx % 2 === 0 ? "fade-right" : "fade-left",
          }));
          setSpeciesList(mapped);
        }
      })
      .catch(() => {
        // Fallback giữ nguyên SPECIES_DATA
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="species"
      className="bg-pacific-figma-dark/80 backdrop-blur-md pt-12 pb-6 relative overflow-hidden border-t border-white/5"
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
          {speciesList.map((s) => {
            const tag = language === "en" ? s.tagEn : s.tagVi;
            const name = language === "en" ? s.nameEn : s.nameVi;
            const desc = language === "en" ? s.descEn : s.descVi;

            return (
              <div
                key={s.id}
                className="bg-pacific-figma-card rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 relative overflow-hidden group cursor-pointer hover:border-pacific-cyan/40 transition-colors"
                data-aos={s.aos}
                data-aos-duration="900"
                onClick={() => navigate(`/species/${s.slug || s.id}`)}
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
                      <h3 className="text-2xl md:text-3xl font-bold text-white font-heading mb-1 group-hover:text-pacific-cyan transition-colors">
                        {name}
                      </h3>
                      <p className="text-sm text-pacific-blue-pale italic mb-6">
                        {s.sciName}
                      </p>

                      {/* Description */}
                      <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5 line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      {s.stats.map((st, idx) => {
                        const displayVal = st.val
                          ? st.isYears
                            ? language === "en"
                              ? `${st.val} yrs`
                              : `${st.val} năm`
                            : st.val
                          : language === "en"
                          ? "Updating"
                          : "Đang cập nhật";

                        return (
                          <div key={idx} className="text-center">
                            <p className="text-xl md:text-2xl font-black text-pacific-cyan font-heading whitespace-nowrap">
                              {displayVal}
                            </p>
                            <p className="text-xs text-pacific-text-muted mt-1">
                              {language === "en" ? st.labelEn : st.labelVi}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Image without glass frame */}
                  <div className="lg:col-span-5 flex justify-center items-center">
                    <div className="relative w-full max-w-sm aspect-square flex justify-center items-center p-4">
                      <img
                        src={s.image || FishHidden}
                        alt={name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FishHidden;
                        }}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] group-hover:scale-108 transition-transform duration-500"
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
          <button
            onClick={() => navigate("/search")}
            className="px-5 py-2.5 rounded-2xl font-bold text-white bg-blue-950 hover:bg-blue-800 active:translate-y-0.5 transition-all cursor-pointer text-sm"
          >
            {t("species.btnViewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
