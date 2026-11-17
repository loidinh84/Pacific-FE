import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { LoginBrandPanel } from "./LoginBrandPanel";
import { LoginForm } from "./LoginForm";

/* Decorative bubbles data */
const BUBBLES = [
  { size: "w-2.5 h-2.5", left: "left-[12%]", delay: "0s", duration: "8s" },
  { size: "w-4 h-4", left: "left-[25%]", delay: "2s", duration: "11s" },
  { size: "w-2 h-2", left: "left-[42%]", delay: "4s", duration: "7s" },
  { size: "w-5 h-5", left: "left-[58%]", delay: "1s", duration: "13s" },
  { size: "w-3 h-3", left: "left-[75%]", delay: "3s", duration: "9s" },
  { size: "w-4 h-4", left: "left-[88%]", delay: "5s", duration: "10s" },
];

export default function Login() {
  return (
    <div className="min-h-screen bg-pacific-figma-dark flex flex-col justify-between relative overflow-hidden">
      {/* Background Sunbeams / Light Rays */}
      {/* Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.18)_0%,rgba(6,182,212,0.06)_35%,transparent_70%)] pointer-events-none" />

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

      {/* Main Container - Split Layout Glassmorphism Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div className="w-full max-w-4xl bg-pacific-figma-card/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
          <LoginBrandPanel />
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
