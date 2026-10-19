import { useState, useEffect } from "react";
import { MapPin, ExternalLink, X, Compass } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import * as Images from "../../assets/Images";

const HOTSPOTS = [
  {
    id: "halong",
    x: 27,
    y: 22,
    nameVi: "Vịnh Hạ Long",
    nameEn: "Ha Long Bay",
    tagVi: "Di sản Thế giới UNESCO",
    tagEn: "UNESCO World Heritage",
    depth: "20 m",
    locationVi: "Đông Bắc Việt Nam",
    locationEn: "Northeast Vietnam",
    descVi: "Một trong những kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi và hệ sinh thái biển độc đáo chứa hơn 1.000 loài sinh vật biển.",
    descEn: "One of the world's natural wonders with thousands of limestone islands and a unique marine ecosystem hosting over 1,000 marine species.",
  },
  {
    id: "hoangsa",
    x: 43,
    y: 36,
    nameVi: "Quần đảo Hoàng Sa",
    nameEn: "Paracel Islands",
    tagVi: "Trọng điểm đa dạng sinh học",
    tagEn: "Biodiversity Hotspot",
    depth: "1,322 m",
    locationVi: "Trung tâm Biển Đông",
    locationEn: "Central East Sea",
    descVi: "Hệ thống rạn san hô phong phú với hơn 200 loài san hô và là ngư trường quan trọng của nhiều loài cá biển quý hiếm.",
    descEn: "A rich coral reef system with over 200 coral species and an important spawning ground for rare marine fish species.",
  },
  {
    id: "truongsa",
    x: 55,
    y: 62,
    nameVi: "Quần đảo Trường Sa",
    nameEn: "Spratly Islands",
    tagVi: "Rạn san hô nhiệt đới & Vực sâu",
    tagEn: "Tropical Coral Reefs & Deep Basin",
    depth: "5,016 m",
    locationVi: "Nam Biển Đông",
    locationEn: "Southern East Sea",
    descVi: "Quần đảo gắn liền với điểm sâu nhất Biển Đông, nơi sinh sống của rùa biển, cá heo, cá ngừ đại dương và nhiều loài san hô quý hiếm.",
    descEn: "The archipelago bordering the deepest trench of the East Sea, home to sea turtles, dolphins, tuna, and rare endemic coral species.",
  },
  {
    id: "vinhthailand",
    x: 27,
    y: 76,
    nameVi: "Vịnh Thái Lan",
    nameEn: "Gulf of Thailand",
    tagVi: "Vùng biển ấm được che chắn",
    tagEn: "Sheltered Warm Waters",
    depth: "80 m",
    locationVi: "Tây Nam Biển Đông",
    locationEn: "Southwest East Sea",
    descVi: "Vịnh nông ấm với độ sâu tối đa chỉ 80m, là môi trường lý tưởng cho cá ngựa, đồi mồi và cá chim vàng nổi tiếng.",
    descEn: "A shallow warm bay with max depth of only 80m, ideal habitat for seahorses, hawksbill turtles, and golden trevally fish.",
  },
  {
    id: "malacca",
    x: 21,
    y: 78,
    nameVi: "Eo Biển Malacca",
    nameEn: "Strait of Malacca",
    tagVi: "Cửa ngõ hàng hải Biển Đông",
    tagEn: "Gateway to East Sea",
    depth: "25 m",
    locationVi: "Cửa ngõ phía Nam Biển Đông",
    locationEn: "Southern Gateway to East Sea",
    descVi: "Cửa ngõ huyết mạch quan trọng vào Biển Đông, nơi đa dạng sinh học cao với hơn 300 loài cá và hệ sinh thái rừng ngập mặn phong phú.",
    descEn: "The most important maritime gateway into the East Sea, with high biodiversity of over 300 fish species and rich mangrove ecosystems.",
  },
];

