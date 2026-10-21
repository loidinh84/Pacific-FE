import axios from "axios";
import { getStoredToken, isPreviewAsGuest } from "../utils/auth";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  if (isPreviewAsGuest()) return {};
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Gửi ý kiến đóng góp từ người dùng (Footer hoặc modal)
 * Hỗ trợ cả khách vãng lai và thành viên đã đăng nhập
 */
export const submitFeedback = async ({ content, rating = 5 }) => {
  const res = await axios.post(
    `${API_ROOT}/feedback`,
    { content, rating },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

/**
 * Lấy danh sách ý kiến đóng góp dành cho Admin
 */
export const fetchAdminFeedback = async (params = {}) => {
  const res = await axios.get(`${API_ROOT}/admin/feedback`, {
    params,
    headers: getAuthHeaders(),
  });
  return res.data;
};

/**
 * Xóa một ý kiến đóng góp (Admin)
 */
export const deleteAdminFeedback = async (id) => {
  const res = await axios.delete(`${API_ROOT}/admin/feedback/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
