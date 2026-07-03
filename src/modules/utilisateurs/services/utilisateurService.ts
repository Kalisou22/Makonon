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
    axiosInstance.post<{ message: string; data: Utilisateur }>('/utilisateurs', {
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: data.role,
      agence_id: data.agence_id,
      actif: data.actif ?? true
    }),

  updateUtilisateur: (id: number, data: Partial<CreateUtilisateurData>) =>
    axiosInstance.put<{ message: string; data: Utilisateur }>(`/utilisateurs/${id}`, {
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: data.role,
      agence_id: data.agence_id,
      actif: data.actif
    }),

  deleteUtilisateur: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/utilisateurs/${id}`),
};
