import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SpeciesSection from "./SpeciesSection";
import SearchSection from "./SearchSection";
import PacificHotspotMap from "../../components/common/PacificHotspotMap";

// Import AOS styles and script
import AOS from "aos";
import "aos/dist/aos.css";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-pacific-figma-dark text-white selection:bg-pacific-cyan/30">
      {/* Bản đồ Biển Đông tương tác làm nền cho cả trang Landing */}
      <PacificHotspotMap asBackground />

      {/* Thanh điều hướng */}
      <Navbar />

      {/* Nội dung các phần của trang Landing */}
      <main className="relative z-10 overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <SpeciesSection />
        <SearchSection />
      </main>

      {/* Chân trang */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
