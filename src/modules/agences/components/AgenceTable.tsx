import React from 'react';
import { Table } from '../../../components/ui/Table';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import type { Agence } from '../../../types';

interface AgenceTableProps {
  data: Agence[];
  isLoading: boolean;
  onEdit: (agence: Agence) => void;
  onDelete: (id: number) => void;
}

export const AgenceTable: React.FC<AgenceTableProps> = ({ data, isLoading, onEdit, onDelete }) => {
  const columns = [
    { key: 'code', header: 'Code', render: (item: Agence) => <span className="font-mono text-sm font-medium text-blue-600">{item.code}</span> },
    { key: 'nom', header: 'Nom', render: (item: Agence) => <span className="font-medium">{item.nom}</span> },
    { key: 'responsable', header: 'Responsable', render: (item: Agence) => item.responsable || '-' },
    { key: 'telephone', header: 'Téléphone', render: (item: Agence) => item.telephone || '-' },
    { key: 'solde_cache', header: 'Solde', render: (item: Agence) => <span className="font-medium text-green-600">{item.solde_cache.toLocaleString('fr-FR')} GNF</span>, align: 'right' as const },
    { key: 'actif', header: 'Statut', render: (item: Agence) => <StatusBadge status={item.actif ? 'SUCCES' : 'ECHEC'} />, align: 'center' as const },
    { key: 'actions', header: 'Actions', render: (item: Agence) => <div className="flex gap-2"><Button variant="primary" size="sm" onClick={() => onEdit(item)}>Modifier</Button><Button variant="danger" size="sm" onClick={() => onDelete(item.id)}>Supprimer</Button></div>, align: 'center' as const },
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} emptyMessage="Aucune agence trouvée" />;
};
