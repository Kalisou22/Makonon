import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fraisService } from '../services/fraisService';
import toast from 'react-hot-toast';

export const useFrais = () => {
  return useQuery({
    queryKey: ['frais'],
    queryFn: () => fraisService.getFrais(),
    staleTime: 60000,
  });
};

export const useFraisConfiguration = (id: number) => {
  return useQuery({
    queryKey: ['frais', id],
    queryFn: () => fraisService.getFraisConfiguration(id),
    enabled: !!id,
  });
};

export const useConfigurationActuelle = () => {
  return useQuery({
    queryKey: ['frais', 'actuelle'],
    queryFn: () => fraisService.getConfigurationActuelle(),
    staleTime: 30000,
  });
};

export const useCalculerFrais = () => {
  return useMutation({
    mutationFn: (montant: number) => fraisService.calculerFrais(montant),
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du calcul';
      toast.error(message);
    },
  });
};

export const useCreateFrais = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => fraisService.createFrais(data),
    onSuccess: () => {
      toast.success('Configuration créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['frais'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateFrais = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      fraisService.updateFrais(id, data),
    onSuccess: () => {
      toast.success('Configuration mise à jour');
      queryClient.invalidateQueries({ queryKey: ['frais'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

export const useDeleteFrais = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => fraisService.deleteFrais(id),
    onSuccess: () => {
      toast.success('Configuration supprimée');
      queryClient.invalidateQueries({ queryKey: ['frais'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

export const useToggleFrais = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, actif }: { id: number; actif: boolean }) =>
      fraisService.toggleFrais(id, actif),
    onSuccess: (response) => {
      toast.success(response.message || 'Statut modifié');
      queryClient.invalidateQueries({ queryKey: ['frais'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export default useFrais;
