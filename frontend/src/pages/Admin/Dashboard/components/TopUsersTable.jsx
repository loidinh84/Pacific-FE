import { UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopUsersTable({
  users = [],
  isDark = true,
  isLoading = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between ${
        isDark ? "bg-[#162040] border-white/10" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-emerald-400" />
          <h3 className={`text-base font-bold font-heading ${isDark ? "text-white" : "text-slate-900"}`}>
            Top người dùng tích cực
          </h3>
        </div>
        <Link
          to="/admin/users"
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
        ) : !users.length ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có dữ liệu hoạt động của người dùng
          </div>
        ) : (
          users.map((u, idx) => (
            <div
              key={u.id || idx}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    idx === 0
                      ? "bg-amber-400/20 text-amber-400"
                      : idx === 1
                      ? "bg-slate-300/20 text-slate-300"
                      : idx === 2
                      ? "bg-amber-700/20 text-amber-600"
                      : isDark
                      ? "bg-white/5 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="w-9 h-9 rounded-full bg-slate-700/40 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                  {u.avatarUrl ? (
                    <img
                      src={u.avatarUrl}
                      alt={u.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{(u.fullName || u.username || "U")[0]?.toUpperCase()}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={`font-bold truncate ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {u.fullName || u.username}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {u.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      : "bg-cyan-50 text-cyan-700 border-cyan-200"
                  }`}
                  title="Lượt xem sinh vật"
                >
                  {(u.viewCount || 0).toLocaleString("vi-VN")} views
                </span>

                {u.commentCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${
                      isDark
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                    title="Số bình luận"
                  >
                    {u.commentCount} cmt
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
