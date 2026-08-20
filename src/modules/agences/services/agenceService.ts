import axiosInstance from '../../../core/api/axiosInstance'

export const agenceService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get('/agences', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/agences/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/agences', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/agences/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/agences/${id}`)
    return response.data
  },
  getSolde: async (agenceId: number) => {
    const response = await axiosInstance.get(`/agences/soldes/${agenceId}`)
    return response.data
  }
}

export default agenceService
