import { axiosInstance } from '../../../core/api/axiosInstance'
import type {
  Transaction,
  CreateTransactionData,
  TransactionFilters,
  SoldeAgenceResponse,
} from '../types'

export const transactionService = {
  // Liste des transactions (paginée)
  getTransactions: (params?: TransactionFilters) =>
    axiosInstance.get<{
      data: Transaction[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>('/transferts', { params }),

  // Créer un transfert
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

  // Retirer un transfert
  withdrawTransaction: (code: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/retirer/${code}`),

  // Annuler un transfert
  cancelTransaction: (code: string, motif?: string) =>
    axiosInstance.put<{ message: string; data: Transaction }>(`/transferts/annuler/${code}`, { motif }),

  // Vérifier un transfert
  verifyTransaction: (code: string) =>
    axiosInstance.get<{ data: Transaction }>(`/transferts/verifier/${code}`),

  // Récupérer le solde de l'agence
  getSoldeAgence: () =>
    axiosInstance.get<SoldeAgenceResponse>('/transferts/solde-agence'),
}

export default transactionService
