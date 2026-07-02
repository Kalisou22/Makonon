export interface Agence {
  id: number;
  code: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  responsable: string;
  devise: string;
  solde_cache: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgenceData {
  code: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  responsable: string;
  devise: string;
  actif?: boolean;
}

export interface AgenceFilters {
  page?: number;
  per_page?: number;
  search?: string;
  actif?: boolean;
}
