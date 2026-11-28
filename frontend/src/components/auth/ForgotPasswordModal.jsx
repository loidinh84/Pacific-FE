import { useState } from "react";
import { X, Lock, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeMessage } from "../../utils/errorTranslator";

export function ForgotPasswordModal({ isOpen, onClose }) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Gọi API khôi phục mật khẩu
      const res = await axios.post("/api/auth/forgot-password", { email });
      setStatusMessage({
        type: "success",
        text: localizeMessage(
          res.data?.message,
          language,
          t("auth.resetEmailSent", "Đã gửi hướng dẫn khôi phục tới email của bạn!")
        ),
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      // Fallback message for demo/backend integration
      const errorMsg = localizeMessage(
        err,
        language,
        t("auth.resetEmailFailed", "Không thể gửi email khôi phục. Vui lòng thử lại sau!")
      );
      setStatusMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/35 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md liquid-glass-strong rounded-2xl p-6 sm:p-8 relative text-[#0f172a] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-[#475569] hover:text-[#0f172a] transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-[#0f172a]/6"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl border border-sky-600/20 bg-sky-600/10 flex items-center justify-center mx-auto mb-5">
          <Lock size={28} className="text-[#0284c7]" />
        </div>

        {/* Header Text */}
        <h2 className="text-2xl font-bold text-[#0f172a] text-center mb-1 font-heading">
          {t("auth.forgotPasswordTitle", "Khôi phục mật khẩu")}
        </h2>
        <p className="text-xs sm:text-sm text-[#475569] text-center mb-6">
          {t("auth.forgotPasswordSubtitle", "Nhập địa chỉ email đã đăng ký của bạn.")}
        </p>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-3.5 mb-5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/12 border border-emerald-500/25 text-emerald-800"
                : "bg-rose-500/12 border border-rose-500/25 text-rose-700"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#334155] mb-2">
              {t("auth.email", "Địa chỉ email")}
            </label>
            <div className="relative flex items-center">
              <Mail
                size={18}
                className="absolute left-4 z-10 text-[#475569] pointer-events-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-11 pr-4 py-3 liquid-input rounded-xl placeholder:text-[#475569]/70 text-sm font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/6 transition-colors text-sm cursor-pointer"
            >
              {t("auth.back", "Quay lại")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] transition-colors text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2 min-w-[110px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t("auth.sending", "Đang gửi...")}</span>
                </>
              ) : (
                t("auth.submit", "Xác nhận")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
