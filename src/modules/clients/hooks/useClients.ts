import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/clientService'
import { toast } from 'react-hot-toast'

export const useClients = (params?: any) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getAll(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client créé avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création')
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      clientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client mis à jour')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour')
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => clientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Client supprimé')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression')
    },
  })
}
