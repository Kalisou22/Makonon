import React, { useState } from 'react';
import { useTransactions, useValiderTransaction, useAnnulerTransaction } from '../hooks/useTransactions';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import StatusBadge from '../../../components/ui/StatusBadge';
import { CreateTransactionModal } from '../components/CreateTransactionModal';

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useTransactions({ page, per_page: 20, search, statut });
  const validerMutation = useValiderTransaction();
  const annulerMutation = useAnnulerTransaction();

  const transactions = data?.data || [];
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const handleValider = async (id: number) => {
    if (!window.confirm('Confirmer le retrait de ce transfert ?')) return;
    try {
      await validerMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleAnnuler = async (id: number) => {
    if (!window.confirm('Confirmer l\'annulation de ce transfert ?')) return;
    const motif = window.prompt('Motif de l\'annulation :');
    try {
      await annulerMutation.mutateAsync({ id, motif: motif || undefined });
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, string> = {
      ENVOYE: 'warning',
      RETIRE: 'success',
      ANNULE: 'danger',
      EN_ATTENTE: 'info',
      EXPIRE: 'danger',
    };
    return <StatusBadge variant={variants[statut] || 'default'}>{statut}</StatusBadge>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transferts</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nouveau transfert</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un transfert..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tous les statuts</option>
          <option value="ENVOYE">En attente de retrait</option>
          <option value="RETIRE">Retiré</option>
          <option value="ANNULE">Annulé</option>
          <option value="EN_ATTENTE">En attente</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">Chargement...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun transfert trouvé</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Expéditeur</th>
                  <th className="px-4 py-2 text-left">Bénéficiaire</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                  <th className="px-4 py-2 text-center">Statut</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{t.code}</td>
                    <td className="px-4 py-2">{t.expediteur?.nom || '-'}</td>
                    <td className="px-4 py-2">{t.beneficiaire?.nom || '-'}</td>
                    <td className="px-4 py-2 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR').format(Number(t.montant))} GNF
                    </td>
                    <td className="px-4 py-2 text-center">{getStatutBadge(t.statut)}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        {t.statut === 'ENVOYE' && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleValider(t.id)}
                              isLoading={validerMutation.isPending}
                            >
                              Retirer
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleAnnuler(t.id)}
                              isLoading={annulerMutation.isPending}
                            >
                              Annuler
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={lastPage}
            onPageChange={setPage}
            total={total}
            perPage={20}
          />
        </>
      )}

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
