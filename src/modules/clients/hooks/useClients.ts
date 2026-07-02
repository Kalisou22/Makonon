import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clientService } from '../services/clientService';
import type { Client, CreateClientData } from '../../../types';

export const useClients = (page = 0, size = 20) => useQuery({
  queryKey: ['clients', page, size],
  queryFn: async () => (await clientService.getClients(page, size)).data,
  staleTime: 60000,
});

export const useClient = (id: number) => useQuery({
  queryKey: ['client', id],
  queryFn: async () => (await clientService.getClient(id)).data,
  enabled: !!id,
});

export const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); toast.success('Client créé'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateClientData }) => 
      clientService.updateClient(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['client', vars.id] });
      toast.success('Client modifié');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};

export const useDeleteClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientService.deleteClient(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clients'] }); toast.success('Client supprimé'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erreur'),
  });
};
