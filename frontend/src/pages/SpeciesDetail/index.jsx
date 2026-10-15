import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SpeciesDetailHero } from "./SpeciesDetailHero";
import { AnatomySection } from "./AnatomySection";
import { SizeComparisonSection } from "./SizeComparisonSection";
import { EcosystemNetworkSection } from "./EcosystemNetworkSection";
import { RelatedSpecies } from "./RelatedSpecies";
import { SpeciesComments } from "./SpeciesComments";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";
import { recordSpeciesView } from "../../services/speciesCommentsApi";
import { fetchSpeciesDetail } from "../../services/speciesApi";

export default function SpeciesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [species, setSpecies] = useState(() => {
    return (
      SEARCH_SPECIES_CATALOG.find((s) => s.id === id || s.slug === id) ||
      SEARCH_SPECIES_CATALOG[0]
    );
  });

  // Tải thông tin loài từ API cơ sở dữ liệu nếu có, hỗ trợ đầy đủ các loài Biển Đông
  useEffect(() => {
    let isMounted = true;
    if (id) {
      recordSpeciesView(id);

      fetchSpeciesDetail(id).then((apiData) => {
        if (!isMounted || !apiData) return;

        const localSpecies = SEARCH_SPECIES_CATALOG.find(
          (s) => s.id === id || s.slug === id
        );

        // Ưu tiên ảnh chất lượng cao có sẵn trong assets cục bộ, sau đó đến API media
        const primaryImage =
          localSpecies?.image ||
          apiData.media?.find((m) => m.isPrimary)?.url ||
          apiData.media?.[0]?.url ||
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop";

        const apiGallery = apiData.media?.map((m) => m.url).filter(Boolean) || [];
        const gallery =
          localSpecies?.gallery && localSpecies.gallery.length > 0
            ? localSpecies.gallery
            : apiGallery.length > 0
            ? apiGallery
            : [primaryImage];

        setSpecies((prev) => ({
          ...prev,
          id: apiData.id || id,
          slug: apiData.slug || id,
          code: apiData.code,
          nameVi: apiData.commonName,
          nameEn: apiData.commonName,
          sciName: apiData.scientificName || prev?.sciName,
          image: primaryImage,
          gallery: gallery,
          descVi: apiData.description || prev?.descVi,
          descEn: apiData.description || prev?.descEn,
          introHeaderVi: apiData.description || prev?.introHeaderVi,
          introHeaderEn: apiData.description || prev?.introHeaderEn,
          depth: `${apiData.depthMinM || 0}m - ${apiData.depthMaxM || 100}m`,
          size: `${apiData.sizeMinCm ? apiData.sizeMinCm / 100 : 1}m - ${apiData.sizeMaxCm ? apiData.sizeMaxCm / 100 : 2}m`,
          weight: `${apiData.weightMinKg || 10}kg - ${apiData.weightMaxKg || 50}kg`,
          statusVi: apiData.vietnamRedListStatus || prev?.statusVi || "Ít quan tâm (LC)",
          statusEn: apiData.vietnamRedListStatus || prev?.statusEn || "Least Concern (LC)",
          vietnamRedListStatus: apiData.vietnamRedListStatus,
          vietnamProtectionGroup: apiData.vietnamProtectionGroup,
          citesAppendix: apiData.citesAppendix,
          eastSeaZone: apiData.eastSeaZone,
          localDistribution: apiData.localDistribution,
          diet: apiData.diet,
          categoryVi: apiData.group?.name || prev?.categoryVi,
          categoryEn: apiData.group?.name || prev?.categoryEn,
        }));
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

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

        {/* 3. Mạng lưới sinh thái & Chuỗi thức ăn Biển Đông (Ecosystem Knowledge Graph) */}
        <EcosystemNetworkSection species={species} language={language} />

        {/* 4. Size comparison infographic section */}
        <SizeComparisonSection species={species} language={language} />

        {/* 4. Similar species recommendation cards */}
        <RelatedSpecies currentSpeciesId={species.id} language={language} />

        {/* 5. Species community opinions and comments */}
        <SpeciesComments speciesId={id || species?.id} species={species} />
      </main>

      <Footer />
    </div>
  );
}
