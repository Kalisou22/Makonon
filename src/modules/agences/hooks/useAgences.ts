import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { agenceService } from '../services/agenceService';
import type { Agence, CreateAgenceData } from '../../../types';

export const useAgences = (page = 0, size = 20) => useQuery({
  queryKey: ['agences', page, size],
  queryFn: async () => {
    const res = await agenceService.getAgences(page, size);
    return res.data;
  },
  staleTime: 60000,
});

export const useAgence = (id: number) => useQuery({
  queryKey: ['agence', id],
  queryFn: async () => {
    const res = await agenceService.getAgence(id);
    return res.data;
  },
  enabled: !!id,
});

export const useCreateAgence = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAgenceData) => agenceService.createAgence(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agences'] });
      toast.success('Agence créée');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useUpdateAgence = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAgenceData }) => 
      agenceService.updateAgence(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['agences'] });
      qc.invalidateQueries({ queryKey: ['agence', vars.id] });
      toast.success('Agence modifiée');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useDeleteAgence = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => agenceService.deleteAgence(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agences'] });
      toast.success('Agence supprimée');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};
