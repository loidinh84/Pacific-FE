import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

/* Background bubbles */
const BUBBLES = [
  { size: "w-2.5 h-2.5", left: "left-[12%]", delay: "0s", duration: "8s" },
  { size: "w-4 h-4", left: "left-[25%]", delay: "2s", duration: "11s" },
  { size: "w-2 h-2", left: "left-[42%]", delay: "4s", duration: "7s" },
  { size: "w-5 h-5", left: "left-[58%]", delay: "1s", duration: "13s" },
  { size: "w-3 h-3", left: "left-[75%]", delay: "3s", duration: "9s" },
  { size: "w-4 h-4", left: "left-[88%]", delay: "5s", duration: "10s" },
];

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Mật khẩu xác nhận không khớp!",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "Mật khẩu phải có ít nhất 6 ký tự!",
      });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      setStatus({
        type: "success",
        message: res.data?.message || "Đặt lại mật khẩu thành công! Đang chuyển hướng...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ!";
      setStatus({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark flex flex-col justify-between relative overflow-hidden">
      {/* Background Sunbeams & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.25)_0%,rgba(6,182,212,0.1)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-pacific-teal/15 blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className={`absolute bottom-[-20px] rounded-full bg-pacific-blue-light/20 border border-pacific-blue-bright/30 animate-bubble ${b.size} ${b.left}`}
            style={{
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div className="w-full max-w-md bg-[#1e2a56]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 relative text-white animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header Text */}
          <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-1">
            Cập nhật mật khẩu mới
          </h1>
          <p className="text-xs sm:text-sm text-white/70 text-center mb-8">
            Hãy tạo 1 mật khẩu mạnh mẽ!
          </p>

          {/* Status Alert */}
          {status && (
            <div
              className={`p-3.5 mb-6 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
                status.type === "success"
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200"
                  : "bg-rose-500/20 border border-rose-500/40 text-rose-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle size={18} className="shrink-0 text-rose-400" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Input 1: Mật khẩu mới */}
            <div className="relative">
              <label className="block text-xs font-semibold text-white/90 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={18}
                  className="absolute left-4 text-white/60 pointer-events-none"
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pacific-blue-bright focus:ring-1 focus:ring-pacific-blue-bright transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Input 2: Xác nhận mật khẩu mới */}
            <div className="relative">
              <label className="block text-xs font-semibold text-white/90 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={18}
                  className="absolute left-4 text-white/60 pointer-events-none"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pacific-blue-bright focus:ring-1 focus:ring-pacific-blue-bright transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-pacific-blue-bright hover:bg-sky-500 active:scale-98 transition-all text-base cursor-pointer shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                "Xác nhận đổi mật khẩu"
              )}
            </button>
          </form>

          {/* Back to Login link */}
          <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-white/70">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-pacific-blue-light font-bold hover:underline transition-colors"
            >
              <ArrowLeft size={14} />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
