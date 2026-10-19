import { sharkAnatomyPreset } from "./presets/sharkAnatomyPreset";

/**
 * Bộ đăng ký các mẫu giải phẫu sinh học biển (Anatomy Presets Registry)
 * Cho phép tự động phát hiện loài và cấp đúng bộ giải phẫu 3D tương ứng.
 */
const PRESETS_MAP = {
  shark: sharkAnatomyPreset,
  "ca-map": sharkAnatomyPreset,
};

/**
 * Lấy Anatomy Preset tương ứng cho một sinh vật
 * @param {Object} species - Đối tượng sinh vật truyền từ backend / page
 * @returns {Object} anatomyPreset
 */
export function getAnatomyPreset(species = {}) {
  // 1. Nếu loài chỉ định rõ preset id
  if (species?.anatomyPresetId && PRESETS_MAP[species.anatomyPresetId]) {
    return PRESETS_MAP[species.anatomyPresetId];
  }

  // 2. Tự động nhận diện qua tên khoa học, slug, hoặc tên loài
  const slug = (species?.slug || "").toLowerCase();
  const nameEn = (species?.nameEn || species?.commonName || "").toLowerCase();
  const nameVi = (species?.nameVi || "").toLowerCase();
  const scientificName = (species?.scientificName || "").toLowerCase();

  const isShark =
    slug.includes("shark") ||
    slug.includes("ca-map") ||
    nameEn.includes("shark") ||
    nameVi.includes("cá mập") ||
    nameVi.includes("ca map") ||
    scientificName.includes("carcharodon") ||
    scientificName.includes("selachimorpha") ||
    scientificName.includes("galeocerdo");

  if (isShark) {
    return sharkAnatomyPreset;
  }

  // Mặc định hiện tại: sử dụng sharkAnatomyPreset làm mẫu chuẩn
  return sharkAnatomyPreset;
}

export { sharkAnatomyPreset };
