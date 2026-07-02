import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardStats();
      return response.data;
    },
    staleTime: 60000,
  });
};

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const response = await dashboardService.getRecentActivity(limit);
      return response.data.data || [];
    },
    staleTime: 30000,
  });
};
