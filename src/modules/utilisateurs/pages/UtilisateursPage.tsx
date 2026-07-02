import React, { useState } from 'react';
import { useUtilisateurs, useCreateUtilisateur, useUpdateUtilisateur, useDeleteUtilisateur } from '../hooks/useUtilisateurs';
import { UtilisateurTable } from '../components/UtilisateurTable';
import { UtilisateurFormModal } from '../components/UtilisateurFormModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Select } from '../../../components/ui/Select';
import { Pagination } from '../../../components/ui/Pagination';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import type { Utilisateur } from '../../../types';

export const UtilisateursPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);

  const { data, isLoading, refetch } = useUtilisateurs(page, pageSize, search, roleFilter);
  const createMutation = useCreateUtilisateur();
  const updateMutation = useUpdateUtilisateur();
  const deleteMutation = useDeleteUtilisateur();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (formData: any) => {
    if (selectedUtilisateur) {
      updateMutation.mutate(
        { id: selectedUtilisateur.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedUtilisateur(null);
          },
        }
      );
    }
  };

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmez-vous la suppression de cet utilisateur ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUtilisateur(null);
  };

  const roleOptions = [
    { value: 'Tous', label: 'Tous les rôles' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'RESPONSABLE', label: 'Responsable' },
    { value: 'AGENT', label: 'Agent' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouvel utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              <SearchBar
                placeholder="Rechercher par nom ou email..."
                onSearch={setSearch}
                className="w-full sm:w-64"
              />
              <Select
                options={roleOptions}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-40"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <UtilisateurTable
            data={data?.content || []}
            isLoading={isLoading || deleteMutation.isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardBody>
      </Card>

      <Pagination
        currentPage={page + 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(newPage) => setPage(newPage - 1)}
      />

      <UtilisateurFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedUtilisateur ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={selectedUtilisateur}
      />
    </div>
  );
};
