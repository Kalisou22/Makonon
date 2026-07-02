import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clientService } from '../services/clientService';
import type { Client, CreateClientData, ClientFilters } from '../types';

export const useClients = (filters?: ClientFilters) => {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      const response = await clientService.getClients(filters);
      return response.data;
    },
    staleTime: 60000,
    keepPreviousData: true,
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const response = await clientService.getClientById(id);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client créé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateClientData> }) =>
      clientService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
      toast.success('Client mis à jour avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};
