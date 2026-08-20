import axiosInstance from '../../../core/api/axiosInstance'

export const auditService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get('/audit-logs', { params })
    return response.data
  },
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/audit-logs/${id}`)
    return response.data
  },
  getActions: async () => {
    const response = await axiosInstance.get('/audit-actions')
    return response.data
  }
}

export default auditService
