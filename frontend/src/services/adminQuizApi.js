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
 * Lấy danh sách câu hỏi trắc nghiệm kèm bộ lọc, tìm kiếm, phân trang
 */
export const fetchAdminQuizList = async (params = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/quiz`, {
      params,
      ...getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tải danh sách câu hỏi trắc nghiệm:", error);
    throw error;
  }
};

/**
 * Thêm câu hỏi mới
 */
export const createAdminQuizQuestion = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/admin/quiz`, data, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo câu hỏi trắc nghiệm:", error);
    throw error;
  }
};

/**
 * Cập nhật câu hỏi
 */
export const updateAdminQuizQuestion = async (id, data) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/admin/quiz/${id}`, data, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật câu hỏi trắc nghiệm:", error);
    throw error;
  }
};

/**
 * Xóa câu hỏi
 */
export const deleteAdminQuizQuestion = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/admin/quiz/${id}`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi trắc nghiệm:", error);
    throw error;
  }
};

/**
 * Bật/tắt trạng thái kích hoạt câu hỏi
 */
export const toggleAdminQuizQuestion = async (id) => {
  try {
    const res = await axios.patch(`${API_BASE_URL}/admin/quiz/${id}/toggle`, {}, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đổi trạng thái câu hỏi:", error);
    throw error;
  }
};
