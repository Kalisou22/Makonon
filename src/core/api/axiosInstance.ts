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

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const publicRoutes = ['/login', '/register', '/password', '/sanctum']
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))

    if (!isPublicRoute && token) {
      const user = useAuthStore.getState().user
      const agencyFromStore = useAgencyStore.getState().agencyId

      let agencyId = user?.agence_id || agencyFromStore

      if (user?.agence_id && user.agence_id !== agencyFromStore) {
        const { setAgency } = useAgencyStore.getState()
        setAgency(user.agence_id, user.agence?.nom || 'Agence')
        agencyId = user.agence_id
      }

      if (agencyId) {
        config.headers['X-Agency-ID'] = String(agencyId)
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isLoginRoute = error.config?.url?.includes('/login')
      const isLogoutRoute = error.config?.url?.includes('/logout')
      if (!isLoginRoute && !isLogoutRoute) {
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
