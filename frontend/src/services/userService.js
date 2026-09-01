import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("pacific_token") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/**
 * Lấy thông tin cá nhân đầy đủ (Private Profile)
 */
export const fetchMyProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}/me`, getAuthHeaders());
  return res.data;
};

/**
 * Cập nhật thông tin cơ bản (fullName, bio, phoneNumber, dateOfBirth)
 */
export const updateMyProfile = async (userData) => {
  const res = await axios.put(`${API_BASE_URL}/me`, userData, getAuthHeaders());
  return res.data;
};

/**
 * Thay đổi email (yêu cầu mật khẩu hiện tại)
 */
export const changeEmail = async ({ newEmail, currentPassword }) => {
  const res = await axios.put(
    `${API_BASE_URL}/me/email`,
    { newEmail, currentPassword },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Thay đổi mật khẩu
 */
export const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
  const res = await axios.put(
    `${API_BASE_URL}/me/password`,
    { oldPassword, newPassword, confirmPassword },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Cập nhật avatar
 */
export const updateAvatar = async (avatarUrl) => {
  const res = await axios.post(
    `${API_BASE_URL}/me/avatar`,
    { avatarUrl },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Lấy số liệu thống kê (Favorites, Explored, Discovered, Member Days)
 */
export const fetchMyStats = async () => {
  const res = await axios.get(`${API_BASE_URL}/me/stats`, getAuthHeaders());
  return res.data;
};

/**
 * Lấy danh sách sinh vật yêu thích của người dùng
 */
export const fetchMyFavorites = async (params = { page: 1, limit: 12 }) => {
  const res = await axios.get(`${API_BASE_URL}/me/favorites`, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * Lấy danh sách địa điểm đã khám phá của người dùng
 */
export const fetchMyExplored = async (params = { page: 1, limit: 12 }) => {
  const res = await axios.get(`${API_BASE_URL}/me/explored`, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};

