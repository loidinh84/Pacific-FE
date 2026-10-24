import { useState, useMemo } from "react";
import {
  Waves,
  Compass,
  MapPin,
  Thermometer,
  Sun,
  Moon,
  Clock,
  Sparkles,
  Droplets,
  Zap,
  Activity,
  Layers,
  Shield,
  Fish,
} from "lucide-react";

export function HabitatAndBehaviorSection({ species, language = "vi" }) {
  const [activeTab, setActiveTab] = useState("habitat");
  const isEn = language === "en";

  // Trích xuất độ sâu số học (mét)
  const depthMetrics = useMemo(() => {
    let minM = 0;
    let maxM = 100;
    if (species.depthMinM !== undefined && species.depthMinM !== null) {
      minM = Number(species.depthMinM);
    }
    if (species.depthMaxM !== undefined && species.depthMaxM !== null) {
      maxM = Number(species.depthMaxM);
    } else if (typeof species.depth === "string") {
      const match = species.depth.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        minM = parseInt(match[1], 10);
        maxM = parseInt(match[2], 10);
      }
    }
    return { minM, maxM };
  }, [species]);

  // Phân tích tầng nước đại dương - Bỏ ngoặc đơn lặp chữ
  const depthZoneInfo = useMemo(() => {
    const max = depthMetrics.maxM;
    if (max <= 200) {
      return {
        id: "sunlight",
        nameVi: "Vùng ngập nắng",
        nameEn: "Sunlight Zone",
        range: "0 – 200m",
        descVi:
          "Tầng nước mặt tiếp nhận hơn 90% ánh sáng, là nơi tập trung các rạn san hô kỳ thú và nguồn phù du dồi dào.",
        descEn:
          "Surface layer absorbing 90% of sunlight, nurturing vibrant coral reefs and abundant plankton.",
        badgeColor: "text-amber-300 border-amber-400/40 bg-amber-400/15",
        badge: "0 - 200m",
      };
    } else if (max <= 1000) {
      return {
        id: "twilight",
        nameVi: "Vùng tranh tối",
        nameEn: "Twilight Zone",
        range: "200 – 1.000m",
        descVi:
          "Tầng nước lạnh mờ ảo nơi ánh sáng mờ dần, diễn ra hiện tượng di cư thẳng đứng kiếm ăn hàng đêm.",
        descEn:
          "Chilled dim layer where light fades quickly, hosting massive nightly vertical feeding migrations.",
        badgeColor: "text-cyan-300 border-cyan-400/40 bg-cyan-400/15",
        badge: "200 - 1.000m",
      };
    } else {
      return {
        id: "midnight",
        nameVi: "Vùng nửa đêm & vực thẳm",
        nameEn: "Midnight Abyss",
        range: "> 1.000m",
        descVi:
          "Biển sâu tối hoàn toàn với áp suất nước cực lớn, sinh vật có khả năng phát quang sinh học độc đáo.",
        descEn:
          "Pitch-black deep sea under immense hydrostatic pressure, where organisms rely on bioluminescence.",
        badgeColor: "text-indigo-300 border-indigo-400/40 bg-indigo-400/15",
        badge: "> 1.000m",
      };
    }
  }, [depthMetrics]);

  // Sinh cảnh sống - Rút ngắn chữ, súc tích
  const habitats = useMemo(() => {
    const nameLower = (
      species.nameVi ||
      species.commonName ||
      ""
    ).toLowerCase();
    const sciLower = (
      species.sciName ||
      species.scientificName ||
      ""
    ).toLowerCase();
    const catLower = (
      species.categoryVi ||
      species.group?.name ||
      ""
    ).toLowerCase();

    const list = [];

    if (
      nameLower.includes("san hô") ||
      nameLower.includes("ốc") ||
      nameLower.includes("hề") ||
      nameLower.includes("bướm") ||
      nameLower.includes("rạn") ||
      nameLower.includes("bạch tuộc") ||
      catLower.includes("san hô") ||
      sciLower.includes("octopus")
    ) {
      list.push({
        titleVi: "Rạn san hô nhiệt đới",
        titleEn: "Tropical Coral Reefs",
        descVi:
          "Rạn san hô viền bờ và san hô vòng tại Hoàng Sa, Trường Sa, Côn Đảo.",
        descEn:
          "Fringing reefs and atolls across Spratly, Paracel, and Con Dao.",
        icon: Sparkles,
        accent:
          "from-emerald-500/25 to-teal-500/10 text-emerald-300 border-emerald-400/30",
        iconBg:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
      });
    }

    if (
      nameLower.includes("rùa") ||
      nameLower.includes("vích") ||
      nameLower.includes("đồi mồi") ||
      nameLower.includes("dugong") ||
      nameLower.includes("bò biển") ||
      nameLower.includes("ngựa") ||
      sciLower.includes("chelonia") ||
      sciLower.includes("dugong")
    ) {
      list.push({
        titleVi: "Thảm cỏ biển & vịnh nông",
        titleEn: "Seagrass Meadows & Coastal Bays",
        descVi:
          "Thảm cỏ biển trù phú tại Phú Quốc, Côn Đảo và các đầm phá ven biển.",
        descEn:
          "Coastal seagrass beds in Phu Quoc, Con Dao, and protected lagoons.",
        icon: Waves,
        accent:
          "from-green-500/25 to-emerald-500/10 text-green-300 border-green-400/30",
        iconBg: "bg-green-500/20 text-green-300 border border-green-400/30",
      });
    }

    if (
      nameLower.includes("mập") ||
      nameLower.includes("ngừ") ||
      nameLower.includes("voi") ||
      nameLower.includes("heo") ||
      nameLower.includes("cá kiếm") ||
      nameLower.includes("đuối") ||
      catLower.includes("mammal") ||
      sciLower.includes("shark")
    ) {
      list.push({
        titleVi: "Vùng biển khơi & hải lưu",
        titleEn: "Open Ocean Currents",
        descVi:
          "Vùng nước biển khơi giàu dinh dưỡng từ hiện tượng nước trồi ven bờ miền Trung.",
        descEn:
          "Deep pelagic waters enriched by coastal upwelling currents in central Vietnam.",
        icon: Compass,
        accent: "from-sky-500/25 to-blue-500/10 text-sky-300 border-sky-400/30",
        iconBg: "bg-sky-500/20 text-sky-300 border border-sky-400/30",
      });
    }

    if (list.length === 0) {
      list.push({
        titleVi: "Rạn san hô & vách đá ngầm",
        titleEn: "Coral Reefs & Rocky Shelves",
        descVi:
          "Khu vực rạn đá ngầm ven đảo, nơi cung cấp nguồn thức ăn và nơi ẩn náu.",
        descEn: "Rocky ledges and coral formations providing shelter and prey.",
        icon: Sparkles,
        accent:
          "from-emerald-500/25 to-teal-500/10 text-emerald-300 border-emerald-400/30",
        iconBg:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
      });
      list.push({
        titleVi: "Thềm lục địa Biển Đông",
        titleEn: "East Sea Continental Shelf",
        descVi: "Vùng biển thềm lục địa ấm áp với độ mặn ổn định 33–34.5‰.",
        descEn: "Warm shelf waters with stable 33–34.5‰ tropical salinity.",
        icon: Compass,
        accent:
          "from-cyan-500/25 to-blue-500/10 text-cyan-300 border-cyan-400/30",
        iconBg: "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30",
      });
    }

    return list;
  }, [species]);

  // Tập tính sinh học - Rút gọn câu chữ, bỏ ngoặc đơn thừa
  const biologyDetails = useMemo(() => {
    let diet = species.diet || "Động vật săn mồi";
    diet = diet.replace(/\s*\([^)]*\)/g, "").trim();

    const nameLower = (
      species.nameVi ||
      species.commonName ||
      ""
    ).toLowerCase();
    const sciLower = (
      species.sciName ||
      species.scientificName ||
      ""
    ).toLowerCase();

    let feedingStrategyVi = "Săn mồi chủ động tầng nước mặt và tầng rạn";
    let feedingStrategyEn =
      "Active predatory foraging in reef and pelagic zones";
    let activityPeriodVi = "Hoạt động mạnh lúc hoàng hôn và bình minh";
    let activityPeriodEn = "Most active during dawn and dusk";
    let reproductionVi =
      "Sinh sản theo chu kỳ gió mùa, di cư về rạn đá hoặc bãi cát nông";
    let reproductionEn =
      "Breeds seasonally with monsoons, moving to reefs or sandy shallows";
    let adaptationVi =
      "Giác quan tinh nhạy cảm nhận áp suất nước và điện trường";
    let adaptationEn =
      "Highly acute sensory organs detecting pressure and electric fields";

    if (nameLower.includes("bạch tuộc") || sciLower.includes("octopus")) {
      feedingStrategyVi =
        "Phục kích ban đêm, dùng giác hút siết chặt cua, ốc và giáp xác";
      feedingStrategyEn =
        "Nocturnal ambush predation using sensory suckers on crabs and mollusks";
      activityPeriodVi = "Săn mồi ban đêm, ban ngày ẩn náu trong hốc đá ngầm";
      activityPeriodEn =
        "Nocturnal hunter, sheltering in rocky crevasses by day";
      reproductionVi =
        "Con cái đẻ hàng vạn trứng thành chùm và chăm sóc đến khi nở";
      reproductionEn =
        "Females lay clusters of thousands of eggs, guarding them until hatch";
      adaptationVi =
        "Biến đổi màu sắc trong 0.2 giây và cơ thể không xương siêu linh hoạt";
      adaptationEn =
        "Dynamic camouflage in 0.2s with boneless, hyper-flexible body";
    } else if (
      nameLower.includes("nhám voi") ||
      nameLower.includes("mập voi") ||
      sciLower.includes("rhincodon")
    ) {
      feedingStrategyVi =
        "Lọc sinh vật phù du, tép và cá nhỏ qua các lược mang";
      feedingStrategyEn =
        "Filter feeds on plankton, krill, and small fish through gill rakers";
      activityPeriodVi =
        "Bơi chậm rãi, di chuyển theo các dòng nước ấm giàu phù du";
      activityPeriodEn =
        "Cruises steadily following warm, plankton-rich currents";
      reproductionVi =
        "Noãn thai sinh, con non phát triển trong cơ thể mẹ trước khi chào đời";
      reproductionEn =
        "Ovoviviparous, embryos develop inside mother before birth";
      adaptationVi =
        "Miệng rộng 1.5m với hơn 300 hàng răng nhỏ và bộ lọc mang xốp";
      adaptationEn =
        "1.5m wide mouth equipped with 300+ tiny tooth rows and filter pads";
    } else if (
      nameLower.includes("rùa") ||
      nameLower.includes("vích") ||
      nameLower.includes("đồi mồi")
    ) {
      feedingStrategyVi = "Ăn cỏ biển, rong rêu, sứa biển và bọt biển";
      feedingStrategyEn =
        "Forages on seagrass, marine algae, jellyfish, and sponges";
      activityPeriodVi = "Hoạt động ban ngày, ngoi lên mặt nước thở định kỳ";
      activityPeriodEn = "Active by day, surfacing periodically for air";
      reproductionVi =
        "Đẻ trứng trên bãi cát ven biển, vượt ngàn dặm về nơi sinh ra";
      reproductionEn =
        "Nests on coastal sandy beaches, homing thousands of miles to natal shores";
      adaptationVi =
        "Định vị bằng từ trường Trái Đất và tuyến lệ đào thải muối thừa";
      adaptationEn =
        "Geomagnetic ocean navigation and salt-excreting eye glands";
    } else if (nameLower.includes("cá ngừ") || sciLower.includes("thunnus")) {
      feedingStrategyVi =
        "Bơi săn mồi tốc độ cao theo bầy đàn, dồn ép các đàn cá nhỏ";
      feedingStrategyEn =
        "High-speed pack hunting, corralling schools of small baitfish";
      activityPeriodVi = "Bơi liên tục ngày đêm để duy trì dòng nước qua mang";
      activityPeriodEn =
        "Swims ceaselessly day and night to keep water flowing through gills";
      reproductionVi =
        "Đẻ trứng nổi ở vùng biển khơi ấm, ấu trùng phát tán theo hải lưu";
      reproductionEn =
        "Pelagic broadcast spawners in warm open waters; larvae drift with currents";
      adaptationVi =
        "Thân hình thoi lướt nước và cơ chế giữ nhiệt cơ bắp giúp bơi hơn 70 km/h";
      adaptationEn =
        "Torpedo body and heat-conserving muscles enabling speeds over 70 km/h";
    }

    return {
      diet,
      feedingStrategyVi,
      feedingStrategyEn,
      activityPeriodVi,
      activityPeriodEn,
      reproductionVi,
      reproductionEn,
      adaptationVi,
      adaptationEn,
    };
  }, [species]);

  // Phân vùng bảo tồn tại Việt Nam
  const localDistText = useMemo(() => {
    if (species.localDistribution) return species.localDistribution;
    if (species.eastSeaZone)
      return `Vùng phân bố trọng điểm: ${species.eastSeaZone}`;
    return "Phân bố tại các rạn san hô và vùng biển tự nhiên của Việt Nam như Hoàng Sa, Trường Sa, Côn Đảo, Phú Quốc.";
  }, [species]);

  return (
    <section className="relative py-14 px-4 md:px-8 max-w-6xl mx-auto border-t border-white/10 font-sans overflow-hidden">
      {/* Ambient background glow: Làm sáng nền, không còn bị chìm tối */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ─── 1. HEADER KHỐI & BỘ CHUYỂN TAB ──────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
            {isEn
              ? "Habitat & Biological Behavior"
              : "Sinh cảnh sống & tập tính sinh học"}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#10223b]/80 backdrop-blur-md border border-white/15 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("habitat")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "habitat"
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Waves size={14} />
            <span>{isEn ? "Habitat & Range" : "Sinh cảnh & phân bố"}</span>
          </button>
          <button
            onClick={() => setActiveTab("behavior")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "behavior"
                ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Activity size={14} />
            <span>{isEn ? "Behavior & Diet" : "Tập tính & săn mồi"}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. NỘI DUNG TAB 1: SINH CẢNH & PHÂN BỐ TẠI BIỂN ĐÔNG ─── */}
      {activeTab === "habitat" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Cột trái (7 cols): Tầng nước sinh thái & Vùng phân bố địa phương */}
          <div className="lg:col-span-7 space-y-5">
            {/* Thẻ Tầng nước sinh thái - Bề mặt kính sáng màu (Frosted Glass) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#122647]/90 via-[#0e1f3a]/90 to-[#0a182e]/90 border border-sky-400/25 relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/35 text-cyan-300">
                    <Layers size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-300">
                      {isEn ? "Bathymetric Layer" : "Tầng nước đại dương"}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {isEn ? depthZoneInfo.nameEn : depthZoneInfo.nameVi}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${depthZoneInfo.badgeColor}`}
                >
                  {depthZoneInfo.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5">
                {isEn ? depthZoneInfo.descEn : depthZoneInfo.descVi}
              </p>

              {/* Thước đo độ sâu: Bỏ ngoặc đơn thừa, nhãn sạch sẽ */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                  <span>0m</span>
                  <span>200m</span>
                  <span>1.000m</span>
                  <span>4.000m+</span>
                </div>
                <div className="relative h-2.5 rounded-full bg-slate-900/90 overflow-hidden border border-white/15">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(14, (depthMetrics.maxM / 1500) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-cyan-200 font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets size={13} className="text-cyan-400" />
                    <span>{isEn ? "Depth range:" : "Độ sâu ghi nhận:"}</span>
                    <strong className="text-white font-bold">
                      {species.depth ||
                        `${depthMetrics.minM}m - ${depthMetrics.maxM}m`}
                    </strong>
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    {isEn ? "Natural biome" : "Sinh cảnh tự nhiên"}
                  </span>
                </div>
              </div>
            </div>

            {/* Thẻ Vị trí phân bố tại Việt Nam */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#122647]/90 via-[#0e1f3a]/90 to-[#0a182e]/90 border border-sky-400/25 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-400/35 text-rose-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-300">
                    {isEn ? "Geographic Range" : "Phân bố tại Việt Nam"}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {species.eastSeaZone ||
                      (isEn
                        ? "East Sea Marine Protected Areas"
                        : "Khu bảo tồn biển Biển Đông")}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                {localDistText}
              </p>

              {/* Các điểm quan trắc / Vườn quốc gia trọng điểm - Static informative tags, no hover */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {[
                  "Hoàng Sa",
                  "Trường Sa",
                  "Côn Đảo",
                  "Phú Quốc",
                  "Nha Trang",
                  "Cù Lao Chàm",
                ].map((zoneName) => (
                  <span
                    key={zoneName}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-sky-500/10 text-sky-200 border border-sky-400/20 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{zoneName}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải (5 cols): Danh sách kiểu sinh cảnh */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield size={14} className="text-cyan-400" />
              <span>
                {isEn ? "Preferred Marine Biomes" : "Sinh cảnh cư trú"}
              </span>
            </h4>

            {habitats.map((h, i) => {
              const IconComp = h.icon;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl bg-gradient-to-r ${h.accent} border backdrop-blur-md`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl shrink-0 ${h.iconBg}`}>
                      <IconComp size={18} />
                    </div>
                    <h5 className="text-sm sm:text-base font-bold text-white">
                      {isEn ? h.titleEn : h.titleVi}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-11">
                    {isEn ? h.descEn : h.descVi}
                  </p>
                </div>
              );
            })}

            {/* Thông số môi trường phụ trợ: Bỏ uppercase */}
            <div className="p-4 rounded-xl bg-[#10223d]/90 border border-sky-400/25 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-400/25">
                  <Thermometer size={16} />
                </div>
                <div>
                  <span className="block text-xs text-slate-300 font-medium">
                    {isEn ? "Water Temp" : "Nhiệt độ nước"}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {species.waterTemp || "22°C – 29°C"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                  <Droplets size={16} />
                </div>
                <div>
                  <span className="block text-xs text-slate-300 font-medium">
                    {isEn ? "Salinity" : "Độ mặn Biển Đông"}
                  </span>
                  <span className="text-xs font-bold text-white">
                    33 – 34.5 ‰
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. NỘI DUNG TAB 2: TẬP TÍNH SINH HỌC & KIẾM ĂN ───────── */}
      {activeTab === "behavior" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {/* Card 1: Chế độ dinh dưỡng & Săn mồi */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#122647]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 w-fit mb-3 border border-cyan-400/30">
                <Fish size={18} />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {isEn ? "Dietary Strategy" : "Kiểu dinh dưỡng"}
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">
                {biologyDetails.diet}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isEn
                  ? biologyDetails.feedingStrategyEn
                  : biologyDetails.feedingStrategyVi}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-white/10 text-xs text-cyan-300 font-medium">
              {isEn
                ? "Trophic interaction recorded"
                : "Ghi nhận chuỗi thức ăn Biển Đông"}
            </div>
          </div>

          {/* Card 2: Thích nghi tiến hóa */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#122647]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 w-fit mb-3 border border-amber-400/30">
                <Zap size={18} />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {isEn ? "Key Adaptation" : "Thích nghi sinh học"}
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">
                {isEn ? "Evolutionary Edge" : "Vũ khí tiến hóa"}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isEn
                  ? biologyDetails.adaptationEn
                  : biologyDetails.adaptationVi}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-white/10 text-xs text-amber-300 font-medium">
              {isEn
                ? "Survives marine pressure"
                : "Tối ưu hóa khả năng sống sót"}
            </div>
          </div>

          {/* Card 3: Chu kỳ & Thời gian hoạt động */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#122647]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 w-fit mb-3 border border-purple-400/30">
                <Clock size={18} />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {isEn ? "Activity Rhythm" : "Nhịp sinh học"}
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">
                {isEn ? "Diel Patterns" : "Thời gian hoạt động"}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isEn
                  ? biologyDetails.activityPeriodEn
                  : biologyDetails.activityPeriodVi}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-white/10 text-xs text-purple-300 font-medium flex items-center gap-1.5">
              <Sun size={12} /> / <Moon size={12} />
              <span>{isEn ? "Diel cycle" : "Chu kỳ ngày đêm"}</span>
            </div>
          </div>

          {/* Card 4: Sinh sản & Vòng đời */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#122647]/90 to-[#0a182e]/90 border border-sky-400/25 flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 w-fit mb-3 border border-emerald-400/30">
                <Sparkles size={18} />
              </div>
              <span className="text-xs font-medium text-slate-300">
                {isEn ? "Life History" : "Sinh sản & vòng đời"}
              </span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">
                {species.lifespan
                  ? `${species.lifespan}`
                  : isEn
                    ? "Reproduction"
                    : "Tiếp nối nòi giống"}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isEn
                  ? biologyDetails.reproductionEn
                  : biologyDetails.reproductionVi}
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-white/10 text-xs text-emerald-300 font-medium">
              {isEn
                ? "Sensitive to ocean warming"
                : "Nhạy cảm với biến đổi khí hậu"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
