import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Compass, ArrowUpRight, Waves } from "lucide-react";

// Tọa độ và vùng biển tiêu biểu theo danh pháp/vùng Biển Đông
const ZONE_COORDINATES_MAP = {
  "hoàng sa": { lat: "16°32' B", lng: "112°02' Đ", zoneName: "Quần đảo Hoàng Sa", zoneId: "hoang-sa" },
  "trường sa": { lat: "8°38' B", lng: "111°55' Đ", zoneName: "Quần đảo Trường Sa", zoneId: "truong-sa" },
  "côn đảo": { lat: "8°41' B", lng: "106°36' Đ", zoneName: "Vườn Quốc gia Côn Đảo", zoneId: "con-dao" },
  "phú quốc": { lat: "10°14' B", lng: "103°58' Đ", zoneName: "Vườn Quốc gia Phú Quốc", zoneId: "phu-quoc" },
  "nha trang": { lat: "12°10' B", lng: "109°18' Đ", zoneName: "Vịnh Nha Trang & Hòn Mun", zoneId: "nha-trang" },
  "cù lao chàm": { lat: "15°57' B", lng: "108°31' Đ", zoneName: "Khu BTTB Cù Lao Chàm", zoneId: "cu-lao-cham" },
  "hạ long": { lat: "20°54' B", lng: "107°11' Đ", zoneName: "Vịnh Hạ Long & Bái Tử Long", zoneId: "ha-long" },
  "bạch long vĩ": { lat: "20°08' B", lng: "107°43' Đ", zoneName: "Đảo Bạch Long Vĩ", zoneId: "bach-long-vi" },
  "vịnh bắc bộ": { lat: "19°30' B", lng: "107°00' Đ", zoneName: "Vùng biển Vịnh Bắc Bộ", zoneId: "bach-long-vi" },
  "vịnh thái lan": { lat: "9°45' B", lng: "103°15' Đ", zoneName: "Vùng biển Vịnh Thái Lan", zoneId: "phu-quoc" },
  "ranh sâu manila": { lat: "14°30' B", lng: "117°30' Đ", zoneName: "Vực thẳm Manila Biển Đông", zoneId: "ranh-manila" },
};

function resolveZoneCoordinates(species) {
  const text = `${species?.east_sea_zone || ""} ${species?.local_distribution || ""} ${species?.descVi || ""} ${species?.nameVi || ""}`.toLowerCase();

  for (const [key, val] of Object.entries(ZONE_COORDINATES_MAP)) {
    if (text.includes(key)) {
      return val;
    }
  }

  // Fallback tọa độ trung tâm thềm lục địa Biển Đông
  return {
    lat: "12°00' – 16°00' B",
    lng: "110°00' – 114°00' Đ",
    zoneName: species?.east_sea_zone || "Thềm lục địa Biển Đông",
    zoneId: "hoang-sa",
  };
}

export function SpeciesDistributionSpecs({ species, language = "vi" }) {
  const isEn = language === "en";
  const zoneInfo = useMemo(() => resolveZoneCoordinates(species), [species]);

  const zoneName = species?.east_sea_zone || zoneInfo.zoneName;
  const habitatText = species?.local_distribution || (isEn ? "Coral reefs, continental shelf" : "Rạn san hô, thềm lục địa ven biển");
  const depthText = species?.depth || (species?.depthMinM !== undefined ? `${species.depthMinM} - ${species.depthMaxM || 100}m` : null);
  const slugOrId = species?.slug || species?.id || "";

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-3 max-w-5xl mx-auto">
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/15 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Thông số tọa độ & phân vùng */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm">
            {/* Vùng biển */}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-sky-400 shrink-0" />
              <div>
                <span className="text-slate-400 text-xs block">
                  {isEn ? "East Sea Zone" : "Vùng phân bố Biển Đông"}
                </span>
                <span className="text-white font-semibold">
                  {zoneName}
                </span>
              </div>
            </div>

            {/* Tọa độ địa lý */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 sm:pl-6">
              <Compass size={16} className="text-teal-400 shrink-0" />
              <div>
                <span className="text-slate-400 text-xs block">
                  {isEn ? "Coordinates" : "Tọa độ địa lý"}
                </span>
                <span className="text-cyan-200 font-mono font-medium text-xs">
                  {zoneInfo.lat}, {zoneInfo.lng}
                </span>
              </div>
            </div>

            {/* Sinh cảnh sống */}
            {habitatText && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-4 sm:pl-6 hidden lg:flex">
                <Waves size={16} className="text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-xs block">
                    {isEn ? "Habitat" : "Sinh cảnh sống"}
                  </span>
                  <span className="text-slate-300">
                    {habitatText}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Nút xem trên bản đồ tương tác lớn */}
          <Link
            to={`/map?zone=${encodeURIComponent(zoneInfo.zoneId || "hoang-sa")}&species=${encodeURIComponent(slugOrId)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-sm shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Compass size={15} />
            <span>{isEn ? "View on East Sea Map" : "Xem trên Bản đồ Biển Đông"}</span>
            <ArrowUpRight size={14} className="opacity-70" />
          </Link>
        </div>
      </div>
    </section>
  );
}
