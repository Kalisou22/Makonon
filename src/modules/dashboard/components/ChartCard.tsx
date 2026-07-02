import React from 'react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import type { ChartData } from '../services/dashboardService';

interface ChartCardProps {
  data: ChartData | undefined;
  isLoading: boolean;
  title: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ data, isLoading, title }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </CardHeader>
        <CardBody>
          <div className="h-64 flex items-center justify-center">
            <Loader />
          </div>
        </CardBody>
      </Card>
    );
  }

  const maxValue = Math.max(...(data?.datasets[0]?.data || [0]), 1);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </CardHeader>
      <CardBody>
        {data && data.labels.length > 0 ? (
          <div className="h-64">
            <div className="flex h-full items-end gap-2">
              {data.labels.map((label, index) => {
                const value = data.datasets[0]?.data[index] || 0;
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500">{value}</div>
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="text-xs text-gray-400 truncate w-full text-center">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">Aucune donnée disponible</p>
        )}
      </CardBody>
    </Card>
  );
};
