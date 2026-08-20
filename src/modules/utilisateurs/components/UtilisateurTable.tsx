import React from 'react';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import type { Utilisateur } from '../types';

interface UtilisateurTableProps {
  data: Utilisateur[];
  onEdit?: (user: Utilisateur) => void;
  onDelete?: (id: number) => void;
  onToggleActif?: (id: number) => void;
  isLoading?: boolean;
  isSuperAdmin: boolean;
}

export const UtilisateurTable: React.FC<UtilisateurTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleActif,
  isLoading,
  isSuperAdmin,
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agence</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
            {isSuperAdmin && (
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{user.nom}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.telephone || '-'}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'RESPONSABLE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">{user.agence?.nom || '-'}</td>
              <td className="px-4 py-3 text-center">
                <StatusBadge variant={user.actif ? 'success' : 'danger'}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </StatusBadge>
              </td>
              {isSuperAdmin && (
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {onToggleActif && (
                      <Button
                        size="sm"
                        variant={user.actif ? 'danger' : 'primary'}
                        onClick={() => onToggleActif(user.id)}
                      >
                        {user.actif ? 'Désactiver' : 'Activer'}
                      </Button>
                    )}
                    {onEdit && (
                      <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                        Modifier
                      </Button>
                    )}
                    {onDelete && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(user.id)}>
                        Supprimer
                      </Button>
                    )}
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

export default UtilisateurTable;
