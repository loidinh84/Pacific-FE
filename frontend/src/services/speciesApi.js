import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

/**
 * Fetch species anatomy data from Backend PostgreSQL database
 * @param {string|number} speciesIdOrSlug - Species ID, Code or Slug
 * @returns {Promise<Array|null>} Array of anatomy objects or null on fallback
 */
export const fetchSpeciesAnatomy = async (speciesIdOrSlug) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/species/${speciesIdOrSlug}/anatomy`
    );
    if (response.data && response.data.success) {
      const rawAnatomy = response.data.data.anatomy || [];
      // Map BE fields to FE expected shape
      return rawAnatomy.map((item) => ({
        id: `a${item.sortOrder || item.id}`,
        labelVi: item.partName,
        labelEn: item.partName,
        latinName: item.latinName,
        system: item.system || "nervous",
        descVi: item.description,
        descEn: item.description,
        x: item.hotspotX ? Number(item.hotspotX) : 50,
        y: item.hotspotY ? Number(item.hotspotY) : 50,
        svgRx: item.svgRx ? Number(item.svgRx) : 5,
        svgRy: item.svgRy ? Number(item.svgRy) : 5,
        medicalData: item.medicalData,
        pos3D: item.pos3D,
      }));
    }
    return null;
  } catch (error) {
    console.warn("Backend Anatomy API offline/fallback:", error.message);
    return null;
  }
};
