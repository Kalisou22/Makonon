import axiosInstance from '../../../core/api/axiosInstance'

export const dashboardService = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard')
    return response.data
  },
  getStatistiques: async () => {
    const response = await axiosInstance.get('/statistiques/dashboard')
    return response.data
  },
  getDashboardComplet: async () => {
    try {
      const [stats, statistiques] = await Promise.all([
        axiosInstance.get('/dashboard'),
        axiosInstance.get('/statistiques/dashboard')
      ])
      return {
        ...stats.data,
        ...statistiques.data
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
      throw error
    }
  }
}

export default dashboardService
