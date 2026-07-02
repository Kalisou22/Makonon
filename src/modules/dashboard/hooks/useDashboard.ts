import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 60000,
    retry: 1,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 30000,
    retry: 1,
  });
};

export const useChartData = (period: string = 'week') => {
  return useQuery({
    queryKey: ['dashboard', 'chart', period],
    queryFn: () => dashboardService.getChartData(period),
    staleTime: 60000,
    retry: 1,
  });
};
