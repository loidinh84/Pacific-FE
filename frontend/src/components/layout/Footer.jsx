import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { CheckCircle2, Send, Star, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { submitFeedback } from "../../services/feedbackApi";
import * as Images from "../../assets/Images";

export default function Footer() {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await submitFeedback({
        content: feedback.trim(),
        rating,
      });
      setSubmitted(true);
      setFeedback("");
      setRating(5);
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      console.error("Gửi ý kiến thất bại:", err);
      setErrorMessage(
        err.response?.data?.message ||
          (isEn
            ? "Could not send feedback, please try again."
            : "Không thể gửi ý kiến, vui lòng thử lại sau.")
      );
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("pacific_system_settings");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleSettingsUpdate = (e) => {
      if (e.detail) setSystemSettings(e.detail);
    };
    window.addEventListener("pacific_settings_update", handleSettingsUpdate);
    return () => window.removeEventListener("pacific_settings_update", handleSettingsUpdate);
  }, []);

  const brandName = systemSettings?.general?.websiteName || "Pacific";

  return (
    <footer className="bg-pacific-figma-dark border-t border-white/10 pt-16 pb-8 relative overflow-hidden text-white/70 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 relative z-10">
        {/* Col 1: Brand Info & Social Icons */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img
              src={systemSettings?.general?.logoUrl || Images.Logo}
              alt="Pacific Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-heading text-2xl font-black text-white tracking-tight">
              {brandName}
            </span>
          </Link>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 max-w-sm">
            {t("footer.brandDesc")}
          </p>

          {/* Social Icons with cohesive brand colors & glowing hovers */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_0_12px_rgba(24,119,242,0.4)] transition-all duration-300"
              title="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_0_12px_rgba(255,0,0,0.4)] transition-all duration-300"
              title="YouTube"
            >
              <FaYoutube size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#E4405F]/10 border border-[#E4405F]/30 flex items-center justify-center text-[#E4405F] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent hover:shadow-[0_0_12px_rgba(225,48,108,0.4)] transition-all duration-300"
              title="Instagram"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#0068FF]/10 border border-[#0068FF]/30 flex items-center justify-center hover:bg-[#0068FF] hover:border-[#0068FF] hover:shadow-[0_0_12px_rgba(0,104,255,0.4)] transition-all duration-300 p-1.5 group"
              title="Zalo"
            >
              <img
                src={Images.Zalo}
                alt="Zalo"
                className="w-full h-full object-contain rounded-full transition-transform group-hover:scale-110"
              />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-white font-bold mb-4 font-heading text-base">
            {t("footer.exploreTitle")}
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <a href="/#hero" className="hover:text-pacific-cyan transition-colors">
                {t("nav.explore")}
              </a>
            </li>
            <li>
              <Link to="/search" className="hover:text-pacific-cyan transition-colors">
                {t("nav.species")}
              </Link>
            </li>
            <li>
              <Link to="/ocean-depth" className="hover:text-pacific-cyan transition-colors">
                {t("nav.oceanDepth", "Độ sâu đại dương")}
              </Link>
            </li>
            <li>
              <Link to="/knowledge-graph" className="hover:text-pacific-cyan transition-colors">
                {t("nav.knowledgeGraph", "Đồ thị tri thức")}
              </Link>
            </li>
            <li>
              <a href="/#about" className="hover:text-pacific-cyan transition-colors">
                {t("nav.about")}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Resources */}
        <div>
          <h4 className="text-white font-bold mb-4 font-heading text-base">
            {t("footer.legalTitle")}
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <a href="#" className="hover:text-pacific-cyan transition-colors">
                {t("footer.privacyPolicy")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pacific-cyan transition-colors">
                {t("footer.termsOfUse")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pacific-cyan transition-colors">
                {t("footer.contentPolicy")}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Feedback */}
        <div>
          <h4 className="text-white font-bold mb-4 font-heading text-base">
            {t("footer.contactTitle")}
          </h4>
          <p className="text-xs text-white/60 mb-3">
            {t("footer.contactDesc")}
          </p>
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-2.5">
            {/* Đánh giá số sao */}
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="text-[11px] text-white/50 mr-1">
                {isEn ? "Rating:" : "Đánh giá:"}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = starVal <= (hoverRating || rating);
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                      title={`${starVal} / 5 ${isEn ? "stars" : "sao"}`}
                    >
                      <Star
                        size={14}
                        className={`transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                            : "text-white/20 hover:text-white/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-amber-400 ml-1">
                {hoverRating || rating}/5
              </span>
            </div>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t("footer.feedbackPlaceholder")}
              disabled={isSubmitting}
              className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all resize-none font-normal disabled:opacity-50"
            />

            {errorMessage && (
              <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px]">
                <AlertCircle size={13} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 size={15} />
                <span>{isEn ? "Thank you for your feedback!" : "Cảm ơn bạn đã gửi ý kiến đóng góp!"}</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer active:translate-y-0.5 shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{isEn ? "Sending..." : "Đang gửi..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>{t("footer.btnSendFeedback")}</span>
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Copyright Bar - Centered & Focused on Biển Đông */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-white/50 text-center">
        <p className="flex items-center gap-1.5">
          <span>&copy; {currentYear} Pacific.</span>
          <span>{isEn ? "All rights reserved." : "Tất cả quyền được bảo lưu."}</span>
        </p>
        <span className="text-white/20 hidden sm:inline">•</span>
        <p className="text-cyan-400 font-medium">
          {isEn
            ? "East Sea Marine Biodiversity Exploration & Conservation Platform"
            : "Bảo tồn & Khám phá Đa dạng Sinh học Biển Đông"}
        </p>
      </div>
    </footer>
  );
}
