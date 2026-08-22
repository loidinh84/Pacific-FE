import { useState } from "react";
import { MapPin, ExternalLink, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Images from "../../assets/Images";

const HOTSPOTS = [
  {
    id: "mariana",
    x: 26,
    y: 46,
    nameVi: "Vực Mariana",
    nameEn: "Mariana Trench",
    tagVi: "Điểm sâu nhất Trái Đất",
    tagEn: "Deepest point on Earth",
    depth: "11,034 m",
    locationVi: "Tây Thái Bình Dương",
    locationEn: "Western Pacific",
    descVi: "Nơi sâu nhất của các đại dương trên thế giới, chứa đựng những sinh vật sinh sống trong áp suất nghẹt thở.",
    descEn: "The deepest place in the world's oceans, inhabited by extraordinary creatures adapted to extreme pressure.",
  },
  {
    id: "barrier",
    x: 24,
    y: 78,
    nameVi: "Rạn San Hô Great Barrier",
    nameEn: "Great Barrier Reef",
    tagVi: "Di sản thế giới UNESCO",
    tagEn: "UNESCO World Heritage",
    depth: "35 m",
    locationVi: "Đông Bắc Úc",
    locationEn: "Northeast Australia",
    descVi: "Hệ thống rạn san hô lớn nhất thế giới với hơn 1,500 loài cá và 400 loài san hô rực rỡ sắc màu.",
    descEn: "The world's largest coral reef system, home to over 1,500 fish species and 400 vivid coral types.",
  },
  {
    id: "galapagos",
    x: 86,
    y: 62,
    nameVi: "Quần Đảo Galápagos",
    nameEn: "Galápagos Islands",
    tagVi: "Thiên đường sinh vật độc bản",
    tagEn: "Endemic Species Sanctuary",
    depth: "200 m",
    locationVi: "Đông Thái Bình Dương",
    locationEn: "Eastern Pacific",
    descVi: "Khu bảo tồn biển độc đáo nổi tiếng với rùa khổng lồ, rồng biển iguana và sư tử biển phong phú.",
    descEn: "A unique marine reserve famous for giant tortoises, marine iguanas, and abundant sea lions.",
  },
  {
    id: "hawaii",
    x: 52,
    y: 38,
    nameVi: "Vùng Biển Hawai'i",
    nameEn: "Hawaiian Marine Reserve",
    tagVi: "Khu bảo tồn sinh thái",
    tagEn: "Ecological Sanctuary",
    depth: "4,500 m",
    locationVi: "Trung Thái Bình Dương",
    locationEn: "Central Pacific",
    descVi: "Vùng biển nhiệt đới trong lành với loài rùa xanh Honu huyền thoại và rạn san hô núi lửa độc đáo.",
    descEn: "Crystal-clear tropical waters home to the legendary Honu green sea turtles and volcanic coral formations.",
  },
  {
    id: "california",
    x: 70,
    y: 30,
    nameVi: "Vịnh California",
    nameEn: "Gulf of California",
    tagVi: "Bể bơi tự nhiên của đại dương",
    tagEn: "Ocean's Aquarium",
    depth: "3,000 m",
    locationVi: "Tây Bắc Bắc Mỹ",
    locationEn: "Northwest North America",
    descVi: "Nơi tụ hội của hàng chục loài cá voi, heo biển và là điểm đến yêu thích của cá mập voi khổng lồ.",
    descEn: "A biodiversity hotspot hosting dozens of whale species, porpoises, and giant whale sharks.",
  },
];

export default function PacificHotspotMap() {
  const { language } = useLanguage();
  const [activeSpot, setActiveSpot] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);

  return (
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15)_0%,transparent_70%)] pointer-events-none z-10" />

      {/* Map Image Base (Official Pacific Ocean Centered Map) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={Images.PacificOceanMap}
          alt="Pacific Ocean Centered Map"
          className="w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pacific-figma-dark/60 via-transparent to-pacific-figma-dark/20 pointer-events-none" />

        {/* Render Hotspots */}
        {HOTSPOTS.map((spot) => {
          const isHovered = activeSpot?.id === spot.id;
          const name = language === "en" ? spot.nameEn : spot.nameVi;
          const tag = language === "en" ? spot.tagEn : spot.tagVi;

          return (
            <div
              key={spot.id}
              className="absolute z-20"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onMouseEnter={() => setActiveSpot(spot)}
              onMouseLeave={() => setActiveSpot(null)}
              onClick={() => setModalSpot(spot)}
            >
              {/* Pulsing Ripple Effect */}
              <div className="relative flex items-center justify-center cursor-pointer group/pin">
                <span className="absolute w-6 h-6 rounded-full bg-pacific-cyan/50 animate-ping" />
                <span className="absolute w-4 h-4 rounded-full bg-pacific-blue-bright/70 animate-pulse" />
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-pacific-cyan to-pacific-blue-bright border-2 border-white shadow-[0_0_14px_rgba(34,211,238,1)] hover:scale-125 transition-transform" />

                {/* Hover Tooltip Card */}
                {isHovered && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-pacific-figma-dark/95 border border-pacific-cyan/40 backdrop-blur-xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-pacific-cyan text-[10px] font-bold uppercase mb-1">
                      <MapPin size={12} />
                      <span>{spot.depth}</span>
                    </div>
                    <p className="text-xs font-bold text-white font-heading leading-snug mb-0.5">
                      {name}
                    </p>
                    <p className="text-[10px] text-pacific-blue-pale line-clamp-1">
                      {tag}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal Popup */}
      {modalSpot && (
        <div className="absolute inset-0 z-40 bg-pacific-figma-dark/90 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-pacific-cyan/20 border border-pacific-cyan/40 text-pacific-cyan text-[10px] font-bold uppercase">
                {modalSpot.depth}
              </span>
              <button
                onClick={() => setModalSpot(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white font-heading mb-1">
              {language === "en" ? modalSpot.nameEn : modalSpot.nameVi}
            </h3>
            <p className="text-xs text-pacific-blue-light font-medium mb-3">
              📍 {language === "en" ? modalSpot.locationEn : modalSpot.locationVi}
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              {language === "en" ? modalSpot.descEn : modalSpot.descVi}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <a
              href="#species"
              onClick={() => setModalSpot(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pacific-blue-bright hover:bg-pacific-blue-bright/80 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <span>{language === "en" ? "Explore Species" : "Khám phá sinh vật"}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
