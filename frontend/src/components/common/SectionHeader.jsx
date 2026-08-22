export function SectionHeader({ badge, title, subtitle, className = "" }) {
  return (
    <div className={`text-center mb-16 ${className}`} data-aos="fade-up">
      {badge && (
        <span className="inline-block px-3 py-1 bg-pacific-blue-bright/20 border border-pacific-blue-bright/40 text-pacific-blue-light text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-black text-white font-heading">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-sm md:text-base text-pacific-blue-pale mt-3 max-w-xl mx-auto font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
