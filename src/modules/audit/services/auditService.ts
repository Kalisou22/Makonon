import api from '../../../core/api/axiosInstance';

export const auditService = {
  getAuditLogs: async (params?: {
    page?: number;
    per_page?: number;
    date_debut?: string;
    date_fin?: string;
    action?: string;
    entite?: string;
    search?: string;
  }) => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },

  getAuditLog: async (id: number) => {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  },

  getActions: async () => {
    const response = await api.get('/audit-actions');
    return response.data;
  },

  getEntities: async () => {
    const response = await api.get('/audit-entities');
    return response.data;
  }
};

export default auditService;
