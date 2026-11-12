import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { language } = useLanguage();
  const searchBackUrl = location.state?.fromSearch || "/search";

  const resolvedId = MOCK_SLUG_MAP[id] || id;

  // Tự động cuộn lên đầu trang khi đổi loài
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, resolvedId]);

  // Chuyển hướng id sang slug chuẩn
  useEffect(() => {
    if (MOCK_SLUG_MAP[id] && MOCK_SLUG_MAP[id] !== id) {
      navigate(`/species/${MOCK_SLUG_MAP[id]}`, {
        replace: true,
        state: location.state,
      });
    }
  }, [id, navigate, location.state]);

  const [species, setSpecies] = useState(() => {
    return (
      SEARCH_SPECIES_CATALOG.find(
        (s) => s.id === id || s.slug === id || s.slug === resolvedId
      ) || null
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

        // Ưu tiên ảnh thật từ API cơ sở dữ liệu (media do thợ lặn chụp), sau đó mới tới mock cục bộ
        const apiGallery = apiData.media?.map((m) => m.url).filter(Boolean) || [];
        const primaryImage =
          apiData.media?.find((m) => m.isPrimary)?.url ||
          apiData.media?.[0]?.url ||
          localSpecies?.image ||
          "";

        const gallery =
          apiGallery.length > 0
            ? apiGallery
            : localSpecies?.gallery && localSpecies.gallery.length > 0
            ? localSpecies.gallery
            : [primaryImage];

        setSpecies({
          id: apiData.id || id,
          slug: apiData.slug || id,
          code: apiData.code,
          nameVi: apiData.commonName,
          nameEn: apiData.commonName,
          sciName: apiData.scientificName,
          image: primaryImage,
          gallery: gallery,
          descVi: apiData.description,
          descEn: apiData.description,
          introHeaderVi: apiData.description,
          introHeaderEn: apiData.description,
          depth: `${apiData.depthMinM || 0}m - ${apiData.depthMaxM || 100}m`,
          size: `${apiData.sizeMinCm ? apiData.sizeMinCm / 100 : 0.1}m - ${apiData.sizeMaxCm ? apiData.sizeMaxCm / 100 : 0.2}m`,
          weight: `${apiData.weightMinKg || 0.01}kg - ${apiData.weightMaxKg || 0.1}kg`,
          statusVi: apiData.conservationStatus?.name || (apiData.vietnamRedListStatus === "LC" ? "Ít quan tâm (LC)" : apiData.vietnamRedListStatus) || "Ít quan tâm (LC)",
          statusEn: apiData.conservationStatus?.code || "LC",
          vietnamRedListStatus: apiData.vietnamRedListStatus,
          vietnamProtectionGroup: apiData.vietnamProtectionGroup,
          citesAppendix: apiData.citesAppendix,
          eastSeaZone: apiData.eastSeaZone,
          localDistribution: apiData.localDistribution,
          diet: apiData.diet,
          category: apiData.group?.slug || apiData.group?.name || "",
          categoryVi: apiData.group?.name || "",
          categoryEn: apiData.group?.name || "",
          model3dUrl: apiData.model_3d_url || apiData.model3dUrl || null,
          fullBioHighlightsVi: localSpecies?.fullBioHighlightsVi || null,
          fullBioHighlightsEn: localSpecies?.fullBioHighlightsEn || null,
          bioFactsVi: localSpecies?.bioFactsVi || null,
          bioFactsEn: localSpecies?.bioFactsEn || null,
          facts: apiData.facts || localSpecies?.facts || [],
          taxonomy: localSpecies?.taxonomy || null,
        });
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, resolvedId]);

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0f2744] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-slate-300 text-lg">Không tìm thấy sinh vật</p>
          <button
            onClick={() => navigate(searchBackUrl)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold cursor-pointer transition-all"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f2744] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
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
