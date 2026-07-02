import { axiosInstance } from '../../../core/api/axiosInstance';

export interface AuditLog {
  id: number;
  utilisateurId: number;
  utilisateurNom?: string;
  action: string;
  entite: string;
  entiteId?: number;
  description?: string;
  oldData?: any;
  newData?: any;
  ip?: string;
  userAgent?: string;
  created_at: string;
}

export interface AuditResponse {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const auditService = {
  getLogs: async (page: number = 0, size: number = 20, search?: string): Promise<AuditResponse> => {
    const params: any = { page, size };
    if (search) params.search = search;
    
    const response = await axiosInstance.get<AuditResponse>('/journal', { params });
    return response.data;
  },

  getLogsByUtilisateur: async (userId: number, page: number = 0, size: number = 20): Promise<AuditResponse> => {
    const response = await axiosInstance.get<AuditResponse>(`/journal/utilisateur/${userId}`, {
      params: { page, size },
    });
    return response.data;
  },

  searchLogs: async (keyword: string, page: number = 0, size: number = 20): Promise<AuditResponse> => {
    const response = await axiosInstance.get<AuditResponse>(`/journal/search`, {
      params: { motCle: keyword, page, size },
    });
    return response.data;
  },

  deleteLog: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/journal/${id}`);
  },

  getActions: async (): Promise<string[]> => {
    const response = await axiosInstance.get<string[]>('/journal/actions');
    return response.data;
  },
};
