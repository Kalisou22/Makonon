import axiosInstance from '../../../core/api/axiosInstance'

export const reportService = {
  getTransfers: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/transfers', { params: filters })
    return response.data
  },
  getFees: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/fees', { params: filters })
    return response.data
  },
  getCash: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/cash', { params: filters })
    return response.data
  },
  getLedger: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/ledger', { params: filters })
    return response.data
  },
  getAudit: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/audit', { params: filters })
    return response.data
  },
  getClients: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/clients', { params: filters })
    return response.data
  },
  getAgencies: async (filters?: any) => {
    const response = await axiosInstance.get('/reports/agencies', { params: filters })
    return response.data
  }
}

export default reportService
