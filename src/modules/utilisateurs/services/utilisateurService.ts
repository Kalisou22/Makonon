import api from '../../../core/api/axiosInstance';
import type { UtilisateurFormData } from '../types';

export const utilisateurService = {
  getUtilisateurs: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
    agence_id?: number;
    actif?: boolean;
  }) => {
    const response = await api.get('/utilisateurs', { params });
    return response.data;
  },

  getUtilisateur: async (id: number) => {
    const response = await api.get(`/utilisateurs/${id}`);
    return response.data;
  },

  createUtilisateur: async (data: UtilisateurFormData) => {
    const response = await api.post('/utilisateurs', data);
    return response.data;
  },

  updateUtilisateur: async (id: number, data: Partial<UtilisateurFormData>) => {
    const response = await api.put(`/utilisateurs/${id}`, data);
    return response.data;
  },

  deleteUtilisateur: async (id: number) => {
    const response = await api.delete(`/utilisateurs/${id}`);
    return response.data;
  },

  toggleActif: async (id: number) => {
    const response = await api.post(`/utilisateurs/${id}/toggle-actif`);
    return response.data;
  }
};

export default utilisateurService;
