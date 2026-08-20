import axiosInstance from '../../../core/api/axiosInstance'

export const mouvementService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get('/mouvements-caisse', { params })
    return response.data
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/mouvements-caisse', data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/mouvements-caisse/${id}`)
    return response.data
  },
  getSolde: async (agenceId?: number) => {
    const params = agenceId ? { agence_id: agenceId } : {}
    const response = await axiosInstance.get('/caisses/solde', { params })
    return response.data
  }
}

export default mouvementService
