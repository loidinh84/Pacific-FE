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
        <div className="lg:col-span-6 flex flex-col items-start pointer-events-auto">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-[1.12] mb-5 font-heading tracking-tight"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            {t("hero.titleLine1")} <br />
            <span className="text-[#0369a1]">
              {t("hero.titleLine2")}
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-[#334155] max-w-lg leading-relaxed mb-8 font-normal"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            {t("hero.description")}
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-wrap items-center gap-3 mb-10"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <a
              href="#species"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] shadow-sm transition-colors cursor-pointer"
            >
              <Compass size={18} />
              <span>{t("hero.btnExplore")}</span>
            </a>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium text-[#0f172a] liquid-glass liquid-glass-interactive cursor-pointer"
            >
              <Search size={17} className="text-[#475569]" />
              <span>{t("hero.btnSearch")}</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div
            className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl"
            data-aos="fade-up"
            data-aos-delay="320"
          >
            <div className="p-4 rounded-2xl liquid-glass">
              <p className="text-xl sm:text-2xl font-bold text-[#0f172a] font-heading tabular-nums whitespace-nowrap">
                {t("hero.stat1Value")}
              </p>
              <p className="text-xs text-[#475569] mt-1 truncate font-medium">
                {t("hero.stat1Title")}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass">
              <p className="text-xl sm:text-2xl font-bold text-[#0f172a] font-heading tabular-nums whitespace-nowrap flex items-baseline gap-1">
                {(() => {
                  const val = t("hero.stat2Value");
                  const parts = val.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        <span>{parts[0]}</span>
                        <span className="text-sm sm:text-base font-semibold text-[#334155]">
                          {parts.slice(1).join(" ")}
                        </span>
                      </>
                    );
                  }
                  return val;
                })()}
              </p>
              <p className="text-xs text-[#475569] mt-1 truncate font-medium">
                {t("hero.stat2Title")}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass">
              <p className="text-xl sm:text-2xl font-bold text-[#0f172a] font-heading tabular-nums whitespace-nowrap">
                {t("hero.stat3Value")}
              </p>
              <p className="text-xs text-[#475569] mt-1 truncate font-medium">
                {t("hero.stat3Title")}
              </p>
            </div>
          </div>
        </div>

        {/* Cột phải: Không gian mở để rạn san hô & rùa biển xanh nổi bật trọn vẹn */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
      </div>

      {/* Không che cứng đáy Hero để 3 cảnh nền chuyển tiếp liền mạch */}
      <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-[#eaf4fb]/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