export default function PacificHotspotMap({ asBackground = false }) {
  const { language } = useLanguage();
  const [activeSpot, setActiveSpot] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    if (!asBackground) return;

    const handleScroll = () => {
      // Mờ dần mượt mà các điểm hotspot khi bắt đầu cuộn khỏi đầu trang Hero (từ 0px đến 120px)
      const currentScroll = window.scrollY;
      const opacity = Math.max(0, Math.min(1, 1 - currentScroll / 120));
      setScrollOpacity(opacity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [asBackground]);

  // Modal hiển thị chi tiết khi nhấp vào hotspot
  const renderDetailModal = () => {
    if (!modalSpot) return null;

    const name = language === "en" ? modalSpot.nameEn : modalSpot.nameVi;
    const tag = language === "en" ? modalSpot.tagEn : modalSpot.tagVi;
    const location = language === "en" ? modalSpot.locationEn : modalSpot.locationVi;
    const desc = language === "en" ? modalSpot.descEn : modalSpot.descVi;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-auto"
        onClick={() => setModalSpot(null)}
      >
        <div
          className="relative w-full max-w-lg bg-pacific-figma-dark/95 border border-pacific-cyan/40 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(14,165,233,0.35)] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pacific-cyan/20 border border-pacific-cyan/40 text-pacific-cyan text-xs font-bold uppercase tracking-wider">
              <MapPin size={13} />
              {modalSpot.depth}
            </span>
            <button
              onClick={() => setModalSpot(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Compass className="text-pacific-cyan" size={20} />
            <h3 className="text-2xl font-black text-white font-heading">
              {name}
            </h3>
          </div>

          <p className="text-sm text-pacific-cyan font-medium mb-3">
            📍 {location} • <span className="text-pacific-blue-light">{tag}</span>
          </p>

          <p className="text-sm text-white/85 leading-relaxed mb-6">
            {desc}
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setModalSpot(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {language === "en" ? "Close" : "Đóng"}
            </button>
            <a
              href="#species"
              onClick={() => setModalSpot(null)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pacific-cyan to-pacific-blue-bright hover:from-pacific-cyan/90 hover:to-pacific-blue-bright/90 text-pacific-figma-dark font-bold text-xs shadow-lg shadow-pacific-cyan/30 transition-all cursor-pointer"
            >
              <span>{language === "en" ? "Explore Species" : "Khám phá sinh vật"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // ─── CHẾ ĐỘ 1: LÀM NỀN CHO CẢ TRANG LANDING (Full-page background ban đầu) ───
  if (asBackground) {
    return (
      <>
        {/* LỚP 1: ẢNH BẢN ĐỒ VÀ CÁC HIỆU ỨNG GRADIENT NẰM Ở z-0 */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[1200/896] min-w-full min-h-full flex-shrink-0">
              <img
                src={Images.BienDongMap}
                alt="Bản đồ Biển Đông"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.12] saturate-[1.22]"
              />

              {/* Lớp gradient làm mịn và kết nối với phong cách thiết kế đại dương */}
              <div className="absolute inset-0 bg-gradient-to-r from-pacific-figma-dark/85 via-pacific-figma-dark/35 to-pacific-figma-dark/75 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-pacific-figma-dark/80 via-transparent to-pacific-figma-dark pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(14,165,233,0.15)_0%,transparent_75%)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* LỚP 2: CÁC NÚT HOTSPOT TƯƠNG TÁC (TỰ ĐỘNG MỜ MƯỢT MÀ KHI CUỘN QUA HERO) */}
        <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[1200/896] min-w-full min-h-full flex-shrink-0">
              <div
                className="absolute inset-0 transition-opacity duration-150"
                style={{
                  opacity: scrollOpacity,
                  pointerEvents: scrollOpacity > 0.05 ? "auto" : "none",
                }}
              >
                {HOTSPOTS.map((spot) => {
                  const isHovered = activeSpot?.id === spot.id;
                  const name = language === "en" ? spot.nameEn : spot.nameVi;

                  return (
                    <div
                      key={spot.id}
                      className="absolute z-20 pointer-events-auto"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onMouseEnter={() => setActiveSpot(spot)}
                      onMouseLeave={() => setActiveSpot(null)}
                      onClick={() => setModalSpot(spot)}
                    >
                      <div className="relative flex items-center justify-center cursor-pointer group/pin -translate-x-1/2 -translate-y-1/2">
                        {/* Vòng quét radar xanh cyan */}
                        <span className="absolute w-8 h-8 rounded-full bg-pacific-cyan/40 animate-ping" />
                        <span className="absolute w-5 h-5 rounded-full bg-pacific-blue-bright/60 animate-pulse" />
                        
                        {/* Nút tâm điểm phát sáng */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pacific-cyan to-white border-2 border-pacific-figma-dark shadow-[0_0_16px_rgba(34,211,238,1)] hover:scale-135 transition-transform" />

                        {/* Nhãn tên địa danh hiển thị trực tiếp dưới điểm */}
                        <div className="absolute top-5 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-pacific-figma-dark/85 backdrop-blur-sm border border-pacific-cyan/40 text-[10px] font-bold text-cyan-200 shadow-lg pointer-events-none group-hover/pin:border-pacific-cyan group-hover/pin:text-white transition-all">
                          {name}
                        </div>

                        {/* Tooltip khi rê chuột */}
                        {isHovered && (
                          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-52 p-3.5 rounded-2xl bg-pacific-figma-dark/95 border border-pacific-cyan/50 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-40 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                            <div className="flex items-center gap-1.5 text-pacific-cyan text-[10px] font-bold uppercase mb-1">
                              <MapPin size={12} />
                              <span>{spot.depth}</span>
                            </div>
                            <p className="text-xs font-bold text-white font-heading leading-snug mb-0.5">
                              {name}
                            </p>
                            <p className="text-[10px] text-pacific-blue-pale line-clamp-1 mb-1.5">
                              {spot.tagVi}
                            </p>
                            <span className="text-[9px] text-cyan-400 font-semibold underline underline-offset-2">
                              {language === "en" ? "Click to view details →" : "Nhấp để xem chi tiết →"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal chi tiết hiển thị khi click */}
        {renderDetailModal()}
      </>
    );
  }

  // ─── CHẾ ĐỘ 2: CARD WIDGET ĐỘC LẬP ──────────────────────────────────────────
  return (
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15)_0%,transparent_70%)] pointer-events-none z-10" />

      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={Images.BienDongMap}
          alt="Bản đồ Biển Đông"
          className="w-full h-full object-cover filter brightness-95 contrast-105 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pacific-figma-dark/60 via-transparent to-pacific-figma-dark/20 pointer-events-none" />

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
              <div className="relative flex items-center justify-center cursor-pointer group/pin -translate-x-1/2 -translate-y-1/2">
                <span className="absolute w-6 h-6 rounded-full bg-pacific-cyan/50 animate-ping" />
                <span className="absolute w-4 h-4 rounded-full bg-pacific-blue-bright/70 animate-pulse" />
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-pacific-cyan to-pacific-blue-bright border-2 border-white shadow-[0_0_14px_rgba(34,211,238,1)] hover:scale-125 transition-transform" />

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

      {renderDetailModal()}
    </div>
  );
}
