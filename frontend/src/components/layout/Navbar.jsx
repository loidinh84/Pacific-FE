import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Check, LogOut, User, HelpCircle } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useScroll } from "../../hooks/useScroll";
import { useClickOutside } from "../../hooks/useClickOutside";
import * as Images from "../../assets/Images";

export default function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const isScrolled = useScroll(60);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pacific_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("pacific_user");
      try {
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("pacific_auth_change", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("pacific_auth_change", checkUser);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("pacific_token");
    localStorage.removeItem("pacific_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("pacific_token");
    sessionStorage.removeItem("pacific_user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("pacific_auth_change"));
    window.location.href = "/";
  };

  useClickOutside(langDropdownRef, () => setIsLangOpen(false));
  useClickOutside(userDropdownRef, () => setIsUserOpen(false));

  const navLinks = [
    { label: t("nav.explore"), href: "/", hasDropdown: true },
    { label: t("nav.species"), href: "/search", hasDropdown: true },
    { label: language === "vi" ? "Độ Sâu Đại Dương" : "Ocean Depth", href: "/ocean-depth", hasDropdown: false },
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
        {/* Logo */}
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

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
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

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
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

          {/* User Auth Buttons or Logged-in User Profile Dropdown */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-full text-white text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                  {user.username?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <span className="max-w-[130px] truncate">
                  {user.full_name || user.username || user.email}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isUserOpen ? "rotate-180 text-pacific-blue-bright" : "text-white/60"
                  }`}
                />
              </button>

              {/* User Glassmorphism Dropdown Menu */}
              {isUserOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1b254b]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.2)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-[11px] text-white/50 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <User size={15} className="text-pacific-cyan" />
                    <span>Hồ sơ của tôi</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserOpen(false);
                      // Có thể mở Modal Báo cáo sự cố
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-pacific-cyan" />
                    <span>Báo cáo sự cố</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-all cursor-pointer mt-0.5"
                  >
                    <LogOut size={15} className="text-rose-400" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <User size={15} />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut size={15} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
