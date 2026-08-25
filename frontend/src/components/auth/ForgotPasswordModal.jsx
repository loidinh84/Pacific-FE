import { useState } from "react";
import { X, Lock, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

export function ForgotPasswordModal({ isOpen, onClose }) {
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
      // Call backend API (or fallback for UI test)
      const res = await axios.post("/api/auth/forgot-password", { email });
      setStatusMessage({
        type: "success",
        text: res.data?.message || "Đã gửi hướng dẫn khôi phục tới email của bạn!",
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      // Fallback message for demo/backend integration
      const errorMsg =
        err.response?.data?.message ||
        "Không thể gửi email khôi phục. Vui lòng thử lại sau!";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#1e2a56]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 relative text-white animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="w-20 h-20 rounded-full border border-white/25 bg-white/5 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Lock size={36} className="text-white" />
        </div>

        {/* Header Text */}
        <h2 className="text-2xl font-black text-white text-center mb-1">
          Khôi phục mật khẩu
        </h2>
        <p className="text-xs sm:text-sm text-white/70 text-center mb-6">
          Nhập địa chỉ email đã đăng ký của bạn.
        </p>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-3.5 mb-5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-white/90 mb-2">
              Địa chỉ email
            </label>
            <div className="relative flex items-center">
              <Mail
                size={18}
                className="absolute left-4 text-white/60 pointer-events-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pacific-blue-bright focus:ring-1 focus:ring-pacific-blue-bright transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-[#1e2a56] bg-white hover:bg-slate-100 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
            >
              Quay lại
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-pacific-blue-bright hover:bg-sky-500 active:scale-95 transition-all text-sm cursor-pointer shadow-md flex items-center justify-center gap-2 min-w-[110px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
