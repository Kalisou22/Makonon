import { axiosInstance } from '../../../core/api/axiosInstance';

export const dashboardService = {
  getDashboardStats: () =>
    axiosInstance.get('/statistiques/dashboard'),
};
