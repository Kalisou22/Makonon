import React, { useState } from 'react';
import { useMouvements } from '../hooks/useMouvements';
import { useAuthStore } from '../../../store/authStore';

export const MouvementsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [motif, setMotif] = useState('');
  const { user } = useAuthStore();

  const { data, isLoading, refetch } = useMouvements({
    page,
    per_page: 20,
    type: type || undefined,
    motif: motif || undefined,
  });

  const mouvements = data?.data || [];
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const getTypeBadge = (type: string) => {
    return type === 'ENTREE' ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        + Entrée
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        - Sortie
      </span>
    );
  };

  const getMotifBadge = (motif: string) => {
    const variants: Record<string, string> = {
      ENVOI: 'bg-blue-100 text-blue-800',
      RETRAIT: 'bg-purple-100 text-purple-800',
      APPROVISIONNEMENT: 'bg-indigo-100 text-indigo-800',
      ANNULATION: 'bg-orange-100 text-orange-800',
      DEPOT: 'bg-teal-100 text-teal-800',
      AJUSTEMENT: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[motif] || 'bg-gray-100 text-gray-800'}`}>
        {motif}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mouvements de caisse</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          Rafraîchir
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tous les types</option>
          <option value="ENTREE">Entrées</option>
          <option value="SORTIE">Sorties</option>
        </select>
        <select
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tous les motifs</option>
          <option value="ENVOI">Envoi</option>
          <option value="RETRAIT">Retrait</option>
          <option value="APPROVISIONNEMENT">Approvisionnement</option>
          <option value="ANNULATION">Annulation</option>
        </select>
        <button
          onClick={() => { setType(''); setMotif(''); }}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Réinitialiser
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : mouvements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun mouvement trouvé</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mouvements.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{getTypeBadge(m.type)}</td>
                    <td className="px-4 py-3">{getMotifBadge(m.motif)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${m.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.type === 'ENTREE' ? '+' : '-'}
                      {new Intl.NumberFormat('fr-FR').format(Number(m.montant))} GNF
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{m.reference || '-'}</td>
                    <td className="px-4 py-3">{m.utilisateur_nom || m.utilisateur?.nom || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {m.date_mouvement ? new Date(m.date_mouvement).toLocaleString('fr-FR') : 
                       m.created_at ? new Date(m.created_at).toLocaleString('fr-FR') : '-'}
                    </td>
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
    </div>
  );
};

export default MouvementsPage;
