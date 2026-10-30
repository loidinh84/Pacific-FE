import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SpeciesDetailHero } from "./SpeciesDetailHero";
import { AnatomySection } from "./AnatomySection";
import { EcosystemNetworkSection } from "./EcosystemNetworkSection";
import { HabitatAndBehaviorSection } from "./HabitatAndBehaviorSection";
import { ConservationAndThreatsSection } from "./ConservationAndThreatsSection";
import { SpeciesFacts } from "./SpeciesFacts";
import { RelatedSpecies } from "./RelatedSpecies";
import { SpeciesComments } from "./SpeciesComments";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";
import { recordSpeciesView } from "../../services/speciesCommentsApi";
import { fetchSpeciesDetail } from "../../services/speciesApi";

const MOCK_SLUG_MAP = {
  "giant-octopus-3": "bach-tuoc-khong-lo",
  octopus: "bach-tuoc-khong-lo",
  "whale-shark": "ca-map-voi-nham-voi",
  "whale-shark-2": "ca-map-voi-nham-voi",
  "bluefin-tuna-1": "ca-ngu-vay-vang-dai-duong",
  "great-white-shark-1": "great-white-shark-1",
};

export default function SpeciesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const resolvedId = MOCK_SLUG_MAP[id] || id;

  // Tự động cuộn lên đầu trang khi đổi loài
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, resolvedId]);

  // Chuyển hướng id sang slug chuẩn
  useEffect(() => {
    if (MOCK_SLUG_MAP[id] && MOCK_SLUG_MAP[id] !== id) {
      navigate(`/species/${MOCK_SLUG_MAP[id]}`, { replace: true });
    }
  }, [id, navigate]);

  const [species, setSpecies] = useState(() => {
    return (
      SEARCH_SPECIES_CATALOG.find(
        (s) => s.id === id || s.slug === id || s.slug === resolvedId
      ) || SEARCH_SPECIES_CATALOG[0]
    );
  });

  // Tải thông tin loài từ API cơ sở dữ liệu nếu có, hỗ trợ đầy đủ các loài Biển Đông
  useEffect(() => {
    let isMounted = true;
    const targetId = resolvedId || id;
    if (targetId) {
      recordSpeciesView(targetId);

      fetchSpeciesDetail(targetId).then((apiData) => {
        if (!isMounted || !apiData) return;

        const localSpecies = SEARCH_SPECIES_CATALOG.find(
          (s) => s.id === id || s.slug === id || s.slug === resolvedId
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
          fullBioHighlightsVi: localSpecies?.fullBioHighlightsVi || prev?.fullBioHighlightsVi,
          fullBioHighlightsEn: localSpecies?.fullBioHighlightsEn || prev?.fullBioHighlightsEn,
          bioFactsVi: localSpecies?.bioFactsVi || prev?.bioFactsVi,
          bioFactsEn: localSpecies?.bioFactsEn || prev?.bioFactsEn,
          facts: apiData.facts || localSpecies?.facts || [],
        }));
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, resolvedId]);

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

        {/* Mạng lưới sinh thái và chuỗi thức ăn Biển Đông */}
        <EcosystemNetworkSection species={species} language={language} />

        {/* 4. Sinh cảnh sống, Tầng nước & Tập tính sinh học Biển Đông */}
        <HabitatAndBehaviorSection species={species} language={language} />

        {/* 5. Tình trạng bảo tồn Sách Đỏ, Khung pháp lý & Các mối đe dọa */}
        <ConservationAndThreatsSection species={species} language={language} />

        {/* Thông tin thú vị về loài */}
        <SpeciesFacts species={species} language={language} />

        {/* 7. Sinh vật tương tự cùng hệ sinh thái Biển Đông */}
        <RelatedSpecies currentSpeciesId={species.id} language={language} />

        {/* 8. Đóng góp ý kiến & Thảo luận cộng đồng */}
        <SpeciesComments speciesId={resolvedId || id || species?.id} species={species} />
      </main>

      <Footer />
    </div>
  );
}
