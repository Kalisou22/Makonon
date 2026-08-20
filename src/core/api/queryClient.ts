import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true, // Rafraîchir quand l'onglet est actif
      refetchOnReconnect: true, // Rafraîchir quand la connexion revient
      refetchInterval: 60 * 1000, // Rafraîchir toutes les minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
