import { ChevronDown } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Images from "../../assets/Images";
import PacificHotspotMap from "../../components/common/PacificHotspotMap";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-pacific-figma-dark"
    >
      {/* Background Image Overlay with Dark Deep-Water Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={Images.BanDo5DaiDuong}
          alt="Ocean Background"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-90 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pacific-figma-dark/80 via-pacific-figma-dark/60 to-pacific-figma-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.15)_0%,transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <h1
            className="text-4xl md:text-6xl font-black text-white leading-[1.15] mb-6 font-heading tracking-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("hero.titleLine1")} <br />
            <span className="bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan bg-clip-text text-transparent">
              {t("hero.titleLine2")}
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-pacific-blue-pale/90 max-w-2xl leading-relaxed mb-8 font-normal"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {t("hero.description")}
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap items-center gap-4 mb-14"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href="#species"
              className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-blue-500 shadow-xs shadow-blue-600/50 hover:bg-blue-400 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {t("hero.btnExplore")}
            </a>
            <a
              href="#search"
              className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              {t("hero.btnSearch")}
            </a>
          </div>

          {/* Stats Bar */}
          <div
            className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-xl"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading">
                {t("hero.stat1Value")}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1">
                {t("hero.stat1Title")}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading whitespace-nowrap">
                {t("hero.stat2Value")}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1">
                {t("hero.stat2Title")}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading">
                {t("hero.stat3Value")}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1">
                {t("hero.stat3Title")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hotspot Map */}
        <div
          className="lg:col-span-5 flex justify-center items-center relative"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <PacificHotspotMap />
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors animate-bounce cursor-pointer"
        aria-label="Scroll to About"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
