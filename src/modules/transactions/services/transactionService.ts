import axiosInstance from '../../../core/api/axiosInstance'
import type { Transfert, PaginatedResponse, ApiResponse } from '../../../types'

export const transactionService = {
  getAll: async (params?: any): Promise<ApiResponse<PaginatedResponse<Transfert>>> => {
    const response = await axiosInstance.get('/transferts', { params })
    return response.data
  },

  getById: async (id: number): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.get(`/transferts/${id}`)
    return response.data
  },

  create: async (data: any): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.post('/transferts', data)
    return response.data
  },

  verifier: async (code: string): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.get(`/transferts/verifier/${code}`)
    return response.data
  },

  valider: async (id: number): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.post(`/transferts/${id}/valider`)
    return response.data
  },

  annuler: async (id: number, motif?: string): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.post(`/transferts/${id}/annuler`, { motif })
    return response.data
  },

  receipt: async (id: number): Promise<ApiResponse<Transfert>> => {
    const response = await axiosInstance.get(`/transferts/${id}/receipt`)
    return response.data
  },

  getSoldeAgence: async (): Promise<ApiResponse<{ solde: number }>> => {
    const response = await axiosInstance.get('/caisses/solde')
    return response.data
  }
}

export default transactionService
