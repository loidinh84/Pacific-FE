export function FloatingInput({
  id,
  type = "text",
  label,
  value,
  onChange,
  required = false,
  icon: Icon,
  endElement,
}) {
  return (
    <div className="relative">
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 text-[#0284c7] z-10 pointer-events-none"
          />
        )}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full pl-11 pr-11 py-2.5 liquid-input rounded-xl text-sm font-medium"
        />
        <label
          htmlFor={id}
          className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-[#475569] pointer-events-none transition-all duration-150 peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:left-3.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[#0284c7] peer-focus:bg-white peer-focus:rounded-full peer-focus:border peer-focus:border-sky-600/20 peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:left-3.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-[#334155] peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:rounded-full peer-[:not(:placeholder-shown)]:border peer-[:not(:placeholder-shown)]:border-[#0f172a]/10 peer-[:not(:placeholder-shown)]:px-2"
        >
          {label}
        </label>
        {endElement}
      </div>
    </div>
  );
}
