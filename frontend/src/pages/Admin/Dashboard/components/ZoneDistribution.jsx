import { Layers } from "lucide-react";

export default function ZoneDistribution({
  zones = [],
  isDark = true,
  isLoading = false,
}) {
  const total = zones.reduce((acc, curr) => acc + (curr.speciesCount || 0), 0);

  const zoneColors = [
    { bar: "bg-cyan-400", dot: "bg-cyan-400", text: "text-cyan-400" },
    { bar: "bg-blue-400", dot: "bg-blue-400", text: "text-blue-400" },
    { bar: "bg-indigo-400", dot: "bg-indigo-400", text: "text-indigo-400" },
    { bar: "bg-purple-400", dot: "bg-purple-400", text: "text-purple-400" },
    { bar: "bg-rose-400", dot: "bg-rose-400", text: "text-rose-400" },
  ];

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-blue-400" />
          <h3 className={`text-base font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
            Sinh vật theo tầng đại dương
          </h3>
        </div>
        <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {total} loài phân bố
        </span>
      </div>

      <div className="space-y-3.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-700/20 animate-pulse rounded-xl" />
          ))
        ) : !zones.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có thông tin phân bố tầng
          </div>
        ) : (
          zones.map((z, idx) => {
            const count = z.speciesCount || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = zoneColors[idx % zoneColors.length];
            const cleanName = z.name?.split("/")?.[0]?.trim() || z.name;
            const depthText =
              z.depthMin != null && z.depthMax != null
                ? `${z.depthMin} - ${z.depthMax}m`
                : z.depthMin != null
                ? `> ${z.depthMin}m`
                : "";

            return (
              <div key={z.id || idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                    <span
                      className={`font-semibold truncate ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                      title={z.name}
                    >
                      {cleanName}
                    </span>
                    {depthText && (
                      <span className="text-[10px] text-slate-400 shrink-0">
                        ({depthText})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold ${color.text}`}>{count} loài</span>
                    <span className="text-[11px] text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
