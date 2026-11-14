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

