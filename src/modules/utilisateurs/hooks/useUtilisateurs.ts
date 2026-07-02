import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { utilisateurService, CreateUtilisateurData } from '../services/utilisateurService';

export const useUtilisateurs = (page: number = 0, size: number = 20, search?: string, role?: string) => {
  return useQuery({
    queryKey: ['utilisateurs', page, size, search, role],
    queryFn: () => utilisateurService.getUtilisateurs(page, size, search, role),
    staleTime: 60000,
    retry: 1,
  });
};

export const useUtilisateur = (id: number) => {
  return useQuery({
    queryKey: ['utilisateur', id],
    queryFn: () => utilisateurService.getUtilisateur(id),
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
    mutationFn: ({ id, data }: { id: number; data: CreateUtilisateurData }) =>
      utilisateurService.updateUtilisateur(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
      queryClient.invalidateQueries({ queryKey: ['utilisateur', variables.id] });
      toast.success('Utilisateur modifié avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
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
