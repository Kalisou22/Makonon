import { axiosInstance } from '../../../core/api/axiosInstance'
import type { Utilisateur, CreateUtilisateurData, UtilisateurFilters } from '../types'

export const utilisateurService = {
  // Liste des utilisateurs (paginée)
  getUtilisateurs: (params?: UtilisateurFilters) =>
    axiosInstance.get<{
      data: Utilisateur[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>('/utilisateurs', { params }),

  // Récupérer un utilisateur par ID
  getUtilisateurById: (id: number) =>
    axiosInstance.get<{ data: Utilisateur }>(`/utilisateurs/${id}`),

  // Créer un utilisateur
  createUtilisateur: (data: CreateUtilisateurData) =>
    axiosInstance.post<{ message: string; data: Utilisateur }>('/utilisateurs', {
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: data.role,
      agence_id: data.agence_id || null,
      actif: data.actif ?? true
    }),

  // Modifier un utilisateur
  updateUtilisateur: (id: number, data: Partial<CreateUtilisateurData>) =>
    axiosInstance.put<{ message: string; data: Utilisateur }>(`/utilisateurs/${id}`, {
      nom: data.nom,
      email: data.email,
      password: data.password || undefined,
      role: data.role,
      agence_id: data.agence_id || null,
      actif: data.actif ?? true
    }),

  // Supprimer un utilisateur
  deleteUtilisateur: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/utilisateurs/${id}`),
}

export default utilisateurService
