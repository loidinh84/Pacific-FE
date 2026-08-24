import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Box, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { Ocean3DBg } from "../../assets/Images";

export default function SpeciesView3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [showInfo, setShowInfo] = useState(true);
  const [expandFacts, setExpandFacts] = useState(false);

  const species = SEARCH_SPECIES_CATALOG.find((s) => s.id === id);

  if (!species) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Không tìm thấy sinh vật</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 rounded-lg text-sm cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const name = language === "en" ? species.nameEn : species.nameVi;
  const desc = language === "en" ? species.descEn : species.descVi;
  const bioFacts = language === "en"
    ? (species.bioFactsEn ?? [])
    : (species.bioFactsVi ?? []);
  const displayFacts = expandFacts ? bioFacts : bioFacts.slice(0, 2);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Ocean Background */}
      <img
        src={Ocean3DBg}
        alt="Ocean background"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/10 to-black/65 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/45 pointer-events-none" />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-5 pb-3 z-30">
        <div className="flex items-center gap-3">
          {/* 3D Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <Box size={13} className="text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-white/90 uppercase">3D</span>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            Quay lại
          </button>
        </div>

        {/* Right: species name badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
          <span className="text-white/50 text-xs italic">{species.sciName}</span>
          <span className="text-white/20">·</span>
          <span className="text-white text-xs font-semibold">{name}</span>
        </div>
      </div>

      {/* ── TOGGLE INFO BUTTON ── */}
      <button
        onClick={() => setShowInfo((v) => !v)}
        className="absolute top-16 left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white/80 text-xs font-medium transition-all cursor-pointer"
      >
        {showInfo ? <EyeOff size={13} /> : <Eye size={13} />}
        {showInfo ? "Ẩn thông tin" : "Hiện thông tin"}
      </button>

      {/* ── LEFT INFO PANEL ── */}
      <div
        className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 max-w-[220px] transition-all duration-500 ${
          showInfo ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
        }`}
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5 font-medium">
              Tên khoa học
            </p>
            <p className="text-cyan-300 text-xs font-semibold italic leading-snug">
              {species.sciName}
            </p>
          </div>

          <div className="border-t border-white/10" />

          <p className="text-white/75 text-[11px] leading-relaxed">{desc}</p>

          <div className="flex gap-3 pt-1">
            <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Độ sâu</p>
              <p className="text-white text-[11px] font-bold mt-0.5">{species.depth}</p>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-wider">Phân loại</p>
              <p className="text-white text-[11px] font-bold mt-0.5">
                {language === "en" ? species.categoryEn : species.categoryVi}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER: SPECIES IMAGE with float animation ── */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img
          src={species.image}
          alt={name}
          className="max-w-[50vw] max-h-[55vh] object-contain animate-float-3d"
          draggable={false}
          style={{ filter: "drop-shadow(0 20px 80px rgba(14,165,233,0.4)) drop-shadow(0 0 40px rgba(14,165,233,0.2))" }}
        />
      </div>

      {/* ── RIGHT FACTS PANEL ── */}
      <div
        className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 max-w-[240px] transition-all duration-500 ${
          showInfo ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        }`}
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">
            Đặc điểm sinh học nổi bật
          </p>

          {bioFacts.length === 0 ? (
            <p className="text-white/40 text-xs italic">Chưa có dữ liệu</p>
          ) : (
            <>
              <ul className="space-y-2.5">
                {displayFacts.map((fact, i) => (
                  <li key={i} className="flex gap-2 text-[11px] text-white/80 leading-relaxed">
                    <span className="text-cyan-400 mt-0.5 shrink-0">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>

              {bioFacts.length > 2 && (
                <button
                  onClick={() => setExpandFacts((v) => !v)}
                  className="flex items-center gap-1 text-cyan-400 text-[11px] font-semibold hover:text-cyan-300 transition-colors cursor-pointer mt-1"
                >
                  {expandFacts ? (
                    <><ChevronUp size={12} /> Rút gọn</>
                  ) : (
                    <><ChevronDown size={12} /> Xem thêm</>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM: conservation status bar ── */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${
          showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
          <div
            className={`w-2 h-2 rounded-full ${
              species.statusType === "danger"
                ? "bg-rose-400"
                : species.statusType === "warning"
                ? "bg-amber-400"
                : "bg-emerald-400"
            }`}
          />
          <span className="text-white/60 text-xs">Tình trạng bảo tồn:</span>
          <span className={`text-xs font-bold ${
            species.statusType === "danger"
              ? "text-rose-300"
              : species.statusType === "warning"
              ? "text-amber-300"
              : "text-emerald-300"
          }`}>
            {language === "en" ? species.statusEn : species.statusVi}
          </span>
        </div>
      </div>
    </div>
  );
}
