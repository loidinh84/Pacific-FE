import { Link } from "react-router-dom";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Images from "../../assets/Images";

const HIGHLIGHTED_LOCATIONS = [
  {
    id: "con-dao",
    nameVi: "Vườn Quốc Gia Côn Đảo",
    nameEn: "Con Dao National Park",
    regionVi: "Bà Rịa - Vũng Tàu • Vùng biển Đông Nam",
    regionEn: "Ba Ria - Vung Tau • Southeast Sea",
    coords: "8.6833° N, 106.6000° E",
    tagVi: "Bảo tồn rùa biển số 1",
    tagEn: "Premier Sea Turtle Sanctuary",
    descVi: "Bãi đẻ lớn nhất của rùa biển tại Việt Nam, sở hữu hệ sinh thái thảm cỏ biển, rừng ngập mặn và rạn san hô nguyên vẹn.",
    descEn: "Vietnam's largest sea turtle nesting grounds, home to pristine coral reefs, seagrass meadows, and mangrove forests.",
    keySpeciesVi: "Rùa xanh, Vích, Bò biển Dugong, Trai tai tượng",
    keySpeciesEn: "Green turtle, Hawksbill, Dugong, Giant clam",
    image: Images.TurtleHatchlings,
  },
  {
    id: "phu-quoc",
    nameVi: "Khu Bảo Tồn Biển Phú Quốc",
    nameEn: "Phu Quoc Marine Protected Area",
    regionVi: "Kiên Giang • Vịnh Thái Lan",
    regionEn: "Kien Giang • Gulf of Thailand",
    coords: "10.2899° N, 103.9840° E",
    tagVi: "Thảm cỏ biển & Bò biển",
    tagEn: "Seagrass Beds & Dugong Habitat",
    descVi: "Khu bảo tồn thảm cỏ biển diện tích hàng ngàn hecta, nơi ghi nhận sự xuất hiện của quần thể Bò biển (Dugong) quý hiếm.",
    descEn: "Spanning thousands of hectares of seagrass meadows, critical habitat for rare Dugong populations and coastal dolphins.",
    keySpeciesVi: "Bò biển Dugong, Cá heo không vây, San hô sừng hươu",
    keySpeciesEn: "Dugong, Finless porpoise, Staghorn coral",
    image: Images.BeachCleanup,
  },
  {
    id: "hon-mun",
    nameVi: "Khu Bảo Tồn Biển Hòn Mun",
    nameEn: "Hon Mun Marine Protected Area",
    regionVi: "Vịnh Nha Trang • Khánh Hòa",
    regionEn: "Nha Trang Bay • Khanh Hoa",
    coords: "12.1694° N, 109.3039° E",
    tagVi: "Đa dạng rạn san hô đỉnh cao",
    tagEn: "Coral Biodiversity Hotspot",
    descVi: "Nơi có độ đa dạng sinh thái rạn san hô phong phú nhất Việt Nam với hơn 350 loài san hô cứng và hàng trăm loài cá rạn.",
    descEn: "Highest coral biodiversity in Vietnam, boasting over 350 hard coral species and hundreds of reef-dwelling fishes.",
    keySpeciesVi: "San hô cành Acropora, Cá hề nemo, Bào ngư chín lỗ",
    keySpeciesEn: "Acropora coral, Clownfish, Abalone",
    image: Images.CoralRestoration,
  },
  {
    id: "hoang-sa-truong-sa",
    nameVi: "Quần Đảo Hoàng Sa & Trường Sa",
    nameEn: "Paracel & Spratly Archipelagos",
    regionVi: "Vùng biển khơi xa bờ • Biển Đông",
    regionEn: "Pelagic Ocean • East Sea",
    coords: "16.5000° N, 112.0000° E",
    tagVi: "Rạn san hô vòng Atoll đại dương",
    tagEn: "Oceanic Coral Atolls",
    descVi: "Hệ sinh thái rạn san hô atoll ngoài khơi sâu, điểm dừng chân của các loài cá di cư đại dương, cá mập san hô và rùa biển.",
    descEn: "Deep oceanic atoll reef ecosystems, essential migration corridors for pelagic tunas, reef sharks, and sea turtles.",
    keySpeciesVi: "Cá cờ xanh, Cá ngừ vây vàng, Cá mập đầu búa",
    keySpeciesEn: "Blue marlin, Yellowfin tuna, Hammerhead shark",
    image: Images.CaMapVoi,
  },
];

export default function LocationsShowcaseSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <section id="marine-locations" className="bg-pacific-figma-dark/95 pt-16 pb-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14" data-aos="fade-up">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              {isEn ? "Marine Protected Areas of the East Sea" : "Các Khu Bảo Tồn Biển Trọng Điểm"}
            </h2>
            <p className="text-sm md:text-base text-slate-300/80 mt-3 leading-relaxed">
              {isEn
                ? "Explore critical biodiversity hotspots, turtle nesting sanctuaries, and coral reef ecosystems along Vietnam's coast and archipelagos."
                : "Khám phá các điểm nóng sinh thái, vùng đẻ trứng của rùa biển và hệ thống rạn san hô trọng điểm dọc bờ biển và hải đảo Việt Nam."}
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>{isEn ? "Explore Marine Life" : "Xem sinh vật theo vùng"}</span>
            <ExternalLink size={15} />
          </Link>
        </div>

        {/* 4 Featured Locations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTED_LOCATIONS.map((loc, idx) => (
            <div
              key={loc.id}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="rounded-3xl p-5 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-colors group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image container */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative bg-black/40">
                  <img
                    src={loc.image}
                    alt={isEn ? loc.nameEn : loc.nameVi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge on image */}
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                    {isEn ? loc.tagEn : loc.tagVi}
                  </span>
                </div>

                  {/* Location Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/90 font-mono">
                      <Navigation size={11} />
                      <span>{loc.coords}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan-300 transition-colors leading-snug">
                      {isEn ? loc.nameEn : loc.nameVi}
                    </h3>

                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="shrink-0 text-slate-500" />
                      <span className="truncate">{isEn ? loc.regionEn : loc.regionVi}</span>
                    </p>

                    <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed pt-1">
                      {isEn ? loc.descEn : loc.descVi}
                    </p>
                  </div>
                </div>

                {/* Key species footer */}
                <div className="mt-4 pt-3.5 border-t border-white/10 text-[11px]">
                  <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider mb-1">
                    {isEn ? "Key Species:" : "Sinh vật đại diện:"}
                  </p>
                  <p className="text-cyan-200/90 font-medium line-clamp-1">
                    {isEn ? loc.keySpeciesEn : loc.keySpeciesVi}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
