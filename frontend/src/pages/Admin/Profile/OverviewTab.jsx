import { useLanguage } from "../../../hooks/useLanguage";

export default function OverviewTab({
  admin,
  stats,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const formatDate = (dateStr) => {
    if (!dateStr) return isEn ? "Not set" : "Chưa cập nhật";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isEn ? "en-US" : "vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const accountRows = [
    { label: isEn ? "Username" : "Tên đăng nhập", value: `@${admin?.username}`, isMono: true },
    { label: isEn ? "Email" : "Địa chỉ Email", value: admin?.email },
    { label: isEn ? "Full Name" : "Họ và tên", value: admin?.fullName || (isEn ? "Not set" : "Chưa cập nhật") },
    { label: isEn ? "Phone Number" : "Số điện thoại", value: admin?.phoneNumber || (isEn ? "Not set" : "Chưa cập nhật") },
    { label: isEn ? "Date of Birth" : "Ngày sinh", value: formatDate(admin?.dateOfBirth) },
    {
      label: isEn ? "Role" : "Vai trò",
      value: admin?.role === "super_admin" ? (isEn ? "Super Administrator" : "Quản trị viên cấp cao") : (isEn ? "Administrator" : "Quản trị viên"),
    },
    { label: isEn ? "Bio & Notes" : "Ghi chú & Tiểu sử", value: admin?.bio || (isEn ? "No bio provided" : "Chưa có ghi chú tiểu sử") },
  ];

  const securityRows = [
    {
      label: isEn ? "Active Session" : "Phiên đăng nhập",
      detail: isEn ? "JWT • Max session 7 days" : "JWT • Phiên tối đa 7 ngày",
      status: isEn ? "Active" : "Đang hoạt động",
      statusClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    },
    {
      label: isEn ? "Two-Factor Auth (2FA)" : "Xác thực 2 yếu tố",
      detail: "TOTP Authenticator",
      status: isEn ? "Disabled" : "Chưa bật",
      statusClass: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    },
    {
      label: isEn ? "Account Activity" : "Hoạt động tài khoản",
      detail: isEn
        ? `Active within last ${stats?.memberDays || 1} days`
        : `Có hoạt động trong ${stats?.memberDays || 1} ngày qua`,
      status: isEn ? "Active" : "Đang hoạt động",
      statusClass: "text-slate-300 bg-white/10 border-white/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
      {/* 1. Account Details Table (7 cols) */}
      <div
        className={`lg:col-span-7 rounded-2xl border p-6 space-y-5 ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="pb-3.5 border-b border-white/15">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Account & Personal Details" : "Thông tin cá nhân & Tài khoản"}
          </h3>
        </div>

        <div className="divide-y divide-white/10 text-sm">
          {accountRows.map((row, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-300 font-medium sm:w-1/3 shrink-0">{row.label}</span>
              <span className={`text-white font-medium ${row.isMono ? "font-mono text-cyan-300" : ""}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Security & Session Table (5 cols) */}
      <div
        className={`lg:col-span-5 rounded-2xl border p-6 space-y-5 ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="pb-3.5 border-b border-white/15">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Security & Active Session" : "Bảo mật & Phiên làm việc"}
          </h3>
        </div>

        <div className="divide-y divide-white/10 text-sm">
          {securityRows.map((sec, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-semibold text-white text-sm sm:text-base">{sec.label}</p>
                <p className="text-xs sm:text-sm text-cyan-200/70">{sec.detail}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${sec.statusClass}`}>
                {sec.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
