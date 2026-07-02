export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
  telephone?: string;
  agenceId?: number;
  agence?: {
    id: number;
    nom: string;
  };
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUtilisateurData {
  nom: string;
  email: string;
  motDePasse?: string;
  role: string;
  agenceId?: number;
  actif?: boolean;
}

export interface UtilisateurResponse {
  content: Utilisateur[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
