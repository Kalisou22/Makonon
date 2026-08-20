import React from 'react';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import type { FraisConfiguration } from '../types';

interface FraisTableProps {
  data: FraisConfiguration[];
  isLoading?: boolean;
  isSuperAdmin: boolean;
  onEdit: (config: FraisConfiguration) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, actif: boolean) => void;
}

export const FraisTable: React.FC<FraisTableProps> = ({
  data,
  isLoading,
  isSuperAdmin,
  onEdit,
  onDelete,
  onToggle,
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune configuration de frais</div>;
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FIXE: 'Fixe',
      POURCENTAGE: 'Pourcentage',
      ECHELONNE: 'Échelonné',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      FIXE: 'bg-blue-100 text-blue-800',
      POURCENTAGE: 'bg-green-100 text-green-800',
      ECHELONNE: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valeur</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
            {isSuperAdmin && (
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((config) => (
            <tr key={config.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{config.nom}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(config.type)}`}>
                  {getTypeLabel(config.type)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {config.type === 'FIXE' && `${new Intl.NumberFormat('fr-FR').format(config.valeur)} GNF`}
                {config.type === 'POURCENTAGE' && `${config.valeur}%`}
                {config.type === 'ECHELONNE' && 'Échelons configurés'}
              </td>
              <td className="px-4 py-3 text-sm">
                {config.date_debut ? new Date(config.date_debut).toLocaleDateString('fr-FR') : '-'}
                {config.date_fin && ` → ${new Date(config.date_fin).toLocaleDateString('fr-FR')}`}
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge variant={config.actif ? 'success' : 'danger'}>
                  {config.actif ? 'Active' : 'Inactive'}
                </StatusBadge>
              </td>
              {isSuperAdmin && (
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={config.actif ? 'warning' : 'success'}
                      onClick={() => onToggle(config.id, config.actif)}
                    >
                      {config.actif ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(config)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(config.id)}>
                      Supprimer
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FraisTable;
