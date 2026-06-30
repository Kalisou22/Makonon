import { axiosInstance } from '../../../core/api/axiosInstance';

export interface Transaction {
  id: number;
  code: string;
  montant: number;
  statut: string;
  agenceEnvoiId: number;
  agenceReceptionId: number;
  expediteurId: number;
  beneficiaireId: number;
  dateEnvoi: string;
}

export interface CreateTransactionData {
  montant: number;
  expediteurNom: string;
  expediteurContact: string;
  beneficiaireNom: string;
  beneficiaireContact: string;
  agenceReceptionId: number;
  idempotencyKey: string;
}

export const transactionService = {
  getTransactions: async (page: number = 0, size: number = 20): Promise<{
    content: Transaction[];
    totalElements: number;
    totalPages: number;
  }> => {
    const response = await axiosInstance.get('/codes-transfert', {
      params: { page, size },
    });
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await axiosInstance.post('/codes-transfert', data);
    return response.data;
  },

  withdrawTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.put(`/codes-transfert/retirer/${code}`);
    return response.data;
  },

  cancelTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.put(`/codes-transfert/annuler/${code}`);
    return response.data;
  },

  verifyTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.get(`/codes-transfert/chercher/${code}`);
    return response.data;
  },
};
