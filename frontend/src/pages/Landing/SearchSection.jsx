import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, TrendingUp } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
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
    navigate(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagClick = (q) => {
    setSearchTerm(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section
      id="search-section"
      className="bg-pacific-figma-dark/95 backdrop-blur-md pt-8 pb-20 relative overflow-hidden border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.1)_0%,transparent_60%)] pointer-events-none" />

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
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Dropdowns Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <select
                      className="w-full py-3 px-4 bg-slate-900/80 text-white border border-white/15 rounded-xl text-xs sm:text-sm cursor-pointer appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                          {isEn ? c.labelEn : c.labelVi}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                    />
                  </div>

                  {/* Habitat Dropdown */}
                  <div className="relative">
                    <select
                      className="w-full py-3 px-4 bg-slate-900/80 text-white border border-white/15 rounded-xl text-xs sm:text-sm cursor-pointer appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      value={habitat}
                      onChange={(e) => setHabitat(e.target.value)}
                    >
                      {HABITATS_DATA.map((h) => (
                        <option key={h.value} value={h.value} className="bg-slate-900 text-white">
                          {isEn ? h.labelEn : h.labelVi}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                    />
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

            {/* Ocean Map Visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl animate-pulse-glow" />
                <img
                  src={Images.BanDo5DaiDuong}
                  alt="Ocean Map"
                  className="w-full h-full object-contain animate-float-slow filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
