import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("pacific_token") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

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

/**
 * Admin: Get species list with filters and pagination
 */
export const fetchAdminSpeciesList = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/species`, {
      params,
      ...getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API danh sách sinh vật admin:", error);
    throw error;
  }
};

/**
 * Admin: Get species detail by ID
 */
export const fetchAdminSpeciesById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/species/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sinh vật admin:", error);
    throw error;
  }
};

/**
 * Admin: Create new species
 */
export const createAdminSpecies = async (speciesData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/species`, speciesData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sinh vật mới:", error);
    throw error;
  }
};

/**
 * Admin: Update existing species
 */
export const updateAdminSpecies = async (id, speciesData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/species/${id}`, speciesData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sinh vật:", error);
    throw error;
  }
};

/**
 * Admin: Toggle species visibility (Hidden / Displayed)
 */
export const toggleSpeciesVisibility = async (id, isVisible) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/admin/species/${id}/visibility`,
      { is_visible: isVisible },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đổi trạng thái ẩn/hiển thị:", error);
    throw error;
  }
};

/**
 * Admin: Soft delete species
 */
export const deleteAdminSpecies = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/species/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa sinh vật:", error);
    throw error;
  }
};

/**
 * Admin: Sync species from external API (GBIF/iNaturalist/OBIS)
 */
export const syncSpeciesFromApi = async (syncData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/species/sync`, syncData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đồng bộ API bên ngoài:", error);
    throw error;
  }
};

/**
 * Admin: Fetch live health status of GBIF, iNaturalist, OBIS APIs and incomplete species from DB
 */
export const fetchApiSyncStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/species/sync-status`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái đồng bộ API:", error);
    throw error;
  }
};

/**
 * Admin: Retry sync for single species by ID
 */
export const retrySyncSpeciesItem = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/species/sync-item/${id}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thử lại đồng bộ loài:", error);
    throw error;
  }
};

/**
 * Admin: Sync all incomplete species in bulk
 */
export const syncAllIncompleteSpecies = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/species/sync-all`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đồng bộ hàng loạt:", error);
    throw error;
  }
};
