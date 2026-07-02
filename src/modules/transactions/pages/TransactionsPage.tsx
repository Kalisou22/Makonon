import React, { useState } from 'react';
import { useTransactions, useCreateTransaction, useWithdrawTransaction, useCancelTransaction } from '../hooks/useTransactions';
import { TransactionTable } from '../components/TransactionTable';
import { CreateTransactionModal } from '../components/CreateTransactionModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Pagination } from '../../../components/ui/Pagination';
import { Select } from '../../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('Tous');

  const { data, isLoading, isError, refetch } = useTransactions(page, pageSize);

  const createMutation = useCreateTransaction();
  const withdrawMutation = useWithdrawTransaction();
  const cancelMutation = useCancelTransaction();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleWithdraw = (code: string) => {
    if (window.confirm('Confirmez-vous le retrait de ce transfert ?')) {
      withdrawMutation.mutate(code);
    }
  };

  const handleCancel = (code: string) => {
    if (window.confirm('Confirmez-vous l\'annulation de ce transfert ?')) {
      cancelMutation.mutate(code);
    }
  };

  const filteredData = data?.content?.filter((t) => {
    if (statutFilter !== 'Tous' && t.statut !== statutFilter) return false;
    if (search && !t.code?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          isLoading={createMutation.isPending}
        >
          Nouveau transfert
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              <SearchBar
                placeholder="Rechercher par code..."
                onSearch={setSearch}
                className="w-full sm:w-64"
              />
              <Select
                options={[
                  { value: 'Tous', label: 'Tous' },
                  { value: 'ENVOYE', label: 'ENVOYÉ' },
                  { value: 'RETIRE', label: 'RETIRÉ' },
                  { value: 'ANNULE', label: 'ANNULÉ' },
                ]}
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
            >
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <TransactionTable
            data={filteredData}
            isLoading={isLoading || withdrawMutation.isPending || cancelMutation.isPending}
            onWithdraw={handleWithdraw}
            onCancel={handleCancel}
          />
        </CardBody>
      </Card>

      <Pagination
        currentPage={page + 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(newPage) => setPage(newPage - 1)}
      />

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={createMutation.isPending}
        onSubmit={handleCreate}
      />
    </div>
  );
};
