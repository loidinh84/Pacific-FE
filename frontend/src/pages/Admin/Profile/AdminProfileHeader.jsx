import { Edit3 } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

export default function AdminProfileHeader({
  admin,
  onOpenEditModal,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const formatDateTime = (dateStr) => {
    if (!dateStr) return isEn ? "No information" : "Chưa có thông tin";
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleTimeString(isEn ? "en-US" : "vi-VN", { hour: "2-digit", minute: "2-digit" })} ${d.toLocaleDateString(isEn ? "en-US" : "vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
    } catch {
      return dateStr;
    }
  };

  const getMonogram = () => {
    if (!admin?.fullName && !admin?.username) return "AD";
    const name = admin.fullName || admin.username;
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-3.5">
      {/* Sleek Enterprise Identity Bar */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          isDark
            ? "bg-[#0b1739]/90 backdrop-blur-md border-white/20 text-white shadow-sm"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Avatar / Monogram */}
          <div className="w-14 h-14 rounded-2xl bg-[#0e1732] border border-white/15 flex items-center justify-center overflow-hidden text-white font-bold text-lg shrink-0">
            {admin?.avatar ? (
              <img
                src={admin.avatar}
                alt={admin.fullName || admin.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getMonogram()}</span>
            )}
          </div>

          {/* Identity info */}
          <div className="space-y-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              {admin?.fullName || admin?.username}
            </h1>
            <p className="text-sm text-cyan-200/70">
              {admin?.email} • {isEn ? "Last login:" : "Đăng nhập cuối:"}{" "}
              <span className="text-white font-medium">{formatDateTime(admin?.lastLogin)}</span>
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onOpenEditModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0 self-end sm:self-auto"
        >
          <Edit3 size={15} />
          <span>{isEn ? "Edit Profile" : "Chỉnh sửa hồ sơ"}</span>
        </button>
      </div>
    </div>
  );
}
