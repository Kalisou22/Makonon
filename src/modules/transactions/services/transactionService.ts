import { axiosInstance } from '../../../core/api/axiosInstance';

export interface Transaction {
  id: number;
  code: string;
  montant: number;
  frais: number;
  statut: string;
  agenceEnvoiId: number;
  agenceReceptionId: number;
  expediteurId: number;
  beneficiaireId: number;
  dateEnvoi: string;
  dateRetrait?: string;
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

export interface TransactionResponse {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const transactionService = {
  getTransactions: async (page: number = 0, size: number = 20): Promise<TransactionResponse> => {
    const response = await axiosInstance.get<TransactionResponse>('/codes-transfert', {
      params: { page, size },
    });
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await axiosInstance.post<Transaction>('/codes-transfert', data);
    return response.data;
  },

  withdrawTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.put<Transaction>(`/codes-transfert/retirer/${code}`);
    return response.data;
  },

  cancelTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.put<Transaction>(`/codes-transfert/annuler/${code}`);
    return response.data;
  },

  verifyTransaction: async (code: string): Promise<Transaction> => {
    const response = await axiosInstance.get<Transaction>(`/codes-transfert/chercher/${code}`);
    return response.data;
  },
};
