import { Link } from "react-router-dom";
import { useLanguage } from "../../../hooks/useLanguage";

export default function AdminStats({ stats, onSelectActivityTab, isDark = true }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const metrics = [
    {
      label: isEn ? "System Users" : "Người dùng hệ thống",
      value: stats?.usersManaged ?? 0,
      unit: isEn ? "accounts" : "tài khoản",
      actionText: isEn ? "View users" : "Xem danh sách",
      actionLink: "/admin/users",
    },
    {
      label: isEn ? "Marine Species" : "Sinh vật quản lý",
      value: stats?.speciesManaged ?? 0,
      unit: isEn ? "species" : "loài",
      actionText: isEn ? "+ Add species" : "+ Thêm mới",
      actionLink: "/admin/species",
      isWarning: stats?.speciesManaged === 0,
    },
    {
      label: isEn ? "Classification Groups" : "Nhóm phân loại",
      value: stats?.groupsManaged ?? 0,
      unit: isEn ? "groups" : "nhóm",
      actionText: isEn ? "Manage groups" : "Quản lý nhóm",
      actionLink: "/admin/groups",
    },
    {
      label: isEn ? "Admin Activity" : "Thao tác quản trị",
      value: stats?.activityCount ?? 0,
      unit: isEn ? "actions" : "thao tác",
      subtext: isEn ? `in last ${stats?.memberDays || 1} days` : `trong ${stats?.memberDays || 1} ngày qua`,
      actionText: isEn ? "View logs" : "Xem nhật ký",
      onClick: onSelectActivityTab,
    },
  ];

  return (
    <div
      className={`rounded-2xl border grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 ${
        isDark
          ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
          : "bg-white border-slate-200 text-slate-900 divide-slate-200 shadow-sm"
      }`}
    >
      {metrics.map((m, idx) => (
        <div key={idx} className="p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-300">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${m.isWarning ? "text-amber-400" : "text-white"}`}>
                {m.value.toLocaleString(isEn ? "en-US" : "vi-VN")}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">{m.unit}</span>
            </div>
            {m.subtext && (
              <p className="text-xs text-slate-400 mt-1">{m.subtext}</p>
            )}
          </div>

          <div className="pt-3">
            {m.actionLink ? (
              <Link
                to={m.actionLink}
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-block"
              >
                {m.actionText}
              </Link>
            ) : (
              <button
                type="button"
                onClick={m.onClick}
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer inline-block"
              >
                {m.actionText}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
