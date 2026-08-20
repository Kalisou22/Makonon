import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agenceService } from '../services/agenceService'
import { toast } from 'react-hot-toast'

export const useAgences = (params?: any) => {
  return useQuery({
    queryKey: ['agences', params],
    queryFn: () => agenceService.getAll(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useAgence = (id: number) => {
  return useQuery({
    queryKey: ['agences', id],
    queryFn: () => agenceService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useSoldeAgence = (agenceId: number) => {
  return useQuery({
    queryKey: ['agences', 'solde', agenceId],
    queryFn: () => agenceService.getSolde(agenceId),
    enabled: !!agenceId,
    staleTime: 1000 * 30,
  })
}

export const useCreateAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => agenceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      toast.success('Agence créée')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création')
    },
  })
}

export const useUpdateAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      agenceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      toast.success('Agence mise à jour')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour')
    },
  })
}

export const useDeleteAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => agenceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      toast.success('Agence supprimée')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression')
    },
  })
}
