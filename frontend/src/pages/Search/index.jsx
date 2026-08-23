import { useState, useMemo } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SearchHeroHeader } from "./SearchHeroHeader";
import { SearchFilterBar } from "./SearchFilterBar";
import { FeaturedSpeciesSlider } from "./FeaturedSpeciesSlider";
import { SearchGridList } from "./SearchGridList";
import { OceanFunFacts } from "./OceanFunFacts";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";

export default function Search() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("az");

  /* Real-time Filter & Sort Logic */
  const filteredSpecies = useMemo(() => {
    return SEARCH_SPECIES_CATALOG.filter((s) => {
      // Search term filter
      const term = searchTerm.toLowerCase().trim();
      const matchNameVi = s.nameVi.toLowerCase().includes(term);
      const matchNameEn = s.nameEn.toLowerCase().includes(term);
      const matchSciName = s.sciName.toLowerCase().includes(term);
      const matchDescVi = s.descVi.toLowerCase().includes(term);
      const matchSearch =
        !term || matchNameVi || matchNameEn || matchSciName || matchDescVi;

      // Category filter
      const matchCategory =
        !selectedCategory || s.category === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === "az") {
        const nameA = language === "en" ? a.nameEn : a.nameVi;
        const nameB = language === "en" ? b.nameEn : b.nameVi;
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "depth") {
        return a.depth.localeCompare(b.depth);
      }
      if (sortBy === "status") {
        return a.statusType.localeCompare(b.statusType);
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, sortBy, language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      document
        .getElementById("search-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSearchTermChange = (val) => {
    setSearchTerm(val);

    if (val.length < searchTerm.length) {
      setTimeout(() => {
        document
          .getElementById("search-hero")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-pacific-figma-dark text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambient Sunbeams */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(14,165,233,0.2)_0%,rgba(6,182,212,0.08)_35%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-pacific-blue-bright/10 blur-[140px] pointer-events-none animate-pulse-glow" />

      <Navbar />

      <main className="flex-1 relative z-10 pb-16">
        <SearchHeroHeader
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          onSearchSubmit={handleSearchSubmit}
        />

        <SearchFilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <FeaturedSpeciesSlider />

        <SearchGridList
          key={`${selectedCategory}|${sortBy}`}
          speciesList={filteredSpecies}
        />

        <OceanFunFacts />
      </main>

      <Footer />
    </div>
  );
}
