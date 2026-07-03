import { axiosInstance } from '../../../core/api/axiosInstance';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  agence_id?: number;
  agence?: { id: number; nom: string } | null;
}

interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/login', {
      email: credentials.email,
      password: credentials.password
    });
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
