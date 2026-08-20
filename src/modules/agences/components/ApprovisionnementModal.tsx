import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useApprovisionnement } from '../hooks/useApprovisionnement';
import toast from 'react-hot-toast';

interface ApprovisionnementModalProps {
  isOpen: boolean;
  onClose: () => void;
  agence: any;
  onSuccess: () => void;
}

export const ApprovisionnementModal: React.FC<ApprovisionnementModalProps> = ({
  isOpen,
  onClose,
  agence,
  onSuccess,
}) => {
  const [montant, setMontant] = useState('');
  const [observation, setObservation] = useState('');
  const { mutate, isPending } = useApprovisionnement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montantNum = parseFloat(montant);
    if (!montant || isNaN(montantNum) || montantNum <= 0) {
      toast.error('Veuillez saisir un montant valide');
      return;
    }

    if (!agence?.caisse?.id) {
      toast.error('Cette agence n\'a pas de caisse associée');
      return;
    }

    try {
      await mutate({
        agence_id: agence.id,
        caisse_id: agence.caisse.id,
        montant: montantNum,
        observation: observation || undefined,
      });
      onSuccess();
      setMontant('');
      setObservation('');
      toast.success(`Approvisionnement de ${new Intl.NumberFormat('fr-FR').format(montantNum)} GNF effectué`);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approvisionnement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Agence</p>
          <p className="font-semibold">{agence?.nom} ({agence?.code})</p>
          <p className="text-sm text-gray-600 mt-2">Solde actuel</p>
          <p className="font-semibold text-green-600">
            {new Intl.NumberFormat('fr-FR').format(agence?.solde_physique || 0)} GNF
          </p>
        </div>

        <Input
          label="Montant (GNF)"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          placeholder="Ex: 10000000"
          required
          min="1"
          step="100"
        />

        <Input
          label="Observation (optionnelle)"
          type="text"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Motif de l'approvisionnement..."
        />

        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
          ⚠️ Cette opération va augmenter le solde de la caisse de l'agence.
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Approvisionner
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApprovisionnementModal;
