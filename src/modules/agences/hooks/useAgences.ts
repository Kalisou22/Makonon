import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { agenceService } from '../services/agenceService'
import type { Agence, CreateAgenceData, AgenceFilters } from '../types'

export const useAgences = (filters?: AgenceFilters) => {
  return useQuery({
    queryKey: ['agences', filters],
    queryFn: async () => {
      const response = await agenceService.getAgences(filters)
      console.log('📥 useAgences response:', response.data)
      return response.data
    },
    staleTime: 60000,
    keepPreviousData: true,
  })
}

export const useAgence = (id: number) => {
  return useQuery({
    queryKey: ['agence', id],
    queryFn: async () => {
      const response = await agenceService.getAgenceById(id)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 60000,
  })
}

export const useCreateAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAgenceData) => agenceService.createAgence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      toast.success('Agence créée avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur création agence:', error.response?.data)
      const message = error.response?.data?.message || 'Erreur lors de la création'
      toast.error(message)
    },
  })
}

export const useUpdateAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAgenceData> }) =>
      agenceService.updateAgence(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      queryClient.invalidateQueries({ queryKey: ['agence', variables.id] })
      toast.success('Agence mise à jour avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur modification agence:', error.response?.data)
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
      toast.error(message)
    },
  })
}

export const useDeleteAgence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => agenceService.deleteAgence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] })
      toast.success('Agence supprimée avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur suppression agence:', error.response?.data)
      const message = error.response?.data?.message || 'Erreur lors de la suppression'
      toast.error(message)
    },
  })
}

export default { useAgences, useAgence, useCreateAgence, useUpdateAgence, useDeleteAgence }
