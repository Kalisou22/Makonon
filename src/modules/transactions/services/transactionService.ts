import { axiosInstance } from '../../../core/api/axiosInstance';
import type {
  Transaction,
  CreateTransactionData,
  TransactionFilters,
  SoldeAgenceResponse,
} from '../types';

export const transactionService = {
  getTransactions: (params?: TransactionFilters) =>
    axiosInstance.get<{
      data: Transaction[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/transferts', { params }),

  createTransaction: (data: CreateTransactionData) =>
    axiosInstance.post<{ message: string; data: Transaction }>('/transferts', data),

  withdrawTransaction: (code: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/retirer/${code}`),

  cancelTransaction: (code: string, motif?: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/annuler/${code}`, { motif }),

  verifyTransaction: (code: string) =>
    axiosInstance.get<{ data: Transaction }>(`/transferts/verifier/${code}`),

  getSoldeAgence: () =>
    axiosInstance.get<SoldeAgenceResponse>('/transferts/solde-agence'),
};
