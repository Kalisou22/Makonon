import api from '../../../core/api/axiosInstance';
import type { TransactionFormData } from '../types';

export const transactionService = {
  getTransactions: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    statut?: string;
  }) => {
    const response = await api.get('/transferts', { params });
    return response.data;
  },

  getTransaction: async (id: number) => {
    const response = await api.get(`/transferts/${id}`);
    return response.data;
  },

  createTransaction: async (data: TransactionFormData) => {
    const response = await api.post('/transferts', data);
    return response.data;
  },

  validerTransaction: async (id: number) => {
    const response = await api.post(`/transferts/${id}/valider`);
    return response.data;
  },

  annulerTransaction: async (id: number, motif?: string) => {
    const response = await api.post(`/transferts/${id}/annuler`, { motif });
    return response.data;
  },

  verifierCode: async (code: string) => {
    const response = await api.get(`/transferts/verifier/${code}`);
    return response.data;
  },

  getReceipt: async (id: number) => {
    const response = await api.get(`/transferts/${id}/receipt`);
    return response.data;
  }
};
