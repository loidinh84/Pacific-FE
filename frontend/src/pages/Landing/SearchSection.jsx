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
      className="bg-transparent pt-10 pb-24 relative"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="liquid-glass-strong rounded-3xl p-8 md:p-12 relative"
          data-aos="fade-up"
          data-aos-duration="700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] leading-tight mb-2 font-heading">
                {t("search.title")}
              </h2>
              <p className="text-xs md:text-sm text-[#334155] mb-6 font-normal">
                {t("search.subtitle")}
              </p>

              <form className="flex flex-col gap-3.5" onSubmit={handleSearch}>
                {/* Input Text Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    className="w-full py-3.5 pl-11 pr-4 liquid-input rounded-xl text-sm placeholder:text-[#475569] font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[#475569] pointer-events-none"
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
                      className={`w-full py-3 px-4 liquid-input rounded-xl text-xs sm:text-sm font-medium cursor-pointer flex items-center justify-between gap-2 select-none ${
                        isCategoryOpen
                          ? "border-[#0284c7] ring-2 ring-sky-500/15"
                          : ""
                      }`}
                    >
                      <span className="truncate">{selectedCatLabel}</span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-[#475569] transition-transform duration-150 ${
                          isCategoryOpen ? "rotate-180 text-[#0284c7]" : ""
                        }`}
                      />
                    </button>

                    {isCategoryOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full z-50 liquid-glass-strong rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-52 overflow-y-auto p-1.5 custom-scrollbar-thin space-y-0.5">
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
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-sky-600/12 text-[#0284c7] font-semibold"
                                    : "text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5"
                                }`}
                              >
                                <span className="truncate">{label}</span>
                                {isSelected && (
                                  <Check size={14} className="text-[#0284c7] shrink-0" />
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
                      className={`w-full py-3 px-4 liquid-input rounded-xl text-xs sm:text-sm font-medium cursor-pointer flex items-center justify-between gap-2 select-none ${
                        isHabitatOpen
                          ? "border-[#0284c7] ring-2 ring-sky-500/15"
                          : ""
                      }`}
                    >
                      <span className="truncate">{selectedHabLabel}</span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-[#475569] transition-transform duration-150 ${
                          isHabitatOpen ? "rotate-180 text-[#0284c7]" : ""
                        }`}
                      />
                    </button>

                    {isHabitatOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-full z-50 liquid-glass-strong rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-52 overflow-y-auto p-1.5 custom-scrollbar-thin space-y-0.5">
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
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition-colors cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-sky-600/12 text-[#0284c7] font-semibold"
                                    : "text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5"
                                }`}
                              >
                                <span className="truncate">{label}</span>
                                {isSelected && (
                                  <Check size={14} className="text-[#0284c7] shrink-0" />
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sm transition-colors cursor-pointer mt-1"
                >
                  <Search size={16} />
                  <span>{t("search.btnSearch")}</span>
                </button>
              </form>

              {/* Trending Suggestions */}
              <div className="mt-5 pt-4 border-t border-[#0f172a]/8 flex items-center flex-wrap gap-2">
                <span className="text-xs text-[#475569] font-medium flex items-center gap-1">
                  <TrendingUp size={13} className="text-[#0284c7]" />
                  <span>{isEn ? "Quick search:" : "Gợi ý tìm nhanh:"}</span>
                </span>
                {TRENDING_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTagClick(tag.q)}
                    className="text-xs px-2.5 py-1 rounded-lg liquid-glass-subtle hover:bg-white text-[#0f172a] hover:text-[#0284c7] transition-colors cursor-pointer"
                  >
                    {isEn ? tag.labelEn : tag.labelVi}
                  </button>
                ))}
              </div>
            </div>

            {/* Mystery Fish Visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <img
                  src={Images.FishHidden}
                  alt={isEn ? "Mystery Marine Life" : "Bóng sinh vật biển bí ẩn"}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(11,37,69,0.16)] select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
