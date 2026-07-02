import { axiosInstance } from '../../../core/api/axiosInstance';

export const auditService = {
  getLogs: (page, size, search) => {
    const params = { page, size };
    if (search) params.search = search;
    return axiosInstance.get('/journal', { params });
  },
  getLogsByUtilisateur: (userId, page, size) => axiosInstance.get(`/journal/utilisateur/${userId}`, { params: { page, size } }),
  searchLogs: (keyword, page, size) => axiosInstance.get('/journal/search', { params: { motCle: keyword, page, size } }),
  deleteLog: (id) => axiosInstance.delete(`/journal/${id}`),
};
