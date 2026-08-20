import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../../auth/hooks/useAuth';
import StatsMiniCards from '../components/StatsMiniCards';
import RecentActivity from '../components/RecentActivity';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  const stats = data?.data;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">
          Bienvenue, {user?.nom}
          {user?.agence && (
            <span className="ml-2 text-sm text-gray-500">
              • {user.agence.nom}
            </span>
          )}
        </p>
      </div>

      {stats && (
        <>
          <StatsMiniCards stats={stats} />
          <div className="mt-6">
            <RecentActivity activities={stats.recent_activites || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
