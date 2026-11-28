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

export default function PacificHotspotMap({ asBackground = false, showHotspots = false }) {
  const { language } = useLanguage();
  const [activeSpot, setActiveSpot] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [activeScene, setActiveScene] = useState(0);

  // Chuyển cảnh nền mượt theo từng khu vực khi người dùng cuộn trang Landing
  useEffect(() => {
    if (!asBackground) return;

    let rafId = null;
    const updateScene = () => {
      const midY = window.innerHeight * 0.45;
      const locationsEl = document.getElementById("marine-locations");
      const searchEl = document.getElementById("search-section");
      const speciesEl = document.getElementById("species");

      if (
        (locationsEl && locationsEl.getBoundingClientRect().top <= midY) ||
        (searchEl && searchEl.getBoundingClientRect().top <= midY)
      ) {
        setActiveScene(2);
      } else if (speciesEl && speciesEl.getBoundingClientRect().top <= midY) {
        setActiveScene(1);
      } else {
        setActiveScene(0);
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScene);
      }
    };

    updateScene();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [asBackground]);

  useEffect(() => {
    if (!asBackground || !showHotspots) return;

    const handleScroll = () => {
      // Làm mờ hotspot khi cuộn qua hero
      const currentScroll = window.scrollY;
      const opacity = Math.max(0, Math.min(1, 1 - currentScroll / 120));
      setScrollOpacity(opacity);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [asBackground, showHotspots]);

  // Modal hiển thị chi tiết khi nhấp vào hotspot
  const renderDetailModal = () => {
    if (!modalSpot) return null;

    const name = language === "en" ? modalSpot.nameEn : modalSpot.nameVi;
    const tag = language === "en" ? modalSpot.tagEn : modalSpot.tagVi;
    const location = language === "en" ? modalSpot.locationEn : modalSpot.locationVi;
    const desc = language === "en" ? modalSpot.descEn : modalSpot.descVi;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/35 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-auto"
        onClick={() => setModalSpot(null)}
      >
        <div
          className="relative w-full max-w-lg liquid-glass-strong rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/6 border border-slate-900/12 text-[#1e293b] text-xs font-medium font-mono tabular-nums">
              <MapPin size={13} />
              {modalSpot.depth}
            </span>
            <button
              onClick={() => setModalSpot(null)}
              className="w-8 h-8 rounded-full bg-[#0f172a]/6 hover:bg-[#0f172a]/12 flex items-center justify-center text-[#334155] hover:text-[#0f172a] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Compass className="text-[#0284c7]" size={20} />
            <h3 className="text-2xl font-bold text-[#0f172a] font-heading">
              {name}
            </h3>
          </div>

          <p className="text-sm text-[#0284c7] font-medium mb-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#0284c7] shrink-0" />
            <span>{location}</span>
            <span className="text-[#475569]">•</span>
            <span className="text-[#334155]">{tag}</span>
          </p>

          <p className="text-sm text-[#334155] leading-relaxed mb-6">
            {desc}
          </p>

          <div className="pt-4 border-t border-[#0f172a]/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setModalSpot(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#334155] hover:text-[#0f172a] hover:bg-[#0f172a]/6 transition-colors cursor-pointer"
            >
              {language === "en" ? "Close" : "Đóng"}
            </button>
            <a
              href="#species"
              onClick={() => setModalSpot(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
            >
              <span>{language === "en" ? "Explore Species" : "Khám phá sinh vật"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Nền trang chủ — 3 cảnh Biển Đông ánh nắng chuyển mượt theo từng phần khi cuộn
  if (asBackground) {
    const bgScenes = [
      {
        src: Images.SunlitMantaHero,
        alt: "Cá đuối manta và cá heo dưới làn nước Biển Đông ánh nắng",
        objectPos: "object-[80%_20%] md:object-center",
        eager: true,
      },
      {
        src: Images.SunlitEastSeaHero,
        alt: "Rạn san hô và rùa biển xanh dưới mặt nước Biển Đông",
        objectPos: "object-[68%_center] md:object-center",
        eager: false,
      },
      {
        src: Images.SunlitIslandHero,
        alt: "Vịnh đảo san hô Biển Đông từ trên cao",
        objectPos: "object-center",
        eager: false,
      },
    ];

    return (
      <>
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#eaf4fb]">
          <div className="absolute inset-x-0 top-0 h-[80vh] md:h-full overflow-hidden">
            {bgScenes.map((scene, idx) => (
              <img
                key={scene.src}
                src={scene.src}
                alt={scene.alt}
                fetchPriority={scene.eager ? "high" : undefined}
                loading={scene.eager ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-cover ${scene.objectPos} transition-opacity duration-1000 ease-out ${
                  activeScene === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Hòa tan rìa dưới ảnh vào nền #eaf4fb trên mobile để giảm phóng đại và xóa đường cắt ngang */}
            <div className="absolute inset-x-0 bottom-0 h-32 md:hidden bg-gradient-to-t from-[#eaf4fb] via-[#eaf4fb]/70 to-transparent pointer-events-none" />
          </div>

          {/* Giữ cảnh biển bên phải rõ nét, phủ nhẹ bên trái & đỉnh để tiêu đề luôn dễ đọc */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eff7fd]/78 via-[#eff7fd]/22 via-45% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5fafe]/35 via-transparent via-75% to-[#eaf4fb]/55 pointer-events-none" />
        </div>

        {/* Các điểm tương tác (chỉ hiển thị khi showHotspots = true) */}
        {showHotspots && (
          <>
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
                            {/* Nút tâm điểm vị trí */}
                            <div className="w-3.5 h-3.5 rounded-full bg-[#0284c7] border-2 border-white shadow-md group-hover/pin:bg-[#0369a1] transition-colors" />

                            {/* Nhãn tên địa danh hiển thị trực tiếp dưới điểm */}
                            <div className="absolute top-5 whitespace-nowrap px-2.5 py-0.5 rounded-full liquid-glass-strong text-[10px] font-semibold text-[#0f172a] pointer-events-none group-hover/pin:border-[#0284c7]/40 transition-colors">
                              {name}
                            </div>

                            {/* Tooltip khi rê chuột */}
                            {isHovered && (
                              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-52 p-3.5 rounded-xl liquid-glass-strong z-40 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                                <div className="flex items-center gap-1.5 text-[#0284c7] text-[10px] font-semibold font-mono tabular-nums mb-1">
                                  <MapPin size={12} />
                                  <span>{spot.depth}</span>
                                </div>
                                <p className="text-xs font-bold text-[#0f172a] font-heading leading-snug mb-0.5">
                                  {name}
                                </p>
                                <p className="text-[11px] text-[#334155] line-clamp-1 mb-1.5">
                                  {language === "en" ? spot.tagEn : spot.tagVi}
                                </p>
                                <span className="text-[10px] text-[#0284c7] font-medium underline underline-offset-2">
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
        )}
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
                <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#07162c] shadow-md group-hover/pin:scale-125 group-hover/pin:bg-cyan-300 transition-all" />

                {isHovered && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-pacific-figma-dark/95 border border-pacific-cyan/40 backdrop-blur-xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-pacific-cyan text-[10px] font-bold mb-1">
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
