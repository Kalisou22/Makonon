import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'
import { toast } from 'react-hot-toast'

export const useTransactions = (params?: any) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getAll(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30s
  })
}

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export const useSoldeAgence = () => {
  return useQuery({
    queryKey: ['solde', 'agence'],
    queryFn: async () => {
      const response = await transactionService.getSoldeAgence()
      return response.data || { solde: 0 }
    },
    staleTime: 1000 * 30,
    refetchInterval: 30 * 1000,
  })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => transactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['solde'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transfert créé avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création')
    },
  })
}

export const useValidateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => transactionService.valider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['solde'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Retrait effectué avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors du retrait')
    },
  })
}

export const useCancelTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motif }: { id: number; motif?: string }) =>
      transactionService.annuler(id, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['solde'] })
      queryClient.invalidateQueries({ queryKey: ['mouvements'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transfert annulé avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'annulation')
    },
  })
}

export const useVerifierCode = () => {
  return useMutation({
    mutationFn: (code: string) => transactionService.verifier(code),
    onSuccess: (data) => {
      toast.success(`Transfert trouvé: ${data.data?.code}`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Code invalide')
    },
  })
}
