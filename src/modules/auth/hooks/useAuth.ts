import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { token, user, setAuth, clearAuth } = useAuthStore();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
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

  const logoutAllMutation = useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Déconnecté de tous les appareils');
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  const refreshMutation = useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: (response) => {
      const { token } = response.data;
      // Mettre à jour le token dans le store
      useAuthStore.setState({ token });
      localStorage.setItem('token', token);
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
    logoutAll: logoutAllMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
