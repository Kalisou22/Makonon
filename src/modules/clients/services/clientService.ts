import { axiosInstance } from '../../../core/api/axiosInstance';
import type { Client, CreateClientData, ClientFilters } from '../types';

export const clientService = {
  getClients: (params?: ClientFilters) =>
    axiosInstance.get<{
      data: Client[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/clients', { params }),

  getClientById: (id: number) =>
    axiosInstance.get<{ data: Client }>(`/clients/${id}`),

  getClientByTelephone: (telephone: string) =>
    axiosInstance.get<{ data: Client }>(`/clients/telephone/${telephone}`),

  createClient: (data: CreateClientData) =>
    axiosInstance.post<{ message: string; data: Client }>('/clients', data),

  updateClient: (id: number, data: Partial<CreateClientData>) =>
    axiosInstance.put<{ message: string; data: Client }>(`/clients/${id}`, data),

  deleteClient: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/clients/${id}`),
};
