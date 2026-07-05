import { axiosInstance } from '../../../core/api/axiosInstance'
import type { Utilisateur, CreateUtilisateurData, UtilisateurFilters } from '../types'

export const utilisateurService = {
  getUtilisateurs: (params?: UtilisateurFilters) =>
    axiosInstance.get<{
      data: Utilisateur[]
      current_page: number
      last_page: number
      per_page: number
      total: number
    }>('/utilisateurs', { params }),

  getUtilisateurById: (id: number) =>
    axiosInstance.get<{ data: Utilisateur }>(`/utilisateurs/${id}`),

  createUtilisateur: (data: CreateUtilisateurData) => {
    // Nettoyer les données avant envoi
    const payload: any = {
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: data.role,
      actif: data.actif ?? true,
    }

    // SUPERADMIN n'a pas d'agence
    if (data.role !== 'SUPERADMIN' && data.agence_id) {
      payload.agence_id = data.agence_id
    } else {
      payload.agence_id = null
    }

    console.log('📤 Payload création utilisateur:', payload)
    return axiosInstance.post<{ message: string; data: Utilisateur }>('/utilisateurs', payload)
  },

  updateUtilisateur: (id: number, data: Partial<CreateUtilisateurData>) => {
    const payload: any = {
      nom: data.nom,
      email: data.email,
      role: data.role,
      actif: data.actif ?? true,
    }

    if (data.password) {
      payload.password = data.password
    }

    if (data.role !== 'SUPERADMIN' && data.agence_id) {
      payload.agence_id = data.agence_id
    } else {
      payload.agence_id = null
    }

    console.log('📤 Payload modification utilisateur:', payload)
    return axiosInstance.put<{ message: string; data: Utilisateur }>(`/utilisateurs/${id}`, payload)
  },

  deleteUtilisateur: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/utilisateurs/${id}`),
}

export default utilisateurService
