import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardStats()
      console.log('📥 Dashboard stats (raw):', response.data)

      // Transformation des données pour correspondre à l'attente du frontend
      const data = response.data

      return {
        // Stats principales
        total_transferts: data?.total_transferts || data?.totalTransactions || 0,
        total_clients: data?.total_clients || data?.totalClients || 0,
        total_agences: data?.total_agences || data?.totalAgences || 0,
        total_utilisateurs: data?.total_utilisateurs || data?.totalUtilisateurs || 0,

        // Stats mini
        solde_agence: data?.solde_agence || data?.solde || data?.soldeAgence || 0,
        volume_journalier: data?.volume_journalier || data?.volumeJournalier || data?.transferts_jour || 0,
        transferts_en_attente: data?.transferts_en_attente || data?.transfertsEnAttente || data?.retraitsEnAttente || 0,

        // Autres stats utiles
        montant_total: data?.montant_total || data?.montantTotal || data?.volumeTotal || 0,
        retraits_en_attente: data?.retraits_en_attente || data?.retraitsEnAttente || 0,
        montant_en_attente: data?.montant_en_attente || data?.montantEnAttente || 0,
        agences_actives: data?.agences_actives || data?.agencesActives || 0,
      }
    },
    staleTime: 60000,
  })
}

export default useDashboardStats
