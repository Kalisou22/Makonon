import React from 'react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';

interface Activity {
  id: number;
  type: string;
  description: string;
  user: string;
  date: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Activité récente</h3>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      transfert: '💰',
      client: '👤',
      user: '👥',
      agence: '🏢',
      login: '🔐',
      default: '📌',
    };
    return icons[type] || icons.default;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Activité récente</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Aucune activité récente
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Par {activity.user} • {new Date(activity.date).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivity;
