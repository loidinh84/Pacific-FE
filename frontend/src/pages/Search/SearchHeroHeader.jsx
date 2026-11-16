import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { LightbulbIcon } from "../../assets/Icons";

const SUGGESTION_GROUPS = [
  [
    { vi: "Cá mập", en: "Sharks" },
    { vi: "Rùa biển", en: "Sea Turtles" },
    { vi: "San hô", en: "Corals" },
    { vi: "Cá hề Nemo", en: "Clownfish" },
    { vi: "Bạch tuộc", en: "Octopus" },
  ],
  [
    { vi: "Sao biển", en: "Starfish" },
    { vi: "Cá voi xanh", en: "Blue Whale" },
    { vi: "Đồi mồi", en: "Hawksbill Turtle" },
    { vi: "Bò biển", en: "Dugong" },
    { vi: "Cá ngựa", en: "Seahorse" },
  ],
  [
    { vi: "Hải quỳ", en: "Sea Anemone" },
    { vi: "Cá cờ xanh", en: "Sailfish" },
    { vi: "Sứa biển", en: "Jellyfish" },
    { vi: "Bào ngư", en: "Abalone" },
    { vi: "Cua khổng lồ", en: "Giant Crab" },
  ],
  [
    { vi: "Tôm hùm", en: "Lobster" },
    { vi: "Cá mặt trăng", en: "Sunfish" },
    { vi: "Ốc tù và", en: "Triton Snail" },
    { vi: "Cá chình", en: "Moray Eel" },
    { vi: "Cá lồng đèn", en: "Lanternfish" },
  ],
];

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const [groupIndex, setGroupIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Tự động luân chuyển gợi ý mượt mà (như TikTok / Shopee), tạm dừng khi hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setGroupIndex((prev) => (prev + 1) % SUGGESTION_GROUPS.length);
        setIsFading(false);
      }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentSuggestions = SUGGESTION_GROUPS[groupIndex];

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-14 pb-4 md:pt-16 md:pb-6 px-4">
      {/* Title - compact, elegant and sharp */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight mb-2">
        {t("searchPage.heroTitle")}
      </h1>

      {/* Description - concise and clear */}
      <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto mb-5 font-normal leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      {/* Main Search Input Form */}
      <form
        onSubmit={onSearchSubmit}
        className="relative max-w-2xl mx-auto mb-4"
      >
        <div className="relative flex items-center">
          <Search
            size={20}
            className="absolute left-4 text-cyan-300/60 pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPage.searchPlaceholder")}
            className="w-full py-3.5 pl-11 pr-32 bg-[#0a203c]/70 border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-[#0c274a]/90 backdrop-blur-xl transition-all shadow-lg shadow-cyan-950/30"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer active:translate-y-0.5 shadow-md shadow-cyan-900/40"
          >
            {t("searchPage.btnSearch")}
          </button>
        </div>

        {/* Compact automatic rotating suggestion chips */}
        <div
          className="flex items-center justify-center flex-wrap gap-1.5 mt-3 min-h-[30px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25 text-amber-300 font-medium text-[11px] select-none shrink-0">
            <LightbulbIcon className="w-3 h-3 text-amber-400 stroke-current" />
            <span>{isEn ? "Suggestions:" : "Gợi ý:"}</span>
          </span>

          <div
            className={`inline-flex flex-wrap items-center justify-center gap-1.5 transition-all duration-300 ease-out ${
              isFading ? "opacity-0 -translate-y-1 scale-95" : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {currentSuggestions.map((item, idx) => {
              const text = isEn ? item.en : item.vi;
              return (
                <button
                  key={`${groupIndex}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSearchTerm(text);
                    if (onSearchSubmit) {
                      setTimeout(() => onSearchSubmit({ preventDefault: () => {} }, text), 10);
                    }
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all cursor-pointer"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
