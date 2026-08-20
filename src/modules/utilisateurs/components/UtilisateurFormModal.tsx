import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useCreateUtilisateur, useUpdateUtilisateur } from '../hooks/useUtilisateurs';
import { useAgences } from '../../agences/hooks/useAgences';
import toast from 'react-hot-toast';
import type { Utilisateur } from '../types';

interface UtilisateurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: Utilisateur | null;
  onSuccess: () => void;
}

export const UtilisateurFormModal: React.FC<UtilisateurFormModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'AGENT' as 'SUPERADMIN' | 'ADMIN' | 'RESPONSABLE' | 'AGENT',
    agence_id: null as number | null,
    telephone: '',
    actif: true,
    daily_limit: '',
  });

  const { data: agencesData } = useAgences({ per_page: 100 });
  const agences = agencesData?.data || [];

  const createMutation = useCreateUtilisateur();
  const updateMutation = useUpdateUtilisateur();

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        password: '',
        role: user.role || 'AGENT',
        agence_id: user.agence_id || null,
        telephone: user.telephone || '',
        actif: user.actif !== undefined ? user.actif : true,
        daily_limit: user.daily_limit?.toString() || '',
      });
    } else {
      setFormData({
        nom: '',
        email: '',
        password: '',
        role: 'AGENT',
        agence_id: null,
        telephone: '',
        actif: true,
        daily_limit: '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.email) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error('Veuillez saisir un mot de passe');
      return;
    }

    const data = {
      nom: formData.nom,
      email: formData.email,
      role: formData.role,
      agence_id: formData.role === 'SUPERADMIN' ? null : formData.agence_id,
      telephone: formData.telephone || undefined,
      actif: formData.actif,
      daily_limit: formData.daily_limit ? parseFloat(formData.daily_limit) : undefined,
    };

    if (!isEditing) {
      (data as any).password = formData.password;
    }

    try {
      if (isEditing && user) {
        await updateMutation.mutateAsync({ id: user.id, data });
      } else {
        await createMutation.mutateAsync(data as any);
      }
      onSuccess();
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  const roleOptions = [
    { value: 'SUPERADMIN', label: 'SUPERADMIN' },
    { value: 'ADMIN', label: 'ADMIN' },
    { value: 'RESPONSABLE', label: 'RESPONSABLE' },
    { value: 'AGENT', label: 'AGENT' },
  ];

  const agenceOptions = [
    { value: '', label: 'Aucune' },
    ...agences.map((a: any) => ({ value: String(a.id), label: a.nom })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom *"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />

        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {!isEditing && (
          <Input
            label="Mot de passe *"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
          />
        )}

        {isEditing && (
          <Input
            label="Nouveau mot de passe (laisser vide pour ne pas changer)"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            minLength={8}
          />
        )}

        <Select
          label="Rôle"
          value={formData.role}
          onChange={(e) => setFormData({
            ...formData,
            role: e.target.value as any,
            agence_id: e.target.value === 'SUPERADMIN' ? null : formData.agence_id,
          })}
          options={roleOptions}
          required
        />

        {formData.role !== 'SUPERADMIN' && (
          <Select
            label="Agence"
            value={formData.agence_id?.toString() || ''}
            onChange={(e) => setFormData({
              ...formData,
              agence_id: e.target.value ? parseInt(e.target.value) : null,
            })}
            options={agenceOptions}
          />
        )}

        <Input
          label="Téléphone"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
        />

        <Input
          label="Limite journalière (GNF)"
          type="number"
          value={formData.daily_limit}
          onChange={(e) => setFormData({ ...formData, daily_limit: e.target.value })}
          min="0"
          step="100"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="actif"
            checked={formData.actif}
            onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="actif" className="text-sm">Compte actif</label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UtilisateurFormModal;
