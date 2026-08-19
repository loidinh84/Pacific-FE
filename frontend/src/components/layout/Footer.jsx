import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import * as Images from "../../assets/Images/index.js";

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.explore"), href: "#hero" },
    { label: t("nav.species"), href: "#species" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.quiz"), href: "#quiz" },
  ];

  const policyLinks = [
    { label: t("footer.privacy"), href: "#" },
    { label: t("footer.policy"), href: "#" },
    { label: t("footer.terms"), href: "#" },
  ];

  return (
    <footer className="bg-[#121933] pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="/" className="flex items-center gap-3 mb-6">
              <img
                src={Images.Logo}
                alt="Pacific Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-heading text-xl font-black text-white">
                Pacific
              </span>
            </a>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {t("footer.aboutDesc")}
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/60 hover:text-pacific-blue-light transition-all">
                <Mail size={14} />
                <span>example@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 hover:text-pacific-blue-light transition-all">
                <Phone size={14} />
                <span>091 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60 hover:text-pacific-blue-light transition-all">
                <MapPin size={14} />
                <span>abc đường def, Phường 9, Quận 8, TP.HCM</span>
              </div>
            </div>

            {/* Official Social Icons including Zalo */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#3b5998]/20 hover:border-[#3b5998] hover:text-[#3b5998] hover:-translate-y-0.5 transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#ff0000]/20 hover:border-[#ff0000] hover:text-[#ff0000] hover:-translate-y-0.5 transition-all"
                aria-label="Youtube"
              >
                <FaYoutube size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#e1306c]/20 hover:border-[#e1306c] hover:text-[#e1306c] hover:-translate-y-0.5 transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3 lg:col-start-5">
            <p className="text-lg font-bold text-white/90 tracking-wider mb-6 whitespace-nowrap">
              {t("footer.colEcosystem")}
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-pacific-blue-light hover:translate-x-1 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Policy */}
          <div className="lg:col-span-2 lg:col-start-8">
            <p className="text-lg font-bold text-white/90 tracking-wider mb-6">
              {t("footer.colStats")}
            </p>
            <div className="flex flex-col gap-3">
              {policyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-pacific-blue-light hover:translate-x-1 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <p className="text-lg font-bold text-white/90 tracking-wider mb-6">
              {t("footer.colFeedback")}
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {t("footer.feedbackPlaceholder")}
            </p>
            <div className="flex flex-col gap-3">
              <textarea
                placeholder={t("footer.feedbackPlaceholder")}
                className="w-full h-25 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/35 focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all resize-none"
                rows={3}
              />
              <button className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:translate-y-0.5">
                {t("footer.btnSubmit")}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar with centered copyright */}
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-white/50">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
