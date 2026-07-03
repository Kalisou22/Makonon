export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  agence_id: number;
  actif: boolean;
  agence?: {
    id: number;
    nom: string;
    code: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateUtilisateurData {
  nom: string;
  email: string;
  password: string;
  role: string;
  agence_id: number;
  actif?: boolean;
}

export interface UtilisateurFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  agence_id?: number;
}
