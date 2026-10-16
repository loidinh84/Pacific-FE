import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

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

/**
 * Tìm kiếm Ngữ nghĩa Sinh thái Biển Đông (Semantic Natural Language Search)
 * Nhận diện câu hỏi: "thiên địch của sao biển gai", "cộng sinh với hải quỳ", "nguy cấp ở Côn Đảo", v.v.
 * @param {string} query
 * @returns {Promise<Object>}
 */
export const searchSemantic = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/species/search/semantic`, {
      params: { q: query },
    });
    if (response.data && response.data.success) {
      return response.data;
    }
    return { success: false, data: [], suggestions: [] };
  } catch (error) {
    console.error("Lỗi khi tìm kiếm ngữ nghĩa:", error);
    return { success: false, data: [], suggestions: [] };
  }
};

/**
 * Admin: Lấy danh sách quan hệ sinh thái
 */
export const fetchAdminRelationships = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/relationships`, {
      params,
      ...getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quan hệ sinh thái admin:", error);
    throw error;
  }
};

/**
 * Admin: Tạo quan hệ sinh thái mới
 */
export const createAdminRelationship = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/relationships`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo quan hệ sinh thái:", error);
    throw error;
  }
};

/**
 * Admin: Cập nhật quan hệ sinh thái
 */
export const updateAdminRelationship = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/relationships/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật quan hệ sinh thái:", error);
    throw error;
  }
};

/**
 * Admin: Xóa quan hệ sinh thái
 */
export const deleteAdminRelationship = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/relationships/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa quan hệ sinh thái:", error);
    throw error;
  }
};
