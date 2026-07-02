import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, Activity, ChartData } from '../../../types';

export const useDashboardStats = () => useQuery({
  queryKey: ['dashboard', 'stats'],
  queryFn: async () => {
    try { return (await dashboardService.getStats()).data; } 
    catch { return { totalTransactions: 0, totalClients: 0, totalAgences: 0, volumeTotal: 0, transactionsAujourdhui: 0, volumeAujourdhui: 0, retraitsEnAttente: 0, montantEnAttente: 0, agencesActives: 0 } as DashboardStats; }
  },
  staleTime: 60000,
  refetchInterval: 60000,
});

export const useRecentActivity = (limit = 10) => useQuery({
  queryKey: ['dashboard', 'activity', limit],
  queryFn: async () => {
    try { return (await dashboardService.getRecentActivity(limit)).data; } 
    catch { return [] as Activity[]; }
  },
  staleTime: 30000,
});

export const useChartData = (period = 'week') => useQuery({
  queryKey: ['dashboard', 'chart', period],
  queryFn: async () => {
    try { return (await dashboardService.getChartData(period)).data; } 
    catch { return { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], datasets: [{ label: 'Transactions', data: [0,0,0,0,0,0,0], backgroundColor: 'rgba(59,130,246,0.5)', borderColor: 'rgb(59,130,246)' }] } as ChartData; }
  },
  staleTime: 60000,
});
