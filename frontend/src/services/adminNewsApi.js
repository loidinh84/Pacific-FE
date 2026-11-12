import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/news`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy danh sách tin tức cho Admin kèm tìm kiếm, lọc và phân trang
 */
export const fetchAdminNewsList = async (params = {}) => {
  const res = await axios.get(API_BASE, { params, ...getAuthHeaders() });
  return res.data;
};

/**
 * Lấy danh sách chuyên mục tin tức
 */
export const fetchAdminNewsCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`, getAuthHeaders());
  return res.data;
};

/**
 * Lấy danh sách nguồn tin chính thống
 */
export const fetchAdminNewsSources = async () => {
  const res = await axios.get(`${API_BASE}/sources`, getAuthHeaders());
  return res.data;
};

/**
 * Lấy chi tiết 1 bài viết
 */
export const fetchAdminNewsById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Tạo bài viết mới
 */
export const createAdminNews = async (data) => {
  const res = await axios.post(API_BASE, data, getAuthHeaders());
  return res.data;
};

/**
 * Cập nhật bài viết
 */
export const updateAdminNews = async (id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data, getAuthHeaders());
  return res.data;
};

/**
 * Bật / tắt trạng thái nổi bật (Featured)
 */
export const toggleAdminNewsFeatured = async (id) => {
  const res = await axios.patch(`${API_BASE}/${id}/featured`, {}, getAuthHeaders());
  return res.data;
};

/**
 * Xóa bài viết
 */
export const deleteAdminNews = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

