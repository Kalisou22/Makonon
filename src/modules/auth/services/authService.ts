import { axiosInstance } from '../../../core/api/axiosInstance';

interface LoginCredentials {
  email: string;
  motDePasse: string;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  agence?: { id: number; nom: string } | null;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  getCsrfCookie: async (): Promise<void> => {
    await axiosInstance.get('/sanctum/csrf-cookie');
  },
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await authService.getCsrfCookie();
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};
