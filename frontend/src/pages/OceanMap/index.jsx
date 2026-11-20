import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  Search,
  X,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Waves,
  Crosshair,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SEARCH_SPECIES_CATALOG } from "../../mocks/speciesMock";
import { useLanguage } from "../../hooks/useLanguage";

// Lazy load leaflet và leaflet css
async function loadLeaflet() {
  const L = (await import("leaflet")).default;
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.min.css";
    document.head.appendChild(link);
  }
  return L;
}

// 10 phân vùng và khu bảo tồn biển trọng điểm Biển Đông
export const EAST_SEA_ZONES = [
  {
    id: "hoang-sa",
    slug: "hoang-sa",
    nameVi: "Quần đảo Hoàng Sa",
    nameEn: "Paracel Islands",
    lat: 16.5333,
    lng: 112.0333,
    coordinatesText: "16°32' B, 112°02' Đ",
    depth: "1.322m",
    categoryVi: "Quần đảo & Rạn san hô",
    categoryEn: "Archipelago & Coral Reefs",
    descVi:
      "Vùng biển rạn san hô trù phú giữa lòng Biển Đông, bao gồm hơn 30 đảo đá và cồn cát, là môi trường sống của hơn 200 loài san hô và nhiều loài cá biển quý hiếm.",
    descEn:
      "Vibrant oceanic reef complex in the central East Sea, comprising over 30 limestone islands and sandbanks hosting over 200 coral species.",
    keywords: ["hoàng sa", "hoang sa", "paracel"],
  },
  {
    id: "truong-sa",
    slug: "truong-sa",
    nameVi: "Quần đảo Trường Sa",
    nameEn: "Spratly Islands",
    lat: 8.6447,
    lng: 111.9194,
    coordinatesText: "8°38' B, 111°55' Đ",
    depth: "5.016m",
    categoryVi: "Quần đảo & Biển sâu",
    categoryEn: "Archipelago & Deep Basin",
    descVi:
      "Khu vực biển nhiệt đới rộng lớn với các rạn san hô san sát vực biển sâu trên 5.000m. Ngư trường trú ẩn và đường di cư quan trọng của rùa biển, cá voi, cá heo và cá ngừ đại dương.",
    descEn:
      "Expansive tropical marine archipelago bordered by 5,000m oceanic trenches, critical migratory corridor for sea turtles, cetaceans, and pelagic tuna.",
    keywords: ["trường sa", "truong sa", "spratly"],
  },
  {
    id: "con-dao",
    slug: "con-dao",
    nameVi: "Vườn Quốc gia Côn Đảo",
    nameEn: "Con Dao National Park",
    lat: 8.6833,
    lng: 106.6000,
    coordinatesText: "8°41' B, 106°36' Đ",
    depth: "40m",
    categoryVi: "Khu bảo tồn biển Ramsar",
    categoryEn: "Ramsar Marine Sanctuary",
    descVi:
      "Bãi đẻ tự nhiên lớn nhất Việt Nam của rùa biển (Đồi mồi, Vích) và là nơi bảo tồn quần thể bò biển Dugong quý hiếm cùng các thảm cỏ biển nguyên sinh tuyệt đẹp.",
    descEn:
      "Vietnam's most vital nesting sanctuary for green turtles and hawksbills, sheltering endangered Dugong populations within lush seagrass meadows.",
    keywords: ["côn đảo", "con dao", "dugong", "đồi mồi"],
  },
  {
    id: "phu-quoc",
    slug: "phu-quoc",
    nameVi: "Khu Bảo tồn Biển Phú Quốc",
    nameEn: "Phu Quoc Marine Reserve",
    lat: 10.2289,
    lng: 103.9572,
    coordinatesText: "10°14' B, 103°58' Đ",
    depth: "35m",
    categoryVi: "Vịnh biển nông & Thảm cỏ biển",
    categoryEn: "Shallow Bay & Seagrass Beds",
    descVi:
      "Vùng nước nông ấm thuộc Vịnh Thái Lan với thảm cỏ biển rộng hơn 12.000 hecta, là sinh cảnh của cá ngựa, cá hề, san hô gạc nai và các loài thân mềm nhiệt đới.",
    descEn:
      "Warm shallow marine habitat in the Gulf of Thailand featuring over 12,000 ha of seagrass beds, supporting seahorses, anemonefish, and staghorn corals.",
    keywords: ["phú quốc", "phu quoc", "vịnh thái lan", "thái lan"],
  },
  {
    id: "nha-trang",
    slug: "nha-trang",
    nameVi: "Vịnh Nha Trang & Hòn Mun",
    nameEn: "Nha Trang Bay & Hon Mun",
    lat: 12.1667,
    lng: 109.3000,
    coordinatesText: "12°10' B, 109°18' Đ",
    depth: "60m",
    categoryVi: "Khu bảo tồn biển kiểu mẫu",
    categoryEn: "Model Marine Protected Area",
    descVi:
      "Khu bảo tồn biển đầu tiên của Việt Nam với mật độ loài san hô bậc nhất khu vực Indo-Pacific. Nơi hội tụ hơn 350 loài san hô đá và hàng trăm loài cá rạn sặc sỡ.",
    descEn:
      "Vietnam's first marine protected area renowned for the highest coral biodiversity in the Indo-Pacific, harboring 350 reef-building corals.",
    keywords: ["nha trang", "hòn mun", "hon mun", "khánh hòa"],
  },
  {
    id: "cu-lao-cham",
    slug: "cu-lao-cham",
    nameVi: "Khu BTTB Cù Lao Chàm",
    nameEn: "Cham Islands Marine Sanctuary",
    lat: 15.9556,
    lng: 108.5144,
    coordinatesText: "15°57' B, 108°31' Đ",
    depth: "45m",
    categoryVi: "Khu dự trữ sinh quyển thế giới",
    categoryEn: "UNESCO Biosphere Reserve",
    descVi:
      "Cụm đảo đá granit ngoài khơi Quảng Nam nổi tiếng với rạn san hô nguyên vẹn, sinh cảnh của cua đá đặc hữu, các loài sao biển và ốc xà cừ quý hiếm.",
    descEn:
      "Granitic archipelago off Central Vietnam harboring pristine coral reefs, endemic land crabs, colorful sea stars, and rare top shells.",
    keywords: ["cù lao chàm", "cu lao cham", "quảng nam"],
  },
  {
    id: "ha-long",
    slug: "ha-long",
    nameVi: "Vịnh Hạ Long & Bái Tử Long",
    nameEn: "Ha Long & Bai Tu Long Bay",
    lat: 20.9101,
    lng: 107.1839,
    coordinatesText: "20°54' B, 107°11' Đ",
    depth: "25m",
    categoryVi: "Di sản Thế giới UNESCO",
    categoryEn: "UNESCO World Heritage Site",
    descVi:
      "Hệ sinh thái biển đảo đá vôi Karst độc nhất vô nhị với hàng nghìn hang động ngập nước, bãi triều rừng ngập mặn và nơi sinh sống của bào ngư, tu hài, cá song.",
    descEn:
      "Unique drowned Karst limestone archipelago with thousands of sea caves, mangrove mudflats, abalones, geoducks, and groupers.",
    keywords: ["hạ long", "ha long", "bái tử long", "quảng ninh"],
  },
  {
    id: "bach-long-vi",
    slug: "bach-long-vi",
    nameVi: "Đảo Bạch Long Vĩ",
    nameEn: "Bach Long Vi Island MPA",
    lat: 20.1333,
    lng: 107.7167,
    coordinatesText: "20°08' B, 107°43' Đ",
    depth: "55m",
    categoryVi: "Đảo tiền tiêu Vịnh Bắc Bộ",
    categoryEn: "Gulf of Tonkin Outpost MPA",
    descVi:
      "Đảo tiền tiêu trung tâm Vịnh Bắc Bộ, là ngư trường trọng yếu với các rạn san hô ngầm, nơi bảo tồn giống loài bào ngư chín lỗ nổi tiếng và nhiều loài cá đáy.",
    descEn:
      "Central Gulf of Tonkin outpost island with rich offshore submerged reefs, preserving endemic nine-hole abalones and demersal fish stocks.",
    keywords: ["bạch long vĩ", "bach long vi", "vịnh bắc bộ", "bắc bộ"],
  },
  {
    id: "hon-cau",
    slug: "hon-cau",
    nameVi: "Khu BTTB Hòn Cau",
    nameEn: "Hon Cau Marine Reserve",
    lat: 11.2333,
    lng: 108.8333,
    coordinatesText: "11°14' B, 108°50' Đ",
    depth: "30m",
    categoryVi: "Vườn ươm sinh thái biển",
    categoryEn: "Coastal Nursery Habitat",
    descVi:
      "Vùng biển ngoài khơi Bình Thuận với những khối đá ngầm kỳ vĩ, là bãi đẻ quan trọng của rùa biển và sở hữu quần thể san hô nguyên sinh quý giá.",
    descEn:
      "Coastal island with majestic underwater rock formations, crucial nesting sanctuary for sea turtles and ancient coral communities.",
    keywords: ["hòn cau", "hon cau", "bình thuận"],
  },
  {
    id: "ranh-manila",
    slug: "ranh-manila",
    nameVi: "Vực thẳm Manila Biển Đông",
    nameEn: "Manila Trench Hadal Basin",
    lat: 14.5000,
    lng: 117.5000,
    coordinatesText: "14°30' B, 117°30' Đ",
    depth: "5.353m",
    categoryVi: "Vực thẳm Hadal đại dương",
    categoryEn: "Oceanic Hadal Trench",
    descVi:
      "Điểm sâu nhất Biển Đông vượt mốc 5.000m, áp suất cực hạn và bóng tối hoàn toàn, nơi sinh sống của các loài sinh vật biển sâu phát quang kỳ ảo.",
    descEn:
      "The deepest oceanic trench in the East Sea exceeding 5,000m, an extreme hadal realm of complete darkness and bioluminescent creatures.",
    keywords: ["rãnh sâu", "manila", "ranh sau", "biển sâu", "hadal", "vực sâu"],
  },
];

