import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';

export const TransferReportPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading, refetch } = useReports({
    type: 'transfers',
    params: { date_debut: dateDebut, date_fin: dateFin, statut, page, per_page: 20 }
  });

  const transfers = data?.data || [];
  const total = data?.totals?.count || 0;
  const totalMontant = data?.totals?.montant || 0;
  const totalFrais = data?.totals?.frais || 0;

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapport des transferts</h1>
        <Button variant="outline" onClick={handleSearch}>Rafraîchir</Button>
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
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full">Appliquer</Button>
        </div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Nombre de transferts</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(totalMontant)} GNF</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Frais totaux</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(totalFrais)} GNF</p>
        </div>
      </div>

      {/* Tableau */}
      {isLoading ? (
        <div className="flex justify-center py-8">Chargement...</div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun transfert trouvé</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Expéditeur</th>
                  <th className="px-4 py-2 text-left">Bénéficiaire</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                  <th className="px-4 py-2 text-right">Frais</th>
                  <th className="px-4 py-2 text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t: any) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{t.code}</td>
                    <td className="px-4 py-2">{t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="px-4 py-2">{t.expediteur || '-'}</td>
                    <td className="px-4 py-2">{t.beneficiaire || '-'}</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR').format(t.montant || 0)} GNF
                    </td>
                    <td className="px-4 py-2 text-right">
                      {new Intl.NumberFormat('fr-FR').format(t.frais || 0)} GNF
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        t.statut === 'RETIRE' ? 'bg-green-100 text-green-800' :
                        t.statut === 'ANNULE' ? 'bg-red-100 text-red-800' :
                        t.statut === 'ENVOYE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t.statut || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={data?.last_page || 1}
            onPageChange={setPage}
            total={total}
            perPage={20}
          />
        </>
      )}
    </div>
  );
};

export default TransferReportPage;
