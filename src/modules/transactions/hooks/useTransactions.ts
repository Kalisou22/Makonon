import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { transactionService } from '../services/transactionService';
import type {
  Transaction,
  CreateTransactionData,
  TransactionFilters,
  SoldeAgenceResponse,
} from '../types';

export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await transactionService.getTransactions(filters);
      return response.data;
    },
    staleTime: 60000,
    keepPreviousData: true,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionData) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['solde-agence'] });
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
      queryClient.invalidateQueries({ queryKey: ['solde-agence'] });
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
    mutationFn: ({ code, motif }: { code: string; motif?: string }) =>
      transactionService.cancelTransaction(code, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transfert annulé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de l'annulation";
      toast.error(message);
    },
  });
};

export const useVerifyTransaction = (code: string) => {
  return useQuery({
    queryKey: ['transaction-verify', code],
    queryFn: async () => {
      const response = await transactionService.verifyTransaction(code);
      return response.data.data;
    },
    enabled: !!code && code.length > 0,
    staleTime: 0,
  });
};

export const useSoldeAgence = () => {
  return useQuery({
    queryKey: ['solde-agence'],
    queryFn: async () => {
      const response = await transactionService.getSoldeAgence();
      return response.data;
    },
    staleTime: 30000,
  });
};
