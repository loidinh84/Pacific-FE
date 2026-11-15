import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldAlert, Waves } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { SPECIES_DATA } from "../../mocks/speciesMock";
import { fetchSpeciesList } from "../../services/speciesApi";
import { FishHidden } from "../../assets/Images";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

const IUCN_COLORS = {
  CR: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  EN: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  VU: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  NT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  LC: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  DD: "bg-slate-500/20 text-slate-300 border-slate-500/40",
};

export default function SpeciesSection() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isEn = language === "en";
  const [speciesList, setSpeciesList] = useState(SPECIES_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Load Featured Species List on Mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

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
            cCode: s.conservationStatus?.code || s.conservationCode || "LC",
            cName: s.conservationStatus?.name || s.conservation || "Ít lo ngại",
            depthZone: s.oceanZone?.name || s.oceanZone || "Tầng mặt (0 - 200m)",
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
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="species"
      className="bg-pacific-figma-dark/90 backdrop-blur-md pt-16 pb-20 relative overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-pacific-cyan/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            {t("species.title")}
          </h2>
          <p className="text-sm md:text-base text-slate-300/80 mt-3 font-normal leading-relaxed">
            {t("species.subtitle")}
          </p>
        </div>

        {/* Species List */}
        <div className="flex flex-col gap-8 md:gap-10">
          {speciesList.map((s) => {
            const tag = isEn ? s.tagEn : s.tagVi;
            const name = isEn ? s.nameEn : s.nameVi;
            const desc = isEn ? s.descEn : s.descVi;
            const iucnClass = IUCN_COLORS[s.cCode] || IUCN_COLORS.LC;

            return (
              <div
                key={s.id}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 backdrop-blur-xl relative overflow-hidden group cursor-pointer hover:border-cyan-400/40 hover:shadow-cyan-500/10 transition-all duration-300"
                data-aos="fade-up"
                data-aos-duration="900"
                onClick={() => navigate(`/species/${s.slug || s.id}`)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Tags row: Group, IUCN & Depth */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold rounded-xl tracking-wide">
                          {tag}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border ${iucnClass}`}
                        >
                          <ShieldAlert size={12} />
                          <span>IUCN: {s.cCode}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-xl bg-white/5 text-slate-300 border border-white/10">
                          <Waves size={12} className="text-cyan-400" />
                          <span>{s.depthZone}</span>
                        </span>
                      </div>

                      {/* Name & SciName */}
                      <h3 className="text-2xl md:text-3xl font-black text-white font-heading mb-1 group-hover:text-cyan-300 transition-colors">
                        {name}
                      </h3>
                      <p className="text-sm text-cyan-200/70 italic mb-4 font-mono">
                        {s.sciName}
                      </p>

                      {/* Description */}
                      <p className="text-sm md:text-base text-slate-200/80 leading-relaxed mb-6 line-clamp-3 font-normal">
                        {desc}
                      </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      {s.stats.map((st, idx) => {
                        const displayVal = st.val
                          ? st.isYears
                            ? isEn
                              ? `${st.val} yrs`
                              : `${st.val} năm`
                            : st.val
                          : isEn
                          ? "Updating"
                          : "Đang cập nhật";

                        return (
                          <div key={idx} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-lg md:text-xl font-black text-cyan-300 font-heading whitespace-nowrap">
                              {displayVal}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isEn ? st.labelEn : st.labelVi}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Image with floating glow */}
                  <div className="lg:col-span-5 flex justify-center items-center">
                    <div className="relative w-full max-w-sm aspect-square flex justify-center items-center p-4">
                      <div className="absolute inset-4 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-400/20 transition-all pointer-events-none" />
                      <img
                        src={s.image || FishHidden}
                        alt={name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FishHidden;
                        }}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12" data-aos="fade-up">
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white bg-pacific-teal hover:bg-pacific-teal-light border border-cyan-400/20 shadow-md shadow-black/20 hover:shadow-cyan-950/50 transition-all text-sm cursor-pointer active:translate-y-0.5"
          >
            <span>{t("species.btnViewAll")}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
