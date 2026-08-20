import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5, // Rafraîchir toutes les 5 minutes
  })
}

export const useDashboardStatistiques = () => {
  return useQuery({
    queryKey: ['dashboard', 'statistiques'],
    queryFn: () => dashboardService.getStatistiques(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useDashboardComplet = () => {
  return useQuery({
    queryKey: ['dashboard', 'complet'],
    queryFn: () => dashboardService.getDashboardComplet(),
    staleTime: 1000 * 60 * 2,
  })
}

export default useDashboardStats
