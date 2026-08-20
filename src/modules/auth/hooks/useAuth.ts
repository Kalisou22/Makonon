import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, user, setAuth, clearAuth } = useAuthStore();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setAuth(token, user);
      toast.success('Connexion réussie');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Déconnexion réussie');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    user: userData?.data || user,
    token,
    isLoading,
    isAuthenticated: !!token && !!userData,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
