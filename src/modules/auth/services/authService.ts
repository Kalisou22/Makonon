import api from '../../../core/api/axiosInstance';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  logoutAll: async () => {
    const response = await api.post('/logout-all');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/refresh');
    return response.data;
  }
};

export default authService;
