import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { utilisateurService } from '../services/utilisateurService';
import type { Utilisateur, CreateUtilisateurData, UtilisateurFilters } from '../types';

export const useUtilisateurs = (filters?: UtilisateurFilters) => {
  return useQuery({
    queryKey: ['utilisateurs', filters],
    queryFn: async () => {
      const response = await utilisateurService.getUtilisateurs(filters);
      return response.data;
    },
    staleTime: 60000,
    keepPreviousData: true,
  });
};

export const useUtilisateur = (id: number) => {
  return useQuery({
    queryKey: ['utilisateur', id],
    queryFn: async () => {
      const response = await utilisateurService.getUtilisateurById(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateUtilisateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUtilisateurData) => utilisateurService.createUtilisateur(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateUtilisateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUtilisateurData> }) =>
      utilisateurService.updateUtilisateur(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
      queryClient.invalidateQueries({ queryKey: ['utilisateur', variables.id] });
      toast.success('Utilisateur mis à jour avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

export const useDeleteUtilisateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => utilisateurService.deleteUtilisateur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};
