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

/**
 * Tra cứu phân loại học đại dương qua Backend Proxy Gateway (Hỗ trợ Provider: auto, gbif, inaturalist, worms)
 */
export const searchSpeciesTaxonomy = async (query, provider = "auto") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/taxonomy-search`, {
      params: { q: query, provider },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi Backend Taxonomy API:", error);
    throw error;
  }
};

/**
 * Upload file từ máy tính (ảnh, video, 3d model .glb, audio .mp3) lên Backend Storage
 * @param {File} file Tệp từ máy tính
 * @returns {Promise<{url: string, filename: string}>}
 */
export const uploadMediaFile = async (file) => {
  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    const response = await axios.post(`${API_BASE_URL}/upload`, {
      filename: file.name,
      fileData: base64,
      mimeType: file.type,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi upload tệp từ máy tính:", error);
    throw error;
  }
};

/**
 * Tra cứu Kho âm thanh Đại dương từ Backend API (default catalog — Wikimedia parallel queries)
 * @param {string} category Phân loại tab
 */
export const getOceanAudioLibrary = async (category = "Tất cả") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/audio-library`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải Kho âm thanh đại dương:", error);
    throw error;
  }
};

/**
 * Tìm kiếm nâng cao âm thanh đại dương trực tiếp từ Freesound.org API
 * @param {string} query Từ khóa cụ thể (tiếng Việt hoặc tiếng Anh)
 */
export const searchOceanAudioAdvanced = async (query = "") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/audio-search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm nâng cao âm thanh đại dương:", error);
    throw error;
  }
};

/**
 * Lấy danh sách nhóm sinh vật biển (Cá, Động vật có vú, Thân mềm...)
 */
export const fetchSpeciesGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/groups`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm loài:", error);
    throw error;
  }
};

/**
 * Lấy danh sách 5 tầng nước đại dương (Sunlight, Twilight, Midnight, Abyssal, Hadal)
 */
export const fetchOceanZones = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/zones`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tầng biển:", error);
    throw error;
  }
};

/**
 * Lấy danh sách trạng thái bảo tồn IUCN
 */
export const fetchConservationStatuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/statuses`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trạng thái bảo tồn:", error);
    throw error;
  }
};

/**
 * Lấy danh sách địa điểm thám hiểm đại dương
 */
export const fetchOceanLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/locations`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa điểm đại dương:", error);
    throw error;
  }
};

