import React from 'react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Client } from '../services/clientService';

interface ClientTableProps {
  data: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPlafond = (montant?: number) => {
    if (!montant) return '-';
    return montant.toLocaleString('fr-FR') + ' GNF';
  };

  const columns = [
    {
      key: 'nom',
      header: 'Nom',
      render: (item: Client) => (
        <span className="font-medium">{item.nom}</span>
      ),
    },
    {
      key: 'telephone',
      header: 'Téléphone',
      render: (item: Client) => item.telephone,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: Client) => item.email || '-',
    },
    {
      key: 'adresse',
      header: 'Adresse',
      render: (item: Client) => item.adresse || '-',
    },
    {
      key: 'plafondTransaction',
      header: 'Plafond',
      render: (item: Client) => formatPlafond(item.plafondTransaction),
      align: 'right' as const,
    },
    {
      key: 'dateCreation',
      header: 'Création',
      render: (item: Client) => formatDate(item.dateCreation || item.created_at),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Client) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(item)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(item.id)}
          >
            Supprimer
          </Button>
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
      emptyMessage="Aucun client trouvé"
    />
  );
};
