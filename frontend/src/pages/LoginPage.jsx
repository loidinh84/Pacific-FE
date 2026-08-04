import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import * as Images from "../assets/Images";

/* Decorative bubbles data */
const BUBBLES = [
  { size: "w-2.5 h-2.5", left: "left-[12%]", delay: "0s", duration: "8s" },
  { size: "w-4 h-4", left: "left-[25%]", delay: "2s", duration: "11s" },
  { size: "w-2 h-2", left: "left-[42%]", delay: "4s", duration: "7s" },
  { size: "w-5 h-5", left: "left-[58%]", delay: "1s", duration: "13s" },
  { size: "w-3 h-3", left: "left-[75%]", delay: "3s", duration: "9s" },
  { size: "w-4 h-4", left: "left-[88%]", delay: "5s", duration: "10s" },
];

/* Random Sea Creatures List for Bottom Accent Carousel */
const RANDOM_CREATURES = [
  {
    name: "Cá mập voi",
    sciName: "Rhincodon typus",
    image: Images.CaMapVoi,
    tag: "Khổng lồ hiền lành",
  },
  {
    name: "Bạch tuộc khổng lồ",
    sciName: "Enteroctopus dofleini",
    image: Images.BachTuotKhongLo,
    tag: "Thông minh kiệt xuất",
  },
  {
    name: "Cá heo Thái Bình Dương",
    sciName: "Delphinidae",
    image: Images.FishHidden,
    tag: "Thân thiện & Nhanh nhẹn",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  /* Random Creature Switcher State */
  const [creatureIndex, setCreatureIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCreatureIndex((prev) => (prev + 1) % RANDOM_CREATURES.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentCreature = RANDOM_CREATURES[creatureIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark flex flex-col justify-between relative overflow-hidden">
      {/* Background Sunbeams / Light Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.25)_0%,rgba(6,182,212,0.1)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[conic-gradient(from_90deg_at_50%_0%,rgba(14,165,233,0.15)_0deg,transparent_60deg,rgba(34,211,238,0.12)_120deg,transparent_180deg)] pointer-events-none blur-xl opacity-70" />

      {/* Background Glowing Orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div
        className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-pacific-teal/15 blur-[120px] pointer-events-none animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      {/* Animated Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className={`absolute bottom-[-20px] rounded-full bg-pacific-blue-light/20 border border-pacific-blue-bright/30 animate-bubble ${b.size} ${b.left}`}
            style={{
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Container - Split Layout Glassmorphism Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div
          className="w-full max-w-4xl bg-pacific-figma-card/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          {/* Left Column: Ocean Branding / Art Visual Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-pacific-navy-mid/80 via-pacific-navy/90 to-pacific-darkest/90 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
            {/* Ambient Background Blur inside Art Panel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pacific-blue-bright/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pacific-teal/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Branding */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pacific-blue-bright/15 border border-pacific-blue-bright/30 text-pacific-blue-light text-xs font-semibold uppercase tracking-wider mb-6">
                &nbsp; Thái Bình Dương
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white font-heading leading-tight mb-3">
                Khám phá thế giới đại dương kỳ diệu
              </h2>
              <p className="text-xs lg:text-sm text-pacific-blue-pale leading-relaxed">
                Đăng nhập để trải nghiệm trọn vẹn hành trình tìm hiểu hàng trăm
                sinh vật biển phong phú.
              </p>
            </div>

            {/* Middle Feature Highlights */}
            <div className="my-8 flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 flex items-center justify-center text-pacific-blue-light">
                  <Compass size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Tra cứu đa dạng
                  </p>
                  <p className="text-[11px] text-pacific-text-muted">
                    Dữ liệu hàng trăm loài sinh vật
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-pacific-teal/20 border border-pacific-teal/30 flex items-center justify-center text-pacific-cyan">
                  <Waves size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Trắc nghiệm sinh động
                  </p>
                  <p className="text-[11px] text-pacific-text-muted">
                    Khám phá tính cách đại dương
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 flex items-center justify-center text-pacific-blue-light">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Bảo mật thông tin
                  </p>
                  <p className="text-[11px] text-pacific-text-muted">
                    An toàn tuyệt đối cho tài khoản
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Accent - Dynamic Random Sea Creature Card */}
            <div className="relative z-10 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
                <div className="w-10 h-10 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
                  <img
                    src={currentCreature.image}
                    alt={currentCreature.name}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      isFading ? "opacity-0 scale-90" : "opacity-100 scale-100"
                    }`}
                  />
                </div>
                <div
                  className={`transition-all duration-300 min-w-0 ${isFading ? "opacity-0" : "opacity-100"}`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate">
                      {currentCreature.name}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pacific-blue-bright/20 text-pacific-blue-light font-semibold border border-pacific-blue-bright/30 whitespace-nowrap">
                      {currentCreature.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-pacific-blue-pale italic truncate font-light">
                    {currentCreature.sciName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphism Login Form */}
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center relative">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-2">
                Đăng nhập
              </h1>
              <p className="text-xs md:text-sm text-pacific-blue-pale font-medium">
                Chào mừng bạn trở lại! Vui lòng nhập thông tin.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Field Email */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Mail
                    size={16}
                    className="absolute left-4 text-pacific-blue-light z-10 pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 focus:ring-2 focus:ring-pacific-blue-bright/20 transition-all font-medium"
                  />
                  <label
                    htmlFor="login-email"
                    className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:left-4 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-pacific-blue-pale peer-focus:bg-[#202c59] peer-focus:rounded-full peer-focus:border peer-focus:border-white/15 peer-focus:px-2.5 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-pacific-blue-pale peer-[:not(:placeholder-shown)]:bg-[#202c59] peer-[:not(:placeholder-shown)]:rounded-full peer-[:not(:placeholder-shown)]:border peer-[:not(:placeholder-shown)]:border-white/15 peer-[:not(:placeholder-shown)]:px-2.5"
                  >
                    Email
                  </label>
                </div>
              </div>

              {/* Field Password */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Lock
                    size={16}
                    className="absolute left-4 text-pacific-blue-light z-10 pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full pl-11 pr-11 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 focus:ring-2 focus:ring-pacific-blue-bright/20 transition-all font-medium"
                  />
                  <label
                    htmlFor="login-password"
                    className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:left-4 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-pacific-blue-pale peer-focus:bg-[#202c59] peer-focus:rounded-full peer-focus:border peer-focus:border-white/15 peer-focus:px-2.5 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-pacific-blue-pale peer-[:not(:placeholder-shown)]:bg-[#202c59] peer-[:not(:placeholder-shown)]:rounded-full peer-[:not(:placeholder-shown)]:border peer-[:not(:placeholder-shown)]:border-white/15 peer-[:not(:placeholder-shown)]:px-2.5"
                  >
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-pacific-blue-bright focus:ring-0 focus:ring-offset-0 cursor-pointer accent-pacific-blue-bright"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a
                  href="#"
                  className="text-pacific-blue-light hover:underline font-medium transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-indigo-400 hover:to-cyan-600 hover:brightness-110 active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1"
              >
                Đăng nhập
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-0.5">
                <div className="w-full border-t border-white/10" />
                <span className="absolute px-3 bg-[#232f5d] text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  hoặc đăng nhập bằng
                </span>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
                >
                  <FcGoogle size={16} />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-semibold transition-all cursor-pointer active:translate-y-0.5"
                >
                  <FaGithub size={16} />
                  <span>GitHub</span>
                </button>
              </div>
            </form>

            {/* Footer Link to Register */}
            <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-white/70">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-pacific-blue-light font-bold hover:underline transition-colors ml-1"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
