import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import toast from 'react-hot-toast';
import { TransactionFormData } from '../types';

export const useTransactions = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  statut?: string;
}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getTransactions(params),
    staleTime: 30000,
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormData) => transactionService.createTransaction(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Transfert créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création du transfert';
      toast.error(message);
    },
  });
};

export const useValiderTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transactionService.validerTransaction(id),
    onSuccess: (response) => {
      toast.success(response.message || 'Transfert retiré avec succès');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du retrait';
      toast.error(message);
    },
  });
};

export const useAnnulerTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motif }: { id: number; motif?: string }) =>
      transactionService.annulerTransaction(id, motif),
    onSuccess: (response) => {
      toast.success(response.message || 'Transfert annulé avec succès');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation';
      toast.error(message);
    },
  });
};

export const useVerifierCode = () => {
  return useMutation({
    mutationFn: (code: string) => transactionService.verifierCode(code),
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Code de retrait invalide';
      toast.error(message);
    },
  });
};
