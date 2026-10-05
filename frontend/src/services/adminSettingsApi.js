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
 * Lấy cấu hình hệ thống
 */
export const fetchAdminSettings = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/settings`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải cấu hình hệ thống:", error);
    throw error;
  }
};

/**
 * Cập nhật cấu hình hệ thống
 */
export const updateAdminSettings = async (settingsData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/admin/settings`, settingsData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lưu cấu hình hệ thống:", error);
    throw error;
  }
};
