import { axiosInstance } from '../../../core/api/axiosInstance';

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

export const clientService = {
  getClients: async (page: number = 0, size: number = 20): Promise<ClientResponse> => {
    const response = await axiosInstance.get<ClientResponse>('/clients', {
      params: { page, size },
    });
    return response.data;
  },

  getClient: async (id: number): Promise<Client> => {
    const response = await axiosInstance.get<Client>(`/clients/${id}`);
    return response.data;
  },

  getClientByTelephone: async (telephone: string): Promise<Client> => {
    const response = await axiosInstance.get<Client>(`/clients/telephone/${encodeURIComponent(telephone)}`);
    return response.data;
  },

  createClient: async (data: CreateClientData): Promise<Client> => {
    const response = await axiosInstance.post<Client>('/clients', data);
    return response.data;
  },

  updateClient: async (id: number, data: CreateClientData): Promise<Client> => {
    const response = await axiosInstance.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/clients/${id}`);
  },
};
