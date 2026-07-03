import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { Client } from '../types';

const clientSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  telephone: z.string().min(1, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  piece_identite: z.string().optional(),
  numero_piece: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  isLoading: boolean;
  initialData?: Client | null;
  title?: string;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  title = initialData ? 'Modifier le client' : 'Nouveau client',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: '',
      telephone: '',
      email: '',
      piece_identite: '',
      numero_piece: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nom: initialData.nom,
        telephone: initialData.telephone,
        email: initialData.email || '',
        piece_identite: initialData.piece_identite || '',
        numero_piece: initialData.numero_piece || '',
      });
    } else {
      reset({
        nom: '',
        telephone: '',
        email: '',
        piece_identite: '',
        numero_piece: '',
      });
    }
  }, [initialData, reset, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            placeholder="Nom du client"
            {...register('nom')}
            error={errors.nom?.message}
          />
          <Input
            label="Téléphone"
            placeholder="Téléphone"
            {...register('telephone')}
            error={errors.telephone?.message}
          />
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Pièce d'identité"
            placeholder="CNI, Passeport..."
            {...register('piece_identite')}
            error={errors.piece_identite?.message}
          />
          <Input
            label="Numéro de pièce"
            placeholder="Numéro de la pièce"
            {...register('numero_piece')}
            error={errors.numero_piece?.message}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
