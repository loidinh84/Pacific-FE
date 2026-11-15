import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { LightbulbIcon } from "../../assets/Icons";

const SUGGESTION_GROUPS = [
  [
    { vi: "Thiên địch của sao biển gai", en: "Crown-of-thorns starfish predator" },
    { vi: "Cộng sinh với hải quỳ", en: "Symbiosis with sea anemones" },
    { vi: "Cực kỳ nguy cấp ở Côn Đảo", en: "Critically endangered at Con Dao" },
    { vi: "Loài ăn cỏ biển Biển Đông", en: "East Sea seagrass grazers" },
    { vi: "Sinh vật tạo nơi cư trú", en: "Habitat-forming species" },
  ],
  [
    { vi: "Sinh vật biển sâu phát quang", en: "Bioluminescent deep-sea life" },
    { vi: "Loài săn mồi đỉnh bảng", en: "Apex ocean predators" },
    { vi: "Rạn san hô Hoàng Sa", en: "Paracel coral reefs" },
    { vi: "Bò biển Dugong Phú Quốc", en: "Phu Quoc Dugong" },
    { vi: "Rùa biển đẻ trứng", en: "Nesting sea turtles" },
  ],
  [
    { vi: "Bạch tuộc đốm xanh có độc", en: "Venomous blue-ringed octopus" },
    { vi: "Ngụy trang đáy biển", en: "Seafloor camouflage masters" },
    { vi: "Động vật có vú biển Đông", en: "East Sea marine mammals" },
    { vi: "Cá mập voi khổng lồ", en: "Giant whale sharks" },
    { vi: "Hệ sinh thái thảm cỏ biển", en: "Seagrass bed ecosystem" },
  ],
  [
    { vi: "Loài nguy cấp trong Sách Đỏ", en: "Red List endangered species" },
    { vi: "Cá hề và hải quỳ", en: "Clownfish and sea anemones" },
    { vi: "Khu bảo tồn biển Cù Lao Chàm", en: "Cu Lao Cham marine reserve" },
    { vi: "Sinh vật tầng đáy Hadal", en: "Hadal zone organisms" },
    { vi: "Loài di cư xa ngoài khơi", en: "Pelagic migratory species" },
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
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-24 pb-10 px-4">
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

        {/* Automatic rotating suggestion chips (TikTok / Shopee style) */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mt-4 min-h-[34px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="text-amber-300 font-semibold flex items-center gap-1.5 mr-1 text-xs md:text-sm select-none">
            <LightbulbIcon className="w-4 h-4 text-amber-400 stroke-current" />
            <span>{isEn ? "Suggestions:" : "Gợi ý:"}</span>
          </span>

          <div
            className={`inline-flex flex-wrap items-center justify-center gap-2 transition-all duration-300 ease-out ${
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
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all cursor-pointer"
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
