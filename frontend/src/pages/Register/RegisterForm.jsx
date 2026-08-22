import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { FloatingInput } from "../../components/ui/FloatingInput";
import { SocialLoginButtons } from "../../components/ui/SocialLoginButtons";

export function RegisterForm() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    console.log("Register submit:", { fullName, email, password, confirmPassword });
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
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-indigo-400 hover:to-cyan-600 hover:brightness-110 active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1"
        >
          {t("auth.btnRegister")}
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
