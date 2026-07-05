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
