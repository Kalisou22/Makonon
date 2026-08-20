import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../core/api/axiosInstance';
import toast from 'react-hot-toast';

export const useApprovisionnement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      agence_id: number;
      caisse_id: number;
      montant: number;
      observation?: string;
    }) => {
      const response = await api.post('/approvisionnements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agences'] });
      queryClient.invalidateQueries({ queryKey: ['mouvements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'approvisionnement';
      toast.error(message);
    },
  });
};

export default useApprovisionnement;
