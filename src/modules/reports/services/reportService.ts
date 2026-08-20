import api from '../../../core/api/axiosInstance';

export const reportService = {
  getTransfers: async (params?: {
    date_debut?: string;
    date_fin?: string;
    statut?: string;
    agence_envoi_id?: number;
    agence_retrait_id?: number;
    search?: string;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get('/reports/transfers', { params });
    return response.data;
  },

  getFees: async (params?: {
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await api.get('/reports/fees', { params });
    return response.data;
  },

  getCash: async (params?: {
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await api.get('/reports/cash', { params });
    return response.data;
  },

  getLedger: async (params?: {
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await api.get('/reports/ledger', { params });
    return response.data;
  },

  getAudit: async (params?: {
    date_debut?: string;
    date_fin?: string;
  }) => {
    const response = await api.get('/reports/audit', { params });
    return response.data;
  },

  getClients: async (params?: {
    search?: string;
  }) => {
    const response = await api.get('/reports/clients', { params });
    return response.data;
  },

  getAgencies: async () => {
    const response = await api.get('/reports/agencies');
    return response.data;
  }
};

export default reportService;
