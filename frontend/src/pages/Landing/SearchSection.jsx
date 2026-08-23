import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { CATEGORIES_DATA, HABITATS_DATA } from "../../mocks/speciesMock";
import * as Images from "../../assets/Images";

export default function SearchSection() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [habitat, setHabitat] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/search");
  };

  return (
    <section
      id="search-section"
      className="bg-pacific-figma-dark pt-4 pb-16 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="bg-pacific-figma-card rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.06)_0%,transparent_50%)] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Content / Form */}
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-6 font-heading">
                {t("search.title")}
              </h2>

              <form className="flex flex-col gap-4" onSubmit={handleSearch}>
                {/* Input Text Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    className="w-full py-3 px-4 bg-white text-slate-800 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pacific-blue-bright transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    className="w-full py-3 px-4 bg-white text-slate-800 border border-transparent rounded-lg text-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-pacific-blue-bright transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.value} value={c.value}>
                        {language === "en" ? c.labelEn : c.labelVi}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                  />
                </div>

                {/* Habitat Dropdown */}
                <div className="relative">
                  <select
                    className="w-full py-3 px-4 bg-white text-slate-800 border border-transparent rounded-lg text-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-pacific-blue-bright transition-all"
                    value={habitat}
                    onChange={(e) => setHabitat(e.target.value)}
                  >
                    {HABITATS_DATA.map((h) => (
                      <option key={h.value} value={h.value}>
                        {language === "en" ? h.labelEn : h.labelVi}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                  />
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:translate-y-0.5"
                >
                  <Search size={14} />
                  {t("search.btnSearch")}
                </button>
              </form>
            </div>

            {/* Visual (5 Oceans Map Canvas) */}
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-60">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] animate-pulse-glow" />
                <img
                  src={Images.BanDo5DaiDuong}
                  alt="Pacific Ocean Map"
                  className="w-full h-full object-contain animate-float-slow filter drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