// Hàm tìm sinh vật sống tại một vùng
function getSpeciesForZone(zone, catalog = SEARCH_SPECIES_CATALOG) {
  const zoneTerms = zone.keywords.map((k) => k.toLowerCase());

  const matched = catalog.filter((sp) => {
    const text = `${sp.nameVi} ${sp.nameEn} ${sp.descVi || ""} ${sp.descEn || ""} ${sp.categoryVi || ""}`.toLowerCase();
    const hasTerm = zoneTerms.some((term) => text.includes(term));
    return hasTerm;
  });

  // Nếu vùng ít loài khớp cụ thể, phân bổ thêm theo độ sâu/sinh cảnh
  if (matched.length < 3) {
    const fallback = catalog.slice(0, 4);
    return Array.from(new Set([...matched, ...fallback])).slice(0, 8);
  }

  return matched.slice(0, 10);
}

export default function OceanMap() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedZone, setSelectedZone] = useState(() => EAST_SEA_ZONES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cursorCoords, setCursorCoords] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const initialSpeciesQuery = searchParams.get("species");
  const initialZoneQuery = searchParams.get("zone");

  // Tìm zone tương ứng từ URL param nếu có
  useEffect(() => {
    if (initialZoneQuery) {
      const found = EAST_SEA_ZONES.find(
        (z) => z.id === initialZoneQuery || z.slug === initialZoneQuery
      );
      if (found) {
        setSelectedZone(found);
        return;
      }
    }

    if (initialSpeciesQuery) {
      const q = initialSpeciesQuery.toLowerCase();
      // Tìm xem loài này thuộc vùng nào
      const sp = SEARCH_SPECIES_CATALOG.find(
        (s) => s.slug === q || s.id === q
      );
      if (sp) {
        const text = `${sp.nameVi} ${sp.descVi || ""}`.toLowerCase();
        const matchedZone = EAST_SEA_ZONES.find((z) =>
          z.keywords.some((k) => text.includes(k))
        );
        if (matchedZone) {
          setSelectedZone(matchedZone);
        }
      }
    }
  }, [initialZoneQuery, initialSpeciesQuery]);

  // Khởi tạo bản đồ Leaflet
  useEffect(() => {
    let map;
    loadLeaflet().then((L) => {
      if (mapInstanceRef.current || !mapContainerRef.current) return;

      // Tâm Biển Đông
      map = L.map(mapContainerRef.current, {
        center: [15.0, 111.0],
        zoom: 6,
        minZoom: 4,
        maxZoom: 12,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      // Zoom control góc trên bên phải
      L.control.zoom({ position: "topright" }).addTo(map);

      // Lớp bản đồ vệ tinh tối (Carto Dark)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          subdomains: "abcd",
          maxZoom: 18,
        }
      ).addTo(map);

      // Thước đo tọa độ di chuột
      map.on("mousemove", (e) => {
        const lat = e.latlng.lat.toFixed(3);
        const lng = e.latlng.lng.toFixed(3);
        setCursorCoords(`${lat}° B, ${lng}° Đ`);
      });

      map.on("mouseout", () => setCursorCoords(null));

      // Thêm các Marker phân vùng biển
      EAST_SEA_ZONES.forEach((zone) => {
        const isCurrent = selectedZone?.id === zone.id;

        const pinHtml = `
          <div class="custom-zone-marker group" style="cursor:pointer; display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: 24px; height: 24px;
              border-radius: 50% 50% 50% 0;
              background: #0ea5e9;
              border: 2px solid #ffffff;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              transition: transform 0.2s ease, background 0.2s ease;
            "></div>
            <div style="
              margin-top: 4px;
              background: rgba(15, 23, 42, 0.85);
              border: 1px solid rgba(255,255,255,0.15);
              padding: 2px 6px;
              border-radius: 6px;
              color: #e2e8f0;
              font-size: 10px;
              font-weight: 600;
              white-space: nowrap;
              pointer-events: none;
              backdrop-filter: blur(4px);
            ">${zone.nameVi}</div>
          </div>
        `;

        const icon = L.divIcon({
          className: "",
          html: pinHtml,
          iconSize: [24, 46],
          iconAnchor: [12, 24],
        });

        const marker = L.marker([zone.lat, zone.lng], { icon })
          .addTo(map)
          .on("click", () => {
            setSelectedZone(zone);
            map.flyTo([zone.lat, zone.lng], Math.max(map.getZoom(), 7), {
              duration: 1.2,
            });
          });

        markersRef.current[zone.id] = marker;
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Căn giữa map khi selectedZone thay đổi
  useEffect(() => {
    if (mapInstanceRef.current && selectedZone) {
      mapInstanceRef.current.flyTo(
        [selectedZone.lat, selectedZone.lng],
        Math.max(mapInstanceRef.current.getZoom(), 7),
        { duration: 1 }
      );
    }
  }, [selectedZone]);

  // Lấy danh sách loài cho vùng hiện tại
  const zoneSpecies = useMemo(() => {
    if (!selectedZone) return [];
    return getSpeciesForZone(selectedZone);
  }, [selectedZone]);

  // Bộ lọc danh mục trong sidebar
  const filteredSpecies = useMemo(() => {
    if (categoryFilter === "all") return zoneSpecies;
    return zoneSpecies.filter((s) => s.category === categoryFilter);
  }, [zoneSpecies, categoryFilter]);

  // Xử lý tìm kiếm sinh vật/vùng biển
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();

    // 1. Tìm xem có khớp tên phân vùng không
    const matchedZone = EAST_SEA_ZONES.find(
      (z) =>
        z.nameVi.toLowerCase().includes(q) ||
        z.nameEn.toLowerCase().includes(q) ||
        z.keywords.some((k) => k.includes(q))
    );

    if (matchedZone) {
      setSelectedZone(matchedZone);
      return;
    }

    // 2. Tìm theo tên loài
    const matchedSpecies = SEARCH_SPECIES_CATALOG.find(
      (s) =>
        s.nameVi.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        (s.sciName && s.sciName.toLowerCase().includes(q))
    );

    if (matchedSpecies) {
      const text = `${matchedSpecies.nameVi} ${matchedSpecies.descVi || ""}`.toLowerCase();
      const z = EAST_SEA_ZONES.find((zone) =>
        zone.keywords.some((k) => text.includes(k))
      );
      if (z) {
        setSelectedZone(z);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#071322] text-white flex flex-col justify-between selection:bg-sky-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {/* Header điều hướng */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
              <Compass size={14} />
              <span>{isEn ? "INTERACTIVE GEOGRAPHIC MAP" : "BẢN ĐỒ TỌA ĐỘ PHÂN VÙNG"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              {isEn ? "East Sea Marine Biodiversity Map" : "Bản đồ Đa dạng Sinh học Biển Đông"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {isEn
                ? "Pan and zoom to explore marine protected areas, geographic coordinates, and regional biodiversity across Vietnam's waters."
                : "Phóng to, thu nhỏ và chọn các phân vùng tọa độ, khu bảo tồn trọng điểm để khám phá các loài sinh vật biển cư ngụ đặc trưng."}
            </p>
          </div>

          {/* Ô tìm kiếm nhanh trên bản đồ */}
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search species or zone..." : "Tìm loài hoặc vùng biển..."}
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </form>
        </div>

        {/* Thanh cuộn nhanh các phân vùng biển */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
          {EAST_SEA_ZONES.map((z) => {
            const isSelected = selectedZone?.id === z.id;
            return (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-sky-600 border-sky-400 text-white shadow-sm"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {z.nameVi}
              </button>
            );
          })}
        </div>

        {/* Khung bản đồ và Sidebar phân vùng */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[550px] relative">
          {/* Cột Bản đồ tương tác */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-white/15 relative bg-[#0a1829] shadow-xl min-h-[420px] lg:min-h-full">
            <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

            {/* Thước đo tọa độ góc dưới bên trái */}
            {cursorCoords && (
              <div className="absolute bottom-3 left-3 z-[400] px-3 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 pointer-events-none flex items-center gap-1.5">
                <Crosshair size={12} />
                <span>{cursorCoords}</span>
              </div>
            )}

            {/* Nút reset khung nhìn Biển Đông */}
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([15.0, 111.0], 6, { duration: 1 });
                }
              }}
              title={isEn ? "Reset view" : "Khung nhìn toàn cảnh"}
              className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-white/15 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Compass size={13} className="text-sky-400" />
              <span>{isEn ? "East Sea Overview" : "Toàn cảnh Biển Đông"}</span>
            </button>
          </div>

          {/* Cột Sidebar Chi tiết vùng & Sinh vật cư ngụ */}
          <div className="lg:col-span-4 rounded-2xl bg-white/[0.03] border border-white/15 p-5 flex flex-col justify-between backdrop-blur-md">
            <div>
              {/* Tên vùng & Loại phân vùng */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    {isEn ? selectedZone.categoryEn : selectedZone.categoryVi}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {isEn ? selectedZone.nameEn : selectedZone.nameVi}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-900/40 border border-sky-600/30 text-[11px] font-mono text-cyan-200">
                  <MapPin size={11} />
                  {selectedZone.coordinatesText}
                </span>
              </div>

              {/* Thông số kỹ thuật nhanh */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <span className="text-slate-400 block text-[11px]">
                    {isEn ? "Max Depth" : "Độ sâu trung bình"}
                  </span>
                  <span className="text-white font-semibold">{selectedZone.depth}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <span className="text-slate-400 block text-[11px]">
                    {isEn ? "Latitude / Longitude" : "Tọa độ số"}
                  </span>
                  <span className="text-cyan-300 font-mono text-[11px]">
                    {selectedZone.lat.toFixed(2)}°, {selectedZone.lng.toFixed(2)}°
                  </span>
                </div>
              </div>

              {/* Mô tả sinh thái vùng */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {isEn ? selectedZone.descEn : selectedZone.descVi}
              </p>

              {/* Danh sách loài sinh vật sinh sống */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Waves size={14} className="text-sky-400" />
                    <span>
                      {isEn ? "Resident Marine Life" : "Sinh vật cư ngụ đặc trưng"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {filteredSpecies.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {filteredSpecies.map((sp) => {
                    const spName = isEn ? sp.nameEn : sp.nameVi;
                    return (
                      <Link
                        key={sp.id}
                        to={`/species/${sp.slug || sp.id}`}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.06] transition-colors group cursor-pointer"
                      >
                        <img
                          src={sp.image}
                          alt={spName}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/assets/FishHidden-jbuafG8p.png";
                          }}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-900 shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors truncate">
                            {spName}
                          </h4>
                          <p className="text-[10px] text-slate-400 italic truncate">
                            {sp.sciName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {sp.categoryVi}
                          </span>
                          <ChevronRight size={13} className="text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">
                {isEn ? "Select a marker to explore other zones" : "Bấm marker để chọn vùng biển khác"}
              </span>
              <Link
                to="/search"
                className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
              >
                <span>{isEn ? "All species" : "Tất cả loài"}</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
