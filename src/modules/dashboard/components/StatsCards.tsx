import React from 'react';
import { Card } from '../../../components/ui/Card';

interface StatsCardsProps {
  stats: {
    total_transferts: number;
    total_clients: number;
    total_agences: number;
    total_utilisateurs: number;
  };
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  console.log('📊 StatsCards:', stats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Transferts', value: stats.total_transferts || 0, icon: '💰' },
    { label: 'Clients', value: stats.total_clients || 0, icon: '👤' },
    { label: 'Agences', value: stats.total_agences || 0, icon: '🏢' },
    { label: 'Utilisateurs', value: stats.total_utilisateurs || 0, icon: '👥' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
            <span className="text-3xl">{item.icon}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
