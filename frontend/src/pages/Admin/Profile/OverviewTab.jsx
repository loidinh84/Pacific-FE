import { useState, useRef } from "react";
import { Edit3, Camera, Loader2, Check } from "lucide-react";
import { updateAdminAvatar } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function OverviewTab({
  admin,
  onAdminUpdated,
  onOpenEditModal,
  onOpenPasswordModal,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

  const getMonogram = () => {
    if (!admin?.fullName && !admin?.username) return "AD";
    const name = admin.fullName || admin.username;
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleAvatarClick = () => {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(isEn ? "Image size must be under 5MB" : "Kích thước ảnh không được vượt quá 5MB");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError(isEn ? "Please select a valid image file" : "Vui lòng chọn file hình ảnh hợp lệ");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    setIsUploadingAvatar(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Avatar = reader.result;
        try {
          const res = await updateAdminAvatar(base64Avatar);
          if (res.success) {
            const newAvatarUrl = res.avatarUrl || base64Avatar;
            if (onAdminUpdated) {
              onAdminUpdated({ avatar: newAvatarUrl });
            }

            try {
              const localUser = JSON.parse(localStorage.getItem("pacific_user") || "{}");
              localUser.avatar = newAvatarUrl;
              localUser.avatar_url = newAvatarUrl;
              localStorage.setItem("pacific_user", JSON.stringify(localUser));
              window.dispatchEvent(new Event("pacific_auth_change"));
            } catch (storageErr) {
              console.warn("Storage sync warning:", storageErr);
            }

            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2500);
          }
        } catch (err) {
          console.error("Lỗi cập nhật ảnh đại diện:", err);
          const msg = err.response?.data?.error || (isEn ? "Failed to update avatar" : "Không thể cập nhật ảnh đại diện");
          setUploadError(msg);
          setTimeout(() => setUploadError(""), 3500);
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Lỗi đọc file ảnh:", err);
      setIsUploadingAvatar(false);
      setUploadError(isEn ? "Failed to read image" : "Lỗi khi đọc file ảnh");
      setTimeout(() => setUploadError(""), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200 relative z-10">
      {/* Hidden File Input for Quick Avatar Change */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
      />

      {/* ─── LEFT COLUMN (4 cols on lg) ─── */}
      <div className="lg:col-span-4 space-y-6">
        {/* 1. Profile Summary Card */}
        <div
          className={`rounded-3xl border p-6 flex flex-col items-center text-center space-y-4 ${
            isDark
              ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          {/* Avatar Circle with Quick Change Hover Overlay */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-28 h-28 rounded-full bg-[#081228] border-2 border-white/25 p-1 flex items-center justify-center overflow-hidden shadow-inner relative transition-transform duration-200 group-hover:scale-105">
              {admin?.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.fullName || admin.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-3xl font-extrabold text-white">{getMonogram()}</span>
              )}

              {/* Hover Dark Overlay + Camera Icon */}
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
                {isUploadingAvatar ? (
                  <Loader2 size={24} className="animate-spin text-cyan-400" />
                ) : uploadSuccess ? (
                  <Check size={26} className="text-emerald-400" />
                ) : (
                  <>
                    <Camera size={22} className="text-cyan-300 mb-0.5" />
                    <span className="text-[10px] font-semibold tracking-tight text-white/90">
                      {isEn ? "Change" : "Đổi ảnh"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Camera Floating Pill Badge */}
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-sm border-2 border-[#0d1a38] transition-transform active:scale-90 cursor-pointer"
              title={isEn ? "Upload new avatar" : "Tải lên ảnh mới"}
            >
              <Camera size={13} />
            </button>
          </div>

          {/* Quick Upload Feedback Messages */}
          {uploadError && (
            <p className="text-xs text-rose-400 font-medium animate-in fade-in">{uploadError}</p>
          )}
          {uploadSuccess && (
            <p className="text-xs text-emerald-400 font-medium animate-in fade-in">
              {isEn ? "Avatar updated!" : "Đã cập nhật ảnh đại diện!"}
            </p>
          )}

          {/* Name & Role */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {admin?.fullName || admin?.username}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {admin?.role === "super_admin"
                ? (isEn ? "SUPER ADMIN" : "QUẢN TRỊ VIÊN CẤP CAO")
                : (isEn ? "ADMIN" : "QUẢN TRỊ VIÊN")}
            </p>
          </div>

          {/* Status Badge */}
          <div className="pt-1">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isEn ? "ACTIVE" : "ĐANG HOẠT ĐỘNG"}
            </span>
          </div>
        </div>

        {/* 2. Account Security Card */}
        <div
          className={`rounded-3xl border p-6 space-y-5 ${
            isDark
              ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="pb-3 border-b border-white/15">
            <h3 className="text-lg font-black text-white tracking-tight">
              {isEn ? "Account Security" : "Bảo mật tài khoản"}
            </h3>
          </div>

          <div className="space-y-3.5 text-sm">
            {/* Email Verification */}
            <div className="flex items-center justify-between py-1">
              <span className="text-white font-bold">
                {isEn ? "Email Verification" : "Xác thực Email"}
              </span>
              <span className="text-emerald-400 font-black text-xs uppercase flex items-center gap-1.5 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {isEn ? "Completed" : "HOÀN TẤT"}
              </span>
            </div>

            {/* Phone Verification */}
            <div className="flex items-center justify-between py-1">
              <span className="text-white font-bold">
                {isEn ? "Phone Verification" : "Xác thực Số Điện Thoại"}
              </span>
              {admin?.phoneNumber ? (
                <span className="text-emerald-400 font-black text-xs uppercase flex items-center gap-1.5 tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {isEn ? "Completed" : "HOÀN TẤT"}
                </span>
              ) : (
                <span className="text-slate-300 font-bold text-xs uppercase flex items-center gap-1.5 tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  {isEn ? "Not Updated" : "CHƯA CẬP NHẬT"}
                </span>
              )}
            </div>
          </div>

          {/* Change Password Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenPasswordModal}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-cyan-200 hover:text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 shadow-sm backdrop-blur-md active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              {isEn ? "Change Security Password" : "Đổi mật khẩu bảo mật"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN (8 cols on lg) ─── */}
      <div className="lg:col-span-8">
        <div
          className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${
            isDark
              ? "bg-[#0d1a38]/92 backdrop-blur-md border-white/20 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          {/* Card Header: Title + Edit Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isEn ? "Personal Profile" : "Hồ sơ cá nhân"}
            </h2>
            <button
              type="button"
              onClick={onOpenEditModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 size={15} />
              <span>{isEn ? "Edit" : "Chỉnh sửa"}</span>
            </button>
          </div>

          {/* 6 Grid Fields (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Field 1: Username */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Username" : "TÊN ĐĂNG NHẬP"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-mono font-bold shadow-inner">
                @{admin?.username}
              </div>
            </div>

            {/* Field 2: Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Full Name" : "HỌ VÀ TÊN"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold shadow-inner">
                {admin?.fullName || (isEn ? "Not set" : "Chưa cập nhật")}
              </div>
            </div>

            {/* Field 3: Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Phone Number" : "SỐ ĐIỆN THOẠI"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold shadow-inner">
                {admin?.phoneNumber || (isEn ? "Not set" : "Chưa cập nhật")}
              </div>
            </div>

            {/* Field 4: Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Email" : "EMAIL"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold shadow-inner">
                {admin?.email}
              </div>
            </div>

            {/* Field 5: Date of Birth */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Date of Birth" : "NGÀY SINH"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold shadow-inner">
                {formatDate(admin?.dateOfBirth)}
              </div>
            </div>

            {/* Field 6: Role / Status */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Role" : "VAI TRÒ"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold shadow-inner">
                {admin?.role === "super_admin"
                  ? (isEn ? "Super Administrator" : "Quản trị viên cấp cao")
                  : (isEn ? "Administrator" : "Quản trị viên")}
              </div>
            </div>
          </div>

          {/* Bio / Description note */}
          {admin?.bio && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black uppercase tracking-wider text-cyan-300">
                {isEn ? "Bio & Notes" : "TIỂU SỬ & GHI CHÚ"}
              </label>
              <div className="w-full px-4 py-3 bg-[#122147]/90 border border-white/25 rounded-xl text-sm sm:text-base text-white font-bold leading-relaxed shadow-inner">
                {admin.bio}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
