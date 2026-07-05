import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  nom: string
  email: string
  role: string
  agence_id?: number | null
  agence?: { id: number; nom: string } | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        // Si l'utilisateur a une agence, la stocker dans agencyStore
        if (user.agence?.id) {
          const { setAgency } = require('./agencyStore').useAgencyStore.getState()
          setAgency(user.agence.id, user.agence.nom)
        } else if (user.agence_id) {
          const { setAgency } = require('./agencyStore').useAgencyStore.getState()
          setAgency(user.agence_id, 'Agence')
        }
        set({ user, token, isAuthenticated: true })
      },
      setUser: (user) => {
        if (user.agence?.id) {
          const { setAgency } = require('./agencyStore').useAgencyStore.getState()
          setAgency(user.agence.id, user.agence.nom)
        }
        set({ user })
      },
      logout: () => {
        localStorage.removeItem('token')
        const { clearAgency } = require('./agencyStore').useAgencyStore.getState()
        clearAgency()
        set({ user: null, token: null, isAuthenticated: false })
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
