import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import Button from '../../../components/ui/Button';

export const FeesReportPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  
  const { data, isLoading, refetch } = useReports({
    type: 'fees',
    params: { date_debut: dateDebut, date_fin: dateFin }
  });

  const totalTransferts = data?.total_transferts || 0;
  const montantTotal = data?.montant_total || 0;
  const fraisTotal = data?.frais_total || 0;
  const details = data?.details || [];

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapport des frais</h1>
        <Button variant="outline" onClick={handleSearch}>Rafraîchir</Button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full">Appliquer</Button>
        </div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Nombre de transferts</p>
          <p className="text-2xl font-bold">{totalTransferts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(montantTotal)} GNF</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Frais totaux</p>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('fr-FR').format(fraisTotal)} GNF</p>
        </div>
      </div>

      {/* Détails */}
      {isLoading ? (
        <div className="flex justify-center py-8">Chargement...</div>
      ) : details.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucune donnée trouvée</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Montant</th>
                <th className="px-4 py-2 text-right">Frais</th>
                <th className="px-4 py-2 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item: any, index: number) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono">{item.code}</td>
                  <td className="px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '-'}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    {new Intl.NumberFormat('fr-FR').format(item.montant || 0)} GNF
                  </td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat('fr-FR').format(item.frais || 0)} GNF
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.statut === 'RETIRE' ? 'bg-green-100 text-green-800' :
                      item.statut === 'ANNULE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.statut || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeesReportPage;
