import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Crosshair,
  Layers,
  Fish,
  MapPin,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguage } from "../../hooks/useLanguage";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  EAST_SEA_ZONES,
  BASEMAP_PROVIDERS,
  CREATURE_MAP_CATEGORIES,
  CATEGORY_COLORS,
} from "./oceanMapData";
import { fetchMapDistribution } from "../../services/speciesApi";

export default function OceanMap() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [searchParams] = useSearchParams();

  const [activeLayer, setActiveLayer] = useState("ocean");
  const [showCreatures, setShowCreatures] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cursorCoords, setCursorCoords] = useState(null);

  const [creaturesList, setCreaturesList] = useState([]);
  const [zonesList, setZonesList] = useState(EAST_SEA_ZONES);
  const [isLoading, setIsLoading] = useState(true);

  // Cụm sinh vật đang được mở bảng khám phá ở đáy bản đồ
  const [activeCluster, setActiveCluster] = useState(null);

  // Trạng thái cho custom dropdowns
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);
  const [isSpeciesSearchOpen, setIsSpeciesSearchOpen] = useState(false);
  const [speciesSearchQuery, setSpeciesSearchQuery] = useState("");

  const zoneDropdownRef = useRef(null);
  const speciesSearchRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const creatureLayerGroupRef = useRef(null);
  const zoneLayerGroupRef = useRef(null);
  const creatureMarkersMapRef = useRef({});

  const zoneQuery = searchParams.get("zone");
  const speciesQuery = searchParams.get("species");

  // Kéo chuột và cuộn mượt cho thanh danh mục sinh vật
  const categoryScrollRef = useRef(null);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, creaturesList]);

  const handleCategoryMouseDown = (e) => {
    if (!categoryScrollRef.current) return;
    setIsCategoryDragging(true);
    setHasMoved(false);
    setDragStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setDragScrollLeft(categoryScrollRef.current.scrollLeft);
  };

  const handleCategoryMouseMove = (e) => {
    if (!isCategoryDragging || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    categoryScrollRef.current.scrollLeft = dragScrollLeft - walk;
    checkScroll();
  };

  const handleCategoryMouseUp = () => {
    setIsCategoryDragging(false);
    checkScroll();
  };

  const handleCategoryMouseLeave = () => {
    setIsCategoryDragging(false);
    checkScroll();
  };

  const scrollCategory = (direction) => {
    if (!categoryScrollRef.current) return;
    const offset = direction === "left" ? -160 : 160;
    categoryScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(checkScroll, 220);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(e.target)) {
        setIsZoneDropdownOpen(false);
      }
      if (speciesSearchRef.current && !speciesSearchRef.current.contains(e.target)) {
        setIsSpeciesSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Tải danh sách phân bố sinh vật & khu bảo tồn từ Database qua Backend API
  useEffect(() => {
    let isMounted = true;
    fetchMapDistribution()
      .then((res) => {
        if (!isMounted || !res) return;
        if (res.locations && res.locations.length > 0) {
          setZonesList(res.locations);
        }
        if (res.species && res.species.length > 0) {
          setCreaturesList(res.species);
        }
      })
      .catch((err) => {
        console.warn("Lỗi tải phân bố sinh vật từ Database:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc danh sách sinh vật cho Search Dropdown
  const filteredSpeciesForSearch = useMemo(() => {
    if (!speciesSearchQuery.trim()) return creaturesList.slice(0, 30);
    const q = speciesSearchQuery.toLowerCase().trim();
    return creaturesList.filter(
      (c) =>
        c.nameVi?.toLowerCase().includes(q) ||
        c.nameEn?.toLowerCase().includes(q) ||
        c.sciName?.toLowerCase().includes(q) ||
        c.zoneNameVi?.toLowerCase().includes(q)
    );
  }, [creaturesList, speciesSearchQuery]);

  // Tạo nội dung Popup chi tiết của 1 sinh vật
  const createCreaturePopupHtml = useCallback(
    (creature) => {
      const categoryColor = CATEGORY_COLORS[creature.groupId] || "#0284c7";
      const creatureName = isEn ? creature.nameEn : creature.nameVi;

      return `
        <div style="font-family: inherit; color: #0f172a; min-width: 240px; max-width: 280px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #ffffff; border: 2px solid ${categoryColor}; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <img src="${creature.image || '/assets/creatures/clownfish.png'}" alt="${creatureName}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${creatureName}
              </div>
              <div style="font-size: 10.5px; color: #64748b; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${creature.sciName}
              </div>
              <div style="margin-top: 3px;">
                <span style="display: inline-block; font-size: 9.5px; font-weight: 600; padding: 1px 6px; border-radius: 4px; background: ${categoryColor}18; color: ${categoryColor};">
                  ${creature.groupName || (isEn ? "Marine Species" : "Sinh vật biển")}
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; padding: 6px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; color: #475569;">
              <span>${isEn ? "Coordinates" : "Tọa độ"}</span>
              <span style="font-family: monospace; font-weight: 700; color: #0284c7;">
                ${creature.coordDecimal || `${creature.lat.toFixed(3)}° B, ${creature.lng.toFixed(3)}° Đ`}
              </span>
            </div>
            ${
              creature.coordText
                ? `
            <div style="text-align: right; font-size: 9.5px; font-family: monospace; color: #64748b;">
              ${creature.coordText}
            </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; color: #475569; margin-top: 2px;">
              <span>${isEn ? "Habitat" : "Vùng cư ngụ"}</span>
              <span style="font-weight: 600; color: #0f172a;">${creature.zoneNameVi}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #475569;">
              <span>${isEn ? "Depth" : "Tầng độ sâu"}</span>
              <span style="font-weight: 600; color: #0f172a;">${creature.depth}</span>
            </div>
          </div>

          <a
            href="/species/${creature.slug}"
            style="display: block; text-align: center; margin-top: 8px; padding: 6px 12px; background: #0284c7; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; transition: background 0.15s ease;"
          >
            ${isEn ? "View Species Profile →" : "Xem hồ sơ sinh vật →"}
          </a>
        </div>
      `;
    },
    [isEn]
  );

  // THUẬT TOÁN GOM CỤM ĐỘNG THEO PIXEL MÀN HÌNH (SCREEN-PIXEL PROXIMITY CLUSTERING)
  // Đảm bảo không bao giờ có 2 pin đè dính lên nhau dù ở bất kỳ mức zoom nào
  const renderCreatureLayers = useCallback(() => {
    if (!mapInstanceRef.current || !creatureLayerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const layerGroup = creatureLayerGroupRef.current;

    layerGroup.clearLayers();
    creatureMarkersMapRef.current = {};

    if (!showCreatures || creaturesList.length === 0) return;

    // Lọc theo danh mục được chọn
    const visibleSpecies = creaturesList.filter(
      (c) => selectedCategory === "all" || c.groupId === selectedCategory
    );

    if (visibleSpecies.length === 0) return;

    // Chiếu tọa độ GPS sang tọa độ pixel màn hình hiện tại
    const itemsWithPoints = visibleSpecies.map((sp) => {
      const pt = map.latLngToContainerPoint([sp.lat, sp.lng]);
      return { sp, pt };
    });

    // Gom cụm với khoảng cách ngưỡng 44px (bảo đảm đường kính 32px luôn có khoảng hở thoáng đãng)
    const CLUSTER_THRESHOLD_PX = 44;
    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < itemsWithPoints.length; i++) {
      if (visited.has(i)) continue;
      const base = itemsWithPoints[i];
      const group = [base.sp];
      visited.add(i);

      for (let j = i + 1; j < itemsWithPoints.length; j++) {
        if (visited.has(j)) continue;
        const target = itemsWithPoints[j];
        const dist = Math.hypot(base.pt.x - target.pt.x, base.pt.y - target.pt.y);
        if (dist < CLUSTER_THRESHOLD_PX) {
          group.push(target.sp);
          visited.add(j);
        }
      }

      if (group.length === 1) {
        clusters.push({ isCluster: false, creature: group[0] });
      } else {
        const sumLat = group.reduce((s, item) => s + item.lat, 0);
        const sumLng = group.reduce((s, item) => s + item.lng, 0);
        clusters.push({
          isCluster: true,
          count: group.length,
          centerLat: sumLat / group.length,
          centerLng: sumLng / group.length,
          name: group[0].zoneNameVi || (isEn ? "Marine Biodiversity Cluster" : "Cụm sinh thái biển"),
          species: group,
        });
      }
    }

    // Vẽ các cụm hoặc từng loài độc lập dưới dạng pin tròn gọn gàng (không chữ rườm rà trên bản đồ)
    clusters.forEach((item) => {
      if (item.isCluster) {
        // TRƯỜNG HỢP 1: Cụm từ 2 loài trở lên -> Pin tròn 38px kèm huy hiệu số lượng nhỏ gọn góc trên
        const representativePhoto =
          item.species[0]?.image || "/assets/creatures/clownfish.png";

        const clusterHtml = `
          <div class="ocean-cluster-pin" style="
            cursor: pointer;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.45));
            transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: #ffffff;
              border: 2.5px solid #0284c7;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
            ">
              <img
                src="${representativePhoto}"
                alt="${item.name}"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
              />
            </div>
            <div style="
              position: absolute;
              top: -3px;
              right: -5px;
              background: #0284c7;
              color: #ffffff;
              font-size: 10.5px;
              font-weight: 800;
              font-family: monospace;
              padding: 1px 5.5px;
              border-radius: 10px;
              border: 1.5px solid #ffffff;
              box-shadow: 0 1px 3px rgba(0,0,0,0.35);
              line-height: 1.1;
            ">
              ${item.count}
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-top: 5px solid #0284c7;
              margin-top: -1px;
            "></div>
          </div>
        `;

        const clusterIcon = L.divIcon({
          className: "cluster-pin !bg-transparent !border-0",
          html: clusterHtml,
          iconSize: [38, 44],
          iconAnchor: [19, 44],
          popupAnchor: [0, -44],
        });

        const clusterMarker = L.marker([item.centerLat, item.centerLng], { icon: clusterIcon })
          .bindTooltip(`${item.name} • ${item.count} loài`, {
            direction: "top",
            offset: [0, -44],
            opacity: 0.95,
          });

        clusterMarker.on("mouseover", () => clusterMarker.setZIndexOffset(10000));
        clusterMarker.on("mouseout", () => clusterMarker.setZIndexOffset(0));
        clusterMarker.on("click", () => {
          map.flyTo([item.centerLat, item.centerLng], Math.min(map.getZoom() + 1.5, 11), {
            duration: 0.8,
          });
          setActiveCluster(item);
        });

        layerGroup.addLayer(clusterMarker);
      } else {
        // TRƯỜNG HỢP 2: Loài đứng độc lập với khoảng cách thoáng đãng -> Vẽ Pin tròn 32px sắc nét
        const creature = item.creature;
        const categoryColor = CATEGORY_COLORS[creature.groupId] || "#0284c7";
        const creatureName = isEn ? creature.nameEn : creature.nameVi;

        const creaturePinHtml = `
          <div class="creature-pin-node" style="
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.28));
            transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #ffffff;
              border: 2.5px solid ${categoryColor};
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
            ">
              <img
                src="${creature.image || '/assets/creatures/clownfish.png'}"
                alt="${creature.nameVi}"
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
              />
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 3.5px solid transparent;
              border-right: 3.5px solid transparent;
              border-top: 5px solid ${categoryColor};
              margin-top: -1px;
            "></div>
          </div>
        `;

        const creatureIcon = L.divIcon({
          className: "creature-pin !bg-transparent !border-0",
          html: creaturePinHtml,
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37],
        });

        const marker = L.marker([creature.lat, creature.lng], { icon: creatureIcon })
          .bindPopup(createCreaturePopupHtml(creature), { maxWidth: 300, closeButton: true })
          .bindTooltip(creatureName, { direction: "top", offset: [0, -37], opacity: 0.95 });

        marker.on("mouseover", () => marker.setZIndexOffset(10000));
        marker.on("mouseout", () => marker.setZIndexOffset(0));
        marker.on("click", () => {
          marker.openPopup();
          setActiveCluster({
            name: creature.zoneNameVi,
            centerLat: creature.lat,
            centerLng: creature.lng,
            species: [creature],
          });
        });

        creatureMarkersMapRef.current[creature.id] = marker;
        layerGroup.addLayer(marker);
      }
    });
  }, [creaturesList, selectedCategory, showCreatures, isEn, createCreaturePopupHtml]);

  // Khởi tạo bản đồ Leaflet
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

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

    const initialProvider = BASEMAP_PROVIDERS.ocean;

    let map;
    try {
      map = L.map(container, {
        center: [14.8, 111.5],
        zoom: 6,
        minZoom: 4,
        maxZoom: initialProvider.maxZoom,
        scrollWheelZoom: true,
        zoomControl: false,
      });
    } catch (err) {
      console.error("Lỗi khởi tạo Leaflet map:", err);
      return;
    }

    // Zoom control góc trên bên phải
    L.control.zoom({ position: "topright" }).addTo(map);

    // Layer bản đồ ban đầu với giới hạn zoom an toàn
    const tileLayer = L.tileLayer(initialProvider.url, {
      attribution: initialProvider.attribution,
      maxZoom: initialProvider.maxZoom,
      maxNativeZoom: initialProvider.maxNativeZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Cập nhật tọa độ chuột
    map.on("mousemove", (e) => {
      const lat = e.latlng.lat.toFixed(3);
      const lng = e.latlng.lng.toFixed(3);
      setCursorCoords(isEn ? `${lat}° N, ${lng}° E` : `${lat}° B, ${lng}° Đ`);
    });

    map.on("mouseout", () => setCursorCoords(null));

    // LayerGroup dành riêng cho các loài sinh vật biển & cụm
    const creatureGroup = L.layerGroup().addTo(map);
    creatureLayerGroupRef.current = creatureGroup;

    // LayerGroup dành riêng cho các phân vùng biển / Khu bảo tồn trọng điểm
    const zoneGroup = L.layerGroup().addTo(map);
    zoneLayerGroupRef.current = zoneGroup;

    // 1. Khởi tạo Marker phân vùng biển / Khu bảo tồn (Icon hải dương học gọn gàng 24px, không chữ đè lên bản đồ)
    markersRef.current = {};
    zonesList.forEach((zone) => {
      const zoneName = isEn ? zone.nameEn : zone.nameVi;
      const category = isEn ? zone.categoryEn : zone.categoryVi;
      const desc = isEn ? zone.descEn : zone.descVi;

      const zonePinHtml = `
        <div style="cursor:pointer; display:flex; flex-direction:column; align-items:center; filter: drop-shadow(0 2px 4px rgba(15,23,42,0.4)); transition: transform 0.15s ease;">
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #091b2e;
            border: 2px solid #38bdf8;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4) inset;
          ">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#38bdf8;"></span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: "nautical-pin !bg-transparent !border-0",
        html: zonePinHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -14],
      });

      const speciesListHtml =
        zone.residentSpecies && zone.residentSpecies.length > 0
          ? `
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; font-weight: 700; margin-bottom: 5px;">
              ${isEn ? "Resident Marine Life" : "Sinh vật cư trú đặc trưng"} (${zone.residentSpecies.length})
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;">
              ${zone.residentSpecies
                .slice(0, 6)
                .map(
                  (sp) => `
                <a href="/species/${sp.slug}" style="display: flex; align-items: center; gap: 8px; text-decoration: none; padding: 4px 6px; border-radius: 6px; background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; transition: background 0.15s ease;">
                  <img src="${sp.image}" alt="${sp.nameVi}" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;" />
                  <span style="font-size: 11px; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${isEn ? sp.nameEn : sp.nameVi}</span>
                  <span style="font-size: 11px; color: #0284c7; font-weight: 700;">→</span>
                </a>
              `
                )
                .join("")}
            </div>
          </div>
        `
          : "";

      const popupHtml = `
        <div style="font-family: inherit; color: #0f172a; min-width: 230px; max-width: 280px; padding: 2px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; font-weight: 600;">
            ${category}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 1px; margin-bottom: 4px;">
            ${zoneName}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 4px 0; border-top: 1px solid #e2e8f0; color: #475569;">
            <span>${isEn ? "Coordinates" : "Tọa độ tâm"}</span>
            <span style="font-family: monospace; font-weight: 600; color: #0284c7;">${zone.coordText}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; color: #475569;">
            <span>${isEn ? "Average Depth" : "Độ sâu trung bình"}</span>
            <span style="font-weight: 600; color: #0f172a;">${zone.depth}</span>
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.45; margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            ${desc}
          </div>
          ${speciesListHtml}
        </div>
      `;

      const marker = L.marker([zone.lat, zone.lng], { icon })
        .bindPopup(popupHtml, { maxWidth: 300, closeButton: true })
        .bindTooltip(zoneName, { direction: "top", offset: [0, -14], opacity: 0.95 });

      marker.on("click", () => {
        const zoneSpecies = creaturesList.filter(
          (sp) =>
            sp.zoneNameVi === zone.nameVi ||
            sp.zoneNameVi?.includes(zone.nameVi) ||
            zone.nameVi?.includes(sp.zoneNameVi)
        );
        if (zoneSpecies.length > 0) {
          setActiveCluster({
            name: zone.nameVi,
            centerLat: zone.lat,
            centerLng: zone.lng,
            species: zoneSpecies,
          });
        }
      });

      markersRef.current[zone.id] = marker;

      // Chỉ hiển thị pin phân vùng khi người dùng tắt hiển thị sinh vật (tránh trùng lặp với pin sinh vật tại cùng tọa độ)
      if (!showCreatures) {
        zoneGroup.addLayer(marker);
      }
    });

    mapInstanceRef.current = map;

    // Lắng nghe sự kiện zoom và kéo bản đồ để tự động gom cụm theo khoảng cách pixel thực tế
    map.on("zoomend", renderCreatureLayers);
    map.on("moveend", renderCreatureLayers);

    // Render khởi đầu
    renderCreatureLayers();

    // ResizeObserver tự động cập nhật map size
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    const timer = setTimeout(() => {
      map.invalidateSize();

      const targetZoneId = zoneQuery;
      if (targetZoneId && markersRef.current[targetZoneId]) {
        map.flyTo(markersRef.current[targetZoneId].getLatLng(), 8, { duration: 1.2 });
        markersRef.current[targetZoneId].openPopup();
      } else if (speciesQuery && creatureMarkersMapRef.current[speciesQuery]) {
        map.flyTo(creatureMarkersMapRef.current[speciesQuery].getLatLng(), 9, { duration: 1.2 });
        creatureMarkersMapRef.current[speciesQuery].openPopup();
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
  }, [isEn, zoneQuery, speciesQuery, zonesList, creaturesList, renderCreatureLayers, showCreatures]);

  // Cập nhật khi danh mục lọc hoặc công tắc hiển thị sinh vật thay đổi
  useEffect(() => {
    renderCreatureLayers();

    if (zoneLayerGroupRef.current) {
      zoneLayerGroupRef.current.clearLayers();
      if (!showCreatures) {
        Object.values(markersRef.current).forEach((m) => {
          zoneLayerGroupRef.current.addLayer(m);
        });
      }
    }
  }, [renderCreatureLayers, showCreatures]);

  // Bật/tắt hiển thị sinh vật biển
  const toggleCreatures = () => {
    setShowCreatures((prev) => !prev);
  };

  // Chọn nhanh và bay đến vị trí sinh vật từ ô tìm kiếm hoặc thẻ
  const handleSelectSpecies = (creature) => {
    if (!creature || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (!showCreatures) setShowCreatures(true);
    if (selectedCategory !== "all" && creature.groupId !== selectedCategory) {
      setSelectedCategory("all");
    }

    map.flyTo([creature.lat, creature.lng], 9.5, { duration: 1.1 });

    setTimeout(() => {
      renderCreatureLayers();
      const marker = creatureMarkersMapRef.current[creature.id];
      if (marker) {
        marker.openPopup();
      }
    }, 600);

    setIsSpeciesSearchOpen(false);
  };

  // Chọn nhanh và bay đến phân vùng biển
  const handleSelectZone = (zone) => {
    if (!zone || !mapInstanceRef.current) return;
    const marker = markersRef.current[zone.id];
    if (marker) {
      mapInstanceRef.current.flyTo(marker.getLatLng(), 8, { duration: 1.2 });
      setTimeout(() => {
        marker.openPopup();
      }, 400);

      const zoneSpecies = creaturesList.filter(
        (sp) =>
          sp.zoneNameVi === zone.nameVi ||
          sp.zoneNameVi?.includes(zone.nameVi) ||
          zone.nameVi?.includes(sp.zoneNameVi)
      );
      if (zoneSpecies.length > 0) {
        setActiveCluster({
          name: zone.nameVi,
          centerLat: zone.lat,
          centerLng: zone.lng,
          species: zoneSpecies,
        });
      }
    }
    setIsZoneDropdownOpen(false);
  };

  // Đổi lớp bản đồ nền
  const handleLayerChange = (layerKey) => {
    if (!mapInstanceRef.current || !BASEMAP_PROVIDERS[layerKey]) return;
    const newProvider = BASEMAP_PROVIDERS[layerKey];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const currentZoom = mapInstanceRef.current.getZoom();
    if (currentZoom > newProvider.maxZoom) {
      mapInstanceRef.current.setZoom(newProvider.maxZoom);
    }

    const newTileLayer = L.tileLayer(newProvider.url, {
      attribution: newProvider.attribution,
      maxZoom: newProvider.maxZoom,
      maxNativeZoom: newProvider.maxNativeZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
    setActiveLayer(layerKey);
  };

  // Reset góc nhìn về toàn cảnh Biển Đông
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([14.8, 111.5], 6, { duration: 1 });
      mapInstanceRef.current.closePopup();
      setActiveCluster(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 py-4 flex flex-col gap-3">
        {/* Thanh tiêu đề & Tùy chọn bản đồ nền */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#081729]/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isEn ? "East Sea Ecological Map" : "Bản đồ Sinh cảnh Biển Đông"}</span>
              {isLoading && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-normal">
                  {isEn ? "Loading..." : "Đang đồng bộ..."}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-400 mt-0.5">
              {isEn
                ? "Explore critical marine habitats, coordinates and depth distributions across Vietnam's East Sea"
                : "Khám phá các vùng biển trọng điểm, tọa độ sinh sống và độ sâu của sinh vật biển Việt Nam"}
            </p>
          </div>

          {/* Công tắc lớp nền & Công tắc sinh vật */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Nút bật/tắt toàn bộ sinh vật */}
            <button
              onClick={toggleCreatures}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-colors cursor-pointer ${
                showCreatures
                  ? "bg-sky-500/20 text-sky-300 border-sky-400/40"
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
              }`}
            >
              <Fish size={15} />
              <span>{isEn ? `Marine Life (${creaturesList.length})` : `Sinh vật biển (${creaturesList.length})`}</span>
            </button>

            {/* Các lớp bản đồ nền */}
            <div className="flex items-center bg-[#061424] p-1 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400 px-2 py-0.5 flex items-center gap-1 hidden sm:flex">
                <Layers size={13} />
                <span>{isEn ? "Layer:" : "Chế độ xem:"}</span>
              </span>
              {Object.keys(BASEMAP_PROVIDERS).map((key) => {
                const p = BASEMAP_PROVIDERS[key];
                const isActive = activeLayer === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleLayerChange(key)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-sky-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {isEn ? p.nameEn : p.nameVi}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thanh bộ lọc danh mục và 2 dropdown chọn nhanh */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-[#081729]/80 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/10 shadow-sm">
          {/* Danh mục sinh vật cuộn ngang có nút trượt và kéo chuột */}
          <div className="relative flex-1 min-w-0 flex items-center">
            {/* Nút cuộn trái */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollCategory("left")}
                className="absolute left-0 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#091b2e]/95 hover:bg-sky-600 border border-white/20 text-slate-200 hover:text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title={isEn ? "Scroll left" : "Cuộn sang trái"}
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Vùng kéo và cuộn danh mục */}
            <div
              ref={categoryScrollRef}
              onMouseDown={handleCategoryMouseDown}
              onMouseMove={handleCategoryMouseMove}
              onMouseUp={handleCategoryMouseUp}
              onMouseLeave={handleCategoryMouseLeave}
              onScroll={checkScroll}
              className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 px-1 select-none ${
                isCategoryDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              {CREATURE_MAP_CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? creaturesList.length
                    : creaturesList.filter((c) => c.groupId === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (hasMoved) return;
                      setSelectedCategory(cat.id);
                      if (!showCreatures) setShowCreatures(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer border whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                      isSelected
                        ? "bg-sky-600/35 border-sky-400/50 text-white shadow-sm"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                    }`}
                  >
                    {cat.id !== "all" && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                    )}
                    <span>{isEn ? cat.labelEn : cat.labelVi}</span>
                    <span className="text-[11px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Nút cuộn phải nếu tràn */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollCategory("right")}
                className="absolute right-0 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#091b2e]/95 hover:bg-sky-600 border border-white/20 text-slate-200 hover:text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title={isEn ? "Scroll right" : "Cuộn sang phải"}
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Hai bộ chọn tùy chỉnh: Phân vùng biển & Tìm kiếm sinh vật */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-shrink-0">
            {/* Custom Dropdown: Chọn phân vùng biển */}
            <div className="relative" ref={zoneDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsZoneDropdownOpen(!isZoneDropdownOpen);
                  setIsSpeciesSearchOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-colors cursor-pointer ${
                  isZoneDropdownOpen
                    ? "bg-[#0b1c30] border-sky-400/50 text-white"
                    : "bg-[#081525] border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                <MapPin size={14} className="text-sky-400" />
                <span>
                  {isEn ? `Marine Zones (${zonesList.length})` : `Khu bảo tồn (${zonesList.length})`}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isZoneDropdownOpen ? "rotate-180 text-sky-400" : "text-slate-400"
                  }`}
                />
              </button>

              {isZoneDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-[#091b2e] border border-white/15 shadow-2xl z-[500] p-1.5 max-h-80 overflow-y-auto">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                    {isEn ? "Select Marine Protected Area" : "Chọn phân vùng trọng điểm"}
                  </div>
                  {zonesList.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => handleSelectZone(z)}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-sky-500/15 text-slate-200 hover:text-white transition-colors cursor-pointer flex flex-col gap-0.5 border border-transparent hover:border-sky-500/20 mb-0.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{isEn ? z.nameEn : z.nameVi}</span>
                        <span className="text-[10px] text-sky-400 font-mono">{z.depth}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{z.coordText}</span>
                        {z.residentSpecies?.length > 0 && (
                          <span className="text-slate-400 font-sans">{z.residentSpecies.length} loài</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Searchable Dropdown: Tìm kiếm & Chọn nhanh sinh vật */}
            <div className="relative" ref={speciesSearchRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSpeciesSearchOpen(!isSpeciesSearchOpen);
                  setIsZoneDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium border transition-colors cursor-pointer ${
                  isSpeciesSearchOpen
                    ? "bg-[#0b1c30] border-sky-400/50 text-white"
                    : "bg-[#081525] border-white/10 text-slate-300 hover:text-white hover:border-white/20"
                }`}
              >
                <Search size={14} className="text-sky-400" />
                <span>
                  {isEn ? `Search Species (${creaturesList.length})` : `Tìm sinh vật (${creaturesList.length})`}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isSpeciesSearchOpen ? "rotate-180 text-sky-400" : "text-slate-400"
                  }`}
                />
              </button>

              {isSpeciesSearchOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 rounded-xl bg-[#091b2e] border border-white/15 shadow-2xl z-[500] p-2 max-h-96 flex flex-col">
                  {/* Ô nhập tìm kiếm */}
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder={isEn ? "Search by name, coordinates..." : "Nhập tên loài, phân vùng..."}
                      value={speciesSearchQuery}
                      onChange={(e) => setSpeciesSearchQuery(e.target.value)}
                      className="w-full bg-[#061424] border border-white/15 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    {speciesSearchQuery && (
                      <button
                        onClick={() => setSpeciesSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Danh sách kết quả cuộn */}
                  <div className="overflow-y-auto flex-1 pr-1 space-y-1">
                    {filteredSpeciesForSearch.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400">
                        {isEn ? "No matching species found" : "Không tìm thấy sinh vật phù hợp"}
                      </div>
                    ) : (
                      filteredSpeciesForSearch.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectSpecies(c)}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-sky-500/15 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 border border-transparent hover:border-sky-500/20"
                        >
                          <div
                            className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 flex-shrink-0"
                            style={{
                              border: `2px solid ${CATEGORY_COLORS[c.groupId] || "#0284c7"}`,
                            }}
                          >
                            <img
                              src={c.image || "/assets/creatures/clownfish.png"}
                              alt={c.nameVi}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs font-semibold leading-tight">
                              <span className="truncate">{isEn ? c.nameEn : c.nameVi}</span>
                              <span className="text-[10px] text-sky-400 font-mono ml-2 flex-shrink-0">
                                {c.coordDecimal}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                              <span className="italic truncate">{c.sciName}</span>
                              <span className="text-[10px] text-slate-500 truncate ml-1">{c.zoneNameVi}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Khung bản đồ toàn màn hình (Full-width, Quiet Chrome) */}
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

          {/* Nút reset khung nhìn Biển Đông (Không dùng chữ rườm rà, dùng icon chuẩn) */}
          <button
            onClick={handleResetView}
            title={isEn ? "Reset view to East Sea" : "Đặt lại góc nhìn Biển Đông"}
            className="absolute top-3 left-3 z-[400] w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center hover:border-sky-400/40"
          >
            <RotateCcw size={17} />
          </button>

          {/* Bảng khám phá cụm sinh vật (Hiển thị khi click vào cụm hoặc sinh vật ở góc dưới bản đồ) */}
          {activeCluster && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-[500] bg-[#071526]/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-3 shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {activeCluster.name}
                    <span className="text-sky-400 font-mono text-xs ml-1.5 font-normal">
                      ({activeCluster.species.length} loài sinh vật)
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo(
                          [activeCluster.centerLat, activeCluster.centerLng],
                          Math.min(mapInstanceRef.current.getZoom() + 1.5, 11),
                          { duration: 1 }
                        );
                      }
                    }}
                    className="text-[11px] text-sky-300 hover:text-white px-2 py-0.5 rounded-md bg-sky-600/20 hover:bg-sky-600/40 border border-sky-400/30 transition-colors cursor-pointer"
                  >
                    {isEn ? "Zoom into Area 🔍" : "Phóng to vùng biển 🔍"}
                  </button>
                  <button
                    onClick={() => setActiveCluster(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Dải thẻ ngang các sinh vật thuộc cụm */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {activeCluster.species.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => handleSelectSpecies(sp)}
                    className="w-56 flex-shrink-0 p-2 rounded-xl bg-[#091b2e] hover:bg-[#0d253f] border border-white/10 hover:border-sky-400/50 cursor-pointer transition-all flex items-center gap-2.5 group shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 flex-shrink-0"
                      style={{ border: `2px solid ${CATEGORY_COLORS[sp.groupId] || "#0284c7"}` }}
                    >
                      <img
                        src={sp.image || "/assets/creatures/clownfish.png"}
                        alt={sp.nameVi}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white group-hover:text-sky-300 truncate">
                        {isEn ? sp.nameEn : sp.nameVi}
                      </div>
                      <div className="text-[10.5px] text-slate-400 italic truncate">
                        {sp.sciName}
                      </div>
                      <div className="text-[10px] text-sky-400 font-mono mt-0.5 truncate">
                        {sp.coordDecimal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
