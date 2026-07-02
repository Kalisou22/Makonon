import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAgences } from '../../agences/hooks/useAgences';

const transactionSchema = z.object({
  montant: z.number({ invalid_type_error: 'Le montant doit être un nombre' })
    .min(100, 'Montant minimum 100 GNF')
    .max(999999999.99, 'Montant maximum 999,999,999.99 GNF'),
  expediteurNom: z.string().min(1, 'Nom requis'),
  expediteurContact: z.string().min(1, 'Téléphone requis'),
  beneficiaireNom: z.string().min(1, 'Nom requis'),
  beneficiaireContact: z.string().min(1, 'Téléphone requis'),
  agenceReceptionId: z.number().min(1, 'Agence requise'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (data: TransactionFormData & { idempotencyKey: string }) => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
}) => {
  const { data: agences, isLoading: agencesLoading } = useAgences();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      montant: undefined,
      expediteurNom: '',
      expediteurContact: '',
      beneficiaireNom: '',
      beneficiaireContact: '',
      agenceReceptionId: undefined,
    },
  });

  const handleFormSubmit = (data: TransactionFormData) => {
    const idempotencyKey = `transfert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    onSubmit({ ...data, idempotencyKey });
    reset();
    onClose();
  };

  const agenceOptions = agences?.map((agence) => ({
    value: agence.id,
    label: agence.nom,
  })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau transfert" maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-700 text-sm">EXPÉDITEUR</h4>
            <Input
              label="Nom complet"
              placeholder="Nom de l'expéditeur"
              {...register('expediteurNom')}
              error={errors.expediteurNom?.message}
            />
            <Input
              label="Téléphone"
              placeholder="Téléphone de l'expéditeur"
              {...register('expediteurContact')}
              error={errors.expediteurContact?.message}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-blue-700 text-sm">BÉNÉFICIAIRE</h4>
            <Input
              label="Nom complet"
              placeholder="Nom du bénéficiaire"
              {...register('beneficiaireNom')}
              error={errors.beneficiaireNom?.message}
            />
            <Input
              label="Téléphone"
              placeholder="Téléphone du bénéficiaire"
              {...register('beneficiaireContact')}
              error={errors.beneficiaireContact?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Montant (GNF)"
            type="number"
            placeholder="1000"
            {...register('montant', { valueAsNumber: true })}
            error={errors.montant?.message}
          />
          <Select
            label="Agence de retrait"
            options={agenceOptions}
            placeholder="Sélectionner une agence"
            {...register('agenceReceptionId', { valueAsNumber: true })}
            error={errors.agenceReceptionId?.message}
            disabled={agencesLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading} loadingText="Création...">
            Créer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  );
};
