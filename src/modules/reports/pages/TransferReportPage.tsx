import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { useAgences } from '../../agences/hooks/useAgences';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/ui/StatusBadge';
import Pagination from '../../../components/ui/Pagination';

export const TransferReportPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState('');
  const [agenceEnvoiId, setAgenceEnvoiId] = useState('');
  const [agenceRetraitId, setAgenceRetraitId] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: agencesData } = useAgences({ per_page: 100 });
  const agences = agencesData?.data || [];

  const { data, isLoading, refetch } = useReports({
    type: 'transfers',
    params: {
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      statut: statut || undefined,
      agence_envoi_id: agenceEnvoiId ? parseInt(agenceEnvoiId) : undefined,
      agence_retrait_id: agenceRetraitId ? parseInt(agenceRetraitId) : undefined,
      search: search || undefined,
      page,
      per_page: 20,
    },
  });

  const transfers = data?.data || [];
  const totals = data?.totals || { count: 0, montant: 0, frais: 0, total: 0 };
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  const handleReset = () => {
    setDateDebut('');
    setDateFin('');
    setStatut('');
    setAgenceEnvoiId('');
    setAgenceRetraitId('');
    setSearch('');
    setPage(1);
    refetch();
  };

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'info' | 'default' => {
    const variants: Record<string, 'success' | 'danger' | 'warning' | 'info' | 'default'> = {
      ENVOYE: 'warning',
      RETIRE: 'success',
      ANNULE: 'danger',
      EN_ATTENTE: 'info',
      EXPIRE: 'danger',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      ENVOYE: 'En attente',
      RETIRE: 'Retiré',
      ANNULE: 'Annulé',
      EN_ATTENTE: 'En attente',
      EXPIRE: 'Expiré',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapport des transferts</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Tous</option>
            <option value="ENVOYE">En attente</option>
            <option value="RETIRE">Retiré</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Code, référence, nom..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agence d'envoi</label>
          <select
            value={agenceEnvoiId}
            onChange={(e) => setAgenceEnvoiId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Toutes</option>
            {agences.map((a: any) => (
              <option key={a.id} value={a.id}>{a.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agence de retrait</label>
          <select
            value={agenceRetraitId}
            onChange={(e) => setAgenceRetraitId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Toutes</option>
            {agences.map((a: any) => (
              <option key={a.id} value={a.id}>{a.nom}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={handleSearch}>Appliquer</Button>
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
        </div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Nombre de transferts</p>
          <p className="text-2xl font-bold">{totals.count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('fr-FR').format(totals.montant || 0)} GNF
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Frais totaux</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('fr-FR').format(totals.frais || 0)} GNF
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Total encaissé</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat('fr-FR').format(totals.total || 0)} GNF
          </p>
        </div>
      </div>

      {/* Tableau */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun transfert trouvé</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agence envoi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agence retrait</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Frais</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transfers.map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{t.code}</td>
                    <td className="px-4 py-3 text-sm">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-3">{t.agence_envoi || t.agenceEnvoi?.nom || '-'}</td>
                    <td className="px-4 py-3">{t.agence_retrait || t.agenceRetrait?.nom || '-'}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR').format(t.montant || 0)} GNF
                    </td>
                    <td className="px-4 py-3 text-right">
                      {new Intl.NumberFormat('fr-FR').format(t.frais || 0)} GNF
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge variant={getStatusVariant(t.statut)}>
                        {getStatusLabel(t.statut)}
                      </StatusBadge>
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
    </div>
  );
};

export default TransferReportPage;
