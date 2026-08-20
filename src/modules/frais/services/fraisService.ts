import axiosInstance from '../../../core/api/axiosInstance'

export const fraisService = {
  getAll: async () => {
    const response = await axiosInstance.get('/frais')
    return response.data
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/frais/configurations', data)
    return response.data
  },
  update: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/frais/configurations/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/frais/configurations/${id}`)
    return response.data
  },
  desactiver: async (id: number) => {
    const response = await axiosInstance.put(`/frais/configurations/${id}/desactiver`)
    return response.data
  },
  getConfigurationActuelle: async () => {
    const response = await axiosInstance.get('/frais/configuration-actuelle')
    return response.data
  },
  getHistorique: async () => {
    const response = await axiosInstance.get('/frais/historique')
    return response.data
  },
  calculer: async (montant: number) => {
    const response = await axiosInstance.post('/frais/calculer', { montant })
    return response.data
  },
}

export default fraisService
