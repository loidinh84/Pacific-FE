import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { Favorite, Favorited, Anchor } from "../../assets/Icons";
import { NoFound } from "../../assets/Images";

export function SearchGridList({ speciesList }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const itemsPerPage = 6;

  const totalPages = Math.ceil(speciesList.length / itemsPerPage) || 1;
  // Clamp currentPage so typing that reduces results never shows an empty grid
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const currentItems = speciesList.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setTimeout(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };


  return (
    <div id="search-results" className="max-w-6xl mx-auto px-4 mb-20 scroll-mt-4">
      <h2 className="text-xl md:text-2xl font-black text-white font-heading mb-6">
        {t("searchPage.mainCatalogTitle")}
      </h2>

      {currentItems.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-4">
          <img
            src={NoFound}
            alt="Không tìm thấy sinh vật"
            className="w-52 md:w-64 opacity-70 select-none"
            draggable={false}
          />
          <p className="text-slate-400 text-sm">
            {t("searchPage.noResults")}
          </p>
        </div>
      ) : (
        <>
          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {currentItems.map((s) => {
              const categoryName =
                language === "en" ? s.categoryEn : s.categoryVi;
              const statusName = language === "en" ? s.statusEn : s.statusVi;
              const name = language === "en" ? s.nameEn : s.nameVi;
              const desc = language === "en" ? s.descEn : s.descVi;
              const isFav = favorites.has(s.id);

              return (
                <div
                  key={s.id}
                  className="bg-[#0d1f35] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500/40 hover:bg-[#0f2540] transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/species/${s.id}`)}
                >
                  <div>
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/25 text-sky-300 text-[10px] font-semibold">
                        {categoryName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          s.statusType === "danger"
                            ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                            : s.statusType === "warning"
                              ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        {statusName}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="w-full h-36 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-white/[0.03]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(56,189,248,0.07)_0%,transparent_70%)]" />
                      <img
                        src={s.image}
                        alt={name}
                        className="w-full h-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] group-hover:scale-105 transition-transform duration-400 relative z-10"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="text-base font-bold text-white font-heading group-hover:text-sky-300 transition-colors mb-0.5 line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-[10px] text-slate-400 italic mb-2">
                      {s.sciName}
                    </p>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3">
                      {desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Anchor className="w-3.5 h-3.5 text-blue-400" /> {s.depth}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, s.id)}
                      className={`flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer ${
                        isFav
                          ? "text-rose-400"
                          : "text-slate-400 hover:text-rose-400"
                      }`}
                      title={isFav ? "Bỏ yêu thích" : "Yêu thích sinh vật"}
                    >
                      {isFav ? (
                        <Favorited className="w-5 h-5" />
                      ) : (
                        <Favorite className="w-5 h-5" />
                      )}
                      <span>
                        {t("searchPage.btnFavorite") ?? "Yêu thích sinh vật"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Trang đầu"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === p
                    ? "bg-sky-500 text-white shadow-sky-500/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Trang cuối"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
