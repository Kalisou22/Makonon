import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useCreateTransaction } from '../hooks/useTransactions';
import { useAgencyStore } from '../../../store/agencyStore';
import { useAgences } from '../../agences/hooks/useAgences';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom_expediteur: '',
    telephone_expediteur: '',
    nom_beneficiaire: '',
    telephone_beneficiaire: '',
    montant: '',
    agence_destinataire_id: '',
  });

  const { agencyId } = useAgencyStore();
  const createMutation = useCreateTransaction();
  const { data: agences } = useAgences();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idempotency_key = `trf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    createMutation.mutate(
      {
        nom_expediteur: formData.nom_expediteur,
        telephone_expediteur: formData.telephone_expediteur,
        nom_beneficiaire: formData.nom_beneficiaire,
        telephone_beneficiaire: formData.telephone_beneficiaire,
        montant: parseFloat(formData.montant),
        agence_envoi_id: agencyId || 0,
        agence_destinataire_id: parseInt(formData.agence_destinataire_id),
        idempotency_key,
      },
      {
        onSuccess: () => {
          setFormData({
            nom_expediteur: '',
            telephone_expediteur: '',
            nom_beneficiaire: '',
            telephone_beneficiaire: '',
            montant: '',
            agence_destinataire_id: '',
          });
          onClose();
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Transfert">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom expéditeur"
            name="nom_expediteur"
            value={formData.nom_expediteur}
            onChange={handleChange}
            required
          />
          <Input
            label="Téléphone expéditeur"
            name="telephone_expediteur"
            value={formData.telephone_expediteur}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom bénéficiaire"
            name="nom_beneficiaire"
            value={formData.nom_beneficiaire}
            onChange={handleChange}
            required
          />
          <Input
            label="Téléphone bénéficiaire"
            name="telephone_beneficiaire"
            value={formData.telephone_beneficiaire}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Montant (GNF)"
            name="montant"
            type="number"
            value={formData.montant}
            onChange={handleChange}
            required
            min="100"
            step="100"
          />
          <Select
            label="Agence destination"
            name="agence_destinataire_id"
            value={formData.agence_destinataire_id}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une agence</option>
            {agences?.data?.map((agence) => (
              <option key={agence.id} value={agence.id}>
                {agence.nom} ({agence.code})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
            Créer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  );
};
