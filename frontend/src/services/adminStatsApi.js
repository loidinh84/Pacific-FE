import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/stats`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy dữ liệu tổng quan (User, Content, Comments, Activities)
 */
export const fetchAdminOverviewStats = async () => {
  const res = await axios.get(`${API_BASE}/overview`, getAuthHeaders());
  return res.data;
};

/**
 * Lấy dữ liệu biểu đồ 7 ngày / 30 ngày (lượt xem, user mới)
 */
export const fetchAdminChartStats = async (days = 7) => {
  const res = await axios.get(`${API_BASE}/charts`, {
    params: { days },
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * Lấy bảng xếp hạng (Top species, phân bố tầng, top user)
 */
export const fetchAdminRankingsStats = async () => {
  const res = await axios.get(`${API_BASE}/rankings`, getAuthHeaders());
  return res.data;
};

/**
 * Lấy toàn bộ dữ liệu dashboard trong 1 request
 */
export const fetchAdminFullDashboard = async (days = 7) => {
  const res = await axios.get(`${API_BASE}/full`, {
    params: { days },
    ...getAuthHeaders(),
  });
  return res.data;
};
