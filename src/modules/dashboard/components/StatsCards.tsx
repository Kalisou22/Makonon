import React from 'react'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'

interface StatsCardsProps {
  stats: {
    total_transferts: number
    total_clients: number
    total_agences: number
    total_utilisateurs: number
  }
  isLoading?: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    { label: 'Transactions', value: stats.total_transferts || 0, icon: '💰', color: 'primary' },
    { label: 'Clients', value: stats.total_clients || 0, icon: '👤', color: 'success' },
    { label: 'Agences', value: stats.total_agences || 0, icon: '🏢', color: 'warning' },
    { label: 'Utilisateurs', value: stats.total_utilisateurs || 0, icon: '👥', color: 'info' as const },
  ]

  const colorClasses = {
    primary: 'border-primary/20 text-primary',
    success: 'border-success/20 text-success',
    warning: 'border-warning/20 text-warning',
    info: 'border-blue-500/20 text-blue-500',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} variant="dashboard" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString('fr-FR')}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${colorClasses[item.color as keyof typeof colorClasses]}`}>
              <span className="text-xl">{item.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards
