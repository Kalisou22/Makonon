import axios from 'axios'
import { useAgencyStore } from '../../store/agencyStore'
import { useAuthStore } from '../../store/authStore'

const API_URL = 'http://localhost:8000/api'

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
})

// ===== INTERCEPTEUR REQUÊTE =====
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Récupérer le token depuis localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. Récupérer l'agence depuis le store (persisté)
    const agencyId = useAgencyStore.getState().agencyId

    // 3. Si pas d'agence dans agencyStore, essayer depuis authStore
    if (!agencyId) {
      const user = useAuthStore.getState().user
      if (user?.agence?.id) {
        // Mettre à jour agencyStore automatiquement
        useAgencyStore.getState().setAgency(user.agence.id, user.agence.nom)
        config.headers['X-Agency-ID'] = String(user.agence.id)
      } else if (user?.agence_id) {
        useAgencyStore.getState().setAgency(user.agence_id, 'Agence')
        config.headers['X-Agency-ID'] = String(user.agence_id)
      }
    } else {
      config.headers['X-Agency-ID'] = String(agencyId)
    }

    console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`, {
      token: !!token,
      agencyId: config.headers['X-Agency-ID'],
    })

    return config
  },
  (error) => Promise.reject(error)
)

// ===== INTERCEPTEUR RÉPONSE =====
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`)
    return response
  },
  async (error) => {
    console.error(`❌ [${error.response?.status}] ${error.config?.url}`, error.response?.data)

    // Si 401 Unauthorized → déconnexion
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      useAuthStore.getState().logout()
      useAgencyStore.getState().clearAgency()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
