import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { utilisateurService } from '../services/utilisateurService';
import type { Utilisateur, CreateUtilisateurData } from '../../../types';

export const useUtilisateurs = (page = 0, size = 20, search?: string, role?: string) => useQuery({
  queryKey: ['utilisateurs', page, size, search, role],
  queryFn: async () => (await utilisateurService.getUtilisateurs(page, size, search, role)).data,
  staleTime: 60000,
});

export const useUtilisateur = (id: number) => useQuery({
  queryKey: ['utilisateur', id],
  queryFn: async () => (await utilisateurService.getUtilisateur(id)).data,
  enabled: !!id,
});

export const useCreateUtilisateur = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUtilisateurData) => utilisateurService.createUtilisateur(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['utilisateurs'] }); toast.success('Utilisateur créé'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useUpdateUtilisateur = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateUtilisateurData }) => 
      utilisateurService.updateUtilisateur(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['utilisateurs'] });
      qc.invalidateQueries({ queryKey: ['utilisateur', vars.id] });
      toast.success('Utilisateur modifié');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useDeleteUtilisateur = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => utilisateurService.deleteUtilisateur(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['utilisateurs'] }); toast.success('Utilisateur supprimé'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};
