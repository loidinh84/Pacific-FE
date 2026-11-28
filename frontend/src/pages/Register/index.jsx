import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { RegisterBrandPanel } from "./RegisterBrandPanel";
import { RegisterForm } from "./RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-28 relative z-10">
        <div className="w-full max-w-4xl liquid-glass-strong rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
          <RegisterBrandPanel />
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
