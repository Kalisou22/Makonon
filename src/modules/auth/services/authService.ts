import { axiosInstance } from '../../../core/api/axiosInstance';

interface LoginCredentials {
  email: string;
  motDePasse: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nom: string;
    email: string;
    role: string;
    agence: {
      id: number;
      nom: string;
    } | null;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  me: async (): Promise<LoginResponse['user']> => {
    const response = await axiosInstance.get<LoginResponse['user']>('/auth/me');
    return response.data;
  },
};
