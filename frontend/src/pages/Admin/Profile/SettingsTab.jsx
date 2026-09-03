import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { changeAdminPassword, updateAdminSettings } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function SettingsTab({
  isDark = true,
  onThemeToggle,
}) {
  const { language, changeLanguage } = useLanguage();
  const isEn = language === "en";

  // Settings State
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [localLang, setLocalLang] = useState(language);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");

  useEffect(() => {
    setLocalLang(language);
  }, [language]);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess("");
    try {
      changeLanguage(localLang);
      await updateAdminSettings({
        notificationsEmail,
        theme: isDark ? "dark" : "light",
        language: localLang,
      });
      setSettingsSuccess(
        isEn ? "Preferences saved successfully." : "Đã lưu cài đặt thành công."
      );
      setTimeout(() => setSettingsSuccess(""), 3000);
    } catch (err) {
      console.error("Lưu cài đặt lỗi:", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLanguageDropdown = (newLang) => {
    setLocalLang(newLang);
    changeLanguage(newLang);
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (newPassword !== confirmPassword) {
      setPassError(
        isEn
          ? "New password and confirmation do not match"
          : "Mật khẩu mới và xác nhận mật khẩu không khớp"
      );
      return;
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passRegex.test(newPassword)) {
      setPassError(
        isEn
          ? "New password must be at least 8 characters, with uppercase, lowercase, and numbers"
          : "Mật khẩu mới phải từ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số"
      );
      return;
    }

    setIsChangingPass(true);

    try {
      const res = await changeAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPassSuccess(
        res.message || (isEn ? "Password updated successfully." : "Đổi mật khẩu thành công.")
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPassSuccess(""), 4000);
    } catch (err) {
      console.error("Đổi mật khẩu lỗi:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (isEn ? "Could not update password." : "Không thể đổi mật khẩu.");
      setPassError(msg);
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
      {/* 1. Interface & Preferences */}
      <div
        className={`rounded-2xl border p-6 space-y-6 ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="pb-3.5 border-b border-white/15">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Interface & Notifications" : "Giao diện & Thông báo"}
          </h3>
        </div>

        {settingsSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{settingsSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5 text-sm">
          {/* Email Notification Row */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="space-y-0.5">
              <p className="font-semibold text-white text-sm sm:text-base">
                {isEn ? "Email notifications" : "Thông báo qua Email"}
              </p>
              <p className="text-xs sm:text-sm text-cyan-200/70">
                {isEn
                  ? "Receive alerts on species data updates"
                  : "Nhận thông báo khi có thay đổi dữ liệu"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={notificationsEmail}
                onChange={(e) => setNotificationsEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Theme Row */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="space-y-0.5">
              <p className="font-semibold text-white text-sm sm:text-base">
                {isEn ? "Theme mode" : "Chế độ giao diện"}
              </p>
              <p className="text-xs sm:text-sm text-cyan-200/70">
                {isDark ? (isEn ? "Dark mode active" : "Đang dùng giao diện tối") : (isEn ? "Light mode active" : "Đang dùng giao diện sáng")}
              </p>
            </div>
            <button
              type="button"
              onClick={onThemeToggle}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/15 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              {isDark ? (isEn ? "🌙 Dark" : "🌙 Tối") : (isEn ? "☀️ Light" : "☀️ Sáng")}
            </button>
          </div>

          {/* Language Row */}
          <div className="space-y-2 pt-1">
            <label className="font-semibold text-white text-sm sm:text-base">
              {isEn ? "Language" : "Ngôn ngữ hiển thị"}
            </label>
            <div className="relative">
              <select
                value={localLang}
                onChange={(e) => handleLanguageDropdown(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-[#0e1732] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                <option value="vi" className="bg-[#0e1732] text-white">Tiếng Việt (Vietnamese)</option>
                <option value="en" className="bg-[#0e1732] text-white">English (International)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingSettings ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Save Preferences" : "Lưu cài đặt")}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Change Password */}
      <div
        className={`rounded-2xl border p-6 space-y-6 ${
          isDark
            ? "bg-[#142144]/90 backdrop-blur-xl border-white/15 text-white shadow-lg"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="pb-3.5 border-b border-white/15">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Change Password" : "Đổi mật khẩu"}
          </h3>
        </div>

        {passError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-sm flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{passError}</span>
          </div>
        )}

        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-sm">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 text-sm">
              {isEn ? "Current password" : "Mật khẩu hiện tại"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={isEn ? "Enter current password" : "Nhập mật khẩu đang sử dụng"}
                className="w-full px-4 py-2.5 pr-10 bg-[#0e1732] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showCurrentPassword ? (isEn ? "Hide password" : "Ẩn mật khẩu") : (isEn ? "Show password" : "Hiện mật khẩu")}
              >
                {showCurrentPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 text-sm">
              {isEn ? "New password" : "Mật khẩu mới"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isEn ? "Min. 8 characters" : "Tối thiểu 8 ký tự"}
                className="w-full px-4 py-2.5 pr-10 bg-[#0e1732] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showNewPassword ? (isEn ? "Hide password" : "Ẩn mật khẩu") : (isEn ? "Show password" : "Hiện mật khẩu")}
              >
                {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <PasswordStrengthIndicator password={newPassword} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 text-sm">
              {isEn ? "Confirm new password" : "Xác nhận mật khẩu mới"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isEn ? "Re-enter new password" : "Nhập lại mật khẩu mới"}
                className="w-full px-4 py-2.5 pr-10 bg-[#0e1732] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showConfirmPassword ? (isEn ? "Hide password" : "Ẩn mật khẩu") : (isEn ? "Show password" : "Hiện mật khẩu")}
              >
                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPass}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isChangingPass && <Loader2 size={15} className="animate-spin" />}
              <span>{isChangingPass ? (isEn ? "Updating..." : "Đang xử lý...") : (isEn ? "Update Password" : "Cập nhật mật khẩu")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
