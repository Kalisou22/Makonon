import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../../store/authStore'
import { useAgencyStore } from '../../../store/agencyStore'
import { authService } from '../services/authService'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAuth, logout: storeLogout, setLoading, user, isAuthenticated } = useAuthStore()
  const { setAgency, clearAgency } = useAgencyStore()

  // Récupérer l'utilisateur courant si token présent
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('token') && !isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  // Mettre à jour le store si l'utilisateur est récupéré
  React.useEffect(() => {
    if (currentUser) {
      setAuth(currentUser, localStorage.getItem('token') || '')
      if (currentUser.agence) {
        setAgency(currentUser.agence.id, currentUser.agence.nom)
      } else if (currentUser.agence_id) {
        setAgency(currentUser.agence_id, 'Agence')
      }
    }
  }, [currentUser])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      console.log('✅ Login réussi:', data.user)

      // Stocker le token
      localStorage.setItem('token', data.token)

      // Mettre à jour authStore
      setAuth(data.user, data.token)

      // Mettre à jour agencyStore
      if (data.user.agence) {
        setAgency(data.user.agence.id, data.user.agence.nom)
      } else if (data.user.agence_id) {
        setAgency(data.user.agence_id, 'Agence')
      } else {
        clearAgency()
      }

      toast.success(data.message || 'Connexion réussie')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion'
      setError(message)
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
    isAuthenticated: !!localStorage.getItem('token') || isAuthenticated,
    isLoading: loginMutation.isPending || isLoadingUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  }
}

// Import React pour le useEffect
import React from 'react'

export default useAuth
