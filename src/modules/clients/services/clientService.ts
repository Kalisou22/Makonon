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

  createClient: (data: CreateClientData) => {
    // N'envoyer que les champs qui existent dans le backend
    const payload: Record<string, any> = {
      nom: data.nom,
      telephone: data.telephone,
    };
    
    // Ajouter email seulement s'il est fourni
    if (data.email && data.email.trim() !== '') {
      payload.email = data.email;
    }
    
    // Ajouter piece_identite seulement s'il est fourni
    if (data.piece_identite && data.piece_identite.trim() !== '') {
      payload.piece_identite = data.piece_identite;
    }
    
    // Ajouter numero_piece seulement s'il est fourni
    if (data.numero_piece && data.numero_piece.trim() !== '') {
      payload.numero_piece = data.numero_piece;
    }
    
    return axiosInstance.post<{ message: string; data: Client }>('/clients', payload);
  },

  updateClient: (id: number, data: Partial<CreateClientData>) => {
    const payload: Record<string, any> = {};
    
    if (data.nom) payload.nom = data.nom;
    if (data.telephone) payload.telephone = data.telephone;
    if (data.email && data.email.trim() !== '') payload.email = data.email;
    if (data.piece_identite && data.piece_identite.trim() !== '') payload.piece_identite = data.piece_identite;
    if (data.numero_piece && data.numero_piece.trim() !== '') payload.numero_piece = data.numero_piece;
    
    return axiosInstance.put<{ message: string; data: Client }>(`/clients/${id}`, payload);
  },

  deleteClient: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/clients/${id}`),
};
