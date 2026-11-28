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
    <div className="max-w-6xl mx-auto px-4 mb-10 mt-2 relative z-30">
      <div className="p-4 md:p-5 rounded-2xl liquid-glass border border-[#0f172a]/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 shadow-lg">
        {/* Left: Category Pill Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 lg:pb-0 custom-scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              !selectedCategory
                ? "bg-sky-600 text-white shadow-sm"
                : "liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white border border-[#0f172a]/10"
            }`}
          >
            {t("news.allCategories")}
          </button>

          {isLoading && categories.length === 0 ? (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-8 rounded-xl liquid-glass-subtle animate-pulse border border-[#0f172a]/10"
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-sm"
                      : "liquid-glass-subtle text-[#334155] hover:text-[#0f172a] hover:bg-white border border-[#0f172a]/10"
                  }`}
                >
                  <span>{getCategoryLabel(t, cat.slug) || cat.name}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Custom Glassmorphic Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t border-[#0f172a]/10 lg:border-t-0">
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-[#0f172a] liquid-glass-subtle hover:bg-white border border-[#0f172a]/10 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowUpDown size={13} className="text-[#0284c7]" />
              <span>{currentSortObj.label}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isSortOpen ? "rotate-180 text-[#0284c7]" : "text-[#334155]"
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-48 liquid-glass-strong border border-[#0f172a]/10 rounded-2xl shadow-lg p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#475569] border-b border-[#0f172a]/10 mb-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-sky-600/10 text-[#0284c7] border border-sky-600/25"
                          : "text-[#0f172a] hover:bg-[#0f172a]/5 border border-transparent"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className="text-[#0284c7]" />}
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
