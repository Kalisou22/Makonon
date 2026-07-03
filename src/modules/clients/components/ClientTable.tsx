import React from 'react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import type { Client } from '../types';

interface ClientTableProps {
  data: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'nom',
      header: 'Nom',
      render: (item: Client) => <span className="font-medium">{item.nom}</span>,
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
      key: 'piece_identite',
      header: 'Pièce',
      render: (item: Client) => item.piece_identite || '-',
    },
    {
      key: 'numero_piece',
      header: 'N° Pièce',
      render: (item: Client) => item.numero_piece || '-',
    },
    {
      key: 'created_at',
      header: 'Création',
      render: (item: Client) => formatDate(item.created_at),
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Client) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(item)}>
            Modifier
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>
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
