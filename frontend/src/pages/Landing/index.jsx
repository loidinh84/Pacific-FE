import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SpeciesSection from "./SpeciesSection";
import SearchSection from "./SearchSection";

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
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <SpeciesSection />
        <SearchSection />
      </main>
      <Footer />
    </>
  );
}
