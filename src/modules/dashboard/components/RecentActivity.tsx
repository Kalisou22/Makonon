import React from 'react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import { Activity } from '../services/dashboardService';

interface RecentActivityProps {
  activities: Activity[] | undefined;
  isLoading: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'bg-green-100 text-green-700',
      LOGOUT: 'bg-gray-100 text-gray-700',
      CREATE: 'bg-blue-100 text-blue-700',
      UPDATE: 'bg-orange-100 text-orange-700',
      DELETE: 'bg-red-100 text-red-700',
      TRANSFERT: 'bg-purple-100 text-purple-700',
      RETRAIT: 'bg-teal-100 text-teal-700',
      ANNULATION: 'bg-red-100 text-red-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      LOGIN: 'Connexion',
      LOGOUT: 'Déconnexion',
      CREATE: 'Création',
      UPDATE: 'Modification',
      DELETE: 'Suppression',
      TRANSFERT: 'Transfert',
      RETRAIT: 'Retrait',
      ANNULATION: 'Annulation',
    };
    return labels[action] || action;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
    
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-700">Activité récente</h3>
        </CardHeader>
        <CardBody>
          <Loader />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-700">Activité récente</h3>
      </CardHeader>
      <CardBody>
        {activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{activity.utilisateurNom}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                      {getActionLabel(activity.action)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente</p>
        )}
      </CardBody>
    </Card>
  );
};
