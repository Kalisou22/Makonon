import axios from 'axios';
import { useAgencyStore } from '../../store/agencyStore';
import { useAuthStore } from '../../store/authStore';

// ⚠️ IMPORTANT: Le backend tourne sur le port 8000
const API_URL = 'http://localhost:8000/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Lire le token depuis localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const agencyId = useAgencyStore.getState().agencyId;
    if (agencyId) {
      config.headers['X-Agency-ID'] = String(agencyId);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // ✅ Supprimer le token et déconnecter
      localStorage.removeItem('token');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
