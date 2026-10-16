import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  isDark = true,
  direction = "down",
  align = "left",
  className = "",
  buttonClassName = "",
  size = "md",
  placeholder = "Chọn...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) || options[0];

  const positionClasses =
    direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5";
  const alignClasses = align === "right" ? "right-0 left-auto" : "left-0";
  const pyCls = size === "sm" ? "py-2 px-3 text-xs" : "py-2.5 px-3.5 text-sm";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full ${pyCls} rounded-xl font-medium flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${
          isDark
            ? "bg-[#0d1730] border border-white/15 text-white hover:border-cyan-400/50"
            : "bg-slate-50 border border-slate-200 text-slate-900 hover:border-cyan-500/50"
        } ${
          open
            ? isDark
              ? "border-cyan-400 ring-2 ring-cyan-400/20"
              : "border-cyan-500 ring-2 ring-cyan-500/20"
            : ""
        } ${buttonClassName}`}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          size={size === "sm" ? 14 : 16}
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-cyan-400" : "text-slate-400"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute ${positionClasses} ${alignClasses} z-50 min-w-full w-max max-h-60 overflow-y-auto rounded-xl border p-1 shadow-md ${
            isDark
              ? "bg-[#101b38] border-white/15 text-white"
              : "bg-white border-slate-200 text-slate-900"
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
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left cursor-pointer transition-colors ${
                  isSelected
                    ? isDark
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "bg-cyan-50 text-cyan-700 font-bold"
                    : isDark
                    ? "hover:bg-white/5 text-slate-300 hover:text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check
                    size={14}
                    className={`shrink-0 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
