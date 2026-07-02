import { axiosInstance } from '../../../core/api/axiosInstance';

export const clientService = {
  getClients: (page, size) => axiosInstance.get('/clients', { params: { page, size } }),
  getClient: (id) => axiosInstance.get(`/clients/${id}`),
  getClientByTelephone: (telephone) => axiosInstance.get(`/clients/telephone/${encodeURIComponent(telephone)}`),
  createClient: (data) => axiosInstance.post('/clients', data),
  updateClient: (id, data) => axiosInstance.put(`/clients/${id}`, data),
  deleteClient: (id) => axiosInstance.delete(`/clients/${id}`),
};
