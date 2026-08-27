import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../../hooks/useLanguage";
import { FloatingInput } from "../../components/ui/FloatingInput";
import { SocialLoginButtons } from "../../components/ui/SocialLoginButtons";

export function RegisterForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/register", {
        fullName,
        email,
        password,
      });

      setSuccessMessage(
        res.data?.message || "Đăng ký tài khoản thành công! Đang chuyển sang trang Đăng nhập..."
      );

      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 800);
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-2">
          {t("auth.registerTitle")}
        </h1>
        <p className="text-xs md:text-sm text-pacific-blue-pale font-medium">
          {t("auth.registerSubtitle")}
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FloatingInput
          id="register-fullname"
          type="text"
          label={t("auth.fullName")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          icon={User}
        />

        <FloatingInput
          id="register-email"
          type="email"
          label={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={Mail}
        />

        <FloatingInput
          id="register-password"
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

        <FloatingInput
          id="register-confirmpassword"
          type={showConfirmPassword ? "text" : "password"}
          label={t("auth.confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          icon={Lock}
          endElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-indigo-400 hover:to-cyan-600 hover:brightness-110 active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang đăng ký...</span>
            </>
          ) : (
            t("auth.btnRegister")
          )}
        </button>

        <div className="relative flex items-center justify-center my-0.5">
          <div className="w-full border-t border-white/10" />
          <span className="absolute px-3 bg-[#232f5d] text-[10px] font-medium text-white/40 uppercase tracking-wider">
            {t("auth.orWith")}
          </span>
        </div>

        <SocialLoginButtons />
      </form>

      <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-white/70">
        {t("auth.hasAccount")}{" "}
        <Link
          to="/login"
          className="text-pacific-blue-light font-bold hover:underline transition-colors ml-1"
        >
          {t("auth.loginNow")}
        </Link>
      </div>
    </div>
  );
}

