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

export const auditService = {
  getAuditLogs: (params?: AuditFilters) =>
    axiosInstance.get<{
      data: AuditLog[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/audit', { params }),

  getAuditLogById: (id: number) =>
    axiosInstance.get<{ data: AuditLog }>(`/audit/${id}`),
};
