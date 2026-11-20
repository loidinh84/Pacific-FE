import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass, Crosshair, Layers } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguage } from "../../hooks/useLanguage";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { EAST_SEA_ZONES, BASEMAP_PROVIDERS } from "./oceanMapData";

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
      } catch {
        // No-op cleanup
      }
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
              {isEn ? "East Sea Marine Habitats & Coordinates" : "Bản đồ Sinh cảnh Biển Đông"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn
                ? "Explore key marine zones, native habitats, and sea depths across Vietnam's waters"
                : "Khám phá các vùng biển trọng điểm, tọa độ sinh sống và độ sâu của sinh vật biển Việt Nam"}
            </p>
          </div>

          {/* Bộ chọn chế độ xem bản đồ không có viền neon */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1 hidden md:flex">
              <Layers size={13} />
              <span>{isEn ? "View:" : "Chế độ xem:"}</span>
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
