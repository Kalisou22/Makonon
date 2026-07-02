import React, { useState } from 'react';
import { useAgences, useCreateAgence, useUpdateAgence, useDeleteAgence } from '../hooks/useAgences';
import { AgenceTable } from '../components/AgenceTable';
import { AgenceFormModal } from '../components/AgenceFormModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Pagination } from '../../../components/ui/Pagination';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Agence } from '../services/agenceService';

export const AgencesPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);

  const { data, isLoading, refetch } = useAgences(page, pageSize);
  const createMutation = useCreateAgence();
  const updateMutation = useUpdateAgence();
  const deleteMutation = useDeleteAgence();

  const filteredData = data?.content?.filter((a) =>
    a.nom?.toLowerCase().includes(search.toLowerCase()) ||
    a.code?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (formData: any) => {
    if (selectedAgence) {
      updateMutation.mutate(
        { id: selectedAgence.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedAgence(null);
          },
        }
      );
    }
  };

  const handleEdit = (agence: Agence) => {
    setSelectedAgence(agence);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmez-vous la suppression de cette agence ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAgence(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Agences</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouvelle agence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <SearchBar
              placeholder="Rechercher par nom ou code..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <AgenceTable
            data={filteredData}
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

      <AgenceFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedAgence ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={selectedAgence}
      />
    </div>
  );
};
