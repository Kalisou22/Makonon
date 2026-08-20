import axiosInstance from '../../../core/api/axiosInstance'

export const utilisateurService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get('/utilisateurs', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/utilisateurs/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/utilisateurs', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/utilisateurs/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/utilisateurs/${id}`)
    return response.data
  }
}

export default utilisateurService
