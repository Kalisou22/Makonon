import api from '../../../core/api/axiosInstance';

export interface DashboardStats {
  role: string;
  agence_id?: number;
  agence_nom?: string;
  solde?: number;
  solde_caisse?: number;
  total_transferts: number;
  total_clients?: number;
  total_agences?: number;
  total_utilisateurs?: number;
  transferts_jour: number;
  volume_journalier: number;
  transferts_attente: number;
  montant_attente: number;
  recent_activites: Array<{
    id: number;
    type: string;
    code: string;
    description: string;
    user: string;
    date: string;
    statut: string;
    montant?: number;
  }>;
}

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/statistiques/dashboard');
    return response.data;
  }
};
