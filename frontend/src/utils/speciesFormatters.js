export const IUCN_VI_LABELS = {
  CR: "Cực kỳ nguy cấp (CR)",
  EN: "Nguy cấp (EN)",
  VU: "Sắp nguy cấp (VU)",
  NT: "Sắp bị đe dọa (NT)",
  LC: "Ít quan tâm (LC)",
  DD: "Thiếu dữ liệu (DD)",
  NE: "Chưa đánh giá (NE)",
  EW: "Tuyệt chủng tự nhiên (EW)",
  EX: "Tuyệt chủng (EX)",
};

const formatNum = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(2));
};

export function formatSizeRange(minCm, maxCm) {
  const hasMin = minCm !== null && minCm !== undefined && minCm !== "";
  const hasMax = maxCm !== null && maxCm !== undefined && maxCm !== "";
  if (!hasMin && !hasMax) return null;

  const min = hasMin ? Number(minCm) : Number(maxCm);
  const max = hasMax ? Number(maxCm) : Number(minCm);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  if (max < 100 && min < 100) {
    if (min === 0 && max > 0) return `<= ${formatNum(max)} cm`;
    if (min === max) return `${formatNum(min)} cm`;
    return `${formatNum(min)} - ${formatNum(max)} cm`;
  }

  const minM = formatNum(min / 100);
  const maxM = formatNum(max / 100);
  if (min === 0 && max > 0) return `<= ${maxM} m`;
  if (minM === maxM) return `${minM} m`;
  return `${minM} - ${maxM} m`;
}

export function formatWeightRange(minKg, maxKg) {
  const hasMin = minKg !== null && minKg !== undefined && minKg !== "";
  const hasMax = maxKg !== null && maxKg !== undefined && maxKg !== "";
  if (!hasMin && !hasMax) return null;

  const min = hasMin ? Number(minKg) : Number(maxKg);
  const max = hasMax ? Number(maxKg) : Number(minKg);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  if (min === 0 && max === 0) return "Vi sinh vật (< 1 mg)";
  if (max < 1 && min < 1) {
    const minG = Math.round(min * 1000);
    const maxG = Math.round(max * 1000);
    if (minG === 0 && maxG > 0) return `<= ${maxG} g`;
    if (minG === maxG) return `${minG} g`;
    return `${minG} - ${maxG} g`;
  }

  const minClean = formatNum(min);
  const maxClean = formatNum(max);
  if (min === 0 && max > 0) return `<= ${maxClean} kg`;
  if (minClean === maxClean) return `${minClean} kg`;
  return `${minClean} - ${maxClean} kg`;
}

export function formatDepthRange(minM, maxM) {
  const hasMin = minM !== null && minM !== undefined && minM !== "";
  const hasMax = maxM !== null && maxM !== undefined && maxM !== "";
  if (!hasMin && !hasMax) return null;

  const min = hasMin ? Number(minM) : Number(maxM);
  const max = hasMax ? Number(maxM) : Number(minM);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) return `${formatNum(min)}m`;
  return `${formatNum(min)}m - ${formatNum(max)}m`;
}

export function formatConservationVi(conservationStatus, vietnamRedListStatus) {
  const code = (conservationStatus?.code || vietnamRedListStatus || "").trim().toUpperCase();
  if (IUCN_VI_LABELS[code]) return IUCN_VI_LABELS[code];
  const rawName = conservationStatus?.name;
  if (rawName && rawName.includes(" - ")) {
    const viPart = rawName.split(" - ").pop()?.trim();
    return code ? `${viPart} (${code})` : viPart;
  }
  return rawName || vietnamRedListStatus || "Chưa đánh giá (NE)";
}

