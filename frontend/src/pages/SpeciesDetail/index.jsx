import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SpeciesDetailHero } from "./SpeciesDetailHero";
import { AnatomySection } from "./AnatomySection";
import { SizeComparisonSection } from "./SizeComparisonSection";
import { RelatedSpecies } from "./RelatedSpecies";
import { SpeciesComments } from "./SpeciesComments";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";

export default function SpeciesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Find species or fallback to first species (Great White Shark)
  const species =
    SEARCH_SPECIES_CATALOG.find((s) => s.id === id) ||
    SEARCH_SPECIES_CATALOG[0];

  if (!species) {
    return (
      <div className="min-h-screen bg-[#071324] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-slate-400 text-lg">Không tìm thấy sinh vật</p>
          <button
            onClick={() => navigate("/search")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold cursor-pointer transition-all"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071324] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* 1. Hero with multi-image 3D coverflow & biological characteristics */}
        <SpeciesDetailHero species={species} language={language} />

        {/* 2. Scientific anatomy analysis illustration with interactive hotspots */}
        <AnatomySection species={species} language={language} />

        {/* 3. Size comparison infographic section */}
        <SizeComparisonSection species={species} language={language} />

        {/* 4. Similar species recommendation cards */}
        <RelatedSpecies currentSpeciesId={species.id} language={language} />

        {/* 5. Species community opinions and comments */}
        <SpeciesComments />
      </main>

      <Footer />
    </div>
  );
}
