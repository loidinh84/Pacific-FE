import { useState, useEffect, useRef } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../../hooks/useLanguage";
import { FloatingInput } from "../../components/ui/FloatingInput";
import { SocialLoginButtons } from "../../components/ui/SocialLoginButtons";
import { ForgotPasswordModal } from "../../components/auth/ForgotPasswordModal";

export function LoginForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const hasProcessedCodeRef = useRef(false);

  // Xử lý callback khi GitHub redirect về với mã ?code=... (Chạy duy nhất 1 lần)
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !hasProcessedCodeRef.current) {
      hasProcessedCodeRef.current = true;

      // Xóa ?code=... trên URL bar để tránh gửi lại mã đã sử dụng
      window.history.replaceState({}, document.title, window.location.pathname);

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("Đang xác thực tài khoản GitHub...");

      axios
        .post("/api/auth/github", { code })
        .then((res) => {
          if (res.data?.token) {
            localStorage.setItem("pacific_token", res.data.token);
            localStorage.setItem("pacific_user", JSON.stringify(res.data.user));
          }
          setSuccessMessage(res.data?.message || "Đăng nhập GitHub thành công!");
          setTimeout(() => {
            window.location.href = "/";
          }, 800);
        })
        .catch((err) => {
          console.error("GitHub auth error:", err);
          const msg =
            err.response?.data?.message || "Đăng nhập bằng GitHub thất bại!";
          setErrorMessage(msg);
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      
      // Save token and user info
      if (res.data?.token) {
        localStorage.setItem("pacific_token", res.data.token);
        localStorage.setItem("pacific_user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("pacific_auth_change"));
      }

      setSuccessMessage(res.data?.message || "Đăng nhập thành công!");

      setTimeout(() => {
        window.location.href = "/";
      }, 600);

    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-2">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-xs md:text-sm text-pacific-blue-pale font-medium">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 mb-5 rounded-xl text-xs sm:text-sm bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 mb-5 rounded-xl text-xs sm:text-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FloatingInput
          id="login-email"
          type="email"
          label={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={Mail}
        />

        <FloatingInput
          id="login-password"
          type={showPassword ? "text" : "password"}
          label={t("auth.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={Lock}
          endElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-white/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-pacific-blue-bright focus:ring-0 focus:ring-offset-0 cursor-pointer accent-pacific-blue-bright"
            />
            <span>{t("auth.rememberMe")}</span>
          </label>
          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-pacific-blue-light hover:underline font-medium transition-colors cursor-pointer"
          >
            {t("auth.forgotPassword")}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-indigo-400 hover:to-cyan-600 hover:brightness-110 active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            t("auth.btnLogin")
          )}
        </button>

        <div className="relative flex items-center justify-center my-0.5">
          <div className="w-full border-t border-white/10" />
          <span className="absolute px-3 bg-[#232f5d] text-[10px] font-medium text-white/40 uppercase tracking-wider">
            {t("auth.orLoginWith")}
          </span>
        </div>

        <SocialLoginButtons />
      </form>

      <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-white/70">
        {t("auth.noAccount")}{" "}
        <Link
          to="/register"
          className="text-pacific-blue-light font-bold hover:underline transition-colors ml-1"
        >
          {t("auth.registerNow")}
        </Link>
      </div>

      {/* Forgot Password Modal Popup */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}


