import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'

export const useTransferReport = (filters?: any) => {
  return useQuery({
    queryKey: ['reports', 'transfers', filters],
    queryFn: () => reportService.getTransfers(filters),
    enabled: !!filters,
    staleTime: 1000 * 60 * 5,
  })
}

export const useFeesReport = (filters?: any) => {
  return useQuery({
    queryKey: ['reports', 'fees', filters],
    queryFn: () => reportService.getFees(filters),
    enabled: !!filters,
    staleTime: 1000 * 60 * 5,
  })
}
