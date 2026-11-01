import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Lấy danh sách bài viết tin tức có phân trang và bộ lọc
 * @param {object} params { page, limit, category, search, sort, lang, source_type }
 */
export const fetchNews = async (params = {}) => {
  const res = await axios.get(`${API_ROOT}/news`, { params });
  return {
    articles: res.data.data || [],
    pagination: res.data.pagination || {
      page: 1,
      limit: params.limit || 6,
      total: 0,
      totalPages: 1,
    },
  };
};

/**
 * Lấy danh sách bài viết nổi bật
 * @param {number} limit Số lượng bài viết nổi bật (mặc định 4)
 */
export const fetchFeaturedNews = async (limit = 4) => {
  const res = await axios.get(`${API_ROOT}/news/featured`, {
    params: { limit },
  });
  return res.data.data || [];
};

/**
 * Lấy danh sách chuyên mục tin tức kèm số lượng bài viết
 */
export const fetchNewsCategories = async () => {
  const res = await axios.get(`${API_ROOT}/news/categories`);
  return res.data.data || [];
};

/**
 * Lấy chi tiết bài viết theo slug (kèm bài viết liên quan)
 * @param {string} slug Slug hoặc ID bài viết
 */
export const fetchNewsDetail = async (slug) => {
  const res = await axios.get(`${API_ROOT}/news/${encodeURIComponent(slug)}`);
  return res.data.data;
};
