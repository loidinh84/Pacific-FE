import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { LoginBrandPanel } from "./LoginBrandPanel";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      {/* Main Container - Split Layout Liquid Glass Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div className="w-full max-w-4xl liquid-glass-strong rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
          <LoginBrandPanel />
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
