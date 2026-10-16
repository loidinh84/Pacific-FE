import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Lấy mạng lưới tri thức sinh thái của 1 loài (Ego Network)
 * @param {string|number} idOrSlug - ID hoặc Slug của loài
 * @returns {Promise<Object>}
 */
export const fetchSpeciesEcosystem = async (idOrSlug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/${idOrSlug}/ecosystem`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.warn(`Lỗi khi lấy hệ sinh thái loài ${idOrSlug}:`, error.message);
    return null;
  }
};

/**
 * Lấy toàn bộ Đồ thị Tri thức Đa dạng Sinh thái Biển Đông (Nodes & Links)
 * @param {Object} filters { zone, groupId, redList, type, limit }
 * @returns {Promise<Object>}
 */
export const fetchKnowledgeGraph = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/ecosystem/graph`, {
      params: filters,
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi tải Đồ thị Tri thức Biển Đông:", error);
    return null;
  }
};

/**
 * Lấy dữ liệu thống kê Đa dạng sinh học & Sách Đỏ Biển Đông
 * @returns {Promise<Object>}
 */
export const fetchEcosystemStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/ecosystem/stats`);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê Biển Đông:", error);
    return null;
  }
};
