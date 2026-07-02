import { axiosInstance } from '../../../core/api/axiosInstance';

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

export const utilisateurService = {
  getUtilisateurs: async (page: number = 0, size: number = 20, search?: string, role?: string): Promise<UtilisateurResponse> => {
    const params: any = { page, size };
    if (search) params.search = search;
    if (role && role !== 'Tous') params.role = role;
    
    const response = await axiosInstance.get<UtilisateurResponse>('/utilisateurs/paginated', { params });
    return response.data;
  },

  getUtilisateur: async (id: number): Promise<Utilisateur> => {
    const response = await axiosInstance.get<Utilisateur>(`/utilisateurs/${id}`);
    return response.data;
  },

  createUtilisateur: async (data: CreateUtilisateurData): Promise<Utilisateur> => {
    const response = await axiosInstance.post<Utilisateur>('/utilisateurs', data);
    return response.data;
  },

  updateUtilisateur: async (id: number, data: CreateUtilisateurData): Promise<Utilisateur> => {
    const response = await axiosInstance.put<Utilisateur>(`/utilisateurs/${id}`, data);
    return response.data;
  },

  deleteUtilisateur: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/utilisateurs/${id}`);
  },
};
