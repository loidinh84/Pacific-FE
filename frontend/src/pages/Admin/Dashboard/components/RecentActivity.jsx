import { Activity, Clock } from "lucide-react";

export default function RecentActivity({
  activities = [],
  isDark = true,
  isLoading = false,
}) {
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Vừa xong";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getActionBadge = (action = "") => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("thêm")) {
      return { text: "Thêm mới", color: isDark ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    if (act.includes("update") || act.includes("sửa") || act.includes("cập nhật")) {
      return { text: "Cập nhật", color: isDark ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" : "bg-cyan-50 text-cyan-700 border-cyan-200" };
    }
    if (act.includes("delete") || act.includes("xóa")) {
      return { text: "Đã xóa", color: isDark ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-rose-50 text-rose-700 border-rose-200" };
    }
    if (act.includes("login") || act.includes("đăng nhập")) {
      return { text: "Đăng nhập", color: isDark ? "bg-blue-500/15 text-blue-400 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200" };
    }
    return { text: action || "Hệ thống", color: isDark ? "bg-slate-500/15 text-slate-300 border-slate-500/30" : "bg-slate-100 text-slate-700 border-slate-200" };
  };

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-purple-400" />
          <h3 className={`text-base font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
            Hoạt động gần đây
          </h3>
        </div>
        <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Nhật ký hệ thống
        </span>
      </div>

      <div className="space-y-3.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-700/20 animate-pulse rounded-xl" />
          ))
        ) : !activities.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có ghi nhận hoạt động nào gần đây
          </div>
        ) : (
          activities.map((item, idx) => {
            const badge = getActionBadge(item.action);
            return (
              <div
                key={item.id || idx}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700/40 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center font-bold text-xs text-white mt-0.5">
                    {item.user?.avatarUrl ? (
                      <img
                        src={item.user.avatarUrl}
                        alt={item.user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{(item.user?.username || "A")[0]?.toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      <span className="font-bold text-cyan-400">
                        {item.user?.username || "Quản trị viên"}
                      </span>{" "}
                      {item.description || item.action}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <Clock size={11} />
                      <span>{formatTimeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border shrink-0 ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
