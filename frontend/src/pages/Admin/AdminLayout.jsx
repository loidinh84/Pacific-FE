import { useState, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Settings, Sun, Moon, LogOut, ExternalLink } from "lucide-react";
import * as Images from "../../assets/Images";
import { useTheme } from "../../hooks/useTheme";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

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
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
        isDark ? "bg-[#0b1329] text-white" : "bg-[#f4f7fb] text-slate-900"
      }`}
    >
      {/* ── 1. TOP HEADER (LOGO + RIGHT CONTROLS) ── */}
      <header
        className={`w-full border-b transition-colors duration-300 ${
          isDark ? "bg-[#0f1b38] border-white/10" : "bg-white border-slate-200"
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
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-amber-300 hover:text-amber-200"
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
                `flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-cyan-400 font-bold"
                    : isDark
                    ? "text-white/80 hover:text-white"
                    : "text-slate-700 hover:text-slate-900"
                }`
              }
            >
              <Settings size={15} />
              <span>Thiết lập hệ thống</span>
            </NavLink>

            {/* User Greeting: Xin chào, [Admin1] */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1 text-sm font-serif italic tracking-wide transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/90 hover:text-white"
                    : "text-slate-800 hover:text-black"
                }`}
              >
                <span>
                  Xin chào,{" "}
                  <strong className="font-semibold not-italic font-sans text-cyan-400">
                    [Admin1]
                  </strong>
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-52 p-2 rounded-2xl border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? "bg-[#132244] border-white/15 text-white shadow-black/50"
                      : "bg-white border-slate-200 text-slate-800 shadow-slate-300"
                  }`}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold leading-tight font-sans not-italic">
                      Admin 1
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans not-italic">
                      admin@pacific.org
                    </p>
                  </div>
                  <Link
                    to="/"
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                      isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                    }`}
                  >
                    <ExternalLink size={13} className="text-cyan-400" />
                    <span>Trang chủ Pacific</span>
                  </Link>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-rose-400 transition-colors cursor-pointer ${
                      isDark ? "hover:bg-rose-500/10" : "hover:bg-rose-50"
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
      <div className="w-full flex items-center justify-center pt-2 px-3">
        <nav
          className={`flex items-center gap-1 px-1 py-1 rounded-full border shadow-md transition-all max-w-full overflow-x-auto scrollbar-none ${
            isDark
              ? "bg-[#283868] border-white/10 text-white"
              : "bg-[#e2e8f5] border-slate-300 text-slate-800"
          }`}
        >
          {adminTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-3 py-1 rounded-full text-md font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-[#435f9f] text-white font-bold shadow-sm"
                      : "bg-white text-blue-800 font-bold shadow-sm"
                    : isDark
                      ? "text-white/80 hover:text-gray-400"
                      : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── 3. MAIN CONTENT OUTLET ── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
