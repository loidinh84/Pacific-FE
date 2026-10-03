import { Fish, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopSpeciesTable({
  species = [],
  isDark = true,
  isLoading = false,
}) {
  const maxViews = species.length ? Math.max(...species.map((s) => s.viewCount || 1)) : 1;

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-amber-400" />
          <h3 className={`text-base font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
            Top 5 sinh vật xem nhiều
          </h3>
        </div>
        <Link
          to="/admin/species"
          className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-3.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-700/20 animate-pulse rounded-xl" />
          ))
        ) : !species.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có sinh vật nào được ghi nhận lượt xem
          </div>
        ) : (
          species.map((sp, idx) => {
            const percentage = Math.round(((sp.viewCount || 0) / maxViews) * 100);
            return (
              <div
                key={sp.id || idx}
                className="group flex items-center gap-3 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0
                      ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                      : idx === 1
                      ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                      : idx === 2
                      ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                      : isDark
                      ? "bg-white/5 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10 flex items-center justify-center">
                  {sp.imageUrl ? (
                    <img
                      src={sp.imageUrl}
                      alt={sp.commonName || sp.scientificName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <Fish size={18} className="text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                      title={sp.commonName || sp.scientificName}
                    >
                      {sp.commonName || sp.scientificName}
                    </span>
                    <span
                      className={`text-xs font-bold shrink-0 ${
                        isDark ? "text-cyan-400" : "text-cyan-600"
                      }`}
                    >
                      {(sp.viewCount || 0).toLocaleString("vi-VN")} lượt
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-700/30">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {sp.oceanZoneName && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {sp.oceanZoneName.split("/")[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
