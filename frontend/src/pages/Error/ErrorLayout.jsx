import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RefreshCw, LogIn } from "lucide-react";
import ErrorBackground from "../../assets/Images/ErrorBackground.png";
import { useLanguage } from "../../hooks/useLanguage";

export default function ErrorLayout({
  code = "404",
  watermark = null,
  title = null,
  actions = [],
  customAction = null,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const displayWatermark = watermark || code;
  const displayTitle =
    title ||
    (code === "OOPS"
      ? t("errors.unexpectedError", "Ứng dụng gặp sự cố ngoài ý muốn")
      : t("errors.error404Title", "Không tìm thấy trang"));

  return (
    <div className="relative min-h-screen w-full bg-[#102144] overflow-hidden flex flex-col items-center justify-center px-4 select-none">
      {/* Đồ họa nền */}
      <img
        src={ErrorBackground}
        alt="Ocean background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 opacity-95"
      />

      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#102144]/30 to-[#0c1833]/80 pointer-events-none z-1" />

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl w-full">
        {/* Mã lỗi */}
        <div className="relative flex items-center justify-center mb-4 sm:mb-6">
          <span
            className="text-[120px] sm:text-[160px] md:text-[210px] font-black text-[#1b2f5b]/80 tracking-wider select-none leading-none transition-all drop-shadow-sm"
            style={{ textShadow: "0 0 30px rgba(16, 33, 68, 0.8)" }}
          >
            {displayWatermark}
          </span>
          <span className="absolute text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wider drop-shadow-md">
            {code}
          </span>
        </div>

        {/* Tiêu đề lỗi */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide mb-8 px-4">
          {displayTitle}
        </h1>

        {/* Nút thao tác */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 z-20">
          {customAction}

          {actions.includes("home") && (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-white text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-cyan-500/10 active:scale-95"
            >
              <Home size={18} className="text-cyan-400" />
              <span>{t("errors.btnHome", "Về trang chủ")}</span>
            </Link>
          )}

          {actions.includes("back") && (
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-white text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={18} className="text-cyan-400" />
              <span>{t("errors.btnBack", "Quay trở lại")}</span>
            </button>
          )}

          {actions.includes("login") && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm sm:text-base font-medium transition-all shadow-md active:scale-95"
            >
              <LogIn size={18} />
              <span>{t("nav.login", "Đăng nhập")}</span>
            </Link>
          )}

          {actions.includes("retry") && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-white text-sm sm:text-base font-medium transition-all shadow-sm hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={18} className="text-cyan-400" />
              <span>{t("errors.btnRetry", "Tải lại trang")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
