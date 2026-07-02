import React from 'react';
import { Card } from '../../../components/ui/Card';
import { DashboardStats } from '../services/dashboardService';

interface StatsMiniCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export const StatsMiniCards: React.FC<StatsMiniCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-12 bg-gray-100 animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const miniCards = [
    {
      title: 'Aujourd\'hui',
      value: stats?.transactionsAujourdhui || 0,
      sub: `${(stats?.volumeAujourdhui || 0).toLocaleString('fr-FR')} GNF`,
      color: 'text-blue-600',
    },
    {
      title: 'Retraits en attente',
      value: stats?.retraitsEnAttente || 0,
      sub: `${(stats?.montantEnAttente || 0).toLocaleString('fr-FR')} GNF`,
      color: 'text-orange-600',
    },
    {
      title: 'Agences actives',
      value: stats?.agencesActives || 0,
      sub: `sur ${stats?.totalAgences || 0} totales`,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {miniCards.map((card, index) => (
        <Card key={index} hover className="p-4">
          <p className="text-sm text-gray-500">{card.title}</p>
          <p className={`text-xl font-bold ${card.color}`}>{card.value.toLocaleString('fr-FR')}</p>
          <p className="text-xs text-gray-400">{card.sub}</p>
        </Card>
      ))}
    </div>
  );
};
