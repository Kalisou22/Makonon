export interface Client {
  id: number;
  nom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  plafondTransaction?: number;
  dateCreation: string;
  lastUpdate?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  nom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  plafondTransaction?: number;
}

export interface ClientResponse {
  content: Client[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
