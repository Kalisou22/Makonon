export interface Client {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  piece_identite: string;
  numero_piece: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  nom: string;
  telephone: string;
  email: string;
  piece_identite: string;
  numero_piece: string;
}

export interface ClientFilters {
  page?: number;
  per_page?: number;
  search?: string;
  telephone?: string;
}
