import api from '../../../core/api/axiosInstance';

export const mouvementService = {
  getMouvements: async (params?: {
    page?: number;
    per_page?: number;
    type?: string;
    motif?: string;
    search?: string;
  }) => {
    const response = await api.get('/mouvements-caisse', { params });
    return response.data;
  },

  getMouvement: async (id: number) => {
    const response = await api.get(`/mouvements-caisse/${id}`);
    return response.data;
  },

  createMouvement: async (data: {
    type: 'ENTREE' | 'SORTIE';
    motif: string;
    montant: number;
    agence_id: number;
    reference?: string;
  }) => {
    const response = await api.post('/mouvements-caisse', data);
    return response.data;
  },

  getByAgence: async (agenceId: number, params?: any) => {
    const response = await api.get(`/agences/${agenceId}/mouvements-caisse`, { params });
    return response.data;
  }
};

export default mouvementService;
