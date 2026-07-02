import { axiosInstance } from '../../../core/api/axiosInstance';

export interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export interface AuditFilters {
  page?: number;
  per_page?: number;
  user_id?: number;
  action?: string;
  date_debut?: string;
  date_fin?: string;
}

// Note: L'audit n'a pas de route dédiée, on utilise les transferts comme source d'activité
export const auditService = {
  // Utiliser les transferts comme journal d'activité
  getAuditLogs: (params?: AuditFilters) =>
    axiosInstance.get<{
      data: AuditLog[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/transferts', { 
      params: { 
        ...params,
        // Transformer les transferts en format audit
      } 
    }),

  getAuditLogById: (id: number) =>
    axiosInstance.get<{ data: AuditLog }>(`/transferts/${id}`),
};
