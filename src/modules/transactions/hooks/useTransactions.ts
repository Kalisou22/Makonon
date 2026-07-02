import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transactionService, CreateTransactionData } from '../services/transactionService';

export const useTransactions = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['transactions', page, size],
    queryFn: () => transactionService.getTransactions(page, size),
    staleTime: 60000,
    retry: 1,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transfert créé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useWithdrawTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => transactionService.withdrawTransaction(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Retrait effectué avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du retrait';
      toast.error(message);
    },
  });
};

export const useCancelTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => transactionService.cancelTransaction(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transfert annulé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation';
      toast.error(message);
    },
  });
};
