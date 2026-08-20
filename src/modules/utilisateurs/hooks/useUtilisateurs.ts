import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utilisateurService } from '../services/utilisateurService';
import type { UtilisateurFormData } from '../types';
import toast from 'react-hot-toast';

export const useUtilisateurs = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  agence_id?: number;
  actif?: boolean;
}) => {
  return useQuery({
    queryKey: ['utilisateurs', params],
    queryFn: () => utilisateurService.getUtilisateurs(params),
    staleTime: 30000,
  });
};

export const useUtilisateur = (id: number) => {
  return useQuery({
    queryKey: ['utilisateur', id],
    queryFn: () => utilisateurService.getUtilisateur(id),
    enabled: !!id,
  });
};

export const useCreateUtilisateur = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UtilisateurFormData) => utilisateurService.createUtilisateur(data),
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
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
    mutationFn: ({ id, data }: { id: number; data: Partial<UtilisateurFormData> }) =>
      utilisateurService.updateUtilisateur(id, data),
    onSuccess: () => {
      toast.success('Utilisateur mis à jour');
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
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
      toast.success('Utilisateur supprimé');
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

export const useToggleActif = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => utilisateurService.toggleActif(id),
    onSuccess: (response) => {
      toast.success(response.message || 'Statut modifié');
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export default useUtilisateurs;
