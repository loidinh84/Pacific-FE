import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Volume2,
  VolumeX,
  Box,
  ChevronLeft,
  ChevronRight,
  Dna,
  Compass,
  Gauge,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Zap,
  Flame,
  Target,
} from "lucide-react";
import { Favorite, Favorited } from "../../assets/Icons";
import { playSpeciesSound, stopSpeciesSound } from "../../utils/oceanAudio";

export function SpeciesDetailHero({ species, language }) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images =
    species.gallery && species.gallery.length > 0
      ? species.gallery
      : [species.image];

  const introText =
    language === "en"
      ? species.introHeaderEn ||
        `Scientific name: ${species.sciName} is an iconic marine apex species of the Pacific Ocean.`
      : species.introHeaderVi ||
        `Tên khoa học: ${species.sciName} là loài cá săn mồi lớn nhất thế giới hiện nay, được mệnh danh là một trong những "hung thần" đỉnh cao của đại dương.`;

  const taxonomy = species.taxonomy || {
    kingdom: "Animalia",
    phylum: "Chordata",
    class: species.categoryVi || "Chondrichthyes",
    order: "Lamniformes",
    family: "Lamnidae",
    genus: "Carcharodon",
    species: species.sciName || "C. carcharias",
  };

  const scientificDossier =
    language === "en"
      ? species.scientificDossierEn || []
      : species.scientificDossierVi || [];

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
    <section className="relative pt-24 pb-10 px-4 md:px-8 max-w-6xl mx-auto">
      {/* ── 1. TOP BAR: INTRO TEXT & SOUND BUTTON ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        {/* Left: Scientific intro description */}
        <div className="max-w-3xl">
          <p className="text-white/95 text-sm md:text-[15px] leading-relaxed font-normal">
            {introText}
          </p>
        </div>

        {/* Right: Sound button */}
        <div className="shrink-0">
          {hasSound ? (
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                isPlayingAudio
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-white/5 hover:bg-white/12 border-white/15 text-white/90 hover:text-white"
              }`}
              title={species.audioLabelVi || "Phát âm thanh thủy âm"}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX size={16} className="text-cyan-400 animate-bounce" />
                  <span className="text-cyan-300 font-bold">
                    Đang phát âm thanh
                  </span>
                  <span className="flex gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
                    <span className="w-1 h-4 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150 rounded-full" />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 size={16} className="text-cyan-400" />
                  <span>Âm thanh</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-white/35 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
              <VolumeX size={13} />
              <span>Không có âm thanh</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. 3D COVERFLOW GALLERY (CLEAN, NO HEAVY GLOW SHADOWS) ── */}
      <div className="relative py-2 my-2 flex items-center justify-center min-h-[340px] md:min-h-[440px] overflow-hidden">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all cursor-pointer backdrop-blur-md"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* 3D Image Stack */}
        <div className="flex items-center justify-center w-full max-w-5xl relative">
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
                "z-20 w-[82%] md:w-[68%] aspect-[16/10] md:aspect-[16/9] max-h-[420px] scale-100 opacity-100 border border-cyan-400/40";
            } else if (isPrev) {
              containerStyle =
                "z-10 w-[60%] md:w-[48%] aspect-[16/10] md:aspect-[16/9] max-h-[340px] -translate-x-[22%] md:-translate-x-[32%] scale-90 opacity-60 hover:opacity-85 -rotate-2 border border-white/10";
            } else if (isNext) {
              containerStyle =
                "z-10 w-[60%] md:w-[48%] aspect-[16/10] md:aspect-[16/9] max-h-[340px] translate-x-[22%] md:translate-x-[32%] scale-90 opacity-60 hover:opacity-85 rotate-2 border border-white/10";
            }

            return (
              <div
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`absolute rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer bg-slate-900 ${containerStyle}`}
              >
                <img
                  src={imgSrc}
                  alt={`${species.nameVi} - ảnh ${idx + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Dots pagination */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeImageIdx
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. BUTTONS: CĂN ĐỀU 2 GÓC 2 BÊN */}
      <div className="flex items-center justify-between my-6 w-full">
        {/* Nút bên trái: Xem dưới dạng 3D */}
        <button
          onClick={() => navigate(`/species/${species.id}/3d`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-900/70 to-indigo-900/70 hover:from-blue-800 hover:to-indigo-800 border border-indigo-400/30 text-white text-xs font-semibold tracking-wide transition-all cursor-pointer backdrop-blur-md"
        >
          <Box size={15} className="text-cyan-400" />
          <span>xem dưới dạng 3D</span>
        </button>

        {/* Nút bên phải: Yêu thích sinh vật */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer backdrop-blur-md ${
            isFavorited
              ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300"
              : "bg-white/5 hover:bg-white/10 border-white/15 text-white/80 hover:text-white"
          }`}
        >
          {isFavorited ? (
            <>
              <Favorited className="w-4 h-4 text-cyan-400" />
              <span>Yêu thích sinh vật</span>
            </>
          ) : (
            <>
              <Favorite className="w-4 h-4 text-white/70" />
              <span>Yêu thích sinh vật</span>
            </>
          )}
        </button>
      </div>

      {/* ── 4. HỒ SƠ SINH HỌC & PHÂN LOẠI HỌC ── */}
      <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
        {/* Tiêu đề mục */}
        <div className="flex items-center gap-2.5">
          <Dna size={20} className="text-cyan-400" />
          <h2 className="text-lg md:text-xl font-bold text-white font-heading">
            Hồ sơ sinh học & Phân loại học
          </h2>
        </div>

        {/* Bảng phân loại khoa học (Bố cục 4 cột rộng rãi, không bị che mất chữ) */}
        <div className="bg-[#0b172a] border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-sm font-semibold  tracking-wider mb-4 flex items-center gap-2">
            Hệ thống phân loại khoa học
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Giới & Ngành */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
              <div>
                <span className="text-white/40 text-sm block">Giới</span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.kingdom}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-white/40 text-sm block">Ngành</span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.phylum}
                </span>
              </div>
            </div>

            {/* Lớp & Bộ */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
              <div>
                <span className="text-white/40 text-sm block">Lớp</span>
                <span className="font-semibold text-cyan-300 mt-0.5 block leading-snug">
                  {taxonomy.class}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-white/40 text-sm block">Bộ</span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.order}
                </span>
              </div>
            </div>

            {/* Họ & Chi */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
              <div>
                <span className="text-white/40 text-sm block">Họ</span>
                <span className="font-semibold text-white mt-0.5 block leading-snug">
                  {taxonomy.family}
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-white/40 text-sm block">Chi</span>
                <span className="font-semibold text-cyan-300 italic mt-0.5 block leading-snug">
                  {taxonomy.genus}
                </span>
              </div>
            </div>

            {/* Loài */}
            <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/25 flex flex-col justify-center">
              <span className="text-cyan-400/80 text-sm block font-semibold">
                Loài
              </span>
              <span className="font-bold text-cyan-300 text-sm italic mt-1 block leading-snug">
                {taxonomy.species}
              </span>
              <span className="text-white/50 text-sm mt-1 block">
                {species.nameVi}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Thông số sinh học cốt lõi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0b172a] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Gauge size={16} />
            </div>
            <div>
              <span className="text-white/60 text-sm block font-medium">
                Kích thước tối đa
              </span>
              <span className="text-white font-bold text-xs sm:text-sm">
                {species.size}
              </span>
            </div>
          </div>

          <div className="bg-[#0b172a] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              <Compass size={16} />
            </div>
            <div>
              <span className="text-white/60 text-sm block font-medium">
                Vùng nước & Độ sâu
              </span>
              <span className="text-white font-bold text-xs sm:text-sm">
                {species.depth}
              </span>
            </div>
          </div>

          <div className="bg-[#0b172a] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-white/60 text-sm block font-medium">
                Trọng lượng
              </span>
              <span className="text-white font-bold text-xs sm:text-sm">
                {species.weight || "Đang cập nhật"}
              </span>
            </div>
          </div>

          <div className="bg-[#0b172a] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <ShieldAlert size={16} />
            </div>
            <div>
              <span className="text-white/60 text-sm block font-medium">
                Tình trạng bảo tồn
              </span>
              <span className="text-rose-300 font-bold text-xs sm:text-sm">
                {species.statusVi}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Chuyên đề đặc điểm sinh thái học chuyên sâu */}
        {scientificDossier.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-semibold text-white/80  tracking-wider">
              Đặc điểm sinh học & Sinh thái học
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scientificDossier.map((dossier, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b172a] border border-white/10 hover:border-cyan-500/30 rounded-2xl p-5 space-y-2.5 transition-all"
                >
                  <div className="flex items-center gap-2">
                    {dossierIcons[idx % dossierIcons.length]}
                    <span className="text-cyan-400 text-sm font-bold tracking-wide">
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