// Ánh xạ tên tiếng Anh cho nhóm phân loại sinh vật
export function getLocalizedCategory(categoryViOrSlug, language = "vi") {
  if (!categoryViOrSlug) return language === "en" ? "Marine Life" : "Sinh vật biển";
  if (language === "vi") return categoryViOrSlug;

  const lower = String(categoryViOrSlug).toLowerCase();
  if (
    lower.includes("ca-bien") ||
    lower.includes("cá biển") ||
    (lower.includes("cá") && !lower.includes("heo") && !lower.includes("voi") && !lower.includes("sụn"))
  ) {
    return "Marine Fishes";
  }
  if (lower.includes("cá sụn") || lower.includes("cartilage") || lower.includes("ca-sun")) {
    return "Cartilaginous Fishes";
  }
  if (
    lower.includes("dong-vat-co-vu") ||
    lower.includes("có vú") ||
    lower.includes("thú biển") ||
    lower.includes("mammal")
  ) {
    return "Marine Mammals";
  }
  if (lower.includes("bo-sat") || lower.includes("bò sát") || lower.includes("reptile")) {
    return "Marine Reptiles";
  }
  if (
    lower.includes("than-mem") ||
    lower.includes("thân mềm") ||
    lower.includes("khong-xuong-song") ||
    lower.includes("không xương sống") ||
    lower.includes("mollusk") ||
    lower.includes("invertebrate")
  ) {
    return "Mollusks & Invertebrates";
  }
  if (
    lower.includes("san-ho") ||
    lower.includes("san hô") ||
    lower.includes("thich-ty") ||
    lower.includes("thích ty") ||
    lower.includes("thực vật") ||
    lower.includes("coral") ||
    lower.includes("plant")
  ) {
    return "Corals & Marine Plants";
  }
  if (
    lower.includes("bien-sau") ||
    lower.includes("biển sâu") ||
    lower.includes("phát quang") ||
    lower.includes("deep sea") ||
    lower.includes("deep-sea")
  ) {
    return "Deep Sea Life";
  }
  if (lower.includes("da gai") || lower.includes("da-gai") || lower.includes("echinoderm")) {
    return "Echinoderms";
  }
  if (lower.includes("giáp xác") || lower.includes("giap-xac") || lower.includes("crustacean")) {
    return "Crustaceans";
  }
  if (lower.includes("phù du") || lower.includes("plankton")) {
    return "Plankton & Microbes";
  }
  return categoryViOrSlug;
}

// Bảng tra cứu tên tiếng Anh theo danh pháp khoa học và tên phổ biến
export const KNOWN_SPECIES_EN_NAMES = {
  "makaira mazara": "Indo-Pacific Blue Marlin",
  "makaira nigricans": "Atlantic Blue Marlin",
  "acropora millepora": "Staghorn Cluster Coral",
  "haliotis diversicolor": "Nine-Hole Abalone",
  "haliotis asinina": "Donkey's Ear Abalone",
  "gigantocypris agassizii": "Giant Pelagic Ostracod",
  "dugong dugon": "Dugong",
  "planktonic ecosystem": "Marine Plankton",
  "amphiprion ocellaris": "Ocellaris Clownfish",
  "chelonia mydas": "Green Sea Turtle",
  "carcharodon carcharias": "Great White Shark",
  "thunnus orientalis": "Pacific Bluefin Tuna",
  "rhincodon typus": "Whale Shark",
  "enteroctopus dofleini": "Giant Pacific Octopus",
  "tursiops truncatus": "Common Bottlenose Dolphin",
  "balaenoptera musculus": "Blue Whale",
  "nautilus pompilius": "Chambered Nautilus",
  "mobula birostris": "Oceanic Manta Ray",
  "galeocerdo cuvier": "Tiger Shark",
  "taeniura lymma": "Bluespotted Ribbontail Ray",
  "plectropomus leopardus": "Leopard Coral Grouper",
  "rhinecanthus aculeatus": "Lagoon Triggerfish",
  "caranx ignobilis": "Giant Trevally",
  "glaucus atlanticus": "Blue Dragon Sea Slug",
  "odontodactylus scyllarus": "Peacock Mantis Shrimp",
  "lysmata amboinensis": "Scarlet Skunk Cleaner Shrimp",
  "lagenodelphis hosei": "Fraser's Dolphin",
  "syringammina fragilissima": "Giant Xenophyophore",
  "bathyphysa conifera": "Flying Spaghetti Monster",
};

export function getLocalizedSpeciesName(species, language = "vi") {
  if (!species) return "";
  const nameVi = species.nameVi || species.commonName || "";
  if (language === "vi") return nameVi;

  // Nếu đã có nameEn hợp lệ và khác nameVi
  if (species.nameEn && species.nameEn !== nameVi) {
    return species.nameEn;
  }

  // Tra cứu qua danh pháp khoa học
  const sciKey = (species.sciName || species.scientificName || "").toLowerCase().trim();
  if (sciKey && KNOWN_SPECIES_EN_NAMES[sciKey]) {
    return KNOWN_SPECIES_EN_NAMES[sciKey];
  }

  // Tra cứu qua slug hoặc id
  const slugKey = String(species.slug || species.id || "").toLowerCase();
  if (slugKey.includes("ca-co-xanh") || slugKey.includes("blue-marlin")) return "Indo-Pacific Blue Marlin";
  if (slugKey.includes("san-ho-canh")) return "Staghorn Cluster Coral";
  if (slugKey.includes("bao-ngu-chin-lo")) return "Nine-Hole Abalone";
  if (slugKey.includes("bao-ngu-vanh-dai")) return "Donkey's Ear Abalone";
  if (slugKey.includes("giap-xac-boi-khong-lo") || slugKey.includes("gigantocypris")) return "Giant Pelagic Ostracod";
  if (slugKey.includes("bo-bien") || slugKey.includes("dugong")) return "Dugong";
  if (slugKey.includes("phu-du") || slugKey.includes("plankton")) return "Marine Plankton";

  return species.nameEn || nameVi || species.scientificName || "";
}


