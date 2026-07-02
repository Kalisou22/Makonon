import React, { useState, useEffect } from 'react';
import { useAuditLogs, useDeleteAuditLog } from '../hooks/useAudit';
import { AuditTable } from '../components/AuditTable';
import { AuditDetailModal } from '../components/AuditDetailModal';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { Pagination } from '../../../components/ui/Pagination';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { AuditLog } from '../services/auditService';

export const AuditPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, refetch } = useAuditLogs(page, pageSize, debouncedSearch);
  const deleteMutation = useDeleteAuditLog();

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmez-vous la suppression de ce journal ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    // TODO: Implémenter l'export CSV
    alert('Export CSV à implémenter');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Journal d\'audit</h1>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Exporter CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <SearchBar
            placeholder="Rechercher par utilisateur, action, description..."
            onSearch={setSearch}
            className="w-full"
          />
        </CardHeader>
        <CardBody>
          <AuditTable
            data={data?.content || []}
            isLoading={isLoading || deleteMutation.isPending}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
          />
        </CardBody>
      </Card>

      <Pagination
        currentPage={page + 1}
        totalPages={data?.totalPages || 1}
        onPageChange={(newPage) => setPage(newPage - 1)}
      />

      <AuditDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    </div>
  );
};
