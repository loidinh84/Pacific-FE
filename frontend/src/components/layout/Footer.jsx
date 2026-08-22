import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../../hooks/useLanguage";
import * as Images from "../../assets/Images";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-pacific-figma-dark border-t border-white/10 pt-16 pb-8 relative overflow-hidden text-white/70 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 relative z-10">
        {/* Col 1: Brand Info & Social Icons */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img
              src={Images.Logo}
              alt="Pacific Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-heading text-2xl font-black text-white tracking-tight">
              Pacific
            </span>
          </Link>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 max-w-sm">
            {t("footer.brandDesc")}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pacific-blue-bright/20 hover:border-pacific-blue-bright text-white/80 hover:text-white transition-all"
              title="Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pacific-blue-bright/20 hover:border-pacific-blue-bright text-white/80 hover:text-white transition-all"
              title="YouTube"
            >
              <FaYoutube size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pacific-blue-bright/20 hover:border-pacific-blue-bright text-white/80 hover:text-white transition-all"
              title="Instagram"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pacific-blue-bright/20 hover:border-pacific-blue-bright transition-all p-2"
              title="Zalo"
            >
              <img
                src={Images.Zalo}
                alt="Zalo"
                className="w-full h-full object-contain filter brightness-90 hover:brightness-100"
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
              <a href="/#species" className="hover:text-pacific-cyan transition-colors">
                {t("nav.species")}
              </a>
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

        {/* Col 4: Contact & Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-4 font-heading text-base">
            {t("footer.contactTitle")}
          </h4>
          <p className="text-xs text-white/60 mb-3">
            {t("footer.contactDesc")}
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
            <textarea
              rows={3}
              placeholder={t("footer.feedbackPlaceholder")}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-xs md:text-xs text-white focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all resize-none font-normal"
            />
            <button
              type="submit"
              className="py-2.5 bg-pacific-blue-bright hover:bg-pacific-blue-bright/80 text-white rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer active:translate-y-0.5"
            >
              {t("footer.btnSendFeedback")}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <p>{t("footer.copyright")}</p>
        <p>Pacific Ocean Explorations &copy; 2026</p>
      </div>
    </footer>
  );
}
