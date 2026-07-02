import React, { useState } from 'react';
import { useAuditLogs } from '../hooks/useAudit';
import { AuditTable } from '../components/AuditTable';
import { AuditDetailModal } from '../components/AuditDetailModal';
import { Card } from '../../../components/ui/Card';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Select } from '../../../components/ui/Select';

export const AuditPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = {
    page,
    per_page: perPage,
    ...(actionFilter && { action: actionFilter }),
  };

  const { data, isLoading } = useAuditLogs(filters);

  const handleView = (log: any) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Journal d'audit</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Consultez l'historique des actions effectuées
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Rechercher dans l'audit..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full"
            >
              <option value="">Toutes les actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="transfert_creation">Création transfert</option>
              <option value="transfert_retrait">Retrait transfert</option>
              <option value="transfert_annulation">Annulation transfert</option>
              <option value="client_creation">Création client</option>
              <option value="client_modification">Modification client</option>
              <option value="user_creation">Création utilisateur</option>
              <option value="user_modification">Modification utilisateur</option>
            </Select>
          </div>
        </div>

        <AuditTable
          data={data?.data || []}
          isLoading={isLoading}
          onView={handleView}
        />

        {data && data.last_page > 1 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              Page {data.current_page} sur {data.last_page}
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={data.current_page <= 1}
                onClick={() => setPage(data.current_page - 1)}
              >
                Précédent
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={data.current_page >= data.last_page}
                onClick={() => setPage(data.current_page + 1)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </Card>

      <AuditDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    </div>
  );
};
