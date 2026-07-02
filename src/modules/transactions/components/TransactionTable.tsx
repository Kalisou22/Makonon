import React from 'react';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Transaction } from '../services/transactionService';

interface TransactionTableProps {
  data: Transaction[];
  isLoading: boolean;
  onWithdraw?: (code: string) => void;
  onCancel?: (code: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  isLoading,
  onWithdraw,
  onCancel,
}) => {
  const formatMontant = (montant: number) => {
    return montant.toLocaleString('fr-FR') + ' GNF';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Transaction) => (
        <span className="font-mono text-sm">{item.code}</span>
      ),
    },
    {
      key: 'montant',
      header: 'Montant',
      render: (item: Transaction) => formatMontant(item.montant),
      align: 'right' as const,
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (item: Transaction) => <StatusBadge status={item.statut} />,
      align: 'center' as const,
    },
    {
      key: 'dateEnvoi',
      header: 'Date',
      render: (item: Transaction) => formatDate(item.dateEnvoi),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Transaction) => (
        <div className="flex gap-2">
          {item.statut === 'ENVOYE' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onWithdraw?.(item.code)}
              >
                Retirer
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel?.(item.code)}
              >
                Annuler
              </Button>
            </>
          )}
        </div>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucune transaction trouvée"
    />
  );
};
