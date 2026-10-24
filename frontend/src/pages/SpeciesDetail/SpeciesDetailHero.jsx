import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Box,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gauge,
  ShieldAlert,
  Thermometer,
  Zap,
  Flame,
  Target,
  Share2,
  Check,
  ArrowLeft,
  Scale,
  Layers,
  Globe,
  X,
} from "lucide-react";
import { Favorite, Favorited } from "../../assets/Icons";
import { playSpeciesSound, stopSpeciesSound } from "../../utils/oceanAudio";
import { useLanguage } from "../../hooks/useLanguage";

// Chuẩn hóa phân hạng bảo tồn Sách Đỏ
const RED_LIST_BADGES = {
  CR: {
    label: "Cực kỳ nguy cấp (CR)",
    style: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
  EN: {
    label: "Nguy cấp (EN)",
    style: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
  VU: {
    label: "Sắp nguy cấp (VU)",
    style: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  NT: {
    label: "Gần bị đe dọa (NT)",
    style: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  LC: {
    label: "Ít quan tâm (LC)",
    style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  DD: {
    label: "Thiếu dữ liệu (DD)",
    style: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  },
  NE: {
    label: "Chưa đánh giá (NE)",
    style: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  },
};

export function SpeciesDetailHero({ species }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images =
    species.gallery && species.gallery.length > 0
      ? species.gallery
      : [species.image].filter(Boolean);

  // Lắng nghe phím bấm khi mở Lightbox (Esc: đóng, Mũi tên trái/phải: chuyển ảnh)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen, images.length]);

  const speciesName = isEn
    ? species.nameEn || species.commonName || "Marine Creature"
    : species.nameVi || species.commonName || "Sinh vật biển";

  const scientificName = species.sciName || species.scientificName || "";

  // Tạo đoạn mô tả sinh học học thuật chính xác, sinh động cho từng phân loại loài
  const introText = useMemo(() => {
    let rawIntro = "";
    if (isEn && species.introHeaderEn) rawIntro = species.introHeaderEn;
    else if (!isEn && species.introHeaderVi) rawIntro = species.introHeaderVi;
    else if (species.descVi || species.description) {
      rawIntro = isEn
        ? species.descEn || species.description
        : species.descVi || species.description;
    }

    if (rawIntro) {
      // Loại bỏ các tiền tố lặp lại tên khoa học hoặc dấu ngoặc kép thừa
      return rawIntro
        .replace(/^Tên khoa học:\s*[^.]*?\s*là\s*/i, "Là ")
        .replace(/^Scientific name:\s*[^.]*?\s*is\s*/i, "Is ")
        .replace(/"hung thần"/g, "kẻ săn mồi đỉnh cao")
        .replace(/[""]/g, "");
    }

    const slug = (species?.slug || "").toLowerCase();
    const nameLower = (speciesName || "").toLowerCase();
    const sciLower = (scientificName || "").toLowerCase();

    // Bạch tuộc khổng lồ
    if (
      slug.includes("octopus") ||
      slug.includes("bach-tuoc") ||
      nameLower.includes("bạch tuộc") ||
      sciLower.includes("octopus")
    ) {
      return isEn
        ? `${scientificName} is the largest and most intelligent cephalopod in the East Sea (Biển Đông). Possessing 3 hearts, 9 distributed brains, and thousands of sensory suction cups, this deep-sea marvel can camouflage within 0.2 seconds.`
        : `${scientificName} là loài động vật thân mềm chân đầu lớn và thông minh bậc nhất đại dương. Sở hữu 3 trái tim, 9 cụm não bộ cùng hàng ngàn giác hút đa cảm giác, sinh vật này có khả năng biến đổi sắc tố ngụy trang chỉ trong 0.2 giây.`;
    }

    // Cá voi lưng gù
    if (
      slug.includes("ca-voi-lung-gu") ||
      nameLower.includes("lưng gù") ||
      sciLower.includes("megaptera")
    ) {
      return isEn
        ? `${scientificName} is a magnificent marine mammal renowned for complex underwater vocal songs and breathtaking breaches across open oceans during long migrations.`
        : `${scientificName} là loài động vật có vú biển khổng lồ nổi tiếng với những bài ca đại dương truyền xa hàng ngàn kilômét qua tầng nước sâu và những vũ khúc nhào lộn ngoạn mục trên mặt sóng Biển Đông.`;
    }

    // Rùa xanh / Vích
    if (
      slug.includes("rua") ||
      slug.includes("vich") ||
      nameLower.includes("rùa") ||
      sciLower.includes("chelonia")
    ) {
      return isEn
        ? `${scientificName} is an ancient marine reptile navigating thousands of ocean miles using Earth's geomagnetic field to return faithfully to its natal nesting beaches.`
        : `${scientificName} là loài bò sát biển cổ đại có khả năng định vị bằng từ trường trái đất, vượt hàng ngàn hải lý để trở về đúng bãi cát nơi chúng sinh ra để duy trì và tiếp nối vòng đời đại dương.`;
    }

    // Cá ngừ vây vàng
    if (
      slug.includes("ca-ngu") ||
      nameLower.includes("cá ngừ") ||
      sciLower.includes("thunnus")
    ) {
      return isEn
        ? `${scientificName} is an ultra-fast oceanic pelagic predator engineered with hydrodynamic torpedo morphology and warm-blooded muscle physiology enabling speeds over 75 km/h.`
        : `${scientificName} là loài cá săn mồi tốc độ cao của vùng biển khơi, sở hữu thân hình thoi khí động học hoàn hảo và hệ mạch trao đổi nhiệt ngược dòng cho phép bơi săn mồi với vận tốc hơn 75 km/h.`;
    }

    // Cá mập voi
    if (
      slug.includes("ca-map-voi") ||
      nameLower.includes("cá mập voi") ||
      nameLower.includes("nhám voi") ||
      sciLower.includes("rhincodon")
    ) {
      return isEn
        ? `${scientificName} is the gentle giant of the ocean and the largest fish species on Earth, filtering plankton peacefully in tropical and warm waters across the East Sea (Biển Đông).`
        : `${scientificName} là người khổng lồ hiền lành của biển cả và là loài cá lớn nhất còn tồn tại trên Trái Đất, chuyên lọc sinh vật phù du và giáp xác nhỏ tại các vùng nước ấm giàu dinh dưỡng của Biển Đông.`;
    }

    // Cá mập trắng lớn
    if (
      slug.includes("shark") ||
      slug.includes("ca-map-trang") ||
      nameLower.includes("cá mập trắng") ||
      sciLower.includes("carcharodon")
    ) {
      return isEn
        ? `${scientificName} is the apex macropredator of the open seas, equipped with serrated razor teeth, extraordinary olfaction, and Lorenzini ampullae detecting minute bioelectric fields.`
        : `${scientificName} là kẻ săn mồi đỉnh bảng huyền thoại của đại dương, sở hữu hàm răng sắc nhọn, khứu giác siêu việt và giác quan Ampullae of Lorenzini cảm nhận điện trường sinh học tinh nhạy.`;
    }

    // Mặc định khoa học chuẩn
    return isEn
      ? `${scientificName} is an iconic marine species of the East Sea ecosystem, playing an essential role in preserving marine trophic balance.`
      : `${scientificName} là loài sinh vật biển tiêu biểu của hệ sinh thái Biển Đông, giữ vai trò quan trọng trong việc duy trì chuỗi thức ăn và cân bằng sinh thái biển.`;
  }, [species, scientificName, speciesName, isEn]);

  // Phân loại học 7 bậc chuẩn khoa học
  const taxonomy = useMemo(() => {
    if (species.taxonomy) return species.taxonomy;

    const slug = (species?.slug || "").toLowerCase();
    const id = (species?.id || "").toString().toLowerCase();
    const nameVi = (species?.nameVi || species?.commonName || "").toLowerCase();
    const cat = (species?.category || species?.categoryVi || "").toLowerCase();
    const sciName = species?.sciName || species?.scientificName || "";

    if (
      slug.includes("octopus") ||
      slug.includes("bach-tuoc") ||
      id === "giant-octopus-3" ||
      nameVi.includes("bạch tuộc") ||
      sciName.toLowerCase().includes("octopus")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Mollusca" : "Thân mềm",
        class: isEn ? "Cephalopoda" : "Chân đầu",
        order: isEn ? "Octopoda" : "Bộ Bạch tuộc",
        family: "Enteroctopodidae",
        genus: "Enteroctopus",
        species: sciName || "Enteroctopus dofleini",
      };
    }

    if (
      slug.includes("ca-voi-lung-gu") ||
      nameVi.includes("lưng gù") ||
      sciName.toLowerCase().includes("megaptera")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Chordata" : "Dây sống",
        class: isEn ? "Mammalia" : "Động vật có vú",
        order: isEn ? "Cetacea" : "Bộ Cá voi",
        family: "Balaenopteridae",
        genus: "Megaptera",
        species: sciName || "Megaptera novaeangliae",
      };
    }

    if (
      slug.includes("rua") ||
      slug.includes("vich") ||
      nameVi.includes("rùa") ||
      sciName.toLowerCase().includes("chelonia")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Chordata" : "Dây sống",
        class: isEn ? "Reptilia" : "Bò sát",
        order: isEn ? "Testudines" : "Bộ Rùa",
        family: "Cheloniidae",
        genus: "Chelonia",
        species: sciName || "Chelonia mydas",
      };
    }

    if (
      slug.includes("ca-ngu") ||
      nameVi.includes("cá ngừ") ||
      sciName.toLowerCase().includes("thunnus")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Chordata" : "Dây sống",
        class: isEn ? "Actinopterygii" : "Cá vây tia",
        order: isEn ? "Scombriformes" : "Bộ Cá bạc má",
        family: "Scombridae",
        genus: "Thunnus",
        species: sciName || "Thunnus albacares",
      };
    }

    if (
      slug.includes("ca-map-voi") ||
      nameVi.includes("cá mập voi") ||
      nameVi.includes("nhám voi") ||
      sciName.toLowerCase().includes("rhincodon")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Chordata" : "Dây sống",
        class: isEn ? "Chondrichthyes" : "Cá sụn",
        order: isEn ? "Orectolobiformes" : "Bộ Cá nhám râu",
        family: "Rhincodontidae",
        genus: "Rhincodon",
        species: sciName || "Rhincodon typus",
      };
    }

    if (
      slug.includes("shark") ||
      slug.includes("ca-map-trang") ||
      id === "great-white-shark-1" ||
      nameVi.includes("cá mập trắng") ||
      sciName.toLowerCase().includes("carcharodon")
    ) {
      return {
        kingdom: isEn ? "Animalia" : "Động vật",
        phylum: isEn ? "Chordata" : "Dây sống",
        class: isEn ? "Chondrichthyes" : "Cá sụn",
        order: isEn ? "Lamniformes" : "Bộ Cá mập chuột",
        family: "Lamnidae",
        genus: "Carcharodon",
        species: sciName || "Carcharodon carcharias",
      };
    }

    const genusGuess = sciName ? sciName.split(" ")[0] : "Chưa xác định";
    let phylumName = isEn ? "Chordata" : "Dây sống";
    let className = isEn ? "Actinopterygii" : "Cá vây tia";

    if (cat.includes("mollusk") || cat.includes("thân mềm")) {
      phylumName = isEn ? "Mollusca" : "Thân mềm";
      className = isEn ? "Cephalopoda" : "Chân đầu";
    } else if (cat.includes("mammal") || cat.includes("vú")) {
      className = isEn ? "Mammalia" : "Động vật có vú";
    } else if (cat.includes("reptile") || cat.includes("bò sát")) {
      className = isEn ? "Reptilia" : "Bò sát";
    }

    return {
      kingdom: isEn ? "Animalia" : "Động vật",
      phylum: phylumName,
      class: className,
      order: isEn ? "Marine Fauna" : "Sinh vật biển",
      family: genusGuess ? `${genusGuess}idae` : "Chưa xác định",
      genus: genusGuess,
      species: sciName || (isEn ? "Marine Specimen" : "Mẫu vật biển"),
    };
  }, [species, isEn]);

  const scientificDossier =
    language === "en"
      ? species.scientificDossierEn || []
      : species.scientificDossierVi || [];

  const size = isEn ? species.sizeEn || species.size : species.size;
  const weight = isEn ? species.weightEn || species.weight : species.weight;
  const status = isEn ? species.statusEn || species.statusVi : species.statusVi;
  const redListCode = species.vietnamRedListStatus || species.redList || "VU";
  const redListMeta = RED_LIST_BADGES[redListCode] || RED_LIST_BADGES.VU;

  // Lọc phân vùng chi tiết: Nếu là "Biển Đông" chung chung hay chứa Thái Bình Dương thì ẩn, chỉ hiển thị nếu là phân vùng/khu bảo tồn cụ thể (Hoàng Sa, Trường Sa, Côn Đảo...)
  const specificZone = useMemo(() => {
    if (!species?.eastSeaZone) return null;
    const raw = String(species.eastSeaZone).trim();
    const lower = raw.toLowerCase();
    const genericTerms = [
      "biển đông",
      "toàn vùng biển đông",
      "biển đông & thái bình dương",
      "thái bình dương",
      "pacific",
      "indo-pacific",
      "chưa cập nhật",
      "unknown",
    ];
    if (genericTerms.includes(lower)) return null;
    return raw.replace(/\s*&\s*thái bình dương/gi, "").replace(/\s*&\s*pacific/gi, "").trim();
  }, [species.eastSeaZone]);

  const dossierIcons = [
    <Thermometer size={18} className="text-cyan-400" />,
    <Zap size={18} className="text-amber-400" />,
    <Flame size={18} className="text-rose-400" />,
    <Target size={18} className="text-emerald-400" />,
  ];

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      stopSpeciesSound();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const duration = playSpeciesSound(species.id) || 3200;
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, duration);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeciesSound();
    };
  }, []);

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const hasSound = species.hasAudio !== false;

  return (
    <section className="relative pt-20 md:pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto font-sans">
      {/* ── 1. BREADCRUMB & BACK NAVIGATION ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto scrollbar-none py-1">
          <Link
            to="/"
            className="hover:text-cyan-300 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>{t("speciesDetail.home") || "Trang chủ"}</span>
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            to="/search"
            className="hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>{t("speciesDetail.catalog") || "Khám phá sinh vật"}</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-semibold truncate max-w-[200px] md:max-w-none">
            {speciesName}
          </span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>{t("speciesDetail.btnBack") || "Quay lại"}</span>
        </button>
      </div>

      {/* ── 2. MAIN HERO HEADER: TIÊU ĐỀ CHÍNH H1 + HUY HIỆU + ACTION BAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Layers size={12} className="text-cyan-400" />
                <span>
                  {taxonomy.class || taxonomy.phylum || (isEn ? "Marine Life" : "Sinh vật biển")}
                </span>
              </span>
              {specificZone && (
                <>
                  <span className="text-cyan-500/40">•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Globe size={12} className="text-cyan-400" />
                    <span>{specificZone}</span>
                  </span>
                </>
              )}
            </span>
          </div>

          {/* TIÊU ĐỀ CẤP 1 (H1) ĐƯỢC GIẢM KÍCH CỠ CÂN ĐỐI, THANH THOÁT */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {speciesName}
            </h1>
            {scientificName && (
              <p className="text-sm sm:text-base md:text-lg text-cyan-300/90 font-serif italic mt-1 tracking-wide">
                {scientificName}
              </p>
            )}
          </div>

          {/* Đoạn văn giới thiệu ngắn sinh động */}
          <p className="text-slate-300 text-sm md:text-[15px] leading-relaxed pt-1 max-w-2xl">
            {introText}
          </p>
        </div>

        {/* ── ACTION BAR (CTA BUTTONS): XEM 3D, ÂM THANH, YÊU THÍCH, CHIA SẺ ── */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          {/* Nút 1: Xem dưới dạng 3D */}
          <button
            onClick={() =>
              navigate(`/species/${species.slug || species.id}/3d`)
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer border border-cyan-400/40 hover:border-cyan-300"
          >
            <Box size={16} className="text-cyan-200" />
            <span>{t("speciesDetail.btnView3D") || "Xem mô hình 3D"}</span>
          </button>

          {/* Nút 2: Phát âm thanh thủy âm */}
          {hasSound ? (
            <button
              onClick={handleAudioToggle}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                isPlayingAudio
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-white/5 hover:bg-white/12 border-white/15 text-white/90 hover:text-white"
              }`}
              title="Phát tín hiệu âm thanh sinh vật"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX size={15} className="text-cyan-400 animate-bounce" />
                  <span className="text-cyan-300 font-bold">
                    {t("speciesDetail.audioPlaying") || "Đang phát"}
                  </span>
                  <span className="flex gap-0.5 ml-0.5">
                    <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
                    <span className="w-1 h-4 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150 rounded-full" />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 size={15} className="text-cyan-400" />
                  <span>{t("speciesDetail.audioBtn") || "Âm thanh"}</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-white/40 px-3 py-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <VolumeX size={14} />
              <span>{t("speciesDetail.noAudio") || "Không có âm thanh"}</span>
            </div>
          )}

          {/* Nút 3: Yêu thích sinh vật */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer backdrop-blur-md ${
              isFavorited
                ? "bg-rose-500/15 border-rose-400/50 text-rose-300"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white/80 hover:text-white"
            }`}
            title="Lưu vào danh sách yêu thích"
          >
            {isFavorited ? (
              <>
                <Favorited className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300">
                  {t("speciesDetail.btnFavorited") || "Đã lưu"}
                </span>
              </>
            ) : (
              <>
                <Favorite className="w-4 h-4 text-white/70" />
                <span>{t("speciesDetail.btnFavorite") || "Yêu thích"}</span>
              </>
            )}
          </button>

          {/* Nút 4: Chia sẻ liên kết */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Sao chép liên kết chia sẻ"
          >
            {isCopied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-300 font-bold">
                  {t("speciesDetail.copied") || "Đã chép"}
                </span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-slate-300" />
                <span>{t("speciesDetail.share") || "Chia sẻ"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 3. QUICK SPECS BAR (ĐƯỢC ĐƯA LÊN ĐẦU TRANG, NGAY DƯỚI HEADER) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {/* Kích thước */}
        <div className="bg-[#0b172a]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
            <Gauge size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-slate-400 text-[11px] block font-medium truncate">
              {t("speciesDetail.maxSize") || "Kích thước tối đa"}
            </span>
            <span className="text-white font-bold text-sm sm:text-base mt-0.5 block truncate">
              {size || "Đang cập nhật"}
            </span>
          </div>
        </div>

        {/* Độ sâu */}
        <div className="bg-[#0b172a]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 shrink-0">
            <Compass size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-slate-400 text-[11px] block font-medium truncate">
              {t("speciesDetail.depthZone") || "Vùng nước & Độ sâu"}
            </span>
            <span className="text-white font-bold text-sm sm:text-base mt-0.5 block truncate">
              {species.depth || "0m - 100m"}
            </span>
          </div>
        </div>

        {/* Khối lượng */}
        <div className="bg-[#0b172a]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0">
            <Scale size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-slate-400 text-[11px] block font-medium truncate">
              {t("speciesDetail.weight") || "Trọng lượng cơ thể"}
            </span>
            <span className="text-white font-bold text-sm sm:text-base mt-0.5 block truncate">
              {weight || (isEn ? "Updating" : "Đang cập nhật")}
            </span>
          </div>
        </div>

        {/* Tình trạng bảo tồn */}
        <div className="bg-[#0b172a]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-slate-400 text-[11px] block font-medium truncate">
              {t("speciesDetail.conservationStatus") || "Tình trạng bảo tồn"}
            </span>
            <span className="text-rose-300 font-bold text-sm sm:text-base mt-0.5 block truncate">
              {status || redListMeta.label || "Ít quan tâm (LC)"}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. 3D COVERFLOW GALLERY SHOWCASE (NỀN TRONG SUỐT, KHÔNG KHUNG BAO) ── */}
      <div className="relative py-4 my-2 flex items-center justify-center min-h-[340px] md:min-h-[440px] overflow-hidden bg-transparent">
        {/* Navigation Arrows (Thủy tinh mờ tinh tế, không bị quá đậm) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 md:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 hover:border-cyan-400/80 transition-all cursor-pointer backdrop-blur-md shadow-lg shadow-black/20 hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 md:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 hover:border-cyan-400/80 transition-all cursor-pointer backdrop-blur-md shadow-lg shadow-black/20 hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* 3D Image Stack */}
        <div className="flex items-center justify-center w-full max-w-5xl relative px-4">
          {images.map((imgSrc, idx) => {
            const total = images.length;
            const diff = (idx - activeImageIdx + total) % total;
            const isCenter = diff === 0;
            const isPrev = diff === total - 1;
            const isNext = diff === 1;

            if (!isCenter && !isPrev && !isNext && total > 3) {
              return null;
            }

            let containerStyle = "hidden";
            if (isCenter) {
              containerStyle =
                "z-20 w-[86%] md:w-[70%] aspect-[16/10] md:aspect-[16/9] max-h-[420px] scale-100 opacity-100 border-2 border-cyan-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.45)]";
            } else if (isPrev) {
              containerStyle =
                "z-10 w-[64%] md:w-[50%] aspect-[16/10] md:aspect-[16/9] max-h-[340px] -translate-x-[24%] md:-translate-x-[34%] scale-90 opacity-60 hover:opacity-85 -rotate-2 border border-white/10";
            } else if (isNext) {
              containerStyle =
                "z-10 w-[64%] md:w-[50%] aspect-[16/10] md:aspect-[16/9] max-h-[340px] translate-x-[24%] md:translate-x-[34%] scale-90 opacity-60 hover:opacity-85 rotate-2 border border-white/10";
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  if (isCenter) {
                    setIsLightboxOpen(true);
                  } else {
                    setActiveImageIdx(idx);
                  }
                }}
                className={`absolute rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer bg-slate-900 group/img ${containerStyle}`}
              >
                <img
                  src={imgSrc}
                  alt={`${speciesName} - ảnh ${idx + 1}`}
                  className={`w-full h-full object-cover select-none transition-transform duration-700 ${
                    isCenter ? "group-hover/img:scale-105" : ""
                  }`}
                  draggable={false}
                  onError={(e) => {
                    if (
                      species.image &&
                      e.currentTarget.src !== species.image
                    ) {
                      e.currentTarget.src = species.image;
                    } else {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Dots pagination */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeImageIdx
                    ? "w-7 bg-cyan-400"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Xem ảnh ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 4.1 LIGHTBOX MODAL (XEM ẢNH PHÓNG TO TOÀN MÀN HÌNH) ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 backdrop-blur-2xl p-4 sm:p-6 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar trong Lightbox */}
            <div
              className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-white font-bold text-sm sm:text-base tracking-wide">
                  {speciesName}
                </span>
                {scientificName && (
                  <span className="hidden sm:inline-block text-xs sm:text-sm text-cyan-300 italic font-serif">
                    ({scientificName})
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 text-xs font-mono font-semibold border border-white/10">
                  {activeImageIdx + 1} / {images.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15 hover:border-cyan-400 shadow-md"
                  title="Đóng (Esc)"
                  aria-label="Close lightbox"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Khung hiển thị ảnh to chính giữa */}
            <div
              className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-3 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút Prev trong Lightbox */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-4 z-20 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Ảnh chất lượng cao phóng to với animation mượt mà */}
              <motion.img
                key={activeImageIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={images[activeImageIdx]}
                alt={`${speciesName} - ảnh phóng to ${activeImageIdx + 1}`}
                className="max-h-[72vh] md:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] border border-white/10"
              />

              {/* Nút Next trong Lightbox */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-4 z-20 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Dải thumbnail xem nhanh phía dưới */}
            {images.length > 1 && (
              <div
                className="flex items-center justify-center gap-2.5 z-10 py-1 overflow-x-auto max-w-xl mx-auto scrollbar-none"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all cursor-pointer border-2 shrink-0 ${
                      i === activeImageIdx
                        ? "border-cyan-400 scale-105 shadow-md shadow-cyan-400/40"
                        : "border-white/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. HỒ SƠ SINH HỌC & PHÂN LOẠI HỌC KHOA HỌC ── */}
      <div className="mt-10 pt-8 border-t border-white/10 space-y-6">
        {/* Tiêu đề mục */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-heading">
            {t("speciesDetail.profileTitle") ||
              "Hồ sơ sinh học & Phân loại học"}
          </h2>
        </div>

        {/* Bảng phân loại khoa học (Bố cục 4 cột rộng rãi) */}
        <div className="bg-[#0b172a] border border-white/10 rounded-2xl p-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Giới & Ngành */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.kingdom") || "Giới"}
                </span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.kingdom}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.phylum") || "Ngành"}
                </span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.phylum}
                </span>
              </div>
            </div>

            {/* Lớp & Bộ */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.class") || "Lớp"}
                </span>
                <span className="font-semibold text-cyan-300 mt-0.5 block leading-snug">
                  {taxonomy.class}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.order") || "Bộ"}
                </span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.order}
                </span>
              </div>
            </div>

            {/* Họ & Chi */}
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-2">
              <div>
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.family") || "Họ"}
                </span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.family}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 text-[11px] block">
                  {t("speciesDetail.genus") || "Chi"}
                </span>
                <span className="font-semibold text-cyan-300 italic mt-0.5 block leading-snug">
                  {taxonomy.genus}
                </span>
              </div>
            </div>

            {/* Loài (Species) */}
            <div className="bg-cyan-500/10 rounded-xl p-3.5 border border-cyan-500/25 flex flex-col justify-center">
              <span className="text-cyan-400/80 text-[11px] block font-semibold">
                {t("speciesDetail.species") || "Loài"}
              </span>
              <span className="font-bold text-cyan-300 text-sm italic mt-1 block leading-snug">
                {taxonomy.species}
              </span>
              <span className="text-slate-400 text-[11px] mt-1 block">
                {speciesName}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Chuyên đề đặc điểm sinh thái học chuyên sâu */}
        {scientificDossier.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide">
              {t("speciesDetail.bioFeatures") ||
                "Đặc điểm sinh học & Sinh thái học"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scientificDossier.map((dossier, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b172a] border border-white/10 rounded-2xl p-5 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    {dossierIcons[idx % dossierIcons.length]}
                    <span className="text-cyan-400 text-xs font-bold tracking-wide">
                      {dossier.category}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm leading-snug">
                    {dossier.title}
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
                    {dossier.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
