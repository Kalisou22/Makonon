import { axiosInstance } from '../../../core/api/axiosInstance';

export const agenceService = {
  getAgences: (page, size) => axiosInstance.get('/agences', { params: { page, size } }),
  getAgence: (id) => axiosInstance.get(`/agences/${id}`),
  createAgence: (data) => axiosInstance.post('/agences', data),
  updateAgence: (id, data) => axiosInstance.put(`/agences/${id}`, data),
  deleteAgence: (id) => axiosInstance.delete(`/agences/${id}`),
};
