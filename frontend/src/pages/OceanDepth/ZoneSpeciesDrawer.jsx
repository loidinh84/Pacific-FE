import { useState, useMemo, useEffect } from "react";
import { X, Search, Waves, ArrowRight } from "lucide-react";
import { OCEAN_ZONES } from "./depthData";
import { useLanguageStore } from "../../stores/useLanguageStore";

function matchesZone(sp, zone) {
  const minD = Number(sp.depthMin ?? sp.depth ?? 0);
  const maxD = Number(sp.depthMax ?? sp.depth ?? minD);
  return maxD >= zone.depthStart && minD < zone.depthEnd;
}

export default function ZoneSpeciesDrawer({
  isOpen,
  initialZoneId,
  apiCreatures,
  onClose,
  onInspectSpecies,
}) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const [selectedZoneId, setSelectedZoneId] = useState(initialZoneId || "sunlight");
  const [query, setQuery] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(60);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const activeZone =
    OCEAN_ZONES.find((z) => z.id === selectedZoneId) || OCEAN_ZONES[0];

  const zoneCounts = useMemo(() => {
    const counts = {};
    for (const z of OCEAN_ZONES) {
      counts[z.id] = apiCreatures.filter((sp) => matchesZone(sp, z)).length;
    }
    return counts;
  }, [apiCreatures]);

  const filteredSpecies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apiCreatures.filter((sp) => {
      if (!matchesZone(sp, activeZone)) return false;
      if (!q) return true;
      return (
        String(sp.nameVi || "").toLowerCase().includes(q) ||
        String(sp.sciName || "").toLowerCase().includes(q) ||
        String(sp.groupName || "").toLowerCase().includes(q)
      );
    });
  }, [apiCreatures, activeZone, query]);

  if (!isOpen) return null;

  const displayed = filteredSpecies.slice(0, visibleLimit);

  return (
    <div className="od-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="od-drawer od-zone-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label={isEn ? "East Sea Depth Zone Species Catalog" : "Danh mục sinh vật theo tầng biển"}
      >
        {/* Header */}
        <div className="od-drawer-header">
          <div className="od-drawer-title-group">
            <span className="od-drawer-kicker">
              {isEn
                ? `PostgreSQL Database • ${apiCreatures.length.toLocaleString()} Species`
                : `Cơ sở dữ liệu Biển Đông • ${apiCreatures.length.toLocaleString()} loài`}
            </span>
            <h3 className="od-drawer-title">
              {isEn ? activeZone.nameEn : activeZone.nameVi}
            </h3>
            <p className="od-drawer-sci">
              {isEn ? activeZone.subNameEn : activeZone.subNameVi}
            </p>
          </div>
          <button
            type="button"
            className="od-drawer-close"
            onClick={onClose}
            aria-label={isEn ? "Close catalog" : "Đóng danh mục"}
          >
            <X size={17} />
          </button>
        </div>

        {/* Zone Tabs */}
        <div className="od-zone-drawer-tabs">
          {OCEAN_ZONES.map((z) => {
            const isActive = z.id === selectedZoneId;
            return (
              <button
                key={z.id}
                type="button"
                className={`od-zone-drawer-tab ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedZoneId(z.id);
                  setVisibleLimit(60);
                }}
              >
                <span>{isEn ? z.nameEn.replace(" Zone", "") : z.nameVi.replace("Vùng ", "")}</span>
                <span className="od-zone-drawer-tab-count">
                  {zoneCounts[z.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="od-zone-drawer-toolbar">
          <div className="od-zone-drawer-search">
            <Search size={14} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleLimit(60);
              }}
              placeholder={
                isEn
                  ? "Search species, scientific name..."
                  : "Tìm tên loài, tên khoa học, nhóm..."
              }
            />
          </div>
        </div>

        {/* Species List */}
        <div className="od-drawer-body custom-scrollbar-thin">
          <div className="od-zone-drawer-meta">
            {isEn
              ? `Showing ${displayed.length} of ${filteredSpecies.length} species in this zone`
              : `Đang hiện ${displayed.length} / ${filteredSpecies.length} loài sống ở tầng này`}
          </div>

          {displayed.length === 0 ? (
            <div className="od-zone-drawer-empty">
              <Waves size={24} />
              <p>
                {isEn
                  ? "No matching species in this depth zone."
                  : "Không tìm thấy loài phù hợp ở tầng nước này."}
              </p>
            </div>
          ) : (
            <div className="od-zone-drawer-list">
              {displayed.map((sp) => (
                <button
                  key={sp.id || sp.slug}
                  type="button"
                  className="od-zone-species-row"
                  onClick={() =>
                    onInspectSpecies({
                      ...sp,
                      isCutout: false,
                    })
                  }
                >
                  <div className="od-zone-species-thumb">
                    {sp.image ? (
                      <img
                        src={sp.image}
                        alt={sp.nameVi}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Waves size={16} />
                    )}
                  </div>
                  <div className="od-zone-species-info">
                    <div className="od-zone-species-name-row">
                      <span className="od-zone-species-name">{sp.nameVi}</span>
                    </div>
                    <span className="od-zone-species-sci">{sp.sciName}</span>
                    <div className="od-zone-species-sub">
                      <span>{sp.depthText || `${sp.depth}m`}</span>
                      {sp.groupName && (
                        <>
                          <span>•</span>
                          <span>{sp.groupName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={14} className="od-zone-species-arrow" />
                </button>
              ))}

              {filteredSpecies.length > visibleLimit && (
                <button
                  type="button"
                  className="od-zone-load-more"
                  onClick={() => setVisibleLimit((prev) => prev + 80)}
                >
                  {isEn
                    ? `Load more (${filteredSpecies.length - visibleLimit} remaining)`
                    : `Xem thêm (${filteredSpecies.length - visibleLimit} loài còn lại)`}
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
