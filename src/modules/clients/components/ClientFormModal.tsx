import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { Client } from '../../../types';

const clientSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  telephone: z.string().min(1, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  adresse: z.string().optional(),
  plafondTransaction: z.number().min(0, 'Montant invalide').optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  isOpen: boolean; onClose: () => void; onSubmit: (data: ClientFormData) => void; isLoading: boolean; initialData?: Client | null; title?: string;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, initialData, title = initialData ? 'Modifier le client' : 'Nouveau client' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({ resolver: zodResolver(clientSchema), defaultValues: { nom: '', telephone: '', email: '', adresse: '', plafondTransaction: undefined } });

  useEffect(() => {
    if (initialData) reset({ nom: initialData.nom, telephone: initialData.telephone, email: initialData.email || '', adresse: initialData.adresse || '', plafondTransaction: initialData.plafondTransaction });
    else reset({ nom: '', telephone: '', email: '', adresse: '', plafondTransaction: undefined });
  }, [initialData, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nom complet" placeholder="Nom du client" {...register('nom')} error={errors.nom?.message} />
          <Input label="Téléphone" placeholder="Téléphone" {...register('telephone')} error={errors.telephone?.message} />
          <Input label="Email" placeholder="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Adresse" placeholder="Adresse" {...register('adresse')} error={errors.adresse?.message} />
          <Input label="Plafond (GNF)" type="number" placeholder="1000000" {...register('plafondTransaction', { valueAsNumber: true })} error={errors.plafondTransaction?.message} />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">Annuler</Button>
          <Button type="submit" isLoading={isLoading} loadingText="Enregistrement...">{initialData ? 'Modifier' : 'Créer'}</Button>
        </div>
      </form>
    </Modal>
  );
};
