import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/admin/me";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("pacific_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("pacific_token") ||
    sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

/**
 * 1. GET /api/admin/me - Lấy thông tin cá nhân Admin
 */
export const fetchAdminProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}`, getAuthHeaders());
  return res.data;
};

/**
 * 2. PUT /api/admin/me - Cập nhật thông tin Admin
 */
export const updateAdminProfile = async (data) => {
  const res = await axios.put(`${API_BASE_URL}`, data, getAuthHeaders());
  return res.data;
};

/**
 * 3. POST /api/admin/me/avatar - Cập nhật avatar Admin
 */
export const updateAdminAvatar = async (avatarUrl) => {
  const res = await axios.post(`${API_BASE_URL}/avatar`, { avatarUrl }, getAuthHeaders());
  return res.data;
};

/**
 * 4. GET /api/admin/me/stats - Lấy thống kê quản trị
 */
export const fetchAdminStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/stats`, getAuthHeaders());
  return res.data;
};

/**
 * 5. GET /api/admin/me/activity - Lấy lịch sử hoạt động
 */
export const fetchAdminActivity = async (params = { page: 1, limit: 20, filter: "all" }) => {
  const res = await axios.get(`${API_BASE_URL}/activity`, {
    ...getAuthHeaders(),
    params,
  });
  return res.data;
};

/**
 * 6. GET /api/admin/me/permissions - Lấy danh sách quyền hạn
 */
export const fetchAdminPermissions = async () => {
  const res = await axios.get(`${API_BASE_URL}/permissions`, getAuthHeaders());
  return res.data;
};

/**
 * 7. POST /api/admin/me/change-password - Đổi mật khẩu
 */
export const changeAdminPassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  const res = await axios.post(
    `${API_BASE_URL}/change-password`,
    { currentPassword, newPassword, confirmPassword },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * 8. PUT /api/admin/me/settings - Cập nhật cài đặt giao diện / thông báo
 */
export const updateAdminSettings = async (settingsData) => {
  const res = await axios.put(`${API_BASE_URL}/settings`, settingsData, getAuthHeaders());
  return res.data;
};
