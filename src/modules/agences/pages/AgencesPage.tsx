import React, { useState } from 'react';
import { useAgences } from '../hooks/useAgences';
import { useAuthStore } from '../../../store/authStore';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import { ApprovisionnementModal } from '../components/ApprovisionnementModal';

export const AgencesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedAgence, setSelectedAgence] = useState<any>(null);
  const [isApproModalOpen, setIsApproModalOpen] = useState(false);
  const { user } = useAuthStore();

  const { data, isLoading, refetch } = useAgences({ page, per_page: 20, search });

  const agences = data?.data || [];
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const handleApprovisionner = (agence: any) => {
    setSelectedAgence(agence);
    setIsApproModalOpen(true);
  };

  const handleApproSuccess = () => {
    setIsApproModalOpen(false);
    setSelectedAgence(null);
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agences</h1>
          <p className="text-sm text-gray-500">
            {total} agence{total > 1 ? 's' : ''} trouvée{total > 1 ? 's' : ''}
          </p>
        </div>
        {isSuperAdmin && (
          <Button variant="primary">Nouvelle agence</Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une agence..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <Button variant="outline" onClick={() => { setSearch(''); refetch(); }}>
          Rafraîchir
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : agences.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucune agence trouvée</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Solde physique</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Solde comptable</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                  {isSuperAdmin && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agences.map((agence: any) => (
                  <tr key={agence.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{agence.code}</td>
                    <td className="px-4 py-3 font-medium">{agence.nom}</td>
                    <td className="px-4 py-3">{agence.ville || '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      {new Intl.NumberFormat('fr-FR').format(agence.solde_physique || 0)} GNF
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-blue-600">
                      {new Intl.NumberFormat('fr-FR').format(agence.solde_comptable || 0)} GNF
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge variant={agence.actif ? 'success' : 'danger'}>
                        {agence.actif ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApprovisionner(agence)}
                        >
                          Approvisionner
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(page - 1) * 20 + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(page * 20, total)}</span> sur{' '}
                  <span className="font-medium">{total}</span> résultats
                </p>
                <div className="flex gap-1">
                  {[...Array(lastPage)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 text-sm border rounded ${
                        page === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isSuperAdmin && selectedAgence && (
        <ApprovisionnementModal
          isOpen={isApproModalOpen}
          onClose={() => setIsApproModalOpen(false)}
          agence={selectedAgence}
          onSuccess={handleApproSuccess}
        />
      )}
    </div>
  );
};

export default AgencesPage;
