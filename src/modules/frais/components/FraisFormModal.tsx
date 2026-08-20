import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useCreateFrais, useUpdateFrais } from '../hooks/useFrais';
import toast from 'react-hot-toast';

interface FraisFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any | null;
  onSuccess: () => void;
}

export const FraisFormModal: React.FC<FraisFormModalProps> = ({
  isOpen,
  onClose,
  config,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: 'POURCENTAGE' as 'FIXE' | 'POURCENTAGE' | 'ECHELONNE',
    valeur: '',
    seuil_min: '',
    seuil_max: '',
    actif: true,
    date_debut: '',
    date_fin: '',
  });

  const createMutation = useCreateFrais();
  const updateMutation = useUpdateFrais();
  const isEditing = !!config;

  useEffect(() => {
    if (config) {
      setFormData({
        nom: config.nom || '',
        description: config.description || '',
        type: config.type || 'POURCENTAGE',
        valeur: config.valeur?.toString() || '',
        seuil_min: config.seuil_min?.toString() || '',
        seuil_max: config.seuil_max?.toString() || '',
        actif: config.actif !== undefined ? config.actif : true,
        date_debut: config.date_debut ? config.date_debut.split('T')[0] : '',
        date_fin: config.date_fin ? config.date_fin.split('T')[0] : '',
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        type: 'POURCENTAGE',
        valeur: '',
        seuil_min: '',
        seuil_max: '',
        actif: true,
        date_debut: '',
        date_fin: '',
      });
    }
  }, [config, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.valeur || !formData.date_debut) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    const data = {
      nom: formData.nom,
      description: formData.description || undefined,
      type: formData.type,
      valeur: parseFloat(formData.valeur),
      seuil_min: formData.seuil_min ? parseFloat(formData.seuil_min) : undefined,
      seuil_max: formData.seuil_max ? parseFloat(formData.seuil_max) : undefined,
      actif: formData.actif,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin || undefined,
    };

    try {
      if (isEditing && config) {
        await updateMutation.mutateAsync({ id: config.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  const typeOptions = [
    { value: 'FIXE', label: 'Fixe (montant en GNF)' },
    { value: 'POURCENTAGE', label: 'Pourcentage' },
    { value: 'ECHELONNE', label: 'Échelonné' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier la configuration' : 'Nouvelle configuration'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom *"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Select
          label="Type *"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          options={typeOptions}
          required
        />

        <Input
          label={formData.type === 'FIXE' ? 'Montant fixe (GNF) *' : 'Valeur (%) *'}
          type="number"
          value={formData.valeur}
          onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
          required
          min="0"
          step={formData.type === 'FIXE' ? '100' : '0.01'}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Seuil minimum (GNF)"
            type="number"
            value={formData.seuil_min}
            onChange={(e) => setFormData({ ...formData, seuil_min: e.target.value })}
            min="0"
            step="100"
          />
          <Input
            label="Seuil maximum (GNF)"
            type="number"
            value={formData.seuil_max}
            onChange={(e) => setFormData({ ...formData, seuil_max: e.target.value })}
            min="0"
            step="100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date début *"
            type="date"
            value={formData.date_debut}
            onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
            required
          />
          <Input
            label="Date fin"
            type="date"
            value={formData.date_fin}
            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="actif"
            checked={formData.actif}
            onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="actif" className="text-sm">Configuration active</label>
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

export default FraisFormModal;
