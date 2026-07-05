import React, { useState } from 'react';
import { useAgences, useCreateAgence, useUpdateAgence, useDeleteAgence } from '../hooks/useAgences';
import { AgenceTable } from '../components/AgenceTable';
import { AgenceFormModal } from '../components/AgenceFormModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import type { Agence } from '../types';

export const AgencesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);

  const filters = { page, per_page: 20 };
  const { data, isLoading, refetch } = useAgences(filters);
  const createMutation = useCreateAgence();
  const updateMutation = useUpdateAgence();
  const deleteMutation = useDeleteAgence();

  console.log('📊 AgencesPage data:', data);

  const filteredData = data?.data?.filter((a: Agence) =>
    a.nom?.toLowerCase().includes(search.toLowerCase()) ||
    a.code?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleUpdate = (formData: any) => {
    if (selectedAgence) {
      updateMutation.mutate(
        { id: selectedAgence.id, data: formData },
        { onSuccess: () => { setIsModalOpen(false); setSelectedAgence(null); } }
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
              value={search}
              onChange={setSearch}
              placeholder="Rechercher par nom ou code..."
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
