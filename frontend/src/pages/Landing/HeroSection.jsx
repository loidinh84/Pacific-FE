import { Link } from "react-router-dom";
import { Compass, Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function HeroSection() {
  const { language, t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Cột trái: Nội dung tiêu đề, mô tả và nút điều hướng */}
        <div className="lg:col-span-7 flex flex-col items-start pointer-events-auto">
          <h1
            className="text-4xl md:text-6xl font-black text-white leading-[1.15] mb-6 font-heading tracking-tight drop-shadow-md"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t("hero.titleLine1")} <br />
            <span className="bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan bg-clip-text text-transparent">
              {t("hero.titleLine2")}
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-pacific-blue-pale/95 max-w-2xl leading-relaxed mb-8 font-normal"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("hero.description")}
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap items-center gap-4 mb-12"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <a
              href="#species"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold text-white bg-pacific-teal hover:bg-pacific-teal-light border border-cyan-400/30 shadow-md shadow-black/20 hover:shadow-cyan-950/40 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Compass size={18} />
              <span>{t("hero.btnExplore")}</span>
            </a>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Search size={17} />
              <span>{t("hero.btnSearch")}</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div
            className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-xl sm:max-w-2xl"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all">
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-300 font-heading whitespace-nowrap">
                {t("hero.stat1Value")}
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 truncate font-medium">
                {t("hero.stat1Title")}
              </p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all">
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-300 font-heading whitespace-nowrap flex items-baseline gap-1.5">
                {(() => {
                  const val = t("hero.stat2Value");
                  const parts = val.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-lg sm:text-xl font-bold text-cyan-300/90 tracking-tight">
                          {parts.slice(1).join(" ")}
                        </span>
                      </>
                    );
                  }
                  return val;
                })()}
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 truncate font-medium">
                {t("hero.stat2Title")}
              </p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/30 transition-all">
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-cyan-300 font-heading whitespace-nowrap">
                {t("hero.stat3Value")}
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 truncate font-medium">
                {t("hero.stat3Title")}
              </p>
            </div>
          </div>
        </div>

        {/* Cột phải: Để trống để bản đồ nền và các nút hotspot nổi bật */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none" />
      </div>

      {/* Gradient chuyển tiếp giữa hero và nội dung */}
      <div className="absolute -bottom-1 left-0 right-0 h-64 bg-gradient-to-t from-pacific-figma-dark via-pacific-figma-dark/85 via-pacific-figma-dark/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
