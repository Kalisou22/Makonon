import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Utilisateur, CreateUtilisateurData } from '../services/utilisateurService';
import { useAgences } from '../../agences/hooks/useAgences';

const utilisateurSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(6, 'Mot de passe minimum 6 caractères').optional().or(z.literal('')),
  role: z.string().min(1, 'Rôle requis'),
  agenceId: z.number().optional().nullable(),
  actif: z.boolean().default(true),
});

type UtilisateurFormData = z.infer<typeof utilisateurSchema>;

interface UtilisateurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UtilisateurFormData) => void;
  isLoading: boolean;
  initialData?: Utilisateur | null;
  title?: string;
}

export const UtilisateurFormModal: React.FC<UtilisateurFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  title = initialData ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur',
}) => {
  const { data: agencesData, isLoading: agencesLoading } = useAgences(0, 100);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UtilisateurFormData>({
    resolver: zodResolver(utilisateurSchema),
    defaultValues: {
      nom: '',
      email: '',
      motDePasse: '',
      role: '',
      agenceId: null,
      actif: true,
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (initialData) {
      reset({
        nom: initialData.nom,
        email: initialData.email,
        motDePasse: '',
        role: initialData.role,
        agenceId: initialData.agenceId || null,
        actif: initialData.actif,
      });
    } else {
      reset({
        nom: '',
        email: '',
        motDePasse: '',
        role: '',
        agenceId: null,
        actif: true,
      });
    }
  }, [initialData, reset, isOpen]);

  const agenceOptions = agencesData?.content?.map((agence) => ({
    value: agence.id,
    label: agence.nom,
  })) || [];

  const roleOptions = [
    { value: 'SUPERADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'RESPONSABLE', label: 'Responsable' },
    { value: 'AGENT', label: 'Agent' },
  ];

  const handleFormSubmit = (data: UtilisateurFormData) => {
    // Si le mot de passe est vide, ne pas l'envoyer (pour la modification)
    if (!data.motDePasse) {
      delete data.motDePasse;
    }
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            placeholder="Nom de l'utilisateur"
            {...register('nom')}
            error={errors.nom?.message}
          />
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Mot de passe"
            placeholder={initialData ? 'Laisser vide pour conserver' : 'Mot de passe'}
            type="password"
            {...register('motDePasse')}
            error={errors.motDePasse?.message}
          />
          <Select
            label="Rôle"
            options={roleOptions}
            placeholder="Sélectionner un rôle"
            {...register('role')}
            error={errors.role?.message}
          />
          {selectedRole !== 'SUPERADMIN' && (
            <Select
              label="Agence"
              options={agenceOptions}
              placeholder="Sélectionner une agence"
              {...register('agenceId', { valueAsNumber: true })}
              error={errors.agenceId?.message}
              disabled={agencesLoading}
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('actif')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Compte actif</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading} loadingText="Enregistrement...">
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
