import React, { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';
import { ClientTable } from '../components/ClientTable';
import { ClientFormModal } from '../components/ClientFormModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import type { Client } from '../types';

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading, refetch } = useClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  // ✅ L'API retourne directement un tableau, pas une structure paginée
  const clientsArray = Array.isArray(clients) ? clients : clients?.data || [];
  console.log('📊 ClientsPage clientsArray:', clientsArray);

  const filteredData = clientsArray.filter((c: Client) =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone?.includes(search)
  );

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleUpdate = (formData: any) => {
    if (selectedClient) {
      updateMutation.mutate(
        { id: selectedClient.id, data: formData },
        { onSuccess: () => { setIsModalOpen(false); setSelectedClient(null); } }
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
              value={search}
              onChange={setSearch}
              placeholder="Rechercher par nom ou téléphone..."
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
