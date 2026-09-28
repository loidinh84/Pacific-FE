import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/locations`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy danh sách địa điểm (phân trang, tìm kiếm, lọc)
 */
export const fetchAdminLocationList = async (params = {}) => {
  const res = await axios.get(API_BASE, { params, ...getAuthHeaders() });
  return res.data;
};

/**
 * Lấy chi tiết 1 địa điểm
 */
export const fetchAdminLocationById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Tạo địa điểm mới
 */
export const createAdminLocation = async (data) => {
  const res = await axios.post(API_BASE, data, getAuthHeaders());
  return res.data;
};

/**
 * Cập nhật địa điểm
 */
export const updateAdminLocation = async (id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data, getAuthHeaders());
  return res.data;
};

/**
 * Xóa địa điểm
 */
export const deleteAdminLocation = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Bật/tắt trạng thái nổi bật
 */
export const toggleAdminLocationFeatured = async (id) => {
  const res = await axios.patch(`${API_BASE}/${id}/featured`, {}, getAuthHeaders());
  return res.data;
};
