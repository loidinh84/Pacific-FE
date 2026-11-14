import { useState } from "react";
import { User, Mail, Lock, Edit3, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { changeEmail, changePassword } from "../../services/userService";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeMessage } from "../../utils/errorTranslator";

export default function GeneralTab({ user, onOpenEditModal, onProfileUpdated }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";
  // State for Email Change Card
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // State for Password Change Card
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Handler for Email Change
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmail || !emailCurrentPassword) {
      setEmailError(
        isEn
          ? "Please enter both your new email and current password"
          : "Vui lòng nhập đầy đủ Email mới và Mật khẩu hiện tại"
      );
      return;
    }

    setIsEmailLoading(true);
    try {
      const res = await changeEmail({ newEmail, currentPassword: emailCurrentPassword });
      setEmailSuccess(
        localizeMessage(
          res.message,
          language,
          isEn ? "Email updated successfully!" : "Thay đổi email thành công!"
        )
      );
      setNewEmail("");
      setEmailCurrentPassword("");

      // Update stored user
      if (onProfileUpdated && user) {
        onProfileUpdated({ ...user, email: res.email || newEmail });
      }
    } catch (err) {
      const msg = localizeMessage(
        err,
        language,
        isEn ? "Failed to change email!" : "Đổi email thất bại!"
      );
      setEmailError(msg);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Handler for Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError(
        isEn
          ? "Please fill in all password fields"
          : "Vui lòng điền đầy đủ các trường mật khẩu"
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        isEn
          ? "New password must be at least 6 characters"
          : "Mật khẩu mới phải có ít nhất 6 ký tự"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        isEn ? "Confirm password does not match" : "Xác nhận mật khẩu mới không khớp"
      );
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await changePassword({ oldPassword, newPassword, confirmPassword });
      setPasswordSuccess(
        localizeMessage(
          res.message,
          language,
          isEn ? "Password changed successfully!" : "Đổi mật khẩu thành công!"
        )
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = localizeMessage(
        err,
        language,
        isEn ? "Failed to change password!" : "Đổi mật khẩu thất bại!"
      );
      setPasswordError(msg);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Format date helper
  const formatDateDisplay = (dateString) => {
    if (!dateString) return isEn ? "Not updated" : "Chưa cập nhật";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(isEn ? "en-US" : "vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. THẺ THÔNG TIN HỒ SƠ */}
      <div className="bg-[#182245]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2.5">
            <User size={20} className="text-pacific-cyan" />
            <span>{isEn ? "Profile Information" : "Thông tin hồ sơ"}</span>
          </h2>
          <button
            onClick={onOpenEditModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 size={14} className="text-pacific-cyan" />
            <span>{isEn ? "Edit Profile" : "Chỉnh sửa"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Avatar Area */}
          <div className="md:col-span-3 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#161f3e] border border-white/20 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-white">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-white/50">
              @{user?.username || "user"}
            </span>
          </div>

          {/* User Fields List */}
          <div className="md:col-span-9 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <span className="sm:col-span-3 text-xs font-semibold text-white/60">
                {isEn ? "Full Name:" : "Họ tên:"}
              </span>
              <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white">
                {user?.fullName || <span className="text-white/40 italic">{isEn ? "Not updated" : "Chưa cập nhật"}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <span className="sm:col-span-3 text-xs font-semibold text-white/60">Email:</span>
              <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white">
                {user?.email || "..."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <span className="sm:col-span-3 text-xs font-semibold text-white/60">
                {isEn ? "Date of Birth:" : "Ngày sinh:"}
              </span>
              <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white">
                {formatDateDisplay(user?.dateOfBirth)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              <span className="sm:col-span-3 text-xs font-semibold text-white/60">
                {isEn ? "Phone Number:" : "Số điện thoại:"}
              </span>
              <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white">
                {user?.phoneNumber || <span className="text-white/40 italic">{isEn ? "Not updated" : "Chưa cập nhật"}</span>}
              </div>
            </div>

            {user?.bio && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start">
                <span className="sm:col-span-3 text-xs font-semibold text-white/60 pt-2">
                  {isEn ? "Biography:" : "Tiểu sử:"}
                </span>
                <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-normal text-white/85 leading-relaxed">
                  {user.bio}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. THẺ THAY ĐỔI EMAIL */}
      <div className="bg-[#182245]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white font-heading mb-6 flex items-center gap-2.5">
          <Mail size={20} className="text-pacific-cyan" />
          <span>{isEn ? "Change Email" : "Thay đổi email"}</span>
        </h2>

        {emailError && (
          <div className="p-3 mb-4 rounded-xl text-xs bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{emailError}</span>
          </div>
        )}

        {emailSuccess && (
          <div className="p-3 mb-4 rounded-xl text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{emailSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/60">
              {isEn ? "Current Email:" : "Email hiện tại:"}
            </label>
            <div className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 select-none">
              {user?.email || "..."}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/70">
              {isEn ? "New Email:" : "Email mới:"}
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={isEn ? "Enter new email address" : "Nhập địa chỉ email mới"}
              className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/70">
              {isEn ? "Current Password:" : "Mật khẩu hiện tại:"}
            </label>
            <input
              type="password"
              required
              value={emailCurrentPassword}
              onChange={(e) => setEmailCurrentPassword(e.target.value)}
              placeholder={isEn ? "Enter current password to verify" : "Nhập mật khẩu hiện tại để xác nhận"}
              className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isEmailLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-pacific-blue-bright to-pacific-teal hover:brightness-110 active:scale-95 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isEmailLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isEn ? "Processing..." : "Đang xử lý..."}</span>
                </>
              ) : (
                <span>{isEn ? "Update Email" : "Thay đổi"}</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. THẺ THAY ĐỔI MẬT KHẨU */}
      <div className="bg-[#182245]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white font-heading mb-6 flex items-center gap-2.5">
          <Lock size={20} className="text-pacific-cyan" />
          <span>{isEn ? "Change Password" : "Thay đổi mật khẩu"}</span>
        </h2>

        {passwordError && (
          <div className="p-3 mb-4 rounded-xl text-xs bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 mb-4 rounded-xl text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/70">
              {isEn ? "Old Password:" : "Mật khẩu cũ:"}
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={isEn ? "Enter current password" : "Nhập mật khẩu hiện tại"}
              className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/70">
              {isEn ? "New Password:" : "Mật khẩu mới:"}
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={isEn ? "New password (at least 6 characters)" : "Nhập mật khẩu mới (ít nhất 6 ký tự)"}
              className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
            <label className="sm:col-span-3 text-xs font-semibold text-white/70">
              {isEn ? "Confirm New Password:" : "Xác nhận mật khẩu mới:"}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={isEn ? "Re-enter new password" : "Nhập lại mật khẩu mới"}
              className="sm:col-span-9 px-4 py-2.5 bg-white/5 border border-white/15 focus:border-pacific-cyan rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-pacific-blue-bright to-pacific-teal hover:brightness-110 active:scale-95 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isPasswordLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isEn ? "Saving..." : "Đang lưu..."}</span>
                </>
              ) : (
                <span>{isEn ? "Save New Password" : "Lưu thay đổi"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
