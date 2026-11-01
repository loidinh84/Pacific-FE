import { useState, useRef } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useClickOutside } from "../../hooks/useClickOutside";
import { getCategoryLabel } from "./newsUtils";

export function NewsFilterBar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  isLoading = false,
}) {
  const { t } = useLanguage();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  useClickOutside(sortDropdownRef, () => setIsSortOpen(false));

  const sortOptions = [
    { value: "newest", label: t("news.sortNewest") },
    { value: "popular", label: t("news.sortPopular") },
  ];

  const currentSortObj =
    sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-10 mt-2">
      <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        {/* Left: Category Pill Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 lg:pb-0 custom-scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              !selectedCategory
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {t("news.allCategories")}
          </button>

          {isLoading && categories.length === 0 ? (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-8 rounded-xl bg-white/5 animate-pulse border border-white/10"
                />
              ))}
            </div>
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span>{getCategoryLabel(t, cat.slug) || cat.name}</span>
                  {typeof cat.article_count === "number" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {cat.article_count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right: Custom Glassmorphic Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t border-white/10 lg:border-t-0">
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
            >
              <ArrowUpDown size={13} className="text-cyan-400" />
              <span>{currentSortObj.label}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isSortOpen ? "rotate-180 text-cyan-400" : "text-white/60"
                }`}
              />
            </button>

            {/* Glassmorphism Dropdown Menu matching Navbar & CustomSelect */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1b254b]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-white/40 border-b border-white/10 mb-1">
                  Sắp xếp bài viết
                </div>
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30"
                          : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className="text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
