import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Check,
  LogOut,
  User,
  HelpCircle,
  Shield,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useScroll } from "../../hooks/useScroll";
import { useClickOutside } from "../../hooks/useClickOutside";
import * as Images from "../../assets/Images";
import {
  getClientEffectiveUser,
  getStoredUser,
  isPreviewAsGuest,
  setPreviewAsGuest,
} from "../../utils/auth";

export default function Navbar() {
  const { language, changeLanguage, t } = useLanguage();
  const isScrolled = useScroll(60);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [user, setUser] = useState(() => getClientEffectiveUser());
  const [isGuestMode, setIsGuestMode] = useState(() => isPreviewAsGuest());

  useEffect(() => {
    const checkUser = () => {
      setUser(getClientEffectiveUser());
      setIsGuestMode(isPreviewAsGuest());
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("pacific_auth_change", checkUser);
    window.addEventListener("pacific_preview_mode_change", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("pacific_auth_change", checkUser);
      window.removeEventListener("pacific_preview_mode_change", checkUser);
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
    return () =>
      window.removeEventListener(
        "pacific_settings_update",
        handleSettingsUpdate,
      );
  }, []);

  useClickOutside(langDropdownRef, () => setIsLangOpen(false));
  useClickOutside(userDropdownRef, () => setIsUserOpen(false));

  const navLinks = [
    { label: t("nav.species"), href: "/search", hasDropdown: false },
    {
      label: language === "vi" ? "Bản Đồ Biển Đông" : "East Sea Map",
      href: "/map",
      hasDropdown: false,
    },
    {
      label: language === "vi" ? "Độ Sâu Biển Đông" : "East Sea Depth",
      href: "/ocean-depth",
      hasDropdown: false,
    },
    {
      label: language === "vi" ? "Đồ Thị Sinh Thái" : "Knowledge Graph",
      href: "/knowledge-graph",
      hasDropdown: false,
    },
    { label: t("nav.news"), href: "/news", hasDropdown: false },
  ];

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "VI" },
    { code: "en", label: "English", flag: "EN" },
  ];

  const currentLangObj =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,padding] duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-[#0f172a]/12 shadow-sm py-2.5"
          : "bg-white/88 backdrop-blur-xl border-b border-[#0f172a]/10 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={systemSettings?.general?.logoUrl || Images.Logo}
            alt={systemSettings?.general?.websiteName || "Logo"}
            className="w-8 h-8 object-contain"
          />
          <span className="font-heading text-xl font-bold text-[#0f172a] tracking-tight">
            {systemSettings?.general?.websiteName || "Biển Đông"}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={index}>
                <Link
                  to={link.href}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sky-600/12 text-[#0284c7]"
                      : "text-[#334155] hover:text-[#0f172a] hover:bg-sky-900/5"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-[#0f172a] liquid-glass-subtle hover:bg-white/85 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              <span className="text-[11px] font-mono font-semibold text-[#0284c7]">
                {currentLangObj.flag}
              </span>
              <span>{currentLangObj.label}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-150 ${
                  isLangOpen
                    ? "rotate-180 text-[#0284c7]"
                    : "text-[#475569]"
                }`}
              />
            </button>

            {/* Liquid Glass Language Menu */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 liquid-glass-strong rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-medium text-[#475569] border-b border-[#0f172a]/8 mb-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-sky-600/12 text-[#0284c7]"
                          : "text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold">
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[#0284c7]" />
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
                className="flex items-center gap-2 px-3 py-1.5 liquid-glass-subtle hover:bg-white/85 rounded-full text-[#0f172a] text-xs font-medium cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#0284c7] flex items-center justify-center text-white text-[11px] font-semibold">
                  {user.username?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <span className="max-w-[130px] truncate">
                  {user.full_name || user.username || user.email}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-150 ${
                    isUserOpen
                      ? "rotate-180 text-[#0284c7]"
                      : "text-[#475569]"
                  }`}
                />
              </button>

              {/* User Liquid Glass Dropdown Menu */}
              {isUserOpen && (
                <div className="absolute right-0 mt-2 w-56 liquid-glass-strong rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#0f172a]/8 mb-1">
                    <p className="text-xs font-semibold text-[#0f172a] truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-[11px] text-[#475569] truncate">
                      {user.email}
                    </p>
                  </div>

                  {(user.role === "admin" || user.role === "super_admin") && (
                    <>
                      <Link
                        to="/admin/species"
                        onClick={() => setIsUserOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#0284c7] hover:bg-sky-600/10 transition-colors cursor-pointer"
                      >
                        <Shield size={15} />
                        <span>Quản trị hệ thống</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserOpen(false);
                          setPreviewAsGuest(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="Tạm ẩn quyền admin để xem trang như một khách vãng lai thực thụ"
                      >
                        <Eye size={15} />
                        <span>Xem với tư cách Khách</span>
                      </button>
                    </>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setIsUserOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5 transition-colors cursor-pointer"
                  >
                    <User size={15} className="text-[#475569]" />
                    <span>Hồ sơ của tôi</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5 transition-colors cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-[#475569]" />
                    <span>Báo cáo sự cố</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-500/10 transition-colors cursor-pointer mt-0.5"
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5 transition-colors cursor-pointer inline-block"
              >
                {t("nav.register")}
              </Link>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0284c7] text-white hover:bg-[#0369a1] transition-colors cursor-pointer inline-block shadow-sm"
              >
                {t("nav.login")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Mở menu điều hướng"
          className="lg:hidden p-2 rounded-lg liquid-glass-subtle text-[#0f172a] hover:bg-white/85 transition-colors cursor-pointer"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden mt-3 px-6 py-4 liquid-glass-strong border-x-0 flex flex-col gap-1.5">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "bg-sky-600/12 text-[#0284c7]"
                  : "text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/5"
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5 mt-2 bg-white/60 rounded-xl border border-[#0f172a]/8">
            <span className="text-xs font-medium text-[#334155]">
              {t("nav.language")}
            </span>
            <div className="flex gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    language === lang.code
                      ? "bg-[#0284c7] text-white shadow-sm"
                      : "bg-[#0f172a]/6 text-[#334155] hover:text-[#0f172a]"
                  }`}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-3 pt-3 border-t border-[#0f172a]/10">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[#0f172a]/15 text-[#0f172a] hover:bg-[#0f172a]/5 transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <User size={15} />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-rose-500/30 text-rose-700 hover:bg-rose-500/10 transition-colors text-center flex items-center justify-center gap-1.5"
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
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#0f172a]/15 text-[#0f172a] hover:bg-[#0f172a]/5 transition-colors text-center"
                >
                  {t("nav.register")}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors text-center shadow-sm"
                >
                  {t("nav.login")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Guest Mode Banner */}
      {isGuestMode &&
        (() => {
          const rawAdminUser = getStoredUser();
          const isActualAdmin =
            rawAdminUser &&
            (rawAdminUser.role === "admin" ||
              rawAdminUser.role === "super_admin");
          if (!isActualAdmin) return null;

          return (
            <aside
              aria-label="Chế độ xem trước của quản trị viên"
              className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
            >
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass-strong border-amber-500/35 text-[#0f172a] text-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                    <Eye size={13} />
                    <span>Chế độ xem Khách</span>
                  </div>
                  <p className="text-[11px] text-[#475569]">
                    Đang ẩn quyền Admin để xem góc nhìn người dùng
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[#0f172a]/10">
                  <button
                    onClick={() => setPreviewAsGuest(false)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 font-medium border border-amber-500/30 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Thoát chế độ khách
                  </button>
                  <Link
                    to="/admin/species"
                    onClick={() => setPreviewAsGuest(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium transition-colors whitespace-nowrap"
                  >
                    Vào Admin
                  </Link>
                </div>
              </div>
            </aside>
          );
        })()}
    </nav>
  );
}
