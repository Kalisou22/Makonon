import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { useAgencyStore } from '../../../store/agencyStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: storeLogout, setLoading, user } = useAuthStore();
  const { setAgency, clearAgency } = useAgencyStore();

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      if (data.user.agence) {
        setAgency(data.user.agence.id, data.user.agence.nom);
      }
      toast.success('Connexion réussie');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    },
    onSettled: () => setLoading(false),
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storeLogout();
      clearAgency();
      queryClient.clear();
      toast.success('Déconnexion réussie');
      navigate('/login');
    },
    onError: () => {
      storeLogout();
      clearAgency();
      navigate('/login');
    },
  });

  return {
    user,
    currentUser,
    isLoading: loginMutation.isPending || isLoadingUser,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isAuthenticated: !!localStorage.getItem('token'),
  };
};
