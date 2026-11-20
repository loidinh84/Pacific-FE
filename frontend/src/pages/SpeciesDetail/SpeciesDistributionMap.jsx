import { useEffect, useState, useRef } from "react";
import { MapPin, ChevronDown, ChevronUp, Loader2, Globe2 } from "lucide-react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Lazy-load Leaflet only when map is opened to keep bundle lean
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

function MapView({ locations, speciesName }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || locations.length === 0) return;

    let map;
    loadLeaflet().then((L) => {
      if (mapRef.current) return; // already initialized

      // Dark tile layer suited for ocean theme
      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom marker icon
      const markerIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px; height:28px;
          background:#0ea5e9;
          border:2px solid rgba(255,255,255,0.4);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.5);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
      });

      const bounds = [];

      locations.forEach((loc) => {
        const latlng = [loc.latitude, loc.longitude];
        bounds.push(latlng);

        const popup = `
          <div style="color:#0f172a;font-family:sans-serif;min-width:160px;">
            <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${loc.name}</div>
            ${loc.description ? `<div style="font-size:11px;color:#475569;line-height:1.5;">${loc.description}</div>` : ""}
            ${loc.is_featured ? '<span style="display:inline-block;margin-top:6px;padding:2px 7px;background:#0ea5e9;color:#fff;border-radius:4px;font-size:10px;font-weight:600;">Điểm nổi bật</span>' : ""}
          </div>
        `;

        L.marker(latlng, { icon: markerIcon })
          .addTo(map)
          .bindPopup(popup, { maxWidth: 240 });
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 5);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={containerRef}
      className="w-full h-72 sm:h-80 rounded-xl overflow-hidden"
      style={{ background: "#0d1b2a" }}
    />
  );
}

export function SpeciesDistributionMap({ species, language }) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const idOrSlug = species?.slug || species?.id;

  async function fetchLocations() {
    if (loaded || !idOrSlug) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/species/${encodeURIComponent(idOrSlug)}/locations`
      );
      if (res.data?.success) {
        setLocations(res.data.data || []);
      }
    } catch {
      setError("Không thể tải dữ liệu phân bố.");
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) {
      fetchLocations();
    }
  }

  // Fallback: use east_sea_zone + local_distribution text from species object
  const textFallback =
    species?.east_sea_zone || species?.local_distribution
      ? [species.east_sea_zone, species.local_distribution]
          .filter(Boolean)
          .join(" · ")
      : null;

  const hasData = locations.length > 0 || textFallback;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4 max-w-5xl mx-auto">
      {/* Accordion header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 text-sky-300">
          <Globe2 size={18} className="shrink-0" />
          <span className="font-semibold text-sm text-white">
            Phân bố địa lý
          </span>
          {textFallback && !open && (
            <span className="text-xs text-slate-400 font-normal truncate max-w-xs hidden sm:inline">
              {textFallback}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 shrink-0" />
        )}
      </button>

      {/* Accordion body */}
      {open && (
        <div className="mt-3 space-y-3">
          {/* Text metadata row */}
          {textFallback && (
            <div className="flex flex-wrap gap-2 px-1">
              {species?.east_sea_zone && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-900/40 border border-sky-700/30 text-xs text-sky-200">
                  <MapPin size={11} />
                  Vùng Biển Đông: {species.east_sea_zone}
                </span>
              )}
              {species?.local_distribution && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/60 border border-white/10 text-xs text-slate-300">
                  {species.local_distribution}
                </span>
              )}
            </div>
          )}

          {/* Map or states */}
          {loading ? (
            <div className="flex items-center justify-center gap-2 h-24 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Đang tải bản đồ…
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 h-20 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 text-sm">
              {error}
            </div>
          ) : locations.length > 0 ? (
            <>
              <MapView
                locations={locations}
                speciesName={species?.common_name || ""}
              />
              {/* Location chips below map */}
              <div className="flex flex-wrap gap-1.5 px-1">
                {locations.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 border border-white/10 text-xs text-slate-300"
                  >
                    <MapPin size={10} className="text-sky-400" />
                    {loc.name}
                  </span>
                ))}
              </div>
            </>
          ) : loaded && !textFallback ? (
            <div className="flex items-center justify-center gap-2 h-20 rounded-xl bg-white/[0.03] border border-white/10 text-slate-500 text-sm">
              Chưa có dữ liệu phân bố cho loài này.
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
