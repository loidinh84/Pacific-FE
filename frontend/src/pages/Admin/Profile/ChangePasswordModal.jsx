import { useState } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { changeAdminPassword } from "../../../services/adminProfileApi";
import { useLanguage } from "../../../hooks/useLanguage";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  isDark = true,
}) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPassError("");
    setPassSuccess("");
    onClose();
  };

  const handleSubmit = async (e) => {
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
      setTimeout(() => {
        handleResetAndClose();
      }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-6 relative transition-all ${
          isDark
            ? "bg-[#223263]/95 backdrop-blur-xl border-white/20 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {isEn ? "Change Security Password" : "Đổi mật khẩu bảo mật"}
          </h3>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isEn ? "Current Password" : "MẬT KHẨU HIỆN TẠI"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={isEn ? "Enter current password" : "Nhập mật khẩu đang sử dụng"}
                className="w-full px-4 py-2.5 pr-10 bg-[#17244c] border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
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
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isEn ? "New Password" : "MẬT KHẨU MỚI"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isEn ? "Min. 8 characters" : "Tối thiểu 8 ký tự"}
                className="w-full px-4 py-2.5 pr-10 bg-[#17244c] border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
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
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isEn ? "Confirm New Password" : "XÁC NHẬN MẬT KHẨU MỚI"} <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isEn ? "Re-enter new password" : "Nhập lại mật khẩu mới"}
                className="w-full px-4 py-2.5 pr-10 bg-[#17244c] border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
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
          <div className="pt-3">
            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isChangingPass && <Loader2 size={16} className="animate-spin" />}
              <span>
                {isChangingPass
                  ? (isEn ? "Updating Password..." : "Đang cập nhật...")
                  : (isEn ? "Update New Password" : "Cập nhật mật khẩu mới")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
