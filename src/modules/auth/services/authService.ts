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
  // ✅ Login direct sans CSRF
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/login', credentials);
    return response.data;
  },
  
  // ✅ Récupérer l'utilisateur
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/me');
    return response.data;
  },
  
  // ✅ Logout
  logout: async (): Promise<void> => {
    await axiosInstance.post('/logout');
  },
};
