import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  CoralIcon,
  SharkIcon,
  TurtleIcon,
  FishIcon,
  JellyfishIcon,
  WhaleIcon,
  OctopusIcon,
  SealIcon,
  LightbulbIcon,
} from "../../assets/Icons";

// Danh sách loài luân chuyển với file icon SVG và màu sắc đặc trưng
const ROTATING_SPECIES = [
  { textVi: "San hô tạo rạn", textEn: "Staghorn Coral", Icon: CoralIcon, color: "text-rose-400", badgeBg: "bg-rose-500/10 border-rose-500/30" },
  { textVi: "Cá mập voi", textEn: "Whale Shark", Icon: SharkIcon, color: "text-cyan-400", badgeBg: "bg-cyan-500/10 border-cyan-500/30" },
  { textVi: "Đồi mồi dứa", textEn: "Green Sea Turtle", Icon: TurtleIcon, color: "text-emerald-400", badgeBg: "bg-emerald-500/10 border-emerald-500/30" },
  { textVi: "Cá hề Nemo", textEn: "Clownfish", Icon: FishIcon, color: "text-amber-400", badgeBg: "bg-amber-500/10 border-amber-500/30" },
  { textVi: "Sứa phát quang", textEn: "Bioluminescent Jellyfish", Icon: JellyfishIcon, color: "text-fuchsia-400", badgeBg: "bg-fuchsia-500/10 border-fuchsia-500/30" },
  { textVi: "Cá voi xanh", textEn: "Blue Whale", Icon: WhaleIcon, color: "text-sky-400", badgeBg: "bg-sky-500/10 border-sky-500/30" },
  { textVi: "Bạch tuộc đốm xanh", textEn: "Blue-ringed Octopus", Icon: OctopusIcon, color: "text-teal-400", badgeBg: "bg-teal-500/10 border-teal-500/30" },
  { textVi: "Hải cẩu đốm", textEn: "Spotted Seal", Icon: SealIcon, color: "text-indigo-400", badgeBg: "bg-indigo-500/10 border-indigo-500/30" },
];

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [index, setIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Hiệu ứng chuyển động mượt mà giữa các loài sinh vật biển
  useEffect(() => {
    const timer = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_SPECIES.length);
        setIsChanging(false);
      }, 350);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const current = ROTATING_SPECIES[index];
  const CurrentIcon = current.Icon;

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4">
      {/* Dynamic pill badge with SVG file icon & smooth morphing */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 shadow-lg ${current.badgeBg}`}
        >
          <div
            className={`w-6 h-6 flex items-center justify-center transition-all duration-300 ${current.color} ${
              isChanging ? "opacity-0 -translate-y-2 scale-75 rotate-12" : "opacity-100 translate-y-0 scale-100 rotate-0"
            }`}
          >
            <CurrentIcon className="w-5 h-5 fill-none stroke-current" />
          </div>
          <span className="text-xs md:text-sm font-medium text-slate-300">
            {isEn ? "Exploring marine fauna:" : "Khám phá sinh vật biển:"}
          </span>
          <span
            className={`text-xs md:text-sm font-bold tracking-wide transition-all duration-300 ${current.color} ${
              isChanging ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {isEn ? current.textEn : current.textVi}
          </span>
        </div>
      </div>

      {/* Title - prominent and sharp */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight mb-3">
        {t("searchPage.heroTitle")}
      </h1>

      {/* Description - legible and clear */}
      <p className="text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto mb-7 font-medium leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      {/* Main Search Input Form */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-6"
      >
        <div className="relative flex items-center">
          <Search
            size={22}
            className="absolute left-4 text-cyan-300/60 pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPage.searchPlaceholder")}
            className="w-full py-4 pl-12 pr-36 bg-[#0a203c]/70 border border-cyan-500/30 rounded-2xl text-base text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-[#0c274a]/90 backdrop-blur-xl transition-all shadow-xl shadow-cyan-950/40"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer active:translate-y-0.5 shadow-md shadow-cyan-900/40"
          >
            {t("searchPage.btnSearch")}
          </button>
        </div>

        {/* Smart Question Suggestions Chips with SVG Lightbulb */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-amber-300 font-semibold flex items-center gap-1.5 mr-1 text-xs md:text-sm">
            <LightbulbIcon className="w-4 h-4 text-amber-400 stroke-current" />
            <span>{isEn ? "Smart prompts:" : "Gợi ý truy vấn:"}</span>
          </span>
          {[
            "Thiên địch của sao biển gai",
            "Cộng sinh với hải quỳ",
            "Cực kỳ nguy cấp ở Côn Đảo",
            "Loài ăn cỏ biển Biển Đông",
            "Sinh vật tạo nơi cư trú",
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setSearchTerm(chip);
                if (onSearchSubmit) {
                  setTimeout(() => onSearchSubmit({ preventDefault: () => {} }, chip), 10);
                }
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </form>

      {/* 4 Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-5 border-t border-white/10">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-heading">
            {t("searchPage.quickStat1")}
          </p>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold">
            {t("searchPage.quickStat1Title")}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-heading">
            {t("searchPage.quickStat2")}
          </p>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold">
            {t("searchPage.quickStat2Title")}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-heading">
            {t("searchPage.quickStat3")}
          </p>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold">
            {t("searchPage.quickStat3Title")}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-heading">
            {t("searchPage.quickStat4")}
          </p>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-semibold">
            {t("searchPage.quickStat4Title")}
          </p>
        </div>
      </div>
    </div>
  );
}
