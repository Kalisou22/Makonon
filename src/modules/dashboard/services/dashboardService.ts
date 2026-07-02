import { axiosInstance } from '../../../core/api/axiosInstance';

export const dashboardService = {
  getStats: () => axiosInstance.get('/statistiques/dashboard'),
  getRecentActivity: (limit) => axiosInstance.get('/journal/recent', { params: { limit } }),
  getChartData: (period) => axiosInstance.get('/statistiques/chart', { params: { period } }),
};
