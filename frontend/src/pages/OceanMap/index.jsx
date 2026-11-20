import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass, Crosshair, Layers } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguage } from "../../hooks/useLanguage";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 10 phân vùng biển và khu bảo tồn trọng điểm Biển Đông kèm tọa độ chuẩn xác
export const EAST_SEA_ZONES = [
  {
    id: "hoang-sa",
    nameVi: "Quần đảo Hoàng Sa",
    nameEn: "Paracel Islands",
    lat: 16.5333,
    lng: 112.0333,
    coordText: "16°32' B, 112°02' Đ",
    depth: "1.322 m",
    categoryVi: "Quần đảo & Rạn san hô",
    categoryEn: "Archipelago & Coral Reefs",
    descVi:
      "Vùng rạn san hô trù phú giữa lòng Biển Đông với hơn 200 loài san hô đá và ngư trường sinh sản quan trọng của các loài cá biển nhiệt đới.",
    descEn:
      "Vibrant oceanic reef complex in the central East Sea hosting over 200 coral species and vital spawning grounds for tropical marine fish.",
  },
  {
    id: "truong-sa",
    nameVi: "Quần đảo Trường Sa",
    nameEn: "Spratly Islands",
    lat: 8.6447,
    lng: 111.9194,
    coordText: "8°38' B, 111°55' Đ",
    depth: "5.016 m",
    categoryVi: "Quần đảo & Biển sâu",
    categoryEn: "Archipelago & Deep Basin",
    descVi:
      "Khu vực biển nhiệt đới gắn liền với vực thẳm sâu nhất Biển Đông, là hành lang di cư của rùa biển, cá voi, cá heo và cá ngừ đại dương.",
    descEn:
      "Expansive tropical marine archipelago bordered by 5,000m oceanic trenches, a critical migratory corridor for cetaceans and pelagic tuna.",
  },
  {
    id: "con-dao",
    nameVi: "Vườn Quốc gia Côn Đảo",
    nameEn: "Con Dao National Park",
    lat: 8.6833,
    lng: 106.6000,
    coordText: "8°41' B, 106°36' Đ",
    depth: "40 m",
    categoryVi: "Khu bảo tồn Ramsar",
    categoryEn: "Ramsar Marine Sanctuary",
    descVi:
      "Bãi đẻ tự nhiên lớn nhất Việt Nam của rùa biển (Đồi mồi, Vích) và khu vực bảo tồn quần thể bò biển Dugong cùng thảm cỏ biển nguyên sinh.",
    descEn:
      "Vietnam's primary nesting sanctuary for sea turtles, sheltering endangered Dugongs within vast pristine seagrass meadows.",
  },
  {
    id: "phu-quoc",
    nameVi: "Khu Bảo tồn Biển Phú Quốc",
    nameEn: "Phu Quoc Marine Reserve",
    lat: 10.2289,
    lng: 103.9572,
    coordText: "10°14' B, 103°58' Đ",
    depth: "35 m",
    categoryVi: "Thảm cỏ biển & Vùng nước nông",
    categoryEn: "Seagrass Beds & Shallow Bay",
    descVi:
      "Vùng nước nông ấm phía Tây Nam thuộc Vịnh Thái Lan với thảm cỏ biển hơn 12.000 ha, là sinh cảnh của cá ngựa, cá hề và các rạn san hô nông.",
    descEn:
      "Warm shallow marine waters in the Gulf of Thailand with over 12,000 ha of seagrass beds supporting seahorses and clownfish.",
  },
  {
    id: "nha-trang",
    nameVi: "Vịnh Nha Trang & Hòn Mun",
    nameEn: "Nha Trang Bay & Hon Mun",
    lat: 12.1667,
    lng: 109.3000,
    coordText: "12°10' B, 109°18' Đ",
    depth: "60 m",
    categoryVi: "Khu bảo tồn biển kiểu mẫu",
    categoryEn: "Model Marine Protected Area",
    descVi:
      "Khu bảo tồn biển đầu tiên của Việt Nam với độ phong phú loài san hô bậc nhất khu vực Indo-Pacific, hội tụ hơn 350 loài san hô tạo rạn.",
    descEn:
      "Vietnam's first marine protected area renowned for immense coral biodiversity, harboring 350 reef-building coral species.",
  },
  {
    id: "cu-lao-cham",
    nameVi: "Khu BTTB Cù Lao Chàm",
    nameEn: "Cham Islands Marine Sanctuary",
    lat: 15.9556,
    lng: 108.5144,
    coordText: "15°57' B, 108°31' Đ",
    depth: "45 m",
    categoryVi: "Khu dự trữ sinh quyển thế giới",
    categoryEn: "UNESCO Biosphere Reserve",
    descVi:
      "Cụm đảo đá granit ngoài khơi Quảng Nam nổi tiếng với rạn san hô nguyên sinh, loài cua đá đặc hữu và các bãi đẻ rùa biển ven bờ.",
    descEn:
      "Granitic archipelago off Central Vietnam harboring pristine coral reefs, endemic land crabs, and coastal sea turtle nesting sites.",
  },
  {
    id: "ha-long",
    nameVi: "Vịnh Hạ Long & Bái Tử Long",
    nameEn: "Ha Long & Bai Tu Long Bay",
    lat: 20.9101,
    lng: 107.1839,
    coordText: "20°54' B, 107°11' Đ",
    depth: "25 m",
    categoryVi: "Di sản Thế giới UNESCO",
    categoryEn: "UNESCO World Heritage Site",
    descVi:
      "Hệ sinh thái biển đảo Karst độc nhất vô nhị với hàng nghìn hang động ngập nước, bãi triều rừng ngập mặn và nơi sinh sống của nhiều loài thân mềm quý.",
    descEn:
      "Unique drowned Karst limestone archipelago with mangrove mudflats, submerged sea caves, and diverse marine mollusks.",
  },
  {
    id: "bach-long-vi",
    nameVi: "Đảo Bạch Long Vĩ",
    nameEn: "Bach Long Vi Island MPA",
    lat: 20.1333,
    lng: 107.7167,
    coordText: "20°08' B, 107°43' Đ",
    depth: "55 m",
    categoryVi: "Đảo tiền tiêu Vịnh Bắc Bộ",
    categoryEn: "Gulf of Tonkin Outpost",
    descVi:
      "Đảo tiền tiêu trung tâm Vịnh Bắc Bộ, là ngư trường trọng yếu với nguồn lợi bào ngư chín lỗ, hải sâm và các loài cá tầng đáy phong phú.",
    descEn:
      "Central outpost island in the Gulf of Tonkin, preserving nine-hole abalones, sea cucumbers, and valuable demersal fish stocks.",
  },
  {
    id: "hon-cau",
    nameVi: "Khu BTTB Hòn Cau",
    nameEn: "Hon Cau Marine Reserve",
    lat: 11.2333,
    lng: 108.8333,
    coordText: "11°14' B, 108°50' Đ",
    depth: "30 m",
    categoryVi: "Vườn ươm rùa biển ven bờ",
    categoryEn: "Coastal Turtle Nursery",
    descVi:
      "Vùng biển ngoài khơi Bình Thuận với những khối đá ngầm khổng lồ, là bãi đẻ tự nhiên quan trọng của rùa biển và quần thể san hô cổ xưa.",
    descEn:
      "Coastal island with underwater boulder reefs, a crucial nesting sanctuary for sea turtles and ancient coral communities.",
  },
  {
    id: "ranh-manila",
    nameVi: "Vực thẳm Manila Biển Đông",
    nameEn: "Manila Trench Hadal Basin",
    lat: 14.5000,
    lng: 117.5000,
    coordText: "14°30' B, 117°30' Đ",
    depth: "5.353 m",
    categoryVi: "Vực thẳm Hadal đại dương",
    categoryEn: "Oceanic Hadal Trench",
    descVi:
      "Rãnh đại dương sâu nhất Biển Đông vượt mốc 5.000m, môi trường áp suất cực lớn và tối hoàn toàn, nơi sinh sống của các loài sinh vật biển sâu kỳ bí.",
    descEn:
      "The deepest oceanic trench in the East Sea exceeding 5,000m, an extreme hadal realm of complete darkness and unique abyssal fauna.",
  },
];

