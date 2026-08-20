import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/auditService';

export const useAudit = (params?: {
  page?: number;
  per_page?: number;
  date_debut?: string;
  date_fin?: string;
  action?: string;
  entite?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: () => auditService.getAuditLogs(params),
    staleTime: 60000,
  });
};

export const useAuditLog = (id: number) => {
  return useQuery({
    queryKey: ['audit', id],
    queryFn: () => auditService.getAuditLog(id),
    enabled: !!id,
  });
};

export const useAuditActions = () => {
  return useQuery({
    queryKey: ['audit-actions'],
    queryFn: () => auditService.getActions(),
    staleTime: 300000,
  });
};

export const useAuditEntities = () => {
  return useQuery({
    queryKey: ['audit-entities'],
    queryFn: () => auditService.getEntities(),
    staleTime: 300000,
  });
};

export default useAudit;
