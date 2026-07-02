import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { agenceService, CreateAgenceData } from '../services/agenceService';

export const useAgences = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['agences', page, size],
    queryFn: () => agenceService.getAgences(page, size),
    staleTime: 60000,
    retry: 1,
  });
};

export const useAgence = (id: number) => {
  return useQuery({
    queryKey: ['agence', id],
    queryFn: () => agenceService.getAgence(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateAgence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgenceData) => agenceService.createAgence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] });
      toast.success('Agence créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateAgence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAgenceData }) =>
      agenceService.updateAgence(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agences'] });
      queryClient.invalidateQueries({ queryKey: ['agence', variables.id] });
      toast.success('Agence modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export const useDeleteAgence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => agenceService.deleteAgence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] });
      toast.success('Agence supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};
