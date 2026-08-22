import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { FloatingInput } from "../../components/ui/FloatingInput";
import { SocialLoginButtons } from "../../components/ui/SocialLoginButtons";

export function LoginForm() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit:", { email, password, rememberMe });
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
          <a
            href="#"
            className="text-pacific-blue-light hover:underline font-medium transition-colors"
          >
            {t("auth.forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-indigo-400 hover:to-cyan-600 hover:brightness-110 active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1"
        >
          {t("auth.btnLogin")}
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
    </div>
  );
}
