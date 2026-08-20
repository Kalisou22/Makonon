export interface Agence {
  id: number;
  code: string;
  nom: string;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  responsable: string | null;
  devise: string;
  solde_cache: number;
  actif: boolean;
  ville: string | null;
  solde_physique?: number;
  solde_comptable?: number;
  caisse?: {
    id: number;
    agence_id: number;
    solde_physique: number;
    solde_comptable: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AgenceResponse {
  success: boolean;
  data: Agence[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export interface AgenceSoldeResponse {
  success: boolean;
  data: {
    agence_id: number;
    agence_nom: string;
    solde_physique: number;
    solde_comptable: number;
  };
}

export interface Approvisionnement {
  id: number;
  agence_id: number;
  caisse_id: number;
  montant: number;
  reference: string;
  motif: string;
  observation: string | null;
  utilisateur_id: number;
  statut: 'VALIDE' | 'ANNULE';
  date_approvisionnement: string;
  created_at: string;
  updated_at: string;
  agence?: Agence;
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
}

export interface ApprovisionnementResponse {
  success: boolean;
  data: Approvisionnement[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
