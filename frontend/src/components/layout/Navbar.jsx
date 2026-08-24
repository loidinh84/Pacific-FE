import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useScroll } from "../../hooks/useScroll";
import { useClickOutside } from "../../hooks/useClickOutside";
import * as Images from "../../assets/Images";

export default function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const isScrolled = useScroll(60);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useClickOutside(langDropdownRef, () => setIsLangOpen(false));

  const navLinks = [
    { label: t("nav.explore"), href: "/", hasDropdown: true },
    { label: t("nav.species"), href: "/search", hasDropdown: true },
    { label: t("nav.about"), href: "/#about", hasDropdown: true },
  ];

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "EN" },
  ];

  const currentLangObj =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-pacific-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Images.Logo}
              alt="Pacific Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-heading text-2xl font-bold text-white tracking-tight">
              Pacific
            </span>
          </Link>
        </div>

        {/* Center: Desktop navigation links (Strictly Centered) */}
        <ul className="hidden lg:flex flex-none items-center justify-center gap-1">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-sm font-medium transition-all"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={13} />}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Desktop actions */}
        <div className="hidden lg:flex flex-1 items-center justify-end gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95"
            >
              <span className="text-sm leading-none">{currentLangObj.flag}</span>
              <span>{currentLangObj.label}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isLangOpen
                    ? "rotate-180 text-pacific-blue-bright"
                    : "text-white/60"
                }`}
              />
            </button>

            {/* Glassmorphism Language Menu */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#1b254b]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.2)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10 mb-1">
                  {t("nav.language")}
                </div>
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-pacific-blue-bright/20 to-pacific-teal/20 text-pacific-cyan border border-pacific-blue-bright/30"
                          : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-pacific-cyan" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Register Button */}
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition-all cursor-pointer inline-block"
          >
            {t("nav.register")}
          </Link>

          {/* Login Button */}
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-400 transition-all cursor-pointer inline-block active:translate-y-0.5"
          >
            {t("nav.login")}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden mt-3 px-6 py-4 bg-pacific-navy/95 backdrop-blur-xl border-b border-white/10 flex flex-col gap-2">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="px-4 py-2.5 text-white/85 hover:text-white hover:bg-white/5 rounded-xl text-base font-medium transition-all"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5 mt-2 bg-white/5 rounded-xl border border-white/10">
            <span className="text-xs font-semibold text-white/70">
              {t("nav.language")}
            </span>
            <div className="flex gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang.code
                      ? "bg-pacific-blue-bright text-white shadow-md"
                      : "bg-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-3 pt-3 border-t border-white/10">
            <Link
              to="/register"
              onClick={() => setIsMobileOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all text-center"
            >
              {t("nav.register")}
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white transition-all text-center"
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
