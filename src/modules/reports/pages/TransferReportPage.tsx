import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportService from '../services/reportService';

export default function TransferReportPage() {
  const [filters, setFilters] = useState<any>({});
  const [applied, setApplied] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', 'transfers', applied],
    queryFn: () => reportService.getTransfers(applied),
    enabled: !!applied,
  });

  const search = () => {
    const f: any = {};
    if (filters.date_debut) f.date_debut = filters.date_debut;
    if (filters.date_fin) f.date_fin = filters.date_fin;
    setApplied(f);
    refetch();
  };

  const print = () => window.print();

  if (isLoading) return <div className="p-8 text-center">⏳ Chargement...</div>;

  const transfers = data?.data || [];
  const totals = data?.totals || { count: 0, montant: 0, frais: 0, total: 0 };

  return (
    <div className="p-6 space-y-4 print:p-2">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">📊 Rapport des transferts</h1>
        <div className="flex gap-2">
          <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded">🔍 Rechercher</button>
          <button onClick={print} className="px-4 py-2 border rounded">🖨️ Imprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 print:hidden">
        <div><label>Date début</label><input type="date" className="w-full p-2 border rounded" value={filters.date_debut || ''} onChange={e => setFilters({...filters, date_debut: e.target.value})} /></div>
        <div><label>Date fin</label><input type="date" className="w-full p-2 border rounded" value={filters.date_fin || ''} onChange={e => setFilters({...filters, date_fin: e.target.value})} /></div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-blue-50 rounded"><span className="text-sm">Nombre</span><br/><span className="text-xl font-bold">{totals.count}</span></div>
        <div className="p-3 bg-green-50 rounded"><span className="text-sm">Montant</span><br/><span className="text-xl font-bold">{totals.montant.toLocaleString()} GNF</span></div>
        <div className="p-3 bg-yellow-50 rounded"><span className="text-sm">Frais</span><br/><span className="text-xl font-bold">{totals.frais.toLocaleString()} GNF</span></div>
        <div className="p-3 bg-purple-50 rounded"><span className="text-sm">Total</span><br/><span className="text-xl font-bold">{totals.total.toLocaleString()} GNF</span></div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">Code</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Expéditeur</th><th className="p-2 text-left">Bénéficiaire</th><th className="p-2 text-right">Montant</th><th className="p-2 text-right">Frais</th><th className="p-2 text-right">Total</th><th className="p-2 text-left">Statut</th></tr></thead>
          <tbody>
            {transfers.map((t: any) => (
              <tr key={t.id} className="border-b"><td className="p-2 font-mono text-xs">{t.code}</td><td className="p-2">{new Date(t.date).toLocaleDateString()}</td><td className="p-2">{t.expediteur}</td><td className="p-2">{t.beneficiaire}</td><td className="p-2 text-right">{t.montant.toLocaleString()}</td><td className="p-2 text-right">{t.frais.toLocaleString()}</td><td className="p-2 text-right">{t.total.toLocaleString()}</td><td className="p-2"><span className={`px-2 py-0.5 rounded text-xs ${t.statut === 'RETIRE' ? 'bg-green-100' : t.statut === 'ANNULE' ? 'bg-red-100' : 'bg-yellow-100'}`}>{t.statut}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {transfers.length === 0 && <p className="text-center text-gray-500">Aucun transfert trouvé</p>}
    </div>
  );
}
