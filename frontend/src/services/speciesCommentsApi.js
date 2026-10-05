import axios from "axios";
import { getStoredToken } from "../utils/auth";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/species`;

const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  };
};

/**
 * Lấy danh sách bình luận công khai của loài sinh vật
 */
export const fetchSpeciesComments = async (idOrSlug) => {
  const res = await axios.get(`${API_BASE}/${encodeURIComponent(idOrSlug)}/comments`);
  return res.data;
};

/**
 * Gửi bình luận mới cho loài sinh vật (cần đăng nhập)
 */
export const postSpeciesComment = async (idOrSlug, content) => {
  const res = await axios.post(
    `${API_BASE}/${encodeURIComponent(idOrSlug)}/comments`,
    { content },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * Xóa bình luận (chính chủ hoặc admin)
 */
export const deleteSpeciesComment = async (commentId) => {
  const res = await axios.delete(
    `${API_BASE}/comments/${commentId}`,
    getAuthHeaders()
  );
  return res.data;
};
