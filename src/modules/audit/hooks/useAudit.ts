import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../../../types';

export const useAuditLogs = (page = 0, size = 20, search?: string) => useQuery({
  queryKey: ['audit', page, size, search],
  queryFn: async () => (await auditService.getLogs(page, size, search)).data,
  staleTime: 30000,
});

export const useDeleteAuditLog = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => auditService.deleteLog(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['audit'] }); toast.success('Journal supprimé'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};
