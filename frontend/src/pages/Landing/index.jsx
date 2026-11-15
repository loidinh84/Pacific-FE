import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "./HeroSection";
import SpeciesSection from "./SpeciesSection";
import LocationsShowcaseSection from "./LocationsShowcaseSection";
import SearchSection from "./SearchSection";
import PacificHotspotMap from "../../components/common/PacificHotspotMap";

// Import AOS styles and script
import AOS from "aos";
import "aos/dist/aos.css";

export default function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-pacific-figma-dark text-white selection:bg-pacific-cyan/30">
      {/* Bản đồ Biển Đông tương tác làm nền cho khu vực Hero */}
      <PacificHotspotMap asBackground />

      {/* Thanh điều hướng */}
      <Navbar />

      {/* Nội dung các phần của trang Landing */}
      <main className="relative z-20">
        <HeroSection />
        <SpeciesSection />
        <LocationsShowcaseSection />
        <SearchSection />
      </main>

      {/* Chân trang */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
