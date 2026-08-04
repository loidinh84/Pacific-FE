import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Compass, Waves } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import * as Images from "../assets/Images";

const BUBBLES = [
  { size: "w-2.5 h-2.5", left: "left-[12%]", delay: "0s", duration: "8s" },
  { size: "w-4 h-4", left: "left-[25%]", delay: "2s", duration: "11s" },
  { size: "w-2 h-2", left: "left-[42%]", delay: "4s", duration: "7s" },
  { size: "w-5 h-5", left: "left-[58%]", delay: "1s", duration: "13s" },
  { size: "w-3 h-3", left: "left-[75%]", delay: "3s", duration: "9s" },
];

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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [creatureIndex, setCreatureIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCreatureIndex((prev) => (prev + 1) % RANDOM_CREATURES.length);
        setIsFading(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentCreature = RANDOM_CREATURES[creatureIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register submit:", { fullName, email, password });
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark flex flex-col justify-between relative overflow-hidden">
      {/* Background Sunbeams / Light Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.25)_0%,rgba(6,182,212,0.1)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[conic-gradient(from_90deg_at_50%_0%,rgba(14,165,233,0.15)_0deg,transparent_60deg,rgba(34,211,238,0.12)_120deg,transparent_180deg)] pointer-events-none blur-xl opacity-70" />

      {/* Background Glowing Orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-pacific-teal/15 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

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

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div 
          className="w-full max-w-4xl bg-pacific-figma-card/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_50px_rgba(14,165,233,0.2)] overflow-hidden grid grid-cols-1 md:grid-cols-12"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          {/* Left Column: Ocean Branding / Art Visual Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-pacific-navy-mid/80 via-pacific-navy/90 to-pacific-darkest/90 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pacific-blue-bright/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pacific-teal/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pacific-blue-bright/15 border border-pacific-blue-bright/30 text-pacific-blue-light text-xs font-semibold uppercase tracking-wider mb-6">
                🌊 &nbsp; Gia nhập Pacific
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white font-heading leading-tight mb-3">
                Bắt đầu hành trình đại dương ngay hôm nay
              </h2>
              <p className="text-xs lg:text-sm text-pacific-blue-pale leading-relaxed">
                Tạo tài khoản miễn phí để lưu giữ lịch sử trắc nghiệm và theo dõi tiến trình khám phá sinh vật biển.
              </p>
            </div>

            <div className="my-8 flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-pacific-blue-bright/20 border border-pacific-blue-bright/30 flex items-center justify-center text-pacific-blue-light">
                  <Compass size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Trải nghiệm cá nhân hóa</p>
                  <p className="text-[11px] text-pacific-text-muted">Lưu lại thông tin bài làm trắc nghiệm</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-pacific-teal/20 border border-pacific-teal/30 flex items-center justify-center text-pacific-cyan">
                  <Waves size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Kết nối cộng đồng</p>
                  <p className="text-[11px] text-pacific-text-muted">Đóng góp và thảo luận kiến thức</p>
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
                <div className={`transition-all duration-300 min-w-0 ${isFading ? "opacity-0" : "opacity-100"}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate">{currentCreature.name}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pacific-blue-bright/20 text-pacific-blue-light font-semibold border border-pacific-blue-bright/30 whitespace-nowrap">
                      {currentCreature.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-pacific-blue-pale italic truncate font-light">{currentCreature.sciName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphism Register Form */}
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center relative">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-2">
                Tạo tài khoản
              </h1>
              <p className="text-xs md:text-sm text-pacific-blue-pale font-medium">
                Nhập thông tin cá nhân của bạn để đăng ký.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Full Name */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-2.5 bg-[#202c59] text-[11px] font-semibold text-pacific-blue-pale rounded-full z-10 border border-white/15">
                  Họ và tên
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-4 text-pacific-blue-light" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-2.5 bg-[#202c59] text-[11px] font-semibold text-pacific-blue-pale rounded-full z-10 border border-white/15">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-4 text-pacific-blue-light" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-2.5 bg-[#202c59] text-[11px] font-semibold text-pacific-blue-pale rounded-full z-10 border border-white/15">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-4 text-pacific-blue-light" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-pacific-blue-bright focus:bg-white/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pacific-blue-bright via-pacific-teal to-pacific-cyan hover:from-sky-600 hover:via-teal-600 hover:to-cyan-600 hover:brightness-110 shadow-[0_4px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.55)] active:translate-y-0.5 transition-all duration-300 cursor-pointer text-base mt-1"
              >
                Tạo tài khoản
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-white/70">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-pacific-blue-light font-bold hover:underline transition-colors ml-1"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
