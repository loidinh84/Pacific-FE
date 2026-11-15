import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Search, TrendingUp } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useClickOutside } from "../../hooks/useClickOutside";
import { CATEGORIES_DATA, HABITATS_DATA } from "../../mocks/speciesMock";
import { getLocalizedCategory } from "../../utils/speciesFormatters";
import { fetchSpeciesGroups } from "../../services/speciesApi";
import * as Images from "../../assets/Images";

const TRENDING_TAGS = [
  { labelVi: "Cá mập trắng", labelEn: "Great White Shark", q: "Cá mập trắng" },
  { labelVi: "Đồi mồi", labelEn: "Hawksbill Turtle", q: "Đồi mồi" },
  { labelVi: "Bò biển Dugong", labelEn: "Dugong", q: "Bò biển" },
  { labelVi: "San hô cành", labelEn: "Acropora Coral", q: "San hô" },
  { labelVi: "Bạch tuộc", labelEn: "Octopus", q: "Bạch tuộc" },
];

export default function SearchSection() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [habitat, setHabitat] = useState("");
  const [categories, setCategories] = useState(CATEGORIES_DATA);

  // Custom Dropdown States & Refs
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isHabitatOpen, setIsHabitatOpen] = useState(false);
  const categoryRef = useRef(null);
  const habitatRef = useRef(null);

  useClickOutside(categoryRef, () => setIsCategoryOpen(false));
  useClickOutside(habitatRef, () => setIsHabitatOpen(false));

  useEffect(() => {
    let isMounted = true;
    fetchSpeciesGroups()
      .then((res) => {
        if (!isMounted) return;
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const apiCats = [
            {
              value: "",
              labelVi: "Tất cả nhóm sinh vật",
              labelEn: "All Species Groups",
            },
            ...res.data.map((g) => {
              const matchedMock = CATEGORIES_DATA.find(
                (c) => c.value === g.slug || c.value === g.id
              );
              return {
                value: g.slug || g.id,
                labelVi: g.name,
                labelEn: matchedMock?.labelEn || getLocalizedCategory(g.name, "en"),
              };
            }),
          ];
          setCategories(apiCats);
        }
      })
      .catch(() => {
        // Giữ fallback CATEGORIES_DATA
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (category) params.set("cat", category);
    if (habitat) params.set("hab", habitat);
    navigate(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagClick = (q) => {
    setSearchTerm(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const selectedCatObj =
    categories.find((c) => String(c.value) === String(category)) || categories[0];
  const selectedCatLabel = isEn ? selectedCatObj?.labelEn : selectedCatObj?.labelVi;

  const selectedHabObj =
    HABITATS_DATA.find((h) => String(h.value) === String(habitat)) || HABITATS_DATA[0];
  const selectedHabLabel = isEn ? selectedHabObj?.labelEn : selectedHabObj?.labelVi;

  return (
    <section
      id="search-section"
      className="bg-pacific-figma-dark/95 backdrop-blur-md pt-8 pb-20 relative overflow-hidden border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          {/* Subtle Radial Glow in background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1)_0%,transparent_60%)]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 font-heading">
                {t("search.title")}
              </h2>
              <p className="text-xs md:text-sm text-slate-300/80 mb-6 font-normal">
                {t("search.subtitle")}
              </p>

              <form className="flex flex-col gap-3.5" onSubmit={handleSearch}>
                {/* Input Text Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    className="w-full py-3.5 pl-11 pr-4 bg-slate-900/70 text-white placeholder-slate-400 border border-white/15 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                {/* Dropdowns Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
                  {/* Category Custom Dropdown */}
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(!isCategoryOpen);
                        setIsHabitatOpen(false);
                      }}
                      className={`w-full py-3 px-4 bg-slate-900/80 hover:bg-slate-900 text-white border rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                        isCategoryOpen
                          ? "border-cyan-400 ring-1 ring-cyan-400/30"
                          : "border-white/15 hover:border-cyan-400/40"
                      }`}
                    >
                      <span className="truncate">{selectedCatLabel}</span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                          isCategoryOpen ? "rotate-180 text-cyan-400" : ""
                        }`}
                      />
                    </button>

                    {isCategoryOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full z-50 bg-[#0d1b34]/98 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar-thin space-y-0.5">
                          {categories.map((c) => {
                            const isSelected = String(c.value) === String(category);
                            const label = isEn ? c.labelEn : c.labelVi;
                            return (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => {
                                  setCategory(c.value);
                                  setIsCategoryOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/25"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <span className="truncate">{label}</span>
                                {isSelected && (
                                  <Check size={14} className="text-cyan-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Habitat Custom Dropdown */}
                  <div className="relative" ref={habitatRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsHabitatOpen(!isHabitatOpen);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full py-3 px-4 bg-slate-900/80 hover:bg-slate-900 text-white border rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                        isHabitatOpen
                          ? "border-cyan-400 ring-1 ring-cyan-400/30"
                          : "border-white/15 hover:border-cyan-400/40"
                      }`}
                    >
                      <span className="truncate">{selectedHabLabel}</span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                          isHabitatOpen ? "rotate-180 text-cyan-400" : ""
                        }`}
                      />
                    </button>

                    {isHabitatOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full z-50 bg-[#0d1b34]/98 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar-thin space-y-0.5">
                          {HABITATS_DATA.map((h) => {
                            const isSelected = String(h.value) === String(habitat);
                            const label = isEn ? h.labelEn : h.labelVi;
                            return (
                              <button
                                key={h.value}
                                type="button"
                                onClick={() => {
                                  setHabitat(h.value);
                                  setIsHabitatOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/25"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <span className="truncate">{label}</span>
                                {isSelected && (
                                  <Check size={14} className="text-cyan-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold bg-pacific-teal hover:bg-pacific-teal-light text-white border border-cyan-400/20 shadow-md shadow-black/20 hover:shadow-cyan-950/40 transition-all cursor-pointer active:translate-y-0.5 mt-1"
                >
                  <Search size={16} />
                  <span>{t("search.btnSearch")}</span>
                </button>
              </form>

              {/* Trending Suggestions */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center flex-wrap gap-2">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <TrendingUp size={13} className="text-cyan-400" />
                  <span>{isEn ? "Trending:" : "Gợi ý tìm nhanh:"}</span>
                </span>
                {TRENDING_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTagClick(tag.q)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/30 text-cyan-200 transition-colors cursor-pointer"
                  >
                    {isEn ? tag.labelEn : tag.labelVi}
                  </button>
                ))}
              </div>
            </div>

            {/* Mystery Fish Visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <div className="absolute inset-4 rounded-full bg-cyan-500/15 blur-3xl animate-pulse-glow pointer-events-none" />
                <img
                  src={Images.FishHidden}
                  alt={isEn ? "Mystery Marine Life" : "Bóng sinh vật biển bí ẩn"}
                  className="w-full h-full object-contain animate-float-slow filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
