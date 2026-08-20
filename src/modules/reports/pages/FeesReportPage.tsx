import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import Button from '../../../components/ui/Button';

export const FeesReportPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const { data, isLoading, refetch } = useReports({
    type: 'fees',
    params: {
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
    },
  });

  const reportData = data?.data;
  const totalTransferts = reportData?.total_transferts || 0;
  const montantTotal = reportData?.montant_total || 0;
  const fraisTotal = reportData?.frais_total || 0;
  const details = reportData?.details || [];

  const handleSearch = () => {
    refetch();
  };

  const handleReset = () => {
    setDateDebut('');
    setDateFin('');
    refetch();
  };

  const getStatutLabel = (statut: string): string => {
    const labels: Record<string, string> = {
      ENVOYE: 'En attente',
      RETIRE: 'Retiré',
      ANNULE: 'Annulé',
    };
    return labels[statut] || statut;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapport des frais</h1>
        <Button variant="outline" onClick={() => refetch()}>
          🔄 Rafraîchir
        </Button>
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
        <div className="flex items-end gap-2">
          <Button onClick={handleSearch}>Appliquer</Button>
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
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
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('fr-FR').format(montantTotal)} GNF
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Frais totaux</p>
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('fr-FR').format(fraisTotal)} GNF
          </p>
        </div>
      </div>

      {/* Détails */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : details.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucune donnée trouvée</div>
      ) : (
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
              {details.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{item.code}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3">{item.agence_envoi || '-'}</td>
                  <td className="px-4 py-3">{item.agence_retrait || '-'}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {new Intl.NumberFormat('fr-FR').format(item.montant || 0)} GNF
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {new Intl.NumberFormat('fr-FR').format(item.frais || 0)} GNF
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.statut === 'RETIRE' ? 'bg-green-100 text-green-800' :
                      item.statut === 'ANNULE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatutLabel(item.statut)}
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
