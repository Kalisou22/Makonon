import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mouvementService } from '../services/mouvementService'
import { toast } from 'react-hot-toast'

export const useMouvements = (params?: any) => {
  return useQuery({
    queryKey: ['mouvements', params],
    queryFn: () => mouvementService.getAll(params),
    staleTime: 1000 * 60 * 2,
  })
}

export const useSoldeMouvement = (agenceId?: number) => {
  return useQuery({
    queryKey: ['mouvements', 'solde', agenceId],
    queryFn: () => mouvementService.getSolde(agenceId),
    staleTime: 1000 * 30,
  })
}

export const useCreateMouvement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => mouvementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements', 'solde'] })
      queryClient.invalidateQueries({ queryKey: ['solde'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Mouvement enregistré avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'enregistrement')
    },
  })
}

export const useDeleteMouvement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => mouvementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements', 'solde'] })
      queryClient.invalidateQueries({ queryKey: ['solde'] })
      toast.success('Mouvement supprimé')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression')
    },
  })
}
