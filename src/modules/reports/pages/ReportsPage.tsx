import { Link } from 'react-router-dom';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Rapports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/reports/transfers" className="p-6 bg-white rounded-lg shadow hover:shadow-lg border">
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-lg font-semibold">Transferts</h2>
          <p className="text-gray-500 text-sm">Liste et totaux des transferts</p>
        </Link>
        <Link to="/reports/fees" className="p-6 bg-white rounded-lg shadow hover:shadow-lg border">
          <div className="text-3xl mb-2">💰</div>
          <h2 className="text-lg font-semibold">Frais DESA</h2>
          <p className="text-gray-500 text-sm">Gain de l'entreprise en frais</p>
        </Link>
      </div>
    </div>
  );
}
