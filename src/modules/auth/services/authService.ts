import { axiosInstance } from '../../../core/api/axiosInstance';

interface LoginCredentials {
  email: string;
  password: string;  // ✅ Changé de motDePasse à password
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
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/me');
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await axiosInstance.post('/logout');
  },
};
