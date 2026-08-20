import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuthStore } from '../../../store/authStore';
import StatsMiniCards from '../components/StatsMiniCards';
import RecentActivity from '../components/RecentActivity';

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useDashboard();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          <p>Erreur lors du chargement du dashboard</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.data || data;
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">
            Bienvenue, {user?.nom}
            {stats.agence_nom && (
              <span className="ml-2 text-sm text-gray-500">
                • {stats.agence_nom}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Soldes pour les utilisateurs non SUPERADMIN */}
      {!isSuperAdmin && (stats.solde_physique !== undefined || stats.solde !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">💰 Solde physique</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('fr-FR').format(stats.solde_physique || 0)} GNF
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">📊 Solde comptable</p>
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('fr-FR').format(stats.solde_comptable || 0)} GNF
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">📈 Solde ledger</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Intl.NumberFormat('fr-FR').format(stats.solde || 0)} GNF
            </p>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <StatsMiniCards stats={stats} isSuperAdmin={isSuperAdmin} />

      {/* Activité récente */}
      <RecentActivity activities={stats.recent_activites || []} />
    </div>
  );
};

export default DashboardPage;
