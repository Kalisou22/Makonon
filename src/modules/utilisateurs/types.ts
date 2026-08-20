export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'RESPONSABLE' | 'AGENT';
  agence_id: number | null;
  agence?: {
    id: number;
    nom: string;
    code: string;
  } | null;
  telephone: string | null;
  actif: boolean;
  daily_limit: number | null;
  created_at: string;
  updated_at: string;
}

export interface UtilisateurFormData {
  nom: string;
  email: string;
  password?: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'RESPONSABLE' | 'AGENT';
  agence_id: number | null;
  telephone?: string | null;
  actif?: boolean;
  daily_limit?: number | null;
}

export interface UtilisateurResponse {
  success: boolean;
  message?: string;
  data: Utilisateur;
}

export interface UtilisateurListResponse {
  success: boolean;
  data: Utilisateur[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
