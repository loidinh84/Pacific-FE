import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { CheckCircle2, Send, Loader2, AlertCircle, Clock } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeMessage } from "../../utils/errorTranslator";
import { submitFeedback } from "../../services/feedbackApi";
import * as Images from "../../assets/Images";

export default function Footer() {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Bộ đếm lùi thời gian chờ chống spam
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    if (cooldown > 0) {
      setErrorMessage(
        isEn
          ? `Please wait ${cooldown}s before sending another feedback.`
          : `Vui lòng đợi ${cooldown} giây trước khi gửi tiếp ý kiến.`
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    const trimmed = feedback.trim();
    if (trimmed.length < 5) {
      setErrorMessage(
        isEn
          ? "Feedback is too short (minimum 5 characters)."
          : "Nội dung ý kiến đóng góp quá ngắn (tối thiểu 5 ký tự)."
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    // Kiểm tra ký tự lặp liên tục vô nghĩa (Spam)
    if (/(.)\1{7,}/.test(trimmed)) {
      setErrorMessage(
        isEn
          ? "Please enter meaningful feedback, avoid spamming characters."
          : "Vui lòng nhập nội dung có ý nghĩa, tránh gửi chuỗi ký tự spam."
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await submitFeedback({
        content: trimmed,
      });
      setSubmitted(true);
      setFeedback("");
      setCooldown(60); // Bật thời gian chờ 60 giây chống spam
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      console.error("Gửi ý kiến thất bại:", err);
      setErrorMessage(
        localizeMessage(
          err,
          language,
          isEn
            ? "Could not send feedback, please try again."
            : "Không thể gửi ý kiến, vui lòng thử lại sau."
        )
      );
      setTimeout(() => setErrorMessage(""), 5000);
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
    <footer className="bg-white/95 backdrop-blur-xl border-t border-[#0f172a]/12 pt-16 pb-8 relative overflow-hidden text-[#334155] text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 relative z-10">
        {/* Col 1: Brand Info & Social Icons */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <img
              src={systemSettings?.general?.logoUrl || Images.Logo}
              alt={brandName || "Logo"}
              className="w-8 h-8 object-contain"
            />
            <span className="font-heading text-2xl font-bold text-[#0f172a] tracking-tight">
              {brandName}
            </span>
          </Link>
          <p className="text-[#475569] text-xs md:text-sm leading-relaxed mb-6 max-w-sm">
            {t("footer.brandDesc")}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-[#334155] hover:text-[#0284c7] hover:bg-white transition-colors"
              title="Facebook"
            >
              <FaFacebookF size={13} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-[#334155] hover:text-[#0284c7] hover:bg-white transition-colors"
              title="YouTube"
            >
              <FaYoutube size={14} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-[#334155] hover:text-[#0284c7] hover:bg-white transition-colors"
              title="Instagram"
            >
              <FaInstagram size={14} />
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl liquid-glass-subtle flex items-center justify-center text-[#334155] hover:bg-white transition-colors p-1.5"
              title="Zalo"
            >
              <img
                src={Images.Zalo}
                alt="Zalo"
                className="w-full h-full object-contain rounded-full opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-[#0f172a] font-semibold mb-4 font-heading text-base">
            {t("footer.exploreTitle")}
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <a href="/#hero" className="hover:text-[#0284c7] transition-colors">
                {t("nav.explore")}
              </a>
            </li>
            <li>
              <Link to="/search" className="hover:text-[#0284c7] transition-colors">
                {t("nav.species")}
              </Link>
            </li>
            <li>
              <Link to="/ocean-depth" className="hover:text-[#0284c7] transition-colors">
                {t("nav.oceanDepth", "Độ sâu đại dương")}
              </Link>
            </li>
            <li>
              <Link to="/knowledge-graph" className="hover:text-[#0284c7] transition-colors">
                {t("nav.knowledgeGraph", "Đồ thị tri thức")}
              </Link>
            </li>
            <li>
              <a href="/#marine-locations" className="hover:text-[#0284c7] transition-colors">
                {language === "vi" ? "Khu bảo tồn biển" : "Marine Sanctuaries"}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Resources */}
        <div>
          <h4 className="text-[#0f172a] font-semibold mb-4 font-heading text-base">
            {t("footer.legalTitle")}
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                {t("footer.privacyPolicy")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                {t("footer.termsOfUse")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0284c7] transition-colors">
                {t("footer.contentPolicy")}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Feedback */}
        <div>
          <h4 className="text-[#0f172a] font-semibold mb-4 font-heading text-base">
            {t("footer.contactTitle")}
          </h4>
          <p className="text-xs text-[#475569] mb-3">
            {t("footer.contactDesc")}
          </p>
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-2.5">
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t("footer.feedbackPlaceholder")}
              disabled={isSubmitting || cooldown > 0}
              className="px-3.5 py-2.5 liquid-input rounded-xl text-xs placeholder:text-[#475569]/70 resize-none font-normal disabled:opacity-50"
            />

            {errorMessage && (
              <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-700 text-[11px]">
                <AlertCircle size={13} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {submitted ? (
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/12 border border-emerald-600/25 text-emerald-800 text-xs font-medium">
                <CheckCircle2 size={15} />
                <span>{isEn ? "Thank you for your feedback" : "Cảm ơn bạn đã gửi ý kiến đóng góp"}</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim() || cooldown > 0}
                className="py-2.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{isEn ? "Sending..." : "Đang gửi..."}</span>
                  </>
                ) : cooldown > 0 ? (
                  <>
                    <Clock size={13} />
                    <span>{isEn ? `Wait ${cooldown}s` : `Chờ ${cooldown}s`}</span>
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

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#0f172a]/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#475569] text-center">
        <p className="flex items-center gap-1.5">
          <span>&copy; {currentYear} {brandName}.</span>
          <span>{isEn ? "All rights reserved." : "Tất cả quyền được bảo lưu."}</span>
        </p>
        <span className="text-[#0f172a]/20 hidden sm:inline">•</span>
        <p className="text-[#0284c7] font-medium">
          {isEn
            ? "East Sea Marine Biodiversity Exploration & Conservation Platform"
            : "Bảo tồn & Khám phá Đa dạng Sinh học Biển Đông"}
        </p>
      </div>
    </footer>
  );
}
