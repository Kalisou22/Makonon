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

    // 2. ✅ SOURCE DE VÉRITÉ = authStore.user.agence_id
    //    ✅ agencyStore = UI seulement, utilisé comme fallback
    const user = useAuthStore.getState().user
    const agencyFromStore = useAgencyStore.getState().agencyId

    // 3. Déterminer l'agence : priorité à user.agence_id
    let agencyId = user?.agence_id || agencyFromStore

    // 4. Synchronisation automatique : si user a une agence différente de agencyStore
    if (user?.agence_id && user.agence_id !== agencyFromStore) {
      // Mettre à jour agencyStore pour rester synchronisé
      const { setAgency } = useAgencyStore.getState()
      const agenceNom = user.agence?.nom || 'Agence'
      setAgency(user.agence_id, agenceNom)
      agencyId = user.agence_id
    }

    // 5. Envoyer le header si une agence est définie
    if (agencyId) {
      config.headers['X-Agency-ID'] = String(agencyId)
    }

    console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`, {
      token: !!token,
      agencyId: config.headers['X-Agency-ID'],
      userAgency: user?.agence_id,
      storeAgency: agencyFromStore,
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

    // Si 403 Forbidden → message d'erreur
    if (error.response?.status === 403) {
      console.error('🔴 Accès refusé:', error.response?.data?.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
