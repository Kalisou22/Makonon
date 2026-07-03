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
    axiosInstance.post<{ message: string; data: Transaction }>('/transferts', {
      nom_expediteur: data.nom_expediteur,
      telephone_expediteur: data.telephone_expediteur,
      nom_beneficiaire: data.nom_beneficiaire,
      telephone_beneficiaire: data.telephone_beneficiaire,
      montant: data.montant,
      agence_envoi_id: data.agence_envoi_id,
      agence_destinataire_id: data.agence_destinataire_id,
      idempotency_key: data.idempotency_key,
    }),

  withdrawTransaction: (code: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/retirer/${code}`),

  cancelTransaction: (code: string, motif?: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/annuler/${code}`, { motif }),

  verifyTransaction: (code: string) =>
    axiosInstance.get<{ data: Transaction }>(`/transferts/verifier/${code}`),

  getSoldeAgence: () =>
    axiosInstance.get<SoldeAgenceResponse>('/transferts/solde-agence'),
};
