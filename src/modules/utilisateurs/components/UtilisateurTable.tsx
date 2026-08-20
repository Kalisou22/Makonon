import React from 'react';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
  actif: boolean;
  telephone?: string;
  agence?: {
    id: number;
    nom: string;
  };
}

interface UtilisateurTableProps {
  data: Utilisateur[];
  onEdit?: (user: Utilisateur) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export const UtilisateurTable: React.FC<UtilisateurTableProps> = ({
  data,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Téléphone</th>
            <th className="px-4 py-2 text-left">Rôle</th>
            <th className="px-4 py-2 text-left">Agence</th>
            <th className="px-4 py-2 text-center">Statut</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{user.nom}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.telephone || '-'}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2">{user.agence?.nom || '-'}</td>
              <td className="px-4 py-2 text-center">
                <StatusBadge variant={user.actif ? 'success' : 'danger'}>
                  {user.actif ? 'Actif' : 'Inactif'}
                </StatusBadge>
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UtilisateurTable;
