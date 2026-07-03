import React, { useState } from 'react';
import { useTransactions, useWithdrawTransaction, useCancelTransaction, useSoldeAgence } from '../hooks/useTransactions';
import { TransactionTable } from '../components/TransactionTable';
import { CreateTransactionModal } from '../components/CreateTransactionModal';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Select } from '../../../components/ui/Select';

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = {
    page,
    per_page: perPage,
    ...(statusFilter && { statut: statusFilter as 'ENVOYE' | 'RETIRE' | 'ANNULE' }),
  };

  const { data, isLoading, refetch } = useTransactions(filters);
  const { data: solde } = useSoldeAgence();
  const withdrawMutation = useWithdrawTransaction();
  const cancelMutation = useCancelTransaction();

  console.log('📊 Transactions data:', data);

  const handleWithdraw = (code: string) => {
    if (window.confirm('Confirmer le retrait de ce transfert ?')) {
      withdrawMutation.mutate(code);
    }
  };

  const handleCancel = (code: string) => {
    const motif = window.prompt('Motif de l\'annulation :');
    if (motif !== null) {
      cancelMutation.mutate({ code, motif: motif || undefined });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'ENVOYE', label: 'Envoyé' },
    { value: 'RETIRE', label: 'Retiré' },
    { value: 'ANNULE', label: 'Annulé' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {solde && (
              <span className="text-green-600 font-medium">
                Solde agence : {solde.solde.toLocaleString('fr-FR')} GNF
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouveau transfert
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Rechercher un transfert..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
              options={statusOptions}
            />
          </div>
        </div>

        <TransactionTable
          data={data?.data || []}
          isLoading={isLoading}
          onWithdraw={handleWithdraw}
          onCancel={handleCancel}
        />

        {data && data.last_page > 1 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              Page {data.current_page} sur {data.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={data.current_page <= 1}
                onClick={() => setPage(data.current_page - 1)}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(data.current_page + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};
