import { useState, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Settings, Sun, Moon, LogOut, User } from "lucide-react";
import * as Images from "../../assets/Images";
import { useTheme } from "../../hooks/useTheme";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const storedUser =
    localStorage.getItem("pacific_user") ||
    localStorage.getItem("user") ||
    sessionStorage.getItem("pacific_user") ||
    sessionStorage.getItem("user");

  let currentUser = { username: "Admin 1", email: "admin@pacific.org" };
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (error) {
      console.warn("Lỗi parse thông tin user từ storage:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("pacific_token");
    localStorage.removeItem("pacific_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("pacific_token");
    sessionStorage.removeItem("pacific_user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("pacific_auth_change"));
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const adminTabs = [
    { label: "Thống kê", path: "/admin/stats" },
    { label: "Sinh vật", path: "/admin/species" },
    { label: "Nhóm sinh vật", path: "/admin/groups" },
    { label: "Địa điểm", path: "/admin/locations" },
    { label: "Người dùng", path: "/admin/users" },
    { label: "Bình luận", path: "/admin/comments" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans relative ${
        isDark ? "bg-[#1b254b] text-white" : "bg-[#f4f7fb] text-slate-900"
      }`}
    >
      {/* Ocean Sunbeams & Coral Reef Atmosphere */}
      {isDark && (
        <>
          {/* Base Underwater Coral Sunbeams Image */}
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-85"
            style={{ backgroundImage: `url(${Images.PacificOceanCoralBg})` }}
          />

          {/* Deep Ocean Soft Ambient Vignette & Contrast Overlay (Light & Crisp, No Heavy Dark Shadow) */}
          <div className="fixed inset-0 bg-gradient-to-b from-[#0a142c]/30 via-transparent to-[#081024]/40 pointer-events-none z-0" />
        </>
      )}

      {/* ── 1. TOP HEADER (LOGO + RIGHT CONTROLS) ── */}
      <header
        className={`w-full border-b transition-colors duration-300 relative z-50 ${
          isDark ? "bg-[#0c1633]/90 backdrop-blur-md border-white/15" : "bg-white border-slate-200"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src={Images.Logo}
              alt="Pacific Logo"
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
            />
            <span
              className={`font-heading text-2xl font-bold tracking-tight transition-colors ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Pacific
            </span>
          </Link>

          {/* Right: Theme Toggle, Settings & User Greeting */}
          <div className="flex items-center gap-4">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 border-white/20 text-amber-300 hover:text-amber-200"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title={
                isDark ? "Chuyển sang chế độ Sáng" : "Chuyển sang chế độ Tối"
              }
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* System Settings Navigation Button */}
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-cyan-300 font-bold"
                    : isDark
                    ? "text-white/90 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`
              }
            >
              <Settings size={15} />
              <span>Thiết lập hệ thống</span>
            </NavLink>

            {/* User Greeting: Xin chào, [Username] */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1 text-sm font-serif italic tracking-wide transition-colors cursor-pointer ${
                  isDark
                    ? "text-white hover:text-cyan-200"
                    : "text-slate-800 hover:text-black"
                }`}
              >
                <span>
                  Xin chào,{" "}
                  <strong className="font-semibold not-italic font-sans text-cyan-300">
                    [{currentUser.username || "Admin"}]
                  </strong>
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-52 p-2 rounded-2xl border shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? "bg-[#0f1d3f] border-white/20 text-white"
                      : "bg-white border-slate-200 text-slate-800 shadow-slate-300"
                  }`}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold leading-tight font-sans not-italic text-white">
                      {currentUser.username || "Admin 1"}
                    </p>
                    <p className="text-[11px] text-slate-300 font-sans not-italic">
                      {currentUser.email || "admin@pacific.org"}
                    </p>
                  </div>
                  <Link
                    to="/admin/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-cyan-300 font-medium transition-colors cursor-pointer mb-0.5 ${
                      isDark ? "hover:bg-cyan-500/20" : "hover:bg-cyan-50"
                    }`}
                  >
                    <User size={13} />
                    <span>Hồ sơ của tôi</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-rose-400 font-medium transition-colors cursor-pointer ${
                      isDark ? "hover:bg-rose-500/20" : "hover:bg-rose-50"
                    }`}
                  >
                    <LogOut size={13} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. THANH ĐIỀU HƯỚNG ── */}
      <div className="w-full flex items-center justify-center pt-3 px-3 relative z-20">
        <nav
          className={`flex items-center gap-1.5 p-1.5 rounded-full border shadow-sm transition-all max-w-full overflow-x-auto scrollbar-none ${
            isDark
              ? "bg-[#0e1b3d]/90 backdrop-blur-md border-white/20 text-white"
              : "bg-white/90 backdrop-blur-md border-slate-300 text-slate-800 shadow-slate-200/50"
          }`}
        >
          {adminTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-sm"
                    : isDark
                      ? "text-white hover:text-cyan-200 hover:bg-white/15"
                      : "text-slate-800 hover:text-black hover:bg-slate-200"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── 3. MAIN CONTENT OUTLET ── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 relative z-0">
        <Outlet />
      </main>
    </div>
  );
}
