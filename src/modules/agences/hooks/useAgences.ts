import { useQuery } from '@tanstack/react-query';
import { agenceService } from '../services/agenceService';

export const useAgences = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  actif?: boolean;
}) => {
  return useQuery({
    queryKey: ['agences', params],
    queryFn: () => agenceService.getAgences(params),
    staleTime: 30000,
  });
};

export const useAgence = (id: number) => {
  return useQuery({
    queryKey: ['agence', id],
    queryFn: () => agenceService.getAgence(id),
    enabled: !!id,
  });
};

export const useAgenceSolde = (id: number) => {
  return useQuery({
    queryKey: ['agence', id, 'solde'],
    queryFn: () => agenceService.getSolde(id),
    enabled: !!id,
    staleTime: 15000,
  });
};

export default useAgences;
