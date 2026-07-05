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
    // 1. Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. Ne pas ajouter X-Agency-ID pour les routes publiques
    const publicRoutes = ['/login', '/register', '/password', '/sanctum']
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))

    if (!isPublicRoute) {
      // 3. Source de vérité = authStore.user.agence_id
      const user = useAuthStore.getState().user
      const agencyFromStore = useAgencyStore.getState().agencyId

      let agencyId = user?.agence_id || agencyFromStore

      // 4. Synchronisation automatique
      if (user?.agence_id && user.agence_id !== agencyFromStore) {
        const { setAgency } = useAgencyStore.getState()
        const agenceNom = user.agence?.nom || 'Agence'
        setAgency(user.agence_id, agenceNom)
        agencyId = user.agence_id
      }

      if (agencyId) {
        config.headers['X-Agency-ID'] = String(agencyId)
      }
    }

    console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`, {
      token: !!token,
      agencyId: config.headers['X-Agency-ID'],
      isPublic: isPublicRoute,
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
      const isLoginRoute = error.config?.url?.includes('/login')
      if (!isLoginRoute) {
        localStorage.removeItem('token')
        useAuthStore.getState().logout()
        useAgencyStore.getState().clearAgency()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
