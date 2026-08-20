import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { utilisateurService } from '../services/utilisateurService'
import { toast } from 'react-hot-toast'

export const useUtilisateurs = (params?: any) => {
  return useQuery({
    queryKey: ['utilisateurs', params],
    queryFn: () => utilisateurService.getAll(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useUtilisateur = (id: number) => {
  return useQuery({
    queryKey: ['utilisateurs', id],
    queryFn: () => utilisateurService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateUtilisateur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => utilisateurService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] })
      toast.success('Utilisateur créé')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création')
    },
  })
}

export const useUpdateUtilisateur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      utilisateurService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] })
      toast.success('Utilisateur mis à jour')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour')
    },
  })
}

export const useDeleteUtilisateur = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => utilisateurService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] })
      toast.success('Utilisateur supprimé')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression')
    },
  })
}
