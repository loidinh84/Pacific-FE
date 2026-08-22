import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { RegisterBrandPanel } from "./RegisterBrandPanel";
import { RegisterForm } from "./RegisterForm";

const BUBBLES = [
  { size: "w-2.5 h-2.5", left: "left-[12%]", delay: "0s", duration: "8s" },
  { size: "w-4 h-4", left: "left-[25%]", delay: "2s", duration: "11s" },
  { size: "w-2 h-2", left: "left-[42%]", delay: "4s", duration: "7s" },
  { size: "w-5 h-5", left: "left-[58%]", delay: "1s", duration: "13s" },
  { size: "w-3 h-3", left: "left-[75%]", delay: "3s", duration: "9s" },
];

export default function Register() {
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
            className={`absolute bottom-[-20px] rounded-full bg-pacific-bubble border border-pacific-blue-bright/30 animate-bubble ${b.size} ${b.left}`}
            style={{
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div className="w-full max-w-4xl bg-pacific-figma-card/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
          <RegisterBrandPanel />
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
