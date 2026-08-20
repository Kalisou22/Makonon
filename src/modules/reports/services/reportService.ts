import api from '../../../core/api/axiosInstance';

export const reportService = {
  getTransfers: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/transfers', { params });
    return response.data;
  },

  getFees: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/fees', { params });
    return response.data;
  },

  getCash: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/cash', { params });
    return response.data;
  },

  getLedger: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/ledger', { params });
    return response.data;
  },

  getAudit: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/audit', { params });
    return response.data;
  },

  getClients: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/clients', { params });
    return response.data;
  },

  getAgencies: async (params?: Record<string, any>) => {
    const response = await api.get('/reports/agencies', { params });
    return response.data;
  }
};

export default reportService;