// Nguồn bản đồ miễn phí, chính xác, không yêu cầu API key
const BASEMAP_PROVIDERS = {
  ocean: {
    labelVi: "Bản đồ Hải dương học",
    labelEn: "Ocean Bathymetry",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, GEBCO, NOAA, National Geographic",
    maxNativeZoom: 13,
    maxZoom: 14,
  },
  satellite: {
    labelVi: "Vệ tinh viễn thám",
    labelEn: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
    maxNativeZoom: 18,
    maxZoom: 18,
  },
  osm: {
    labelVi: "Bản đồ đường bờ biển",
    labelEn: "Coastline Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    subdomains: ["a", "b", "c"],
    maxNativeZoom: 19,
    maxZoom: 19,
  },
};

export default function OceanMap() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [searchParams] = useSearchParams();

  const [activeLayer, setActiveLayer] = useState("ocean");
  const [cursorCoords, setCursorCoords] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});

  const zoneQuery = searchParams.get("zone");
  const speciesQuery = searchParams.get("species");

  // Khởi tạo bản đồ Leaflet
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Tránh lỗi StrictMode React 18: Dọn dẹp map cũ và ID nếu còn lưu
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (_) {}
      mapInstanceRef.current = null;
    }

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }
    container.innerHTML = "";

    let map;
    try {
      map = L.map(container, {
        center: [14.8, 111.5],
        zoom: 6,
        minZoom: 4,
        maxZoom: 14,
        scrollWheelZoom: true,
        zoomControl: false,
      });
    } catch (err) {
      console.error("Lỗi khởi tạo Leaflet map:", err);
      return;
    }

    // Zoom control góc trên bên phải
    L.control.zoom({ position: "topright" }).addTo(map);

    // Layer bản đồ ban đầu (Esri Ocean Base)
    const provider = BASEMAP_PROVIDERS.ocean;
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      maxNativeZoom: provider.maxNativeZoom || provider.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Cập nhật tọa độ chuột
    map.on("mousemove", (e) => {
      const lat = e.latlng.lat.toFixed(3);
      const lng = e.latlng.lng.toFixed(3);
      setCursorCoords(isEn ? `${lat}° N, ${lng}° E` : `${lat}° B, ${lng}° Đ`);
    });

    map.on("mouseout", () => setCursorCoords(null));

    // Thêm các marker gọn gàng (Quiet Nautical Pins)
    markersRef.current = {};
    EAST_SEA_ZONES.forEach((zone) => {
      const pinHtml = `
        <div style="cursor:pointer; display:flex; align-items:center; justify-content:center; width:20px; height:20px;">
          <div style="
            width: 14px; height: 14px;
            border-radius: 50%;
            background: #0284c7;
            border: 2px solid #ffffff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.5);
            transition: transform 0.15s ease;
          "></div>
        </div>
      `;

      const icon = L.divIcon({
        className: "nautical-pin !bg-transparent !border-0",
        html: pinHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12],
      });

      const zoneName = isEn ? zone.nameEn : zone.nameVi;
      const category = isEn ? zone.categoryEn : zone.categoryVi;
      const desc = isEn ? zone.descEn : zone.descVi;

      const popupHtml = `
        <div style="font-family: inherit; color: #0f172a; min-width: 220px; max-width: 280px; padding: 2px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; font-weight: 600;">
            ${category}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 1px; margin-bottom: 4px;">
            ${zoneName}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 4px 0; border-top: 1px solid #e2e8f0; color: #475569;">
            <span>${isEn ? "Coordinates" : "Tọa độ"}</span>
            <span style="font-family: monospace; font-weight: 600; color: #0284c7;">${zone.coordText}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; color: #475569;">
            <span>${isEn ? "Depth" : "Độ sâu"}</span>
            <span style="font-weight: 600; color: #0f172a;">${zone.depth}</span>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.45; margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            ${desc}
          </div>
        </div>
      `;

      const marker = L.marker([zone.lat, zone.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, { maxWidth: 300, closeButton: true })
        .bindTooltip(zoneName, { direction: "top", offset: [0, -10], opacity: 0.9 });

      markersRef.current[zone.id] = marker;
    });

    mapInstanceRef.current = map;

    // ResizeObserver tự động cập nhật map size khi container layout hoàn tất
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    // Đảm bảo kích thước map render đầy đủ & focus target nếu có
    const timer = setTimeout(() => {
      map.invalidateSize();

      const targetZoneId = zoneQuery || (speciesQuery ? "hoang-sa" : null);
      if (targetZoneId && markersRef.current[targetZoneId]) {
        map.flyTo(markersRef.current[targetZoneId].getLatLng(), 8, { duration: 1.2 });
        markersRef.current[targetZoneId].openPopup();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isEn, zoneQuery, speciesQuery]);

  // Xử lý chuyển đổi lớp bản đồ (Ocean, Satellite, Coastline)
  const handleLayerChange = (layerKey) => {
    if (!mapInstanceRef.current || !BASEMAP_PROVIDERS[layerKey]) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const provider = BASEMAP_PROVIDERS[layerKey];
    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      maxNativeZoom: provider.maxNativeZoom || provider.maxZoom,
      subdomains: provider.subdomains || "abc",
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    setActiveLayer(layerKey);
  };

  return (
    <div className="min-h-screen bg-[#071322] text-white flex flex-col justify-between selection:bg-sky-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col">
        {/* Header tinh gọn (Quiet Chrome) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {isEn ? "East Sea Marine Coordinates & Zones" : "Bản đồ phân vùng & Tọa độ Biển Đông"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn
                ? "Geographic coordinates, ocean depth, and marine protected areas across Vietnamese waters"
                : "Tọa độ địa lý, độ sâu và các vùng bảo tồn biển trọng điểm của Việt Nam"}
            </p>
          </div>

          {/* Bộ chọn lớp bản đồ không có viền neon */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1 hidden md:flex">
              <Layers size={13} />
              <span>{isEn ? "Layer:" : "Lớp:"}</span>
            </span>
            {Object.entries(BASEMAP_PROVIDERS).map(([key, item]) => {
              const isActive = activeLayer === key;
              return (
                <button
                  key={key}
                  onClick={() => handleLayerChange(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isEn ? item.labelEn : item.labelVi}
                </button>
              );
            })}
          </div>
        </div>

        {/* Khung bản đồ toàn màn hình (Full-width, không có sidebar thừa) */}
        <div
          className="rounded-2xl overflow-hidden border border-white/10 relative bg-[#061220] shadow-xl w-full"
          style={{ width: "100%", height: "640px", minHeight: "640px" }}
        >
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ width: "100%", height: "640px", minHeight: "640px", background: "#061220" }}
          />

          {/* Thước đo tọa độ di chuột góc dưới bên trái */}
          {cursorCoords && (
            <div className="absolute bottom-3 left-3 z-[400] px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 pointer-events-none flex items-center gap-1.5 shadow-sm">
              <Crosshair size={12} className="text-slate-400" />
              <span>{cursorCoords}</span>
            </div>
          )}

          {/* Nút reset khung nhìn toàn cảnh Biển Đông */}
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([14.8, 111.5], 6, { duration: 1 });
              }
            }}
            title={isEn ? "Reset overview" : "Toàn cảnh Biển Đông"}
            className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Compass size={13} className="text-sky-400" />
            <span>{isEn ? "East Sea View" : "Toàn cảnh Biển Đông"}</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
