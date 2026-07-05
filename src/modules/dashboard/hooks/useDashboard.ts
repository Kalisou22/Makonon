import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardService.getDashboardStats();
      console.log('📥 Dashboard stats:', response.data);
      return response.data;
    },
    staleTime: 60000,
  });
};
