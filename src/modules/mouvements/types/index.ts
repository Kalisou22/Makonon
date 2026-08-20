export interface MouvementCaisse {
  id: number;
  caisse_id: number;
  type: 'ENTREE' | 'SORTIE';
  motif: string;
  montant: number;
  reference: string | null;
  utilisateur_id: number;
  transfert_id: number | null;
  created_at: string;
  updated_at: string;
  caisse?: {
    id: number;
    agence_id: number;
    solde_physique: number;
    solde_comptable: number;
  };
  utilisateur?: {
    id: number;
    nom: string;
    email: string;
  };
  transfert?: {
    id: number;
    code: string;
    montant: number;
  };
  utilisateur_nom?: string;
  agence_nom?: string;
  agence_id?: number;
  date_mouvement?: string;
}

export interface MouvementResponse {
  success: boolean;
  data: MouvementCaisse[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface MouvementCreateData {
  type: 'ENTREE' | 'SORTIE';
  motif: string;
  montant: number;
  agence_id: number;
  reference?: string;
}

export const MOTIFS = {
  ENVOI: 'ENVOI',
  RETRAIT: 'RETRAIT',
  APPROVISIONNEMENT: 'APPROVISIONNEMENT',
  ANNULATION: 'ANNULATION',
  DEPOT: 'DEPOT',
  AJUSTEMENT: 'AJUSTEMENT',
} as const;

export const MOTIF_LABELS: Record<string, string> = {
  ENVOI: 'Envoi',
  RETRAIT: 'Retrait',
  APPROVISIONNEMENT: 'Approvisionnement',
  ANNULATION: 'Annulation',
  DEPOT: 'Dépôt',
  AJUSTEMENT: 'Ajustement',
};
