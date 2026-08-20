import api from '../../../core/api/axiosInstance';

export const agenceService = {
  getAgences: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    actif?: boolean;
  }) => {
    const response = await api.get('/agences', { params });
    return response.data;
  },

  getAgence: async (id: number) => {
    const response = await api.get(`/agences/${id}`);
    return response.data;
  },

  createAgence: async (data: any) => {
    const response = await api.post('/agences', data);
    return response.data;
  },

  updateAgence: async (id: number, data: any) => {
    const response = await api.put(`/agences/${id}`, data);
    return response.data;
  },

  deleteAgence: async (id: number) => {
    const response = await api.delete(`/agences/${id}`);
    return response.data;
  },

  getSolde: async (id: number) => {
    const response = await api.get(`/agences/soldes/${id}`);
    return response.data;
  },
};

export default agenceService;
