import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { mouvementService, type MouvementCaisse, type CreateMouvementData, type MouvementFilters } from '../services/mouvementService'

export const useMouvements = (filters?: MouvementFilters) => {
  const cleanFilters: Record<string, any> = {}
  if (filters) {
    if (filters.page) cleanFilters.page = filters.page
    if (filters.per_page) cleanFilters.per_page = filters.per_page
    if (filters.type) cleanFilters.type = filters.type
    if (filters.motif) cleanFilters.motif = filters.motif
  }

  return useQuery({
    queryKey: ['mouvements', cleanFilters],
    queryFn: async () => {
      const response = await mouvementService.getMouvements(cleanFilters)
      console.log('📥 Mouvements response:', response.data)
      return response.data
    },
    staleTime: 30000,
    keepPreviousData: true,
  })
}

export const useCreateMouvement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMouvementData) => mouvementService.createMouvement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements-solde'] })
      toast.success('Mouvement enregistré avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur création mouvement:', error.response?.data)
      toast.error(error.response?.data?.error || 'Erreur lors de la création')
    },
  })
}

export const useDeleteMouvement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => mouvementService.deleteMouvement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements-solde'] })
      toast.success('Mouvement supprimé avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur suppression mouvement:', error.response?.data)
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression')
    },
  })
}

export const useSoldeMouvement = (agenceId?: number) => {
  return useQuery({
    queryKey: ['mouvements-solde', agenceId],
    queryFn: async () => {
      const response = await mouvementService.getSolde(agenceId)
      console.log('📥 Solde mouvement:', response.data)
      return response.data
    },
    staleTime: 30000,
  })
}

export default { useMouvements, useCreateMouvement, useDeleteMouvement, useSoldeMouvement }
