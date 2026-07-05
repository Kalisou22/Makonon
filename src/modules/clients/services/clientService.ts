import { axiosInstance } from '../../../core/api/axiosInstance'
import type { Client, CreateClientData } from '../types'

export const clientService = {
  // Liste des clients
  getClients: () =>
    axiosInstance.get<Client[]>('/clients'),

  // Récupérer un client par ID
  getClientById: (id: number) =>
    axiosInstance.get<{ data: Client }>(`/clients/${id}`),

  // Récupérer un client par téléphone
  getClientByTelephone: (telephone: string) =>
    axiosInstance.get<{ data: Client }>(`/clients/telephone/${telephone}`),

  // Créer un client
  createClient: (data: CreateClientData) =>
    axiosInstance.post<{ message: string; data: Client }>('/clients', {
      nom: data.nom,
      telephone: data.telephone,
      email: data.email || null,
      piece_identite: data.piece_identite || null,
      numero_piece: data.numero_piece || null,
    }),

  // Modifier un client
  updateClient: (id: number, data: Partial<CreateClientData>) =>
    axiosInstance.put<{ message: string; data: Client }>(`/clients/${id}`, {
      nom: data.nom,
      telephone: data.telephone,
      email: data.email || null,
      piece_identite: data.piece_identite || null,
      numero_piece: data.numero_piece || null,
    }),

  // Supprimer un client
  deleteClient: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/clients/${id}`),
}

export default clientService
