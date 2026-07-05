import React from 'react'
import { Card } from '../../../components/ui/Card'

interface StatsMiniCardsProps {
  stats: {
    solde_agence: number
    transferts_jour: number
    transferts_attente: number
  }
  isLoading?: boolean
}

export const StatsMiniCards: React.FC<StatsMiniCardsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-12 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    { label: 'Solde agence', value: stats.solde_agence || 0, format: 'GNF' },
    { label: 'Volume journalier', value: stats.transferts_jour || 0, format: 'GNF' },
    { label: 'En attente', value: stats.transferts_attente || 0, format: '' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} variant="default" className="p-4">
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{item.label}</p>
            <p className="text-xl font-bold text-gray-900">
              {item.format === 'GNF'
                ? Number(item.value).toLocaleString('fr-FR') + ' GNF'
                : item.value
              }
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StatsMiniCards
