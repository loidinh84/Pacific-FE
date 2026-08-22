import { Compass, Waves } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CreatureAccentCard } from "../../components/species/CreatureAccentCard";

export function RegisterBrandPanel() {
  const { t } = useLanguage();

  return (
    <div className="md:col-span-5 bg-gradient-to-br from-pacific-navy-mid/80 via-pacific-navy/90 to-pacific-darkest/90 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pacific-blue-bright/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pacific-teal/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pacific-blue-bright/15 border border-pacific-blue-bright/30 text-pacific-blue-light text-xs font-semibold uppercase tracking-wider mb-6">
          &nbsp; {t("auth.registerBadge")}
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-white font-heading leading-tight mb-3">
          {t("auth.registerBrandTitle")}
        </h2>
        <p className="text-xs lg:text-sm text-pacific-blue-pale leading-relaxed">
          {t("auth.registerBrandDesc")}
        </p>
      </div>

      <div className="my-8 flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 flex items-center justify-center text-pacific-blue-light">
            <Compass size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {t("auth.featurePersonalized")}
            </p>
            <p className="text-[11px] text-pacific-text-muted">
              {t("auth.featurePersonalizedSub")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-pacific-teal/20 border border-pacific-teal/30 flex items-center justify-center text-pacific-cyan">
            <Waves size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {t("auth.featureCommunity")}
            </p>
            <p className="text-[11px] text-pacific-text-muted">
              {t("auth.featureCommunitySub")}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Accent - Dynamic Random Sea Creature Card */}
      <CreatureAccentCard />
    </div>
  );
}
