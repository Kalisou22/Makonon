import React, { useState } from 'react';
import { useFrais, useDeleteFrais, useToggleFrais } from '../hooks/useFrais';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import { FraisFormModal } from '../components/FraisFormModal';

export const FraisPage: React.FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const { data, isLoading, refetch } = useFrais();
  const deleteMutation = useDeleteFrais();
  const toggleMutation = useToggleFrais();

  const configurations = data?.data || [];

  const handleCreate = () => {
    setSelectedConfig(null);
    setIsModalOpen(true);
  };

  const handleEdit = (config: any) => {
    setSelectedConfig(config);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: number, currentActif: boolean) => {
    if (!window.confirm(`Confirmer la ${currentActif ? 'désactivation' : 'activation'} de cette configuration ?`)) return;
    try {
      await toggleMutation.mutateAsync({ id, actif: !currentActif });
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression de cette configuration ?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configuration des frais</h1>
          <p className="text-sm text-gray-500">
            {configurations.length} configuration{configurations.length > 1 ? 's' : ''}
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={handleCreate}>Nouvelle configuration</Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : configurations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucune configuration de frais</div>
      ) : (
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
              {configurations.map((config: any) => (
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
                    {config.type === 'ECHELONNE' && (
                      <span className="text-sm text-gray-500">Échelons configurés</span>
                    )}
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
                          onClick={() => handleToggle(config.id, config.actif)}
                          isLoading={toggleMutation.isPending}
                        >
                          {config.actif ? 'Désactiver' : 'Activer'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(config)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(config.id)}
                          isLoading={deleteMutation.isPending}
                        >
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
      )}

      {isSuperAdmin && (
        <FraisFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          config={selectedConfig}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default FraisPage;
