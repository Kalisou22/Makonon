import { axiosInstance } from '../../../core/api/axiosInstance';
import type { Utilisateur, CreateUtilisateurData, UtilisateurFilters } from '../types';

export const utilisateurService = {
  getUtilisateurs: (params?: UtilisateurFilters) =>
    axiosInstance.get<{
      data: Utilisateur[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/utilisateurs', { params }),

  getUtilisateurById: (id: number) =>
    axiosInstance.get<{ data: Utilisateur }>(`/utilisateurs/${id}`),

  createUtilisateur: (data: CreateUtilisateurData) =>
    axiosInstance.post<{ message: string; data: Utilisateur }>('/utilisateurs', data),

  updateUtilisateur: (id: number, data: Partial<CreateUtilisateurData>) =>
    axiosInstance.put<{ message: string; data: Utilisateur }>(`/utilisateurs/${id}`, data),

  deleteUtilisateur: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/utilisateurs/${id}`),
};
