import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ExternalLink,
  Network,
  Ruler,
  MapPin,
  Waves,
  ShieldAlert,
  Utensils,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { fetchSpeciesDetail } from "../../services/speciesApi";
import { fetchSpeciesEcosystem } from "../../services/ecosystemApi";
import { useLanguageStore } from "../../stores/useLanguageStore";

const detailCache = new Map();
const ecoCache = new Map();

function getRedListStyle(code) {
  const clean = String(code || "").trim().toUpperCase().split(/\s+/)[0];
  if (clean === "CR" || clean === "EN") {
    return { code: clean, cls: "is-critical" };
  }
  if (clean === "VU" || clean === "NT") {
    return { code: clean, cls: "is-vulnerable" };
  }
  if (clean === "LC") {
    return { code: clean, cls: "is-safe" };
  }
  return null;
}

export default function DiveQuickDrawer({ creature, onClose, onSelectRelated }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const slug = creature?.slug || creature?.id || null;

  const [fetched, setFetched] = useState({
    slug: null,
    detail: null,
    ecosystem: null,
  });

  // Escape key closes drawer
  useEffect(() => {
    if (!creature) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [creature, onClose]);

  // Load species full detail + food-web ecosystem in parallel (cached)
  useEffect(() => {
    if (!slug) return undefined;
    if (detailCache.has(slug) && ecoCache.has(slug)) return undefined;

    let active = true;
    const cachedDetail = detailCache.get(slug);
    const cachedEco = ecoCache.get(slug);

    Promise.all([
      cachedDetail ? Promise.resolve(cachedDetail) : fetchSpeciesDetail(slug),
      cachedEco ? Promise.resolve(cachedEco) : fetchSpeciesEcosystem(slug),
    ]).then(([det, eco]) => {
      if (det) detailCache.set(slug, det);
      if (eco) ecoCache.set(slug, eco);
      if (!active) return;
      setFetched({
        slug,
        detail: det || cachedDetail || null,
        ecosystem: eco || cachedEco || null,
      });
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!creature) return null;

  const detail =
    fetched.slug === slug ? fetched.detail : detailCache.get(slug) || null;
  const ecosystem =
    fetched.slug === slug ? fetched.ecosystem : ecoCache.get(slug) || null;
  const loading = Boolean(
    slug && !(detailCache.has(slug) && ecoCache.has(slug)) && fetched.slug !== slug
  );

  const displayName = isEn
    ? creature.nameEn || detail?.commonName || creature.nameVi
    : creature.nameVi || detail?.commonName || creature.nameEn;

  const sciName = detail?.scientificName || creature.sciName || "";
  const description = isEn
    ? creature.descEn || detail?.description || creature.descVi
    : detail?.description || creature.descVi || creature.descEn;

  const redListRaw =
    detail?.vietnamRedListStatus ||
    detail?.conservationStatus?.code ||
    creature.redList;
  const redList = getRedListStyle(redListRaw);

  const depthText =
    detail?.depthMinM != null || detail?.depthMaxM != null
      ? `${detail.depthMinM ?? 0}m – ${detail.depthMaxM ?? creature.depth}m`
      : creature.depthText || `${creature.depth?.toLocaleString() || 0}m`;

  const sizeText =
    detail?.sizeMaxCm
      ? detail.sizeMaxCm >= 100
        ? `${(detail.sizeMaxCm / 100).toFixed(1)} m`
        : `${detail.sizeMaxCm} cm`
      : null;

  const eastSeaZone = detail?.eastSeaZone || creature.eastSeaZone || "Biển Đông";

  const heroImage =
    creature.image ||
    detail?.media?.find((m) => m.isPrimary)?.url ||
    detail?.media?.[0]?.url ||
    "";

  const roles = ecosystem?.ecologicalRoles || {};
  const preyList = (roles.prey || []).slice(0, 5);
  const predatorList = (roles.predators || []).slice(0, 5);
  const symbiosisList = [
    ...(roles.symbionts || []),
    ...(roles.habitats || []),
    ...(roles.dwellers || []),
  ].slice(0, 4);
  const hasFoodWeb =
    preyList.length > 0 || predatorList.length > 0 || symbiosisList.length > 0;

  return (
    <div className="od-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="od-drawer od-quick-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label={displayName}
      >
        {/* Top Bar */}
        <div className="od-drawer-header">
          <div className="od-drawer-title-group">
            <span className="od-drawer-kicker">
              {isEn ? "Quick Dive Inspector" : "Soi nhanh sinh vật biển"}
            </span>
            <h3 className="od-drawer-title">{displayName}</h3>
            {sciName && <p className="od-drawer-sci">{sciName}</p>}
          </div>
          <button
            type="button"
            className="od-drawer-close"
            onClick={onClose}
            aria-label={isEn ? "Close panel" : "Đóng bảng"}
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="od-drawer-body custom-scrollbar-thin">
          {/* Specimen Stage */}
          <div className="od-drawer-stage">
            {heroImage ? (
              <img
                src={heroImage}
                alt={displayName}
                className={`od-drawer-stage-img ${creature.isCutout === false ? "is-photo" : ""}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="od-drawer-stage-empty">
                <Waves size={28} />
              </div>
            )}

            <div className="od-drawer-stage-badges">
              <span className="od-drawer-pill is-depth">
                <Waves size={12} />
                <span>{depthText}</span>
              </span>
              {redList && (
                <span className={`od-drawer-pill ${redList.cls}`}>
                  <ShieldAlert size={12} />
                  <span>IUCN {redList.code}</span>
                </span>
              )}
            </div>
          </div>

          {/* Biometric Chips */}
          <div className="od-drawer-facts-grid">
            <div className="od-drawer-fact-box">
              <span className="od-drawer-fact-label">
                <MapPin size={12} />
                <span>{isEn ? "Distribution" : "Vùng phân bố"}</span>
              </span>
              <span className="od-drawer-fact-val">{eastSeaZone}</span>
            </div>
            <div className="od-drawer-fact-box">
              <span className="od-drawer-fact-label">
                <Ruler size={12} />
                <span>{isEn ? "Max Size" : "Kích thước"}</span>
              </span>
              <span className="od-drawer-fact-val">
                {sizeText || (isEn ? "Deep-sea fauna" : "Đang cập nhật")}
              </span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="od-drawer-section">
              <h4 className="od-drawer-section-title">
                {isEn ? "Biological Overview" : "Đặc điểm sinh học"}
              </h4>
              <p className="od-drawer-desc">{description}</p>
            </div>
          )}

          {/* Diet summary if available */}
          {detail?.diet && (
            <div className="od-drawer-section">
              <h4 className="od-drawer-section-title">
                <Utensils size={13} />
                <span>{isEn ? "Diet" : "Chế độ dinh dưỡng"}</span>
              </h4>
              <p className="od-drawer-desc">{detail.diet}</p>
            </div>
          )}

          {/* Mini Ecological Food Web */}
          <div className="od-drawer-section">
            <h4 className="od-drawer-section-title">
              <Network size={13} />
              <span>
                {isEn ? "Mini Food Web & Ecosystem" : "Chuỗi thức ăn & Sinh thái"}
              </span>
            </h4>

            {loading && !ecosystem ? (
              <div className="od-drawer-loading">
                <Loader2 size={15} className="animate-spin" />
                <span>
                  {isEn
                    ? "Loading ecological connections..."
                    : "Đang tải mạng lưới sinh thái..."}
                </span>
              </div>
            ) : hasFoodWeb ? (
              <div className="od-foodweb-groups">
                {preyList.length > 0 && (
                  <div className="od-foodweb-group">
                    <span className="od-foodweb-label is-prey">
                      {isEn ? "Feeds on / Prey" : "Nguồn thức ăn / Con mồi"}
                    </span>
                    <div className="od-foodweb-chips">
                      {preyList.map((item) => (
                        <button
                          key={`prey-${item.relationshipId}`}
                          type="button"
                          className="od-foodweb-chip"
                          onClick={() =>
                            onSelectRelated({
                              slug: item.slug,
                              id: item.speciesId,
                              nameVi: item.name,
                              nameEn: item.scientificName,
                              sciName: item.scientificName,
                              image: item.image,
                              redList: item.redList,
                              isCutout: false,
                            })
                          }
                        >
                          <span>{item.name}</span>
                          <ArrowRight size={11} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {predatorList.length > 0 && (
                  <div className="od-foodweb-group">
                    <span className="od-foodweb-label is-predator">
                      {isEn ? "Predators" : "Thiên địch đe dọa"}
                    </span>
                    <div className="od-foodweb-chips">
                      {predatorList.map((item) => (
                        <button
                          key={`pred-${item.relationshipId}`}
                          type="button"
                          className="od-foodweb-chip"
                          onClick={() =>
                            onSelectRelated({
                              slug: item.slug,
                              id: item.speciesId,
                              nameVi: item.name,
                              nameEn: item.scientificName,
                              sciName: item.scientificName,
                              image: item.image,
                              redList: item.redList,
                              isCutout: false,
                            })
                          }
                        >
                          <span>{item.name}</span>
                          <ArrowRight size={11} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {symbiosisList.length > 0 && (
                  <div className="od-foodweb-group">
                    <span className="od-foodweb-label is-symbiosis">
                      {isEn ? "Symbiosis & Habitat" : "Cộng sinh & Sinh cảnh"}
                    </span>
                    <div className="od-foodweb-chips">
                      {symbiosisList.map((item) => (
                        <button
                          key={`sym-${item.relationshipId}`}
                          type="button"
                          className="od-foodweb-chip"
                          onClick={() =>
                            onSelectRelated({
                              slug: item.slug,
                              id: item.speciesId,
                              nameVi: item.name,
                              nameEn: item.scientificName,
                              sciName: item.scientificName,
                              image: item.image,
                              redList: item.redList,
                              isCutout: false,
                            })
                          }
                        >
                          <span>{item.name}</span>
                          <ArrowRight size={11} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="od-drawer-empty-note">
                {isEn
                  ? "Explore the Knowledge Graph to inspect broader food-web links for this depth zone."
                  : "Mở Đồ thị tri thức sinh thái để khám phá thêm các liên kết trong cùng tầng biển."}
              </p>
            )}
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="od-drawer-footer">
          <Link
            to={`/species/${slug}`}
            className="od-drawer-btn-primary"
          >
            <span>{isEn ? "View Full Profile" : "Xem hồ sơ đầy đủ"}</span>
            <ExternalLink size={14} />
          </Link>
          <Link
            to="/knowledge-graph"
            className="od-drawer-btn-secondary"
            title={isEn ? "Open Knowledge Graph" : "Mở Đồ thị sinh thái"}
          >
            <Network size={15} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
