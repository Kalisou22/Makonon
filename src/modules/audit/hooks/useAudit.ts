import { useQuery } from '@tanstack/react-query';
import { auditService, type AuditLog, type AuditFilters } from '../services/auditService';

export const useAuditLogs = (filters?: AuditFilters) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      const response = await auditService.getAuditLogs(filters);
      return response.data;
    },
    staleTime: 60000,
    keepPreviousData: true,
  });
};

export const useAuditLog = (id: number) => {
  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: async () => {
      const response = await auditService.getAuditLogById(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
};
