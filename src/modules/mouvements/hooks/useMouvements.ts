import { useQuery } from '@tanstack/react-query';
import { mouvementService } from '../services/mouvementService';

export const useMouvements = (params?: {
  page?: number;
  per_page?: number;
  type?: string;
  motif?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['mouvements', params],
    queryFn: () => mouvementService.getMouvements(params),
    staleTime: 30000,
  });
};

export const useMouvement = (id: number) => {
  return useQuery({
    queryKey: ['mouvement', id],
    queryFn: () => mouvementService.getMouvement(id),
    enabled: !!id,
  });
};

export default useMouvements;
