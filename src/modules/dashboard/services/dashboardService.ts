import { axiosInstance } from '../../../core/api/axiosInstance';

export interface DashboardStats {
  totalTransactions: number;
  totalClients: number;
  totalAgences: number;
  volumeTotal: number;
  transactionsAujourdhui: number;
  volumeAujourdhui: number;
  retraitsEnAttente: number;
  montantEnAttente: number;
  agencesActives: number;
}

export interface Activity {
  id: number;
  action: string;
  description: string;
  utilisateurNom: string;
  created_at: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>('/statistiques/dashboard');
    return response.data;
  },

  getRecentActivity: async (limit: number = 10): Promise<Activity[]> => {
    const response = await axiosInstance.get<Activity[]>('/journal/recent', {
      params: { limit },
    });
    return response.data;
  },

  getChartData: async (period: string = 'week'): Promise<ChartData> => {
    const response = await axiosInstance.get<ChartData>('/statistiques/chart', {
      params: { period },
    });
    return response.data;
  },
};
