import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  isDark,
  placeholder = "Chọn...",
  className = "",
  size = "md",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border font-medium transition-all cursor-pointer text-left select-none ${
          size === "sm" ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-xs sm:text-sm"
        } ${
          isDark
            ? "bg-[#112d4e] border-white/15 text-white hover:border-cyan-400/50"
            : "bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-500"
        } ${
          isOpen
            ? isDark
              ? "border-cyan-400 ring-2 ring-cyan-400/20"
              : "border-sky-500 ring-2 ring-sky-500/20"
            : ""
        }`}
      >
        <span className="truncate flex items-center gap-1.5">
          {selectedOption?.icon && <selectedOption.icon size={13} className="shrink-0 text-amber-400" />}
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 text-slate-400 ${
            isOpen ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border shadow-xl max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-[#112d4e] border-white/15 text-white"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-sky-500/20 text-sky-300 font-semibold"
                      : "bg-sky-50 text-sky-700 font-semibold"
                    : isDark
                    ? "hover:bg-white/5 text-slate-200"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  {opt.icon && <opt.icon size={13} className="shrink-0 text-amber-400" />}
                  <span>{opt.label}</span>
                </span>
                {isSelected && <Check size={14} className="text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

