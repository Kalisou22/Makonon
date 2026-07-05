import React from 'react'
import { useDashboardStats } from '../hooks/useDashboard'
import { StatsCards } from '../components/StatsCards'
import { StatsMiniCards } from '../components/StatsMiniCards'
import { RecentActivity } from '../components/RecentActivity'

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats()

  console.log('📊 Dashboard stats (raw):', stats)

  const statsData = {
    total_transferts: stats?.total_transferts || 0,
    total_clients: stats?.total_clients || 0,
    total_agences: stats?.total_agences || 0,
    total_utilisateurs: stats?.total_utilisateurs || 0,
  }

  const miniStats = {
    solde_agence: stats?.solde_agence || 0,
    transferts_jour: stats?.volume_journalier || 0,
    transferts_attente: stats?.transferts_en_attente || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Tableau de bord</h1>
        <span className="text-sm text-text-secondary">
          Dernière mise à jour : {new Date().toLocaleTimeString()}
        </span>
      </div>

      <StatsCards stats={statsData} isLoading={isLoading} />
      <StatsMiniCards stats={miniStats} isLoading={isLoading} />
      <RecentActivity activities={[]} isLoading={isLoading} />
    </div>
  )
}

export default DashboardPage
