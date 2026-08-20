import axiosInstance from '../../../core/api/axiosInstance'

export const clientService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get('/clients', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/clients/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/clients', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/clients/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/clients/${id}`)
    return response.data
  },
  byTelephone: async (telephone: string) => {
    const response = await axiosInstance.get(`/clients/by-telephone/${telephone}`)
    return response.data
  }
}

export default clientService
