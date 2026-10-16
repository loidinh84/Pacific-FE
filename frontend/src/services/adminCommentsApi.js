import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/comments`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy danh sách bình luận (hỗ trợ phân trang, tìm kiếm, lọc theo tab: all, reported, deleted, today)
 */
export const fetchAdminComments = async (params = {}) => {
  const res = await axios.get(API_BASE, { params, ...getAuthHeaders() });
  return res.data;
};

/**
 * Xóa mềm bình luận (chuyển vào thùng rác)
 */
export const deleteAdminComment = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Khôi phục bình luận đã xóa
 */
export const restoreAdminComment = async (id) => {
  const res = await axios.patch(`${API_BASE}/${id}/restore`, {}, getAuthHeaders());
  return res.data;
};

/**
 * Bác bỏ báo cáo vi phạm — Giữ bình luận
 */
export const dismissAdminCommentReports = async (id) => {
  const res = await axios.post(`${API_BASE}/${id}/reports/dismiss`, {}, getAuthHeaders());
  return res.data;
};

/**
 * Tạm ẩn hoặc hiển thị lại bình luận
 */
export const toggleHideAdminComment = async (id) => {
  const res = await axios.patch(`${API_BASE}/${id}/toggle-hide`, {}, getAuthHeaders());
  return res.data;
};

/**
 * Xóa vĩnh viễn bình luận khỏi database
 */
export const permanentDeleteAdminComment = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}/permanent`, getAuthHeaders());
  return res.data;
};
