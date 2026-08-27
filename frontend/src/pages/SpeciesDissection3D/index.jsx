import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  Sparkles,
  X,
  Copy,
  Check,
  Microscope,
  Activity,
  Scale,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { fetchSpeciesAnatomy } from "../../services/speciesApi";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { SYSTEM_CONFIG } from "../SpeciesDetail/anatomyConfig";
import { DissectionScene3D } from "../SpeciesView3D/DissectionCanvas3D";

export default function SpeciesDissection3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { copiedId, copy } = useCopyToClipboard();

  const [activeSystem, setActiveSystem] = useState("all");
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [xrayMode, setXrayMode] = useState(true);

  const species =
    SEARCH_SPECIES_CATALOG.find((s) => s.id === id) ||
    SEARCH_SPECIES_CATALOG[0];

  const [liveHotspots, setLiveHotspots] = useState(species?.anatomy || []);

  useEffect(() => {
    fetchSpeciesAnatomy(id || species?.id || "great-white-shark-1").then((data) => {
      if (data && data.length > 0) {
        setLiveHotspots(data);
      }
    });
  }, [id, species]);

  const handleCopy = useCallback((organ, e) => {
    if (organ) copy(organ.id, organ.latinName, e);
  }, [copy]);

  if (!species) {
    return (
      <div className="min-h-screen bg-[#071018] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-slate-400">
            {language === "en" ? "Species not found" : "Không tìm thấy sinh vật"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-cyan-600 rounded-xl text-sm font-semibold cursor-pointer"
          >
            {t("speciesDetail.btnBack")}
          </button>
        </div>
      </div>
    );
  }

  const name = language === "en" ? species.nameEn : species.nameVi;
  const hotspots = liveHotspots;

  const systemsPresent = [
    "all",
    ...new Set(hotspots.map((s) => s.system).filter(Boolean)),
  ];

  const activeSysCfg = SYSTEM_CONFIG[selectedOrgan?.system] || SYSTEM_CONFIG.nervous;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050B14] select-none text-white font-sans">
      {/* High-tech Lab Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050B14] to-[#02050B] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── 3D DISSECTION CANVAS SCENE ── */}
      <div className="absolute inset-0 z-0">
        <DissectionScene3D
          hotspots={hotspots}
          activeSystem={activeSystem}
          selectedOrgan={selectedOrgan}
          onSelectOrgan={setSelectedOrgan}
          language={language}
          xrayMode={xrayMode}
        />
      </div>

      {/* ── TOP HEADER BAR ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-30 pointer-events-auto bg-gradient-to-b from-[#050B14]/90 via-[#050B14]/50 to-transparent">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => navigate(`/species/${species.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-white text-xs font-semibold transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft size={14} />
            <span>{t("speciesDetail.btnBack")}</span>
          </button>

          {/* 3D Lab Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md text-cyan-300 text-xs font-bold tracking-wide uppercase">
            <Box size={14} className="text-cyan-400 animate-pulse" />
            <span>
              {language === "vi" ? "Phòng Giải Phẫu 3D" : "3D Dissection Room"}
            </span>
          </div>

          {/* X-Ray / Translucent Mode Toggle */}
          <button
            onClick={() => setXrayMode((v) => !v)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md text-xs font-semibold transition-all cursor-pointer ${
              xrayMode
                ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-white/10 border-white/15 text-slate-300 hover:bg-white/20"
            }`}
          >
            {xrayMode ? <Eye size={14} className="text-cyan-400" /> : <EyeOff size={14} />}
            <span>
              {xrayMode
                ? language === "vi" ? "Chế độ X-Ray (Trong suốt)" : "X-Ray Mode (On)"
                : language === "vi" ? "Chế độ Thường (Đặc)" : "Solid Skin Mode"}
            </span>
          </button>
        </div>

        {/* Species Title */}
        <div className="hidden md:flex items-center gap-3 px-5 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl">
          <Sparkles size={14} className="text-amber-400" />
          <span className="text-white font-bold text-sm">{name}</span>
          <span className="text-slate-500 text-xs font-mono">({species.sciName})</span>
        </div>
      </div>

      {/* ── LEFT SYSTEM FILTER BAR ── */}
      <div className="absolute top-20 left-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 px-1">
          {language === "vi" ? "Hệ Cơ Quan" : "Organ Systems"}
        </p>
        {systemsPresent.map((key) => {
          const cfg = SYSTEM_CONFIG[key];
          if (!cfg) return null;
          const isActive = activeSystem === key;
          const Icon = cfg.Icon;
          const label = language === "en" ? cfg.labelEn : cfg.labelVi;

          return (
            <button
              key={key}
              onClick={() => {
                setActiveSystem(key);
                setSelectedOrgan(null);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md"
              style={
                isActive
                  ? {
                      backgroundColor: cfg.color + "30",
                      borderColor: cfg.color,
                      color: "#FFFFFF",
                      boxShadow: `0 0 15px ${cfg.color}40`,
                    }
                  : {
                      backgroundColor: "rgba(15, 23, 42, 0.65)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "#94A3B8",
                    }
              }
            >
              {Icon ? <Icon size={13} style={{ color: cfg.color }} /> : <Box size={13} />}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── RIGHT MEDICAL DATA PANEL (when organ is clicked) ── */}
      {selectedOrgan && (
        <div className="absolute top-20 right-6 z-20 w-80 max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/90 backdrop-blur-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-right-4 pointer-events-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{
                  backgroundColor: activeSysCfg.color + "25",
                  color: activeSysCfg.color,
                  border: `1px solid ${activeSysCfg.color}60`,
                }}
              >
                {language === "en" ? activeSysCfg.labelEn : activeSysCfg.labelVi}
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {language === "en"
                  ? selectedOrgan.labelEn || selectedOrgan.labelVi
                  : selectedOrgan.labelVi}
              </h3>
              {selectedOrgan.latinName && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs italic text-cyan-300 font-mono">
                    {selectedOrgan.latinName}
                  </span>
                  <button
                    onClick={(e) => handleCopy(selectedOrgan, e)}
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer transition-colors"
                    title="Sao chép tên Latin"
                  >
                    {copiedId === selectedOrgan.id ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedOrgan(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Biological Description */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
              {language === "vi" ? "Mô Tả Sinh Học" : "Biological Description"}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === "en"
                ? selectedOrgan.descEn || selectedOrgan.descVi
                : selectedOrgan.descVi}
            </p>
          </div>

          {/* Medical Data */}
          {selectedOrgan.medicalData && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {language === "vi" ? "Dữ Liệu Y Khoa" : "Medical Data"}
              </p>

              {selectedOrgan.medicalData.weightEstimate && (
                <div className="flex items-start gap-2.5 py-1 text-xs">
                  <Scale size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {language === "vi" ? "Khối lượng" : "Weight"}
                    </span>
                    <span className="text-white font-semibold">
                      {selectedOrgan.medicalData.weightEstimate}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 py-1 text-xs">
                <Activity size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === "vi" ? "Chức năng" : "Function"}
                  </span>
                  <span className="text-slate-200">
                    {language === "en"
                      ? selectedOrgan.medicalData.functionEn ||
                        selectedOrgan.medicalData.functionVi
                      : selectedOrgan.medicalData.functionVi}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 py-2 text-xs bg-cyan-950/40 border border-cyan-500/20 rounded-xl px-3">
                <Microscope size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-cyan-300 block text-[10px] font-bold">
                    {language === "vi"
                      ? "Ứng dụng y học / dược học"
                      : "Medical Application"}
                  </span>
                  <span className="text-slate-200 leading-normal">
                    {language === "en"
                      ? selectedOrgan.medicalData.medicalUseEn ||
                        selectedOrgan.medicalData.medicalUseVi
                      : selectedOrgan.medicalData.medicalUseVi}
                  </span>
                </div>
              </div>

              {selectedOrgan.medicalData.source && (
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <BookOpen size={12} className="text-slate-500" />
                  <span>{selectedOrgan.medicalData.source}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3D Interaction Hint overlay at top center */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="text-[10px] text-cyan-300/80 bg-slate-900/60 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-md">
          {language === "vi"
            ? "🖱️ Kéo để xoay 360° • Cuộn để zoom • Click bộ phận để xem chi tiết"
            : "🖱️ Drag to rotate 360° • Scroll to zoom • Click organ for details"}
        </span>
      </div>
    </div>
  );
}
