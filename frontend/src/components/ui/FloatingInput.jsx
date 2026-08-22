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
            className="absolute left-4 text-pacific-blue-light z-10 pointer-events-none"
          />
        )}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full pl-11 pr-11 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all font-medium"
        />
        <label
          htmlFor={id}
          className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:left-4 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-pacific-blue-pale peer-focus:bg-[#202c59] peer-focus:rounded-full peer-focus:border peer-focus:border-white/15 peer-focus:px-2.5 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-pacific-blue-pale peer-[:not(:placeholder-shown)]:bg-[#202c59] peer-[:not(:placeholder-shown)]:rounded-full peer-[:not(:placeholder-shown)]:border peer-[:not(:placeholder-shown)]:border-white/15 peer-[:not(:placeholder-shown)]:px-2.5"
        >
          {label}
        </label>
        {endElement}
      </div>
    </div>
  );
}
