import { Search, Play } from "lucide-react";
import * as Images from "../../assets/Images";
import * as Icons from "../../assets/Icons";

/* Bubble data for background decoration */
const BUBBLES = [
  { size: "w-2 h-2", left: "left-[10%]", delay: "[0s]", duration: "[8s]" },
  { size: "w-3 h-3", left: "left-[25%]", delay: "[2s]", duration: "[11s]" },
  { size: "w-1.5 h-1.5", left: "left-[40%]", delay: "[4s]", duration: "[9s]" },
  { size: "w-4 h-4", left: "left-[55%]", delay: "[1s]", duration: "[13s]" },
  { size: "w-2.5 h-2.5", left: "left-[70%]", delay: "[3s]", duration: "[10s]" },
  { size: "w-1.5 h-1.5", left: "left-[80%]", delay: "[5s]", duration: "[12s]" },
  {
    size: "w-3.5 h-3.5",
    left: "left-[90%]",
    delay: "[1.5s]",
    duration: "[8s]",
  },
  { size: "w-2 h-2", left: "left-[5%]", delay: "[6s]", duration: "[14s]" },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_60%_50%,#0d2a5a_0%,#050d1a_50%,#020810_100%)]"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.05)_0%,transparent_40%)] pointer-events-none" />

      {/* Floating bubbles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className={`absolute bottom-[-20px] rounded-full bg-pacific-blue-bright/15 border border-pacific-blue-bright/20 animate-bubble ${b.size} ${b.left}`}
            style={{
              animationDelay: b.delay.replace("[", "").replace("]", ""),
              animationDuration: b.duration.replace("[", "").replace("]", ""),
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 py-32 md:py-20 min-h-screen">
          {/* Left: Content */}
          <div className="animate-fade-in-left text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
              Trái Đất có đại dương mang tên{" "}
              <span className="bg-gradient-to-r from-pacific-blue-bright to-pacific-cyan bg-clip-text text-transparent">
                Thái Bình Dương
              </span>{" "}
              rộng lớn
            </h1>

            <p className="text-base md:text-lg text-pacific-blue-pale leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              Nơi chứa đựng vô số bí ẩn và sinh vật kỳ thú. Hãy khám phá thế
              giới đại dương và hiểu rõ hơn về hành tinh xanh của chúng ta.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-white/5 hover:bg-blue-400/30 text-white border border-white/15 backdrop-blur-md transition-all -translate-y-0 cursor-pointer active:translate-y-0.5">
                <Search size={16} />
                Tìm hiểu
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-pacific-blue-bright to-pacific-teal text-white shadow-[0_4px_20px_rgba(14,165,233,0.4)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.6)] transition-all -translate-y-0 cursor-pointer active:translate-y-0.5">
                <Play size={15} fill="currentColor" />
                Khám phá
              </button>
            </div>
          </div>

          {/* Right: Visual Globe */}
          <div className="flex justify-center items-center relative animate-fade-in-right order-first md:order-last">
            <div className="relative w-64 md:w-80 lg:w-[480px] aspect-square">
              <div className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.2)_0%,transparent_70%)] animate-pulse-glow" />
              <div className="absolute inset-[-40px] rounded-full border border-pacific-blue-bright/10 animate-spin-slow">
                <div className="absolute top-[10%] left-[-4px] w-2 h-2 rounded-full bg-pacific-blue-bright shadow-[0_0_12px_#0ea5e9]" />
              </div>
              <img
                src={Images.BanDo5DaiDuong}
                alt="Trái Đất - Thái Bình Dương"
                className="w-full h-full object-cover rounded-full animate-float shadow-[0_0_60px_rgba(14,165,233,0.25),0_0_120px_rgba(14,165,233,0.1),inset_0_0_40px_rgba(0,0,0,0.2)] filter brightness-105 contrast-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest animate-fade-in-up">
        <div className="w-[1px] height-[40px] bg-gradient-to-b from-pacific-blue-bright/60 to-transparent animate-bounce h-10" />
        <Icons.ArrowBackLong className="w-5 h-5 opacity-70 text-blue-700 rotate-[-90deg]" />
      </div>
    </section>
  );
}
