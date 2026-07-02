import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { auditService } from '../services/auditService';

export const useAuditLogs = (page: number = 0, size: number = 20, search?: string) => {
  return useQuery({
    queryKey: ['audit', page, size, search],
    queryFn: () => auditService.getLogs(page, size, search),
    staleTime: 30000,
    retry: 1,
  });
};

export const useAuditLogsByUtilisateur = (userId: number, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['audit', 'user', userId, page, size],
    queryFn: () => auditService.getLogsByUtilisateur(userId, page, size),
    enabled: !!userId,
    staleTime: 30000,
  });
};

export const useSearchAudit = (keyword: string, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['audit', 'search', keyword, page, size],
    queryFn: () => auditService.searchLogs(keyword, page, size),
    enabled: !!keyword,
    staleTime: 30000,
  });
};

export const useDeleteAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => auditService.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit'] });
      toast.success('Journal supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};
