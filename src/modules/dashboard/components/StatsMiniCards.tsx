import React from 'react';
import { Card } from '../../../components/ui/Card';

interface StatsMiniCardsProps {
  stats: {
    solde_agence: number;
    transferts_jour: number;
    transferts_attente: number;
  };
  isLoading?: boolean;
}

export const StatsMiniCards: React.FC<StatsMiniCardsProps> = ({ stats, isLoading = false }) => {
  console.log('📊 StatsMiniCards:', stats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Solde agence', value: stats.solde_agence || 0, format: 'GNF' },
    { label: 'Volume journalier', value: stats.transferts_jour || 0, format: '' },
    { label: 'En attente', value: stats.transferts_attente || 0, format: '' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {item.format === 'GNF' 
                ? Number(item.value).toLocaleString('fr-FR') + ' GNF'
                : item.value
              }
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
