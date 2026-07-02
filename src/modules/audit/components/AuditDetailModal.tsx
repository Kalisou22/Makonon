import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { AuditLog } from '../services/auditService';

interface AuditDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détails de l'audit">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">ID</label>
            <p className="text-gray-900">{log.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Utilisateur</label>
            <p className="text-gray-900">{log.user_name}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Action</label>
          <p className="text-gray-900">{log.action}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Description</label>
          <p className="text-gray-900">{log.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">IP</label>
            <p className="text-gray-900">{log.ip_address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date</label>
            <p className="text-gray-900">
              {new Date(log.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
