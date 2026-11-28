import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { Favorite, Favorited, Anchor } from "../../assets/Icons";
import { NoFound, FishHidden } from "../../assets/Images";
import { getStoredToken } from "../../utils/auth";
import { toggleSpeciesFavorite } from "../../services/speciesApi";
import { fetchMyFavoriteIds } from "../../services/userService";
import { getLocalizedCategory, getLocalizedSpeciesName } from "../../utils/speciesFormatters";

export function SearchGridList({
  speciesList,
  semanticQuery,
  semanticMeta,
  imagePreview,
  onSuggestionClick,
  onClearSemantic,
  loading = false,
  loadingText,
  currentPage: controlledPage,
  onPageChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  const [internalPage, setInternalPage] = useState(1);
  const currentPage = controlledPage ?? internalPage;
  const [favorites, setFavorites] = useState(new Set());
  const itemsPerPage = 12;

  // Tải danh sách ID đã yêu thích nếu người dùng đã đăng nhập
  useEffect(() => {
    let isMounted = true;
    if (getStoredToken()) {
      fetchMyFavoriteIds()
        .then((res) => {
          if (!isMounted) return;
          if (res && res.success && Array.isArray(res.data)) {
            setFavorites(new Set(res.data.map(String)));
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(speciesList.length / itemsPerPage) || 1;
  // Clamp currentPage so typing that reduces results never shows an empty grid
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const currentItems = speciesList.slice(startIndex, startIndex + itemsPerPage);

  // Sinh dải số trang thông minh dạng rút gọn có dấu '...' tránh tràn layout
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (effectivePage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (effectivePage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", effectivePage - 1, effectivePage, effectivePage + 1, "...", totalPages];
  }, [effectivePage, totalPages]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      if (onPageChange) {
        onPageChange(p);
      } else {
        setInternalPage(p);
      }
      setTimeout(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const toggleFavorite = async (e, s) => {
    e.stopPropagation();
    if (!getStoredToken()) {
      navigate("/login");
      return;
    }

    const targetKey = String(s.id);
    const wasFav = favorites.has(targetKey);

    // Optimistic update
    setFavorites((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(targetKey);
      else next.add(targetKey);
      return next;
    });

    try {
      const res = await toggleSpeciesFavorite(s.slug || s.id);
      if (res && res.success) {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (res.isFavorited) next.add(targetKey);
          else next.delete(targetKey);
          return next;
        });
      }
    } catch {
      // Revert nếu lỗi
      setFavorites((prev) => {
        const next = new Set(prev);
        if (wasFav) next.add(targetKey);
        else next.delete(targetKey);
        return next;
      });
    }
  };


  return (
    <div id="search-results" className="max-w-6xl mx-auto px-4 mb-20 scroll-mt-4">
      {semanticQuery || imagePreview ? (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 pb-4 border-b border-[#0f172a]/10">
          <div className="flex items-start gap-3.5">
            {imagePreview && (
              <img
                src={imagePreview}
                alt={semanticQuery || "Hình ảnh tìm kiếm"}
                className="w-14 h-14 rounded-xl object-cover border border-[#0f172a]/12 shadow-xs shrink-0"
              />
            )}
            <div className="space-y-1.5">
              <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading">
                {imagePreview ? (
                  <>
                    {language === "en" ? "Photo match:" : "Kết quả từ hình ảnh:"}{" "}
                    {semanticQuery && !semanticMeta?.outOfDomain && (
                      <span className="text-[#0284c7] font-semibold">
                        {semanticQuery}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {language === "en" ? "Results for:" : "Kết quả cho:"}{" "}
                    <span className="text-[#0284c7] font-semibold">
                      "{semanticQuery}"
                    </span>
                  </>
                )}
                <span className="text-[#475569] text-sm font-normal ml-2 tabular-nums">
                  ({speciesList.length} {language === "en" ? "species" : "loài"})
                </span>
              </h2>
              {semanticMeta?.summary && !semanticMeta?.outOfDomain && (
                <p className="text-xs sm:text-sm text-[#475569] font-normal leading-relaxed max-w-3xl">
                  {semanticMeta.summary}
                </p>
              )}
            </div>
          </div>
          {onClearSemantic && (
            <button
              onClick={onClearSemantic}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-subtle hover:bg-white text-[#334155] hover:text-[#0f172a] text-xs font-medium transition-colors self-start cursor-pointer shrink-0"
            >
              {language === "en" ? "View all species" : "Xem tất cả loài"}
            </button>
          )}
        </div>
      ) : (
        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] font-heading mb-6">
          {t("searchPage.mainCatalogTitle")}
        </h2>
      )}

      {/* Khung tổng hợp giải đáp sinh học bám sát dữ liệu Biển Đông (RAG Answer) */}
      {!loading && semanticMeta?.ragAnswer && (
        <div className="liquid-glass-strong rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-[#0284c7]">
            <BookOpen size={16} className="shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-[#0f172a] font-heading">
              {semanticMeta.ragAnswer.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
            {semanticMeta.ragAnswer.answer}
          </p>
          {semanticMeta.ragAnswer.keyPoints?.length > 0 && (
            <ul className="space-y-1.5 pt-1">
              {semanticMeta.ragAnswer.keyPoints.map((pt, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-[#1e293b] leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-2 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}
          {semanticMeta.ragAnswer.citedSpecies?.length > 0 && (
            <div className="pt-2.5 border-t border-[#0f172a]/8 flex items-center flex-wrap gap-2">
              <span className="text-[11px] font-medium text-[#475569]">
                {language === "en" ? "Referenced species:" : "Sinh vật liên quan:"}
              </span>
              {semanticMeta.ragAnswer.citedSpecies.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() =>
                    navigate(`/species/${sp.slug || sp.id}`, {
                      state: { fromSearch: `${location.pathname}${location.search}` },
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#0f172a]/10 hover:border-[#0284c7]/40 text-xs font-medium text-[#0f172a] hover:text-[#0284c7] transition-colors cursor-pointer"
                >
                  {sp.commonName}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-[#334155]">
            {loadingText || "Đang tìm kiếm dữ liệu sinh thái Biển Đông..."}
          </p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center gap-4">
          <img
            src={NoFound}
            alt="Không tìm thấy sinh vật"
            className="w-52 md:w-64 opacity-80 select-none"
            draggable={false}
          />
          <p className="text-[#475569] text-sm max-w-md leading-relaxed">
            {semanticMeta?.message || t("searchPage.noResults")}
          </p>
          {semanticMeta?.suggestions?.length > 0 && onSuggestionClick && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mt-2">
              {semanticMeta.suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSuggestionClick(sug)}
                  className="px-3 py-1.5 rounded-full liquid-glass-subtle hover:bg-white text-xs text-[#334155] hover:text-[#0284c7] font-medium transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 2 Columns on mobile/tablet, 3 Columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 mb-10">
            {currentItems.map((s) => {
              const categoryName = getLocalizedCategory(s.categoryVi || s.categoryEn, language);
              const statusName = language === "en" ? s.statusEn : s.statusVi;
              const name = getLocalizedSpeciesName(s, language);
              const desc = language === "en" ? (s.descEn || s.descVi) : s.descVi;
              const isFav = favorites.has(String(s.id)) || (s.slug && favorites.has(String(s.slug)));

              return (
                <div
                  key={s.id}
                  className="liquid-glass liquid-glass-interactive rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between group cursor-pointer min-w-0"
                  onClick={() =>
                    navigate(`/species/${s.slug || s.id}`, {
                      state: { fromSearch: `${location.pathname}${location.search}` },
                    })
                  }
                >
                  <div className="min-w-0">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 min-w-0">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-900/6 border border-slate-900/12 text-[#1e293b] text-[10px] sm:text-[11px] font-medium truncate min-w-0">
                        {categoryName}
                      </span>
                      <span
                        className={`shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium ${
                          s.statusType === "danger"
                            ? "bg-rose-500/12 border border-rose-500/25 text-rose-700"
                            : s.statusType === "warning"
                              ? "bg-amber-500/12 border border-amber-500/25 text-amber-800"
                              : "bg-emerald-500/12 border border-emerald-500/25 text-emerald-700"
                        }`}
                      >
                        {statusName}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="w-full h-28 sm:h-40 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 relative overflow-hidden bg-gradient-to-br from-sky-100/55 via-white/55 to-cyan-100/45 border border-white/85">
                      <img
                        src={s.image || FishHidden}
                        alt={name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FishHidden;
                        }}
                        className={
                          typeof s.image === "string" &&
                          (s.image.startsWith("http") || s.image.endsWith(".jpg") || s.image.endsWith(".webp"))
                            ? "w-full h-full object-cover relative z-10"
                            : "w-full h-full object-contain p-2 sm:p-3 drop-shadow-[0_6px_12px_rgba(15,23,42,0.16)] relative z-10"
                        }
                      />
                    </div>

                    {/* Info */}
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <h3 className="text-[13px] sm:text-base font-bold text-[#0f172a] font-heading group-hover:text-[#0284c7] transition-colors line-clamp-1">
                        {name}
                      </h3>
                      {s.role && (
                        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-900/6 border border-slate-900/12 text-[#1e293b]">
                          {s.role}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#475569] italic mb-1.5 sm:mb-2 font-mono truncate">
                      {s.sciName}
                    </p>
                    {s.semanticReason ? (
                      <p className="text-[11px] sm:text-xs text-[#0f172a] bg-sky-500/10 border border-sky-500/20 rounded-md p-1.5 sm:p-2 mb-1.5 sm:mb-2 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {s.semanticReason}
                      </p>
                    ) : null}
                    <p className="text-[11px] sm:text-xs text-[#334155] leading-snug sm:leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                      {desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 sm:pt-3 border-t border-[#0f172a]/8 flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#475569] font-mono tabular-nums truncate">
                      <Anchor className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0284c7] shrink-0" /> {s.depth}
                    </span>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, s)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                        isFav
                          ? "text-rose-600"
                          : "text-[#475569] hover:text-rose-600"
                      }`}
                      title={isFav ? "Bỏ yêu thích" : "Yêu thích sinh vật"}
                      aria-label={isFav ? "Bỏ yêu thích" : "Yêu thích sinh vật"}
                    >
                      {isFav ? (
                        <Favorited className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Favorite className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {t("searchPage.btnFavorite") ?? "Yêu thích"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={effectivePage <= 1}
              className="p-2 rounded-xl liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang đầu"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              onClick={() => goToPage(effectivePage - 1)}
              disabled={effectivePage <= 1}
              className="p-2 rounded-xl liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft size={15} />
            </button>

            {paginationItems.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-[#475569] font-medium select-none"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                    effectivePage === p
                      ? "bg-[#0284c7] text-white shadow-sm"
                      : "liquid-glass-subtle text-[#334155] hover:bg-white hover:text-[#0f172a]"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(effectivePage + 1)}
              disabled={effectivePage >= totalPages}
              className="p-2 rounded-xl liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Trang sau"
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={effectivePage >= totalPages}
              className="p-2 rounded-xl liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
