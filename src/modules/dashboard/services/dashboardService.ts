import { axiosInstance } from '../../../core/api/axiosInstance';

export const dashboardService = {
  // Statistiques du dashboard
  getDashboardStats: () =>
    axiosInstance.get('/statistiques/dashboard'),

  // Statistiques pour les cartes
  getStatsCards: () =>
    axiosInstance.get('/statistiques/dashboard'),

  // Activité récente (utiliser l'audit ou les transferts)
  getRecentActivity: (limit: number = 10) =>
    axiosInstance.get('/transferts', { 
      params: { per_page: limit, page: 1 }
    }),
};
