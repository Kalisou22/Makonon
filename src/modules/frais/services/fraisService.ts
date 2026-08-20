import api from '../../../core/api/axiosInstance';

export const fraisService = {
  getFrais: async () => {
    const response = await api.get('/frais');
    return response.data;
  },

  getFraisConfiguration: async (id: number) => {
    const response = await api.get(`/frais/configurations/${id}`);
    return response.data;
  },

  getConfigurationActuelle: async () => {
    const response = await api.get('/frais/configuration-actuelle');
    return response.data;
  },

  calculerFrais: async (montant: number) => {
    const response = await api.post('/frais/calculer', { montant });
    return response.data;
  },

  createFrais: async (data: any) => {
    const response = await api.post('/frais/configurations', data);
    return response.data;
  },

  updateFrais: async (id: number, data: any) => {
    const response = await api.put(`/frais/configurations/${id}`, data);
    return response.data;
  },

  deleteFrais: async (id: number) => {
    const response = await api.delete(`/frais/configurations/${id}`);
    return response.data;
  },

  toggleFrais: async (id: number, actif: boolean) => {
    const endpoint = actif ? 'activer' : 'desactiver';
    const response = await api.put(`/frais/configurations/${id}/${endpoint}`);
    return response.data;
  },

  getHistorique: async () => {
    const response = await api.get('/frais/historique');
    return response.data;
  }
};

export default fraisService;
