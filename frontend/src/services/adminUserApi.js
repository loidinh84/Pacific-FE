import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/users`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy danh sách người dùng
 * @param {Object} params - { page, limit, search, role, status, sortBy, order }
 */
export const fetchAdminUserList = async (params = {}) => {
  const res = await axios.get(API_BASE, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * Lấy chi tiết 1 người dùng
 * @param {string} id - User ID
 */
export const fetchAdminUserById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Cập nhật trạng thái người dùng
 * @param {string} id - User ID
 * @param {string} status - "active" | "locked" | "pending"
 */
export const updateAdminUserStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_BASE}/${id}/status`,
    { status },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Cập nhật vai trò người dùng
 * @param {string} id - User ID
 * @param {string} role - Vai trò mới
 * @param {string} [confirmPassword] - Mật khẩu xác nhận của Admin
 */
export const updateAdminUserRole = async (id, role, confirmPassword = "") => {
  const payload = { role };
  if (confirmPassword) payload.confirmPassword = confirmPassword;
  const res = await axios.patch(
    `${API_BASE}/${id}/role`,
    payload,
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Đặt lại mật khẩu người dùng về mặc định
 * @param {string} id - User ID
 * @param {string} newPassword - Mật khẩu mới
 */
export const resetAdminUserPassword = async (id, newPassword = "Pacific@123") => {
  const res = await axios.post(
    `${API_BASE}/${id}/reset-password`,
    { newPassword },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Lấy lịch sử hoạt động của người dùng
 * @param {string} id - User ID
 * @param {number} limit - Số lượng tối đa mỗi loại
 */
export const fetchAdminUserActivity = async (id, limit = 10) => {
  const res = await axios.get(`${API_BASE}/${id}/activity`, {
    params: { limit },
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * Lấy thông báo chờ duyệt
 */
export const fetchAdminNotifications = async () => {
  const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  const res = await axios.get(`${BASE}/admin/notifications`, getAuthHeaders());
  return res.data;
};
