import React from 'react';
import StatusBadge from '../../../components/ui/StatusBadge';

interface TransactionStatusBadgeProps {
  status: string;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const getVariant = (status: string) => {
    switch (status) {
      case 'ENVOYE':
        return 'warning';
      case 'RETIRE':
        return 'success';
      case 'ANNULE':
        return 'danger';
      case 'EN_ATTENTE':
        return 'info';
      case 'EXPIRE':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'ENVOYE':
        return 'En attente';
      case 'RETIRE':
        return 'Retiré';
      case 'ANNULE':
        return 'Annulé';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EXPIRE':
        return 'Expiré';
      default:
        return status;
    }
  };

  const variant = getVariant(status);
  const label = getLabel(status);

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
};

export default TransactionStatusBadge;
