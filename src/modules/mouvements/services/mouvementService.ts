import { axiosInstance } from '../../../core/api/axiosInstance'

export interface MouvementCaisse {
  id: number
  caisse_id: number
  agence_id: number
  agence_nom: string
  type: 'ENTREE' | 'SORTIE'
  motif: string
  montant: number
  reference?: string
  utilisateur_id: number
  utilisateur_nom: string
  date_mouvement: string
  created_at: string
}

export interface CreateMouvementData {
  type: 'ENTREE' | 'SORTIE'
  motif: string
  montant: number
  agence_id: number
  reference?: string
}

export interface MouvementFilters {
  page?: number
  per_page?: number
  type?: 'ENTREE' | 'SORTIE'
  motif?: string
}

export const mouvementService = {
  // Liste des mouvements (paginée)
  getMouvements: (params?: MouvementFilters) =>
    axiosInstance.get<{
      data: MouvementCaisse[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>('/mouvements-caisse', { params }),

  // Créer un mouvement
  createMouvement: (data: CreateMouvementData) =>
    axiosInstance.post<{ message: string; data: MouvementCaisse }>('/mouvements-caisse', data),

  // Supprimer un mouvement
  deleteMouvement: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/mouvements-caisse/${id}`),

  // Récupérer le solde
  getSolde: (agenceId?: number) =>
    axiosInstance.get<{ solde_physique: number; solde_comptable: number; ecart: number }>(
      '/mouvements-caisse/solde',
      { params: { agence_id: agenceId } }
    ),
}

export default mouvementService
