import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import SpeciesSection from "../components/sections/SpeciesSection";
import SearchSection from "../components/sections/SearchSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";

// Import AOS styles and script
import AOS from "aos";
import "aos/dist/aos.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian chạy animation (1 giây)
      once: false,    // Chạy lại animation khi scroll ngược lên/xuống
      mirror: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <SpeciesSection />
        <SearchSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
