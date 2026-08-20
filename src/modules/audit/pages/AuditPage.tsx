import React, { useState } from 'react';
import { useAudit, useAuditActions } from '../hooks/useAudit';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import StatusBadge from '../../../components/ui/StatusBadge';

export const AuditPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [action, setAction] = useState('');
  const [entite, setEntite] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const { data, isLoading, refetch } = useAudit({
    page,
    per_page: 20,
    date_debut: dateDebut || undefined,
    date_fin: dateFin || undefined,
    action: action || undefined,
    entite: entite || undefined,
    search: search || undefined,
  });

  const { data: actionsData } = useAuditActions();

  const logs = data?.data || [];
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;
  const actions = actionsData?.data || [];

  const handleReset = () => {
    setDateDebut('');
    setDateFin('');
    setAction('');
    setEntite('');
    setSearch('');
    setPage(1);
    refetch();
  };

  const handleViewDetail = (log: any) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      login: 'info',
      logout: 'info',
      transfert_cree: 'success',
      transfert_retire: 'success',
      transfert_annule: 'danger',
      agence_cree: 'success',
      agence_modifie: 'warning',
      agence_supprime: 'danger',
      utilisateur_cree: 'success',
      utilisateur_modifie: 'warning',
      utilisateur_supprime: 'danger',
      approvisionnement_caisse: 'success',
      approvisionnement_annule: 'danger',
      caisse_entree: 'success',
      caisse_sortie: 'danger',
    };
    const labels: Record<string, string> = {
      login: '🔐 Connexion',
      logout: '🔐 Déconnexion',
      transfert_cree: '📤 Transfert créé',
      transfert_retire: '📥 Transfert retiré',
      transfert_annule: '❌ Transfert annulé',
      agence_cree: '🏢 Agence créée',
      agence_modifie: '🏢 Agence modifiée',
      agence_supprime: '🏢 Agence supprimée',
      utilisateur_cree: '👤 Utilisateur créé',
      utilisateur_modifie: '👤 Utilisateur modifié',
      utilisateur_supprime: '👤 Utilisateur supprimé',
      approvisionnement_caisse: '💰 Approvisionnement',
      approvisionnement_annule: '💰 Approvisionnement annulé',
      caisse_entree: '💳 Entrée caisse',
      caisse_sortie: '💳 Sortie caisse',
    };
    return (
      <StatusBadge variant={variants[action] || 'default'}>
        {labels[action] || action}
      </StatusBadge>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Journal d'audit</h1>
          <p className="text-sm text-gray-500">
            {total} événement{total > 1 ? 's' : ''} enregistré{total > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          🔄 Rafraîchir
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Toutes</option>
            {actions.map((a: any) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Action, entité, ID..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-end gap-2 col-span-1 md:col-span-4">
          <Button onClick={() => refetch()}>Appliquer</Button>
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
        </div>
      </div>

      {/* Tableau */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun événement d'audit trouvé</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{log.user_name || 'Système'}</p>
                        {log.user_role && (
                          <p className="text-xs text-gray-500">{log.user_role}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{getActionBadge(log.action)}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{log.entite || '-'}</span>
                      {log.entite_id && (
                        <span className="text-xs text-gray-500 block">#{log.entite_id}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{log.description || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(log)}
                      >
                        Détail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={lastPage}
              onPageChange={setPage}
              total={total}
              perPage={20}
            />
          </div>
        </>
      )}

      {/* Modal de détail */}
      {isDetailOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Détail de l'événement</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {selectedLog.created_at ? new Date(selectedLog.created_at).toLocaleString('fr-FR') : '-'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Utilisateur</p>
                <p className="font-medium">{selectedLog.user_name || 'Système'}</p>
                {selectedLog.user_role && (
                  <p className="text-sm text-gray-500">{selectedLog.user_role}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Action</p>
                <p className="font-medium">{selectedLog.action_label || selectedLog.action}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Entité</p>
                <p className="font-medium">{selectedLog.entite} #{selectedLog.entite_id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedLog.description || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Adresse IP</p>
                <p className="font-medium font-mono text-sm">{selectedLog.ip_address || '-'}</p>
              </div>

              {selectedLog.old_data && (
                <div>
                  <p className="text-sm text-gray-500">Données avant</p>
                  <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.old_data, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_data && (
                <div>
                  <p className="text-sm text-gray-500">Données après</p>
                  <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.new_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setIsDetailOpen(false)}>Fermer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPage;
