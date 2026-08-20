export interface FraisConfiguration {
  id: number
  nom: string
  description?: string
  type: 'FIXE' | 'POURCENTAGE' | 'ECHELONNE'
  valeur: number
  seuil_min?: number
  seuil_max?: number
  actif: boolean
  date_debut: string
  date_fin?: string
  created_by?: number
  created_at?: string
  updated_at?: string
}

export interface FraisHistorique {
  id: number
  frais_configuration_id?: number
  transfert_id?: number
  montant_initial: number
  montant_frais: number
  type_frais: string
  date_application: string
  created_at?: string
  updated_at?: string
}

export interface FraisCalcul {
  frais: number
  commission: number
  taux: number
  config_utilisee?: {
    id: number
    nom: string
    type: string
  }
}
