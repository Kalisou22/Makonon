import { axiosInstance } from '../../../core/api/axiosInstance';

export interface Agence {
  id: number;
  code: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  responsable?: string;
  devise: string;
  solde_cache: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgenceData {
  code: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  responsable?: string;
  devise?: string;
  actif?: boolean;
}

export interface AgenceResponse {
  content: Agence[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const agenceService = {
  getAgences: async (page: number = 0, size: number = 20): Promise<AgenceResponse> => {
    const response = await axiosInstance.get<AgenceResponse>('/agences', {
      params: { page, size },
    });
    return response.data;
  },

  getAgence: async (id: number): Promise<Agence> => {
    const response = await axiosInstance.get<Agence>(`/agences/${id}`);
    return response.data;
  },

  createAgence: async (data: CreateAgenceData): Promise<Agence> => {
    const response = await axiosInstance.post<Agence>('/agences', data);
    return response.data;
  },

  updateAgence: async (id: number, data: CreateAgenceData): Promise<Agence> => {
    const response = await axiosInstance.put<Agence>(`/agences/${id}`, data);
    return response.data;
  },

  deleteAgence: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/agences/${id}`);
  },
};
