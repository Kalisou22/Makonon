import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportService from '../services/reportService';

export default function FeesReportPage() {
  const [filters, setFilters] = useState<any>({});
  const [applied, setApplied] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', 'fees', applied],
    queryFn: () => reportService.getFees(applied),
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

  const report = data?.data || {};
  const details = report.details || [];

  return (
    <div className="p-6 space-y-4 print:p-2">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">💰 Rapport des frais DESA</h1>
        <div className="flex gap-2">
          <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded">🔍 Rechercher</button>
          <button onClick={print} className="px-4 py-2 border rounded">🖨️ Imprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 print:hidden">
        <div><label>Date début</label><input type="date" className="w-full p-2 border rounded" value={filters.date_debut || ''} onChange={e => setFilters({...filters, date_debut: e.target.value})} /></div>
        <div><label>Date fin</label><input type="date" className="w-full p-2 border rounded" value={filters.date_fin || ''} onChange={e => setFilters({...filters, date_fin: e.target.value})} /></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded text-center"><span className="text-sm">Transferts</span><br/><span className="text-2xl font-bold">{report.total_transferts || 0}</span></div>
        <div className="p-4 bg-green-50 rounded text-center"><span className="text-sm">Montant</span><br/><span className="text-2xl font-bold">{(report.montant_total || 0).toLocaleString()} GNF</span></div>
        <div className="p-4 bg-yellow-50 rounded text-center"><span className="text-sm">Frais DESA</span><br/><span className="text-2xl font-bold text-yellow-700">{(report.frais_total || 0).toLocaleString()} GNF</span></div>
      </div>

      <div className="overflow-auto">
        <h3 className="font-semibold mb-2">Détail</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">Code</th><th className="p-2 text-left">Date</th><th className="p-2 text-right">Montant</th><th className="p-2 text-right">Frais</th><th className="p-2 text-left">Statut</th></tr></thead>
          <tbody>
            {details.map((d: any, i: number) => (
              <tr key={i} className="border-b"><td className="p-2 font-mono text-xs">{d.code}</td><td className="p-2">{new Date(d.date).toLocaleDateString()}</td><td className="p-2 text-right">{d.montant.toLocaleString()}</td><td className="p-2 text-right">{d.frais.toLocaleString()}</td><td className="p-2"><span className="px-2 py-0.5 rounded text-xs bg-blue-100">{d.statut}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
