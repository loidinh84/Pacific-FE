import { Lightbulb } from "lucide-react";

export function SpeciesFacts({ species, language }) {
  const facts = language === "en"
    ? (species.bioFactsEn ?? [])
    : (species.bioFactsVi ?? []);

  if (facts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-14">
      {/* Section title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25">
          <Lightbulb size={18} className="text-amber-400" />
        </div>
        <h2 className="text-xl font-black text-white font-heading">
          Điều thú vị có thể bạn chưa biết
        </h2>
      </div>

      {/* Facts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="flex gap-4 p-5 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/7 hover:border-white/12 transition-all"
          >
            {/* Number badge */}
            <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 text-xs font-black">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
