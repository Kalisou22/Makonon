import React from 'react';
import { useDashboardStats } from '../hooks/useDashboard';
import { StatsCards } from '../components/StatsCards';
import { StatsMiniCards } from '../components/StatsMiniCards';
import { RecentActivity } from '../components/RecentActivity';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  console.log('📊 Dashboard stats (raw):', stats);

  // Extraire toutes les données disponibles
  const statsData = {
    total_transferts: stats?.total_transferts || 0,
    total_clients: stats?.total_clients || 0,
    total_agences: stats?.total_agences || 0,
    total_utilisateurs: stats?.total_utilisateurs || 0,
  };

  const miniStats = {
    solde_agence: stats?.solde_agence || 0,
    transferts_jour: stats?.volume_journalier || 0,
    transferts_attente: stats?.transferts_en_attente || 0,
  };

  // Activités récentes (à compléter)
  const activities = [
    // { id: 1, type: 'transfert', description: 'Transfert de 1000 GNF', user: 'Admin', date: new Date().toISOString() }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      <StatsCards stats={statsData} isLoading={isLoading} />
      
      <StatsMiniCards stats={miniStats} isLoading={isLoading} />
      
      <RecentActivity activities={activities} isLoading={isLoading} />
    </div>
  );
};
