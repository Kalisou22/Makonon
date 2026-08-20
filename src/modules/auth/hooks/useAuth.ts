import { useAuthStore } from '../../../store/authStore'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export function useAuth() {
  const { user, token, setAuth, logout, setLoading } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = () => {
    const isAuth = !!token && !!user
    console.log('🔐 isAuthenticated:', isAuth, 'token:', !!token, 'user:', !!user)
    return isAuth
  }

  const login = async (email: string, password: string) => {
    console.log('🔐 Tentative de login:', email)
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      console.log('🔐 Réponse login:', response)

      // ✅ Vérifier la structure de la réponse
      if (response && response.data) {
        const userData = response.data.user || response.data
        const tokenData = response.data.token

        console.log('🔐 User data:', userData)
        console.log('🔐 Token:', tokenData)

        if (userData && tokenData) {
          // ✅ Sauvegarder dans le store
          setAuth(userData, tokenData)

          // ✅ Sauvegarder dans localStorage
          localStorage.setItem('token', tokenData)
          localStorage.setItem('user', JSON.stringify(userData))

          toast.success('Connexion réussie')
          return response.data
        } else {
          console.error('❌ Données manquantes:', { userData, tokenData })
          throw new Error('Données utilisateur ou token manquantes')
        }
      } else {
        console.error('❌ Réponse invalide:', response)
        throw new Error('Réponse invalide du serveur')
      }
    } catch (error: any) {
      console.error('❌ Erreur login:', error)
      const message = error?.response?.data?.message || error?.message || 'Erreur de connexion'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      logout()
      toast.success('Déconnexion réussie')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout: handleLogout,
    isLoading,
    setLoading
  }
}
