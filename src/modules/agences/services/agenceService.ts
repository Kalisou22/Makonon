import { axiosInstance } from '../../../core/api/axiosInstance'
import type { Agence, CreateAgenceData, AgenceFilters } from '../types'

export const agenceService = {
  // Liste des agences (paginée)
  getAgences: (params?: AgenceFilters) =>
    axiosInstance.get<{
      data: Agence[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>('/agences', { params }),

  // Récupérer une agence par ID
  getAgenceById: (id: number) =>
    axiosInstance.get<{ data: Agence }>(`/agences/${id}`),

  // Créer une agence
  createAgence: (data: CreateAgenceData) =>
    axiosInstance.post<{ message: string; data: Agence }>('/agences', {
      code: data.code,
      nom: data.nom,
      adresse: data.adresse || null,
      telephone: data.telephone || null,
      email: data.email || null,
      responsable: data.responsable || null,
      devise: data.devise || 'GNF',
      actif: data.actif ?? true
    }),

  // Modifier une agence
  updateAgence: (id: number, data: Partial<CreateAgenceData>) =>
    axiosInstance.put<{ message: string; data: Agence }>(`/agences/${id}`, {
      code: data.code,
      nom: data.nom,
      adresse: data.adresse || null,
      telephone: data.telephone || null,
      email: data.email || null,
      responsable: data.responsable || null,
      devise: data.devise || 'GNF',
      actif: data.actif ?? true
    }),

  // Supprimer une agence
  deleteAgence: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/agences/${id}`),
}

export default agenceService
