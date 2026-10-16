import { useState, useMemo } from "react";
import { Ruler, Scale, User, Ship, Compass, Info, ArrowRightLeft } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const REFERENCES = {
  diver: {
    id: "diver",
    nameVi: "Thợ lặn trưởng thành",
    nameEn: "Human Scuba Diver",
    lengthM: 1.8,
    weightKg: 75,
    icon: User,
    descVi: "Chiều cao trung bình thợ lặn có trang bị chân vịt (~1.8m)",
    descEn: "Standard adult scuba diver with fins (~1.8m)",
  },
  submersible: {
    id: "submersible",
    nameVi: "Tàu lặn nghiên cứu",
    nameEn: "Research Submersible",
    lengthM: 6.5,
    weightKg: 8000,
    icon: Ship,
    descVi: "Tàu ngầm lặn sâu thám hiểm hải dương học (~6.5m)",
    descEn: "Deep-sea oceanographic research submarine (~6.5m)",
  },
};

export function SizeComparisonSection({ species }) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [selectedRefKey, setSelectedRefKey] = useState("diver");
  const currentRef = REFERENCES[selectedRefKey] || REFERENCES.diver;

  // Trích xuất chiều dài tính theo mét
  const speciesLengthM = useMemo(() => {
    if (species?.sizeMaxCm) return Number(species.sizeMaxCm) / 100;
    if (species?.sizeMinCm) return Number(species.sizeMinCm) / 100;

    // Phân tích từ chuỗi (vd "3.4m - 6m", "18m", "6m")
    if (typeof species?.size === "string") {
      const matches = species.size.match(/(\d+(\.\d+)?)/g);
      if (matches && matches.length > 0) {
        return parseFloat(matches[matches.length - 1]);
      }
    }
    return 3.0; // Mặc định 3m
  }, [species]);

  // Trích xuất cân nặng tính theo kg
  const speciesWeightKg = useMemo(() => {
    if (species?.weightMaxKg) return Number(species.weightMaxKg);
    if (species?.weightMinKg) return Number(species.weightMinKg);

    if (typeof species?.weight === "string") {
      const matches = species.weight.match(/(\d+(\.\d+)?)/g);
      if (matches && matches.length > 0) {
        let val = parseFloat(matches[matches.length - 1]);
        if (species.weight.toLowerCase().includes("t") || species.weight.toLowerCase().includes("tấn")) {
          val = val * 1000;
        }
        return val;
      }
    }
    return 450;
  }, [species]);

  // Tỉ lệ tương quan
  const lengthRatio = (speciesLengthM / currentRef.lengthM).toFixed(1);
  const weightRatio = (speciesWeightKg / currentRef.weightKg).toFixed(1);

  // Tính % bề rộng hiển thị trong khung tỉ lệ (khung biểu diễn max 15m hoặc lớn hơn)
  const maxScaleM = Math.max(12, speciesLengthM * 1.25, currentRef.lengthM * 1.5);
  const speciesPercent = Math.min(94, Math.max(12, (speciesLengthM / maxScaleM) * 100));
  const refPercent = Math.min(94, Math.max(10, (currentRef.lengthM / maxScaleM) * 100));

  const speciesName = isEn
    ? species?.nameEn || species?.commonName || "Marine Creature"
    : species?.nameVi || species?.commonName || "Sinh vật biển";

  return (
    <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2.5">
            <Ruler size={13} />
            <span>{isEn ? "Morphometrics & Allometry" : "Đo Đạc Hình Thái Học"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
            {isEn ? "Comparative Size Scale" : "Tương Quan Kích Thước Sinh Thái"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            {isEn
              ? `Visual length and mass comparison between ${speciesName} and standard reference models.`
              : `Mô phỏng trực quan tương quan kích thước chiều dài và khối lượng thực tế giữa ${speciesName} và các vật chuẩn đại dương.`}
          </p>
        </div>

        {/* Nút chọn đối tượng so sánh */}
        <div className="flex items-center gap-2 bg-[#081a30]/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          {Object.values(REFERENCES).map((ref) => {
            const Icon = ref.icon;
            const isSelected = selectedRefKey === ref.id;
            return (
              <button
                key={ref.id}
                onClick={() => setSelectedRefKey(ref.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={14} />
                <span>{isEn ? ref.nameEn : ref.nameVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── VISUAL COMPARISON STAGE ── */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0b1b33] to-[#061224] border border-white/15 p-6 md:p-8 overflow-hidden shadow-2xl">
        {/* Lưới tọa độ thước đo nền */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Water ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Thước đo mét trên đỉnh */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-white/10 pb-2 mb-8">
          <span>0m</span>
          <span>{(maxScaleM * 0.25).toFixed(1)}m</span>
          <span>{(maxScaleM * 0.5).toFixed(1)}m</span>
          <span>{(maxScaleM * 0.75).toFixed(1)}m</span>
          <span>{maxScaleM.toFixed(1)}m</span>
        </div>

        {/* Khung trực quan hóa 2 sinh vật */}
        <div className="relative z-10 space-y-8">
          {/* 1. Thanh sinh vật biển */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-cyan-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#38bdf8]" />
                {speciesName}
                {species?.sciName && <span className="text-slate-400 italic font-normal">({species.sciName})</span>}
              </span>
              <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                {speciesLengthM.toFixed(2)}m
              </span>
            </div>

            <div className="w-full bg-white/5 h-12 rounded-xl p-1 relative flex items-center overflow-hidden border border-white/10">
              <div
                className="h-full rounded-lg bg-gradient-to-r from-cyan-600 via-sky-500 to-teal-400 flex items-center px-3 relative transition-all duration-700 ease-out shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                style={{ width: `${speciesPercent}%` }}
              >
                {/* Ảnh đại diện nhỏ dạng cắt */}
                {species?.image && (
                  <img
                    src={species.image}
                    alt={speciesName}
                    className="w-8 h-8 rounded-full object-cover mr-2 border border-white/40 shadow-sm"
                  />
                )}
                <span className="text-[11px] font-bold text-white tracking-wide truncate">
                  {speciesName} ({speciesLengthM.toFixed(1)}m)
                </span>
              </div>
            </div>
          </div>

          {/* 2. Thanh đối tượng so sánh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                {isEn ? currentRef.nameEn : currentRef.nameVi}
                <span className="text-slate-500 font-normal">({isEn ? currentRef.descEn : currentRef.descVi})</span>
              </span>
              <span className="font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                {currentRef.lengthM.toFixed(2)}m
              </span>
            </div>

            <div className="w-full bg-white/5 h-12 rounded-xl p-1 relative flex items-center overflow-hidden border border-white/10">
              <div
                className="h-full rounded-lg bg-gradient-to-r from-slate-600 to-slate-400 flex items-center px-3 relative transition-all duration-700 ease-out"
                style={{ width: `${refPercent}%` }}
              >
                <currentRef.icon size={18} className="text-white/80 mr-2 flex-shrink-0" />
                <span className="text-[11px] font-bold text-white tracking-wide truncate">
                  {isEn ? currentRef.nameEn : currentRef.nameVi} ({currentRef.lengthM}m)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRIC STATS COMPARISON CARDS ── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          {/* Thẻ 1: Tương quan chiều dài */}
          <div className="bg-[#071324]/80 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isEn ? "Relative Length" : "Tỉ Lệ Chiều Dài"}</span>
              <ArrowRightLeft size={14} className="text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-heading">
              {Number(lengthRatio) >= 1 ? (
                <>
                  <span className="text-cyan-400">×{lengthRatio}</span> {isEn ? "longer" : "lớn hơn"}
                </>
              ) : (
                <>
                  <span className="text-cyan-400">×{lengthRatio}</span> {isEn ? "of reference" : "vật mẫu"}
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isEn
                ? `${speciesName} is ${lengthRatio}x the size of a ${currentRef.nameEn}.`
                : `${speciesName} dài gấp ${lengthRatio} lần kích thước ${currentRef.nameVi.toLowerCase()}.`}
            </p>
          </div>

          {/* Thẻ 2: Tương quan cân nặng */}
          <div className="bg-[#071324]/80 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isEn ? "Relative Mass" : "Tỉ Lệ Khối Lượng"}</span>
              <Scale size={14} className="text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-heading">
              {Number(weightRatio) >= 1 ? (
                <>
                  <span className="text-amber-400">×{weightRatio}</span> {isEn ? "heavier" : "nặng hơn"}
                </>
              ) : (
                <>
                  <span className="text-amber-400">×{weightRatio}</span> {isEn ? "of reference" : "vật mẫu"}
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isEn
                ? `Estimated mass: ~${speciesWeightKg.toLocaleString()}kg vs ${currentRef.weightKg.toLocaleString()}kg.`
                : `Khối lượng ước tính: ~${speciesWeightKg.toLocaleString()}kg so với ${currentRef.weightKg.toLocaleString()}kg của vật mẫu.`}
            </p>
          </div>

          {/* Thẻ 3: Môi trường & phân tầng độ sâu */}
          <div className="bg-[#071324]/80 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{isEn ? "Ocean Zone Depth" : "Phân Phối Độ Sâu"}</span>
              <Compass size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-heading">
              <span className="text-emerald-400">{species?.depth || "0m - 1,000m"}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {species?.oceanZone?.name || species?.oceanZone || (isEn ? "Pelagic Zone" : "Tầng nước biển tự nhiên")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
