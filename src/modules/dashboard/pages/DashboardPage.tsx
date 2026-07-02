import React from 'react';
import { useDashboardStats, useRecentActivity } from '../hooks/useDashboard';
import { StatsCards } from '../components/StatsCards';
import { StatsMiniCards } from '../components/StatsMiniCards';
import { RecentActivity } from '../components/RecentActivity';
import { ChartCard } from '../components/ChartCard';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity(5);

  // Transformation des données pour les composants
  const statsData = {
    total_transferts: stats?.total_transferts || 0,
    total_clients: stats?.total_clients || 0,
    total_agences: stats?.total_agences || 0,
    total_utilisateurs: stats?.total_utilisateurs || 0,
  };

  const miniStats = {
    solde_agence: stats?.solde_agence || 0,
    transferts_jour: stats?.transferts_jour || 0,
    clients_jour: stats?.clients_jour || 0,
  };

  // Transformer les transferts en activités
  const formattedActivities = activities?.map((t: any) => ({
    id: t.id,
    type: 'transfert',
    description: `Transfert de ${t.montant} GNF - ${t.code}`,
    user: t.utilisateurEnvoi?.nom || 'Inconnu',
    date: t.created_at || new Date().toISOString(),
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      <StatsCards stats={statsData} isLoading={statsLoading} />
      
      <StatsMiniCards stats={miniStats} isLoading={statsLoading} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard 
          title="Statistiques" 
          isLoading={statsLoading}
        />
        <RecentActivity 
          activities={formattedActivities} 
          isLoading={activitiesLoading} 
        />
      </div>
    </div>
  );
};
