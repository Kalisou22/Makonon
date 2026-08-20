import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useCreateTransaction } from '../hooks/useTransactions';
import { useClients } from '../../clients/hooks/useClients';
import { useAgences } from '../../agences/hooks/useAgences';
import toast from 'react-hot-toast';

const schema = z.object({
  expediteur_id: z.number().min(1, 'Sélectionnez un expéditeur'),
  beneficiaire_id: z.number().min(1, 'Sélectionnez un bénéficiaire'),
  montant: z.number().min(100, 'Le montant minimum est de 100 GNF'),
  agence_retrait_id: z.number().min(1, 'Sélectionnez une agence de retrait'),
  telephone_destinataire: z.string().optional(),
  nom_destinataire: z.string().optional(),
  reference: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransactionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTransaction = useCreateTransaction();
  const { data: clientsData } = useClients({ per_page: 100 });
  const { data: agencesData } = useAgences({ per_page: 100 });

  const clients = clientsData?.data || [];
  const agences = agencesData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createTransaction.mutateAsync(data);
      reset();
      onClose();
      toast.success('Transfert créé avec succès');
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau transfert">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Expéditeur"
          {...register('expediteur_id', { valueAsNumber: true })}
          error={errors.expediteur_id?.message}
        >
          <option value="">Sélectionner un expéditeur</option>
          {clients.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.nom} - {client.telephone}
            </option>
          ))}
        </Select>

        <Select
          label="Bénéficiaire"
          {...register('beneficiaire_id', { valueAsNumber: true })}
          error={errors.beneficiaire_id?.message}
        >
          <option value="">Sélectionner un bénéficiaire</option>
          {clients.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.nom} - {client.telephone}
            </option>
          ))}
        </Select>

        <Input
          label="Montant (GNF)"
          type="number"
          {...register('montant', { valueAsNumber: true })}
          error={errors.montant?.message}
        />

        <Select
          label="Agence de retrait"
          {...register('agence_retrait_id', { valueAsNumber: true })}
          error={errors.agence_retrait_id?.message}
        >
          <option value="">Sélectionner une agence</option>
          {agences.map((agence: any) => (
            <option key={agence.id} value={agence.id}>
              {agence.nom} - {agence.code}
            </option>
          ))}
        </Select>

        <Input
          label="Téléphone du destinataire"
          {...register('telephone_destinataire')}
          error={errors.telephone_destinataire?.message}
        />

        <Input
          label="Nom du destinataire"
          {...register('nom_destinataire')}
          error={errors.nom_destinataire?.message}
        />

        <Input
          label="Référence (optionnelle)"
          {...register('reference')}
          error={errors.reference?.message}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Créer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  );
};
