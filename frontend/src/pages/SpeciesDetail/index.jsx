import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
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
import {
  formatSizeRange,
  formatWeightRange,
  formatDepthRange,
  formatConservationVi,
} from "../../utils/speciesFormatters";

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

  const targetId = resolvedId || id;

  const [speciesState, setSpeciesState] = useState(() => {
    const local = SEARCH_SPECIES_CATALOG.find(
      (s) => s.id === id || s.slug === id || s.slug === resolvedId
    );
    return {
      targetId,
      data: local || null,
      isLoading: !local,
    };
  });

  const isCurrentTarget = speciesState.targetId === targetId;
  const species = isCurrentTarget ? speciesState.data : null;
  const isLoading = !isCurrentTarget || speciesState.isLoading;

  // Tải thông tin loài từ API cơ sở dữ liệu nếu có, hỗ trợ đầy đủ các loài Biển Đông
  useEffect(() => {
    let isMounted = true;
    if (targetId) {
      recordSpeciesView(targetId);

      const localSpecies = SEARCH_SPECIES_CATALOG.find(
        (s) => s.id === id || s.slug === id || s.slug === resolvedId
      );

      fetchSpeciesDetail(targetId)
        .then((apiData) => {
          if (!isMounted) return;

          if (!apiData) {
            setSpeciesState({
              targetId,
              data: localSpecies || null,
              isLoading: false,
            });
            return;
          }

          // Ưu tiên ảnh thật từ API cơ sở dữ liệu (media do thợ lặn chụp), sau đó mới tới mock cục bộ
          const primaryImage =
            apiData.media?.find((m) => m.isPrimary)?.url ||
            apiData.media?.[0]?.url ||
            localSpecies?.image ||
            null;

          const apiGallery = apiData.media?.map((m) => m.url).filter(Boolean) || [];
          const gallery =
            localSpecies?.gallery && localSpecies.gallery.length > 0
              ? localSpecies.gallery
              : apiGallery.length > 0
              ? apiGallery
              : primaryImage
              ? [primaryImage]
              : [];

          const formattedSize = formatSizeRange(apiData.sizeMinCm, apiData.sizeMaxCm);
          const formattedWeight = formatWeightRange(apiData.weightMinKg, apiData.weightMaxKg);
          const formattedDepth = formatDepthRange(apiData.depthMinM, apiData.depthMaxM);
          const statusCode =
            apiData.conservationStatus?.code ||
            apiData.vietnamRedListStatus ||
            "NE";

          setSpeciesState({
            targetId,
            isLoading: false,
            data: {
              id: apiData.id || id,
              slug: apiData.slug || id,
              code: apiData.code,
              sourceApiId: apiData.sourceApiId || null,
              nameVi: apiData.commonName,
              nameEn: apiData.commonName,
              sciName: apiData.scientificName,
              image: primaryImage,
              gallery: gallery,
              descVi: apiData.description,
              descEn: apiData.description,
              introHeaderVi: apiData.description,
              introHeaderEn: apiData.description,
              depth: formattedDepth,
              size: formattedSize,
              weight: formattedWeight,
              temperatureMinC: apiData.temperatureMinC ?? null,
              temperatureMaxC: apiData.temperatureMaxC ?? null,
              statusVi: formatConservationVi(apiData.conservationStatus, apiData.vietnamRedListStatus),
              statusEn: statusCode,
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
              taxonomy: apiData.taxonomy || localSpecies?.taxonomy || null,
            },
          });
        })
        .catch(() => {
          if (!isMounted) return;
          setSpeciesState({
            targetId,
            data: localSpecies || null,
            isLoading: false,
          });
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, resolvedId, targetId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f2744] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16 w-full">
          {/* Skeleton Breadcrumbs */}
          <div className="w-48 h-4 bg-white/10 rounded mb-6 animate-pulse" />

          {/* Skeleton Header */}
          <div className="space-y-3 mb-8 animate-pulse">
            <div className="w-64 sm:w-80 h-10 bg-white/15 rounded-xl" />
            <div className="w-44 h-5 bg-white/10 rounded-lg" />
            <div className="w-full max-w-2xl h-14 bg-white/5 rounded-xl" />
          </div>

          {/* Skeleton Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 animate-pulse">
            <div className="h-20 bg-white/10 rounded-2xl" />
            <div className="h-20 bg-white/10 rounded-2xl" />
            <div className="h-20 bg-white/10 rounded-2xl" />
            <div className="h-20 bg-white/10 rounded-2xl" />
          </div>

          {/* Skeleton Image Coverflow */}
          <div className="w-full h-[260px] sm:h-[360px] rounded-2xl bg-white/[0.04] border border-white/10 mb-10 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-xs text-slate-300 font-medium">
              Đang tải dữ liệu sinh vật Biển Đông...
            </span>
          </div>

          {/* Skeleton Taxonomy */}
          <div className="w-full h-36 bg-white/[0.04] border border-white/10 rounded-2xl animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0f2744] flex flex-col justify-between text-white selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="text-center max-w-md p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
              <Compass size={28} className="text-cyan-400/70" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Không tìm thấy sinh vật</h2>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                Sinh vật này không tồn tại trong danh mục hoặc đường dẫn chưa chính xác.
              </p>
            </div>
            <button
              onClick={() => navigate(searchBackUrl)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2 text-white shadow-md shadow-blue-900/30"
            >
              <ArrowLeft size={16} />
              <span>Quay lại tìm kiếm</span>
            </button>
          </div>
        </main>
        <Footer />
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
