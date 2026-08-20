import React from 'react';

interface Activity {
  id: number;
  type: string;
  code: string;
  description: string;
  user: string;
  date: string;
  statut: string;
  montant?: number;
  agence_envoi?: string;
  agence_retrait?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getStatusBadge = (statut: string) => {
    const variants: Record<string, string> = {
      ENVOYE: 'bg-yellow-100 text-yellow-800',
      RETIRE: 'bg-green-100 text-green-800',
      ANNULE: 'bg-red-100 text-red-800',
      EN_ATTENTE: 'bg-gray-100 text-gray-800',
    };
    const labels: Record<string, string> = {
      ENVOYE: 'En attente',
      RETIRE: 'Retiré',
      ANNULE: 'Annulé',
      EN_ATTENTE: 'En attente',
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${variants[statut] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
        <p className="text-gray-500 text-center py-8">Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Activité récente</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.code}</span>
                {getStatusBadge(activity.statut)}
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>{activity.user}</span>
                <span>•</span>
                <span>{new Date(activity.date).toLocaleString('fr-FR')}</span>
                {activity.agence_envoi && (
                  <>
                    <span>•</span>
                    <span>Envoi: {activity.agence_envoi}</span>
                  </>
                )}
                {activity.agence_retrait && (
                  <>
                    <span>•</span>
                    <span>Retrait: {activity.agence_retrait}</span>
                  </>
                )}
              </div>
            </div>
            {activity.montant && (
              <div className="text-right">
                <span className="font-medium">
                  {new Intl.NumberFormat('fr-FR').format(activity.montant)} GNF
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
