import { Link } from "react-router-dom";
import { Compass, Search, Sparkles, Waves } from "lucide-react";
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
          {/* Animated Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-sm"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {language === "en"
                ? "East Sea Biodiversity Portal • Scientific Standard"
                : "Cổng thông tin & Tra cứu sinh vật Biển Đông chuẩn khoa học"}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-white leading-[1.15] mb-6 font-heading tracking-tight drop-shadow-md"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("hero.titleLine1")} <br />
            <span className="bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan bg-clip-text text-transparent">
              {t("hero.titleLine2")}
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-pacific-blue-pale/95 max-w-2xl leading-relaxed mb-8 font-normal"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            {t("hero.description")}
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap items-center gap-4 mb-12"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href="#species"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Compass size={18} />
              <span>{t("hero.btnExplore")}</span>
            </a>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Search size={17} />
              <span>{t("hero.btnSearch")}</span>
            </Link>
            <Link
              to="/ocean-depth"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 backdrop-blur-md transition-all cursor-pointer"
            >
              <Waves size={16} />
              <span>{language === "en" ? "5 Depth Layers" : "5 Tầng độ sâu"}</span>
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
