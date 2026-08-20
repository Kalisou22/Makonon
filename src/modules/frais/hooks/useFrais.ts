import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fraisService } from '../services/fraisService'
import { toast } from 'react-hot-toast'

export const useFrais = () => {
  return useQuery({
    queryKey: ['frais'],
    queryFn: () => fraisService.getAll(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useFraisConfiguration = () => {
  return useQuery({
    queryKey: ['frais', 'configuration'],
    queryFn: () => fraisService.getConfigurationActuelle(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useFraisHistorique = () => {
  return useQuery({
    queryKey: ['frais', 'historique'],
    queryFn: () => fraisService.getHistorique(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateFrais = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => fraisService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frais'] })
      queryClient.invalidateQueries({ queryKey: ['frais', 'configuration'] })
      toast.success('Configuration créée avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création')
    },
  })
}

export const useUpdateFrais = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      fraisService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frais'] })
      queryClient.invalidateQueries({ queryKey: ['frais', 'configuration'] })
      toast.success('Configuration mise à jour')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour')
    },
  })
}

export const useDeleteFrais = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => fraisService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frais'] })
      queryClient.invalidateQueries({ queryKey: ['frais', 'configuration'] })
      toast.success('Configuration supprimée')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression')
    },
  })
}

export const useDesactiverFrais = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => fraisService.desactiver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frais'] })
      queryClient.invalidateQueries({ queryKey: ['frais', 'configuration'] })
      toast.success('Configuration désactivée')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la désactivation')
    },
  })
}

export const useCalculerFrais = () => {
  return useMutation({
    mutationFn: (montant: number) => fraisService.calculer(montant),
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors du calcul')
    },
  })
}
