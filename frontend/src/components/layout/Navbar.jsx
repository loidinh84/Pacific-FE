import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import * as Images from "../../assets/Images";

const navLinks = [
  { label: "Khám phá", href: "/#hero", hasDropdown: true },
  { label: "Sinh vật biển", href: "/#species", hasDropdown: true },
  { label: "Về chúng tôi", href: "/#about", hasDropdown: true },
  { label: "Trò chơi", href: "/#quiz", hasDropdown: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <span className="font-heading text-2xl font-black text-white tracking-tight">
            Pacific
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
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
          <button className="flex items-center gap-1.5 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-xs font-medium cursor-pointer transition-all">
            <Globe size={14} />
            <span>Ngôn ngữ</span>
            <ChevronDown size={12} />
          </button>
          <Link 
            to="/register"
            className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition-all cursor-pointer inline-block"
          >
            Đăng ký
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white shadow-[0_4px_20px_rgba(14,165,233,0.4)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.6)] active:translate-y-0.5 transition-all cursor-pointer inline-block"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="lg:hidden flex flex-col px-6 pb-6 pt-2 gap-1 border-t border-white/10 bg-pacific-dark">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-white/85 hover:text-white hover:bg-white/5 rounded-xl text-base font-medium transition-all"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
            <Link 
              to="/register"
              onClick={() => setIsMobileOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-all text-center"
            >
              Đăng ký
            </Link>
            <Link 
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white transition-all text-center"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
