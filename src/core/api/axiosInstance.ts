import axios from 'axios';
import { useAgencyStore } from '../../store/agencyStore';
import { useAuthStore } from '../../store/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'https://transfert-api.onrender.com/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Intercepteur request - Ajoute token + agence
axiosInstance.interceptors.request.use(
  (config) => {
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

// Intercepteur response - Gestion erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Accès refusé:', error.response?.data?.message);
    }

    if (error.response?.status === 429) {
      console.error('Trop de requêtes, veuillez réessayer plus tard.');
    }

    return Promise.reject(error);
  }
);
