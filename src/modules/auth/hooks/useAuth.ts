import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../store/authStore'
import { useAgencyStore } from '../../../store/agencyStore'
import { authService } from '../services/authService'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAuth, logout: storeLogout, setLoading, user } = useAuthStore()
  const { setAgency, clearAgency } = useAgencyStore()

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      // Stocker le token
      localStorage.setItem('token', data.token)

      // ✅ SOURCE DE VÉRITÉ = user du backend
      const user = data.user
      setAuth(user, data.token)

      // ✅ Synchronisation automatique avec agencyStore
      if (user.agence) {
        setAgency(user.agence.id, user.agence.nom)
      } else if (user.agence_id) {
        setAgency(user.agence_id, 'Agence')
      } else {
        clearAgency()
      }

      toast.success(data.message || 'Connexion réussie')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion'
      toast.error(message)
      setLoading(false)
    },
    onSettled: () => setLoading(false),
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storeLogout()
      clearAgency()
      localStorage.removeItem('token')
      queryClient.clear()
      toast.success('Déconnexion réussie')
      navigate('/login')
    },
    onError: () => {
      storeLogout()
      clearAgency()
      localStorage.removeItem('token')
      navigate('/login')
    },
  })

  return {
    user,
    currentUser,
    isLoading: loginMutation.isPending || isLoadingUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isAuthenticated: !!localStorage.getItem('token'),
  }
}

export default useAuth
