import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import { DashboardStats } from '../services/dashboardService';

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Loader />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Transactions',
      value: stats?.totalTransactions || 0,
      icon: '💳',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Clients',
      value: stats?.totalClients || 0,
      icon: '👤',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Agences',
      value: stats?.totalAgences || 0,
      icon: '🏢',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Volume Total',
      value: stats?.volumeTotal || 0,
      icon: '💰',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      format: true,
    },
  ];

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.format ? formatValue(card.value) : card.value.toLocaleString('fr-FR')}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
