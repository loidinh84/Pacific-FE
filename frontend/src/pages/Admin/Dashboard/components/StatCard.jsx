import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "so với tuần trước",
  subtext,
  badge,
  badgeColor = "neutral", // "neutral" | "warning" | "danger" | "success"
  iconColor = "cyan",
  isDark = true,
  isLoading = false,
}) {
  const colorMap = {
    cyan: {
      bg: isDark ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
    blue: {
      bg: isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200",
    },
    emerald: {
      bg: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    amber: {
      bg: isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-200",
    },
    rose: {
      bg: isDark ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-200",
    },
    purple: {
      bg: isDark ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-600 border-purple-200",
    },
    indigo: {
      bg: isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  };

  const currentTheme = colorMap[iconColor] || colorMap.cyan;

  const badgeStyles = {
    neutral: isDark ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700",
    warning: isDark ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-700 border-amber-200",
    danger: isDark ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-200",
    success: isDark ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        isDark ? "bg-[#162040] border-white/10 hover:border-white/20" : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-700/30 animate-pulse rounded-md" />
            ) : (
              <span className={`text-2xl sm:text-3xl font-extrabold font-heading tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {typeof value === "number" ? value.toLocaleString("vi-VN") : value ?? 0}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border shrink-0 ${currentTheme.bg}`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      {(trend !== undefined || subtext || badge) && (
        <div className="mt-3.5 pt-3 border-t flex flex-wrap items-center justify-between gap-2 border-slate-200/60 dark:border-white/5">
          {trend !== undefined ? (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {trend > 0 ? (
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <TrendingUp size={14} />
                  +{trend}%
                </span>
              ) : trend < 0 ? (
                <span className="flex items-center gap-0.5 text-rose-400 font-semibold">
                  <TrendingDown size={14} />
                  {trend}%
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-slate-400 font-medium">
                  <Minus size={14} />
                  0%
                </span>
              )}
              <span className={isDark ? "text-slate-400 text-[11px]" : "text-slate-500 text-[11px]"}>
                {trendLabel}
              </span>
            </div>
          ) : subtext ? (
            <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {subtext}
            </span>
          ) : <div />}

          {badge && (
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyles[badgeColor] || badgeStyles.neutral}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
