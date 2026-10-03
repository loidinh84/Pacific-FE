import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { UserPlus } from "lucide-react";

function CustomBarTooltip({ active, payload, label, isDark }) {
  if (active && payload && payload.length) {
    return (
      <div
        className={`px-3 py-2 rounded-xl border shadow-sm text-xs ${
          isDark
            ? "bg-[#0d1730] border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <p className="font-semibold text-slate-400 mb-1">
          Ngày: {payload[0]?.payload?.date || label}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-emerald-400">
            {payload[0].value.toLocaleString("vi-VN")} người dùng mới
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function BarChartNew({
  data = [],
  isDark = true,
  isLoading = false,
  days = 7,
}) {
  const total = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-400" />
            <h3 className={`text-base font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
              Người dùng mới ({days} ngày qua)
            </h3>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tốc độ tăng trưởng tài khoản tham gia hệ thống
          </p>
        </div>
        <div className="text-right">
          <span className={`text-xl font-extrabold font-heading ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            {total.toLocaleString("vi-VN")}
          </span>
          <span className={`block text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Tài khoản mới
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-48 w-full bg-slate-700/20 animate-pulse rounded-xl" />
          </div>
        ) : !data.length ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
            Chưa có tài khoản mới trong khoảng thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
              />
              <Tooltip content={(props) => <CustomBarTooltip {...props} isDark={isDark} />} />
              <Bar
                dataKey="count"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
