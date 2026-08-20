import React from 'react';
import type { DashboardStats } from '../services/dashboardService';

interface StatsMiniCardsProps {
  stats: DashboardStats;
  isSuperAdmin: boolean;
}

export const StatsMiniCards: React.FC<StatsMiniCardsProps> = ({ stats, isSuperAdmin }) => {
  const cards = [
    {
      label: 'Transferts aujourd\'hui',
      value: stats.transferts_jour || 0,
      format: 'number',
      color: 'blue',
      icon: '📤',
    },
    {
      label: 'Volume journalier',
      value: stats.volume_journalier || 0,
      format: 'money',
      color: 'green',
      icon: '💰',
    },
    {
      label: 'En attente de retrait',
      value: stats.transferts_attente || 0,
      format: 'number',
      color: 'yellow',
      icon: '⏳',
    },
    {
      label: 'Montant en attente',
      value: stats.montant_attente || 0,
      format: 'money',
      color: 'orange',
      icon: '📦',
    },
  ];

  if (isSuperAdmin) {
    cards.push(
      {
        label: 'Total agences',
        value: stats.total_agences || 0,
        format: 'number',
        color: 'purple',
        icon: '🏢',
      },
      {
        label: 'Total clients',
        value: stats.total_clients || 0,
        format: 'number',
        color: 'teal',
        icon: '👤',
      }
    );
  }

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    teal: 'bg-teal-50 border-teal-200 text-teal-600',
  };

  const formatValue = (value: number, format: string) => {
    if (format === 'money') {
      return new Intl.NumberFormat('fr-FR').format(value) + ' GNF';
    }
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${colorClasses[card.color]}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-xs font-medium text-gray-500">{card.label}</span>
          </div>
          <p className="text-xl font-bold mt-2">
            {formatValue(card.value, card.format)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsMiniCards;
