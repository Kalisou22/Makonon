import React, { useState } from 'react';
import { useDashboardStats, useRecentActivity, useChartData } from '../hooks/useDashboard';
import { StatsCards } from '../components/StatsCards';
import { StatsMiniCards } from '../components/StatsMiniCards';
import { RecentActivity } from '../components/RecentActivity';
import { ChartCard } from '../components/ChartCard';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState('week');

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity(10);
  const { data: chartData, isLoading: chartLoading } = useChartData(chartPeriod);

  const periodOptions = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ];

  // ✅ Format volume avec vérification
  const formatVolume = (value: number | undefined) => {
    if (value === undefined || value === null) return '0 GNF';
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + ' Md GNF';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + ' M GNF';
    return value.toLocaleString('fr-FR') + ' GNF';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
          </span>
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            Actualiser
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />
      <StatsMiniCards stats={stats} isLoading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-700">Évolution des transactions</h2>
              <Select
                options={periodOptions}
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
          <ChartCard
            data={chartData}
            isLoading={chartLoading}
            title="Transactions par période"
          />
        </div>
        <div>
          <RecentActivity activities={activities} isLoading={activitiesLoading} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-700">Volume total des transactions</h3>
        </CardHeader>
        <CardBody>
          <p className="text-3xl font-bold text-blue-600">
            {formatVolume(stats?.volumeTotal)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.totalTransactions || 0} transactions au total
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
