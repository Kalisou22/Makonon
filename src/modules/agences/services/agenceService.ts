import { axiosInstance } from '../../../core/api/axiosInstance';
import type { Agence, CreateAgenceData, AgenceFilters } from '../types';

export const agenceService = {
  getAgences: (params?: AgenceFilters) =>
    axiosInstance.get<{
      data: Agence[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/agences', { params }),

  getAgenceById: (id: number) =>
    axiosInstance.get<{ data: Agence }>(`/agences/${id}`),

  createAgence: (data: CreateAgenceData) =>
    axiosInstance.post<{ message: string; data: Agence }>('/agences', data),

  updateAgence: (id: number, data: Partial<CreateAgenceData>) =>
    axiosInstance.put<{ message: string; data: Agence }>(`/agences/${id}`, data),

  deleteAgence: (id: number) =>
    axiosInstance.delete<{ message: string }>(`/agences/${id}`),
};
