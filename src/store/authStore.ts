import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAgencyStore } from './agencyStore'

export interface User {
  id: number
  nom: string
  email: string
  role: string
  agence_id?: number | null
  agence?: { id: number; nom: string } | null
  telephone?: string
  actif?: boolean
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
        console.log('🔐 setAuth:', { user, token })
        
        // ✅ Sauvegarder dans localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        // ✅ Synchronisation avec agencyStore
        if (user?.agence?.id) {
          useAgencyStore.getState().setAgency(user.agence.id, user.agence.nom)
        } else if (user?.agence_id) {
          useAgencyStore.getState().setAgency(user.agence_id, 'Agence')
        } else {
          useAgencyStore.getState().clearAgency()
        }

        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false
        })
      },

      setUser: (user) => {
        console.log('🔐 setUser:', user)
        if (user?.agence?.id) {
          useAgencyStore.getState().setAgency(user.agence.id, user.agence.nom)
        } else if (user?.agence_id) {
          useAgencyStore.getState().setAgency(user.agence_id, 'Agence')
        } else {
          useAgencyStore.getState().clearAgency()
        }
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
      },

      logout: () => {
        console.log('🔐 logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        useAgencyStore.getState().clearAgency()
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
