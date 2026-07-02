import React, { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';
import { ClientTable } from '../components/ClientTable';
import { ClientFormModal } from '../components/ClientFormModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Pagination } from '../../../components/ui/Pagination';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Client } from '../services/clientService';

export const ClientsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data, isLoading, refetch } = useClients(page, pageSize);
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const filteredData = data?.content?.filter((c) =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone?.includes(search)
  ) || [];

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdate = (formData: any) => {
    if (selectedClient) {
      updateMutation.mutate(
        { id: selectedClient.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedClient(null);
          },
        }
      );
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmez-vous la suppression de ce client ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouveau client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <SearchBar
              placeholder="Rechercher par nom ou téléphone..."
              onSearch={setSearch}
              className="w-full sm:w-64"
            />
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <ClientTable
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

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={selectedClient ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        initialData={selectedClient}
      />
    </div>
  );
};
