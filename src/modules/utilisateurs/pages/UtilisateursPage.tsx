import React, { useState } from 'react';
import { useUtilisateurs, useToggleActif, useDeleteUtilisateur } from '../hooks/useUtilisateurs';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import { UtilisateurTable } from '../components/UtilisateurTable';
import { UtilisateurFormModal } from '../components/UtilisateurFormModal';

export const UtilisateursPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const { data, isLoading, refetch } = useUtilisateurs({
    page,
    per_page: 20,
    search: search || undefined,
    role: role || undefined,
  });

  const toggleActif = useToggleActif();
  const deleteUser = useDeleteUtilisateur();

  const users = data?.data || [];
  const total = data?.total || 0;
  const lastPage = data?.last_page || 1;

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleToggleActif = async (id: number) => {
    if (!window.confirm('Confirmer le changement de statut de cet utilisateur ?')) return;
    try {
      await toggleActif.mutateAsync(id);
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;
    try {
      await deleteUser.mutateAsync(id);
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleReset = () => {
    setSearch('');
    setRole('');
    setPage(1);
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-sm text-gray-500">
            {total} utilisateur{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={handleCreate}>Nouvel utilisateur</Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tous les rôles</option>
          <option value="SUPERADMIN">SUPERADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="RESPONSABLE">RESPONSABLE</option>
          <option value="AGENT">AGENT</option>
        </select>
        <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
        <Button variant="outline" onClick={() => refetch()}>Rafraîchir</Button>
      </div>

      {/* Tableau */}
      <UtilisateurTable
        data={users}
        isLoading={isLoading}
        isSuperAdmin={isSuperAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActif={handleToggleActif}
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={lastPage}
          onPageChange={setPage}
          total={total}
          perPage={20}
        />
      </div>

      {/* Modal */}
      {isSuperAdmin && (
        <UtilisateurFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default UtilisateursPage;
