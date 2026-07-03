import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { Agence } from '../../../types';

const agenceSchema = z.object({
  code: z.string().min(1, 'Code requis').max(20, 'Code trop long'),
  nom: z.string().min(1, 'Nom requis'),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  responsable: z.string().optional(),
  devise: z.string().default('GNF'),
  actif: z.boolean().default(true),
});

type AgenceFormData = z.infer<typeof agenceSchema>;

interface AgenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AgenceFormData) => void;
  isLoading: boolean;
  initialData?: Agence | null;
  title?: string;
}

export const AgenceFormModal: React.FC<AgenceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  title = initialData ? 'Modifier l\'agence' : 'Nouvelle agence',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgenceFormData>({
    resolver: zodResolver(agenceSchema),
    defaultValues: {
      code: '',
      nom: '',
      adresse: '',
      telephone: '',
      email: '',
      responsable: '',
      devise: 'GNF',
      actif: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        nom: initialData.nom,
        adresse: initialData.adresse || '',
        telephone: initialData.telephone || '',
        email: initialData.email || '',
        responsable: initialData.responsable || '',
        devise: initialData.devise || 'GNF',
        actif: initialData.actif,
      });
    } else {
      reset({
        code: '',
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        responsable: '',
        devise: 'GNF',
        actif: true,
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data: AgenceFormData) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Code" placeholder="EX: AG003" {...register('code')} error={errors.code?.message} />
          <Input label="Nom" placeholder="Nom de l'agence" {...register('nom')} error={errors.nom?.message} />
          <Input label="Adresse" placeholder="Adresse" {...register('adresse')} error={errors.adresse?.message} />
          <Input label="Téléphone" placeholder="Téléphone" {...register('telephone')} error={errors.telephone?.message} />
          <Input label="Email" placeholder="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Responsable" placeholder="Nom du responsable" {...register('responsable')} error={errors.responsable?.message} />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('actif')} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">Agence active</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">Annuler</Button>
          <Button type="submit" isLoading={isLoading} >{initialData ? 'Modifier' : 'Créer'}</Button>
        </div>
      </form>
    </Modal>
  );
};
