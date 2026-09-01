import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/admin/species-groups";
const SPECIES_BASE_URL = "http://localhost:3000/api/admin/species";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("pacific_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("pacific_token") ||
    sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/**
 * 1. Lấy danh sách tất cả các nhóm sinh vật (kèm số lượng sinh vật)
 */
export const fetchAdminSpeciesGroups = async (params = {}) => {
  const res = await axios.get(API_BASE_URL, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * 2. Tạo nhóm sinh vật mới
 */
export const createAdminSpeciesGroup = async (groupData) => {
  const res = await axios.post(API_BASE_URL, groupData, getAuthHeaders());
  return res.data;
};

/**
 * 3. Cập nhật nhóm sinh vật
 */
export const updateAdminSpeciesGroup = async (id, groupData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, groupData, getAuthHeaders());
  return res.data;
};

/**
 * 4. Xóa nhóm sinh vật (Tự động gỡ liên kết sinh vật)
 */
export const deleteAdminSpeciesGroup = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * 5. Gán hàng loạt sinh vật vào nhóm
 */
export const assignSpeciesToGroup = async (groupId, speciesIds) => {
  const res = await axios.post(
    `${API_BASE_URL}/${groupId}/species`,
    { speciesIds },
    getAuthHeaders()
  );
  return res.data;
};

/**
 * 6. Gỡ sinh vật khỏi nhóm
 */
export const removeSpeciesFromGroup = async (groupId, speciesId) => {
  const res = await axios.delete(
    `${API_BASE_URL}/${groupId}/species/${speciesId}`,
    getAuthHeaders()
  );
  return res.data;
};

/**
 * 7. Lấy danh sách sinh vật thuộc 1 nhóm
 */
export const fetchGroupSpecies = async (groupId, params = { page: 1, limit: 12 }) => {
  const res = await axios.get(`${API_BASE_URL}/${groupId}/species`, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};

/**
 * 8. Lấy tất cả sinh vật trong hệ thống (dùng cho modal Gán sinh vật)
 */
export const fetchAllSpeciesForAssign = async (params = { page: 1, limit: 100 }) => {
  const res = await axios.get(SPECIES_BASE_URL, {
    params,
    ...getAuthHeaders(),
  });
  return res.data;
};
