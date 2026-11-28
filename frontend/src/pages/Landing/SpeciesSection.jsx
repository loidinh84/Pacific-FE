import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldAlert, Waves } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { SPECIES_DATA } from "../../mocks/speciesMock";
import { fetchSpeciesList } from "../../services/speciesApi";
import { FishHidden } from "../../assets/Images";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

const IUCN_COLORS = {
  CR: "bg-rose-500/12 text-rose-700 border-rose-500/25",
  EN: "bg-orange-500/12 text-orange-700 border-orange-500/25",
  VU: "bg-amber-500/12 text-amber-800 border-amber-500/25",
  NT: "bg-yellow-500/12 text-yellow-800 border-yellow-500/25",
  LC: "bg-emerald-500/12 text-emerald-700 border-emerald-500/25",
  DD: "bg-slate-500/12 text-slate-700 border-slate-500/25",
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
      className="bg-transparent pt-16 pb-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] font-heading tracking-tight leading-tight">
            {t("species.title")}
          </h2>
          <p className="text-sm md:text-base text-[#334155] mt-3 font-normal leading-relaxed">
            {t("species.subtitle")}
          </p>
        </div>

        {/* Species List */}
        <div className="flex flex-col gap-6 md:gap-7 max-w-6xl mx-auto">
          {speciesList.map((s) => {
            const tag = isEn ? s.tagEn : s.tagVi;
            const name = isEn ? s.nameEn : s.nameVi;
            const desc = isEn ? s.descEn : s.descVi;
            const iucnClass = IUCN_COLORS[s.cCode] || IUCN_COLORS.LC;
            const isPhotoUrl =
              typeof s.image === "string" &&
              (s.image.startsWith("http") || s.image.endsWith(".jpg") || s.image.endsWith(".webp"));

            return (
              <div
                key={s.id}
                className="liquid-glass liquid-glass-interactive rounded-[28px] p-5 sm:p-6 md:p-7 relative overflow-hidden group cursor-pointer"
                data-aos="fade-up"
                data-aos-duration="700"
                onClick={() => navigate(`/species/${s.slug || s.id}`)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Text & Stats Column (alternates left/right for editorial rhythm) */}
                  <div
                    className={`lg:col-span-7 flex flex-col justify-between ${
                      s.reverse ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div>
                      {/* Tags row: Group, IUCN & Depth */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-white/75 border border-slate-900/10 text-[#1e293b] text-xs font-medium rounded-full shadow-2xs">
                          {tag}
                        </span>
                        {s.cCode && (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${iucnClass}`}
                          >
                            <ShieldAlert size={13} />
                            <span>IUCN: {s.cCode}</span>
                          </span>
                        )}
                        {s.depthZone && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-white/70 text-[#334155] border border-slate-900/10">
                            <Waves size={13} className="text-[#0284c7]" />
                            <span>{s.depthZone}</span>
                          </span>
                        )}
                      </div>

                      {/* Name & SciName */}
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] font-heading group-hover:text-[#0284c7] transition-colors">
                          {name}
                        </h3>
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#0284c7] shrink-0">
                          <span>{isEn ? "View profile" : "Xem chi tiết"}</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                      <p className="text-sm text-[#475569] italic mb-4 font-mono">
                        {s.sciName}
                      </p>

                      {/* Description */}
                      <p className="text-sm md:text-[15px] text-[#334155] leading-relaxed mb-6 line-clamp-3 font-normal">
                        {desc}
                      </p>
                    </div>

                    {/* Unified Liquid Glass Metric Strip */}
                    <div className="grid grid-cols-3 divide-x divide-slate-900/10 rounded-2xl bg-white/65 border border-white/90 shadow-2xs overflow-hidden">
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
                          <div key={idx} className="text-center py-3.5 px-3">
                            <p className="text-base md:text-lg font-bold text-[#0f172a] font-heading tabular-nums whitespace-nowrap">
                              {displayVal}
                            </p>
                            <p className="text-[11px] sm:text-xs text-[#475569] mt-0.5 font-medium">
                              {isEn ? st.labelEn : st.labelVi}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specimen / Photo Showcase Column */}
                  <div
                    className={`lg:col-span-5 flex justify-center items-center ${
                      s.reverse ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div
                      className={`relative w-full aspect-[16/11] rounded-2xl overflow-hidden flex justify-center items-center border border-white/90 shadow-inner ${
                        isPhotoUrl
                          ? "bg-sky-100/60"
                          : "bg-gradient-to-br from-sky-100/55 via-white/55 to-cyan-100/45 p-5"
                      }`}
                    >
                      <img
                        src={s.image || FishHidden}
                        alt={name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FishHidden;
                        }}
                        className={
                          isPhotoUrl
                            ? "w-full h-full object-cover"
                            : "w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
                        }
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
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-sm transition-colors text-sm cursor-pointer"
          >
            <span>{t("species.btnViewAll")}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
