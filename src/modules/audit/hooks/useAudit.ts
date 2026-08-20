import { useQuery } from '@tanstack/react-query'
import { auditService } from '../services/auditService'

export const useAuditLogs = (params?: any) => {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: () => auditService.getAll(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useAuditLog = (id: number) => {
  return useQuery({
    queryKey: ['audit', id],
    queryFn: () => auditService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useAuditActions = () => {
  return useQuery({
    queryKey: ['audit', 'actions'],
    queryFn: () => auditService.getActions(),
    staleTime: 1000 * 60 * 60,
  })
}
