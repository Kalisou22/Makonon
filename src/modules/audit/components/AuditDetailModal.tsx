import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { AuditLog } from '../services/auditService';

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails du journal" maxWidth="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">ID</label>
            <p className="mt-1 text-sm">#{log.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date</label>
            <p className="mt-1 text-sm">{formatDate(log.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Utilisateur</label>
            <p className="mt-1 text-sm">{log.utilisateurNom || 'Système'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Action</label>
            <p className="mt-1 text-sm font-medium">{log.action}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Entité</label>
            <p className="mt-1 text-sm">{log.entite} {log.entiteId && `#${log.entiteId}`}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">IP</label>
            <p className="mt-1 text-sm">{log.ip || '-'}</p>
          </div>
        </div>

        {log.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">{log.description}</p>
          </div>
        )}

        {log.oldData && (
          <div>
            <label className="text-sm font-medium text-gray-500">Anciennes données</label>
            <pre className="mt-1 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
              {JSON.stringify(log.oldData, null, 2)}
            </pre>
          </div>
        )}

        {log.newData && (
          <div>
            <label className="text-sm font-medium text-gray-500">Nouvelles données</label>
            <pre className="mt-1 text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
              {JSON.stringify(log.newData, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
