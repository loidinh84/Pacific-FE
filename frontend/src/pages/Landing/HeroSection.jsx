import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Cột trái: Nội dung tiêu đề, mô tả và nút điều hướng */}
        <div className="lg:col-span-7 flex flex-col items-start pointer-events-auto">
          {/* Badge nhỏ */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pacific-cyan/15 border border-pacific-cyan/30 text-pacific-cyan text-xs font-semibold mb-5 backdrop-blur-md"
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <Compass size={14} className="animate-spin-slow" />
            <span>{language === "en" ? "East Sea Bathymetric Atlas" : "Hải đồ độ sâu Biển Đông"}</span>
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
            className="flex flex-wrap items-center gap-4 mb-14"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a
              href="#species"
              className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-blue-500 shadow-lg shadow-blue-500/30 hover:bg-blue-400 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {t("hero.btnExplore")}
            </a>
            <Link
              to="/search"
              className="px-8 py-3.5 rounded-full text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all cursor-pointer inline-block"
            >
              {t("hero.btnSearch")}
            </Link>
          </div>

          {/* Stats Bar */}
          <div
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-white/15 w-full max-w-xl sm:max-w-2xl"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading whitespace-nowrap">
                {t("hero.stat1Value")}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1 truncate">
                {t("hero.stat1Title")}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading whitespace-nowrap flex items-baseline gap-1.5">
                {(() => {
                  const val = t("hero.stat2Value");
                  const parts = val.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-xl md:text-2xl font-bold font-heading text-pacific-cyan/95 tracking-tight">
                          {parts.slice(1).join(" ")}
                        </span>
                      </>
                    );
                  }
                  return val;
                })()}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1 truncate">
                {t("hero.stat2Title")}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-pacific-cyan font-heading whitespace-nowrap">
                {t("hero.stat3Value")}
              </p>
              <p className="text-xs text-pacific-text-muted mt-1 truncate">
                {t("hero.stat3Title")}
              </p>
            </div>
          </div>
        </div>

        {/* Cột phải: Để trống để bản đồ nền và các nút hotspot nổi bật */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none" />
      </div>

      {/* Lớp gradient chuyển tiếp đại dương nối liền mượt mà giữa Hero và AboutSection (xóa bỏ hoàn toàn vết cắt ngang) */}
      <div className="absolute -bottom-1 left-0 right-0 h-64 bg-gradient-to-t from-pacific-figma-dark via-pacific-figma-dark/85 via-pacific-figma-dark/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
