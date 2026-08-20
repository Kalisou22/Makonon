import React, { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import type { FraisConfiguration } from '../types'

interface FraisFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
  initialData?: FraisConfiguration | null
}

export const FraisFormModal: React.FC<FraisFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: 'FIXE' as 'FIXE' | 'POURCENTAGE' | 'ECHELONNE',
    valeur: '',
    seuil_min: '0',
    seuil_max: '',
    actif: true,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        description: initialData.description || '',
        type: initialData.type || 'FIXE',
        valeur: String(initialData.valeur || ''),
        seuil_min: String(initialData.seuil_min || '0'),
        seuil_max: String(initialData.seuil_max || ''),
        actif: initialData.actif !== undefined ? initialData.actif : true,
      })
    } else {
      setFormData({
        nom: '',
        description: '',
        type: 'FIXE',
        valeur: '',
        seuil_min: '0',
        seuil_max: '',
        actif: true,
      })
    }
  }, [initialData, isOpen])

  const typeOptions = [
    { value: 'FIXE', label: 'Fixe (montant fixe)' },
    { value: 'POURCENTAGE', label: 'Pourcentage (%)' },
    { value: 'ECHELONNE', label: 'Échelonné (par tranches)' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      valeur: parseFloat(formData.valeur) || 0,
      seuil_min: parseFloat(formData.seuil_min) || 0,
      seuil_max: formData.seuil_max ? parseFloat(formData.seuil_max) : null,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Modifier la configuration' : 'Nouvelle configuration de frais'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          placeholder="Ex: Frais standard"
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description optionnelle"
        />
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          options={typeOptions}
        />
        <Input
          label={formData.type === 'POURCENTAGE' ? 'Valeur (%)' : 'Valeur (GNF)'}
          type="number"
          value={formData.valeur}
          onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
          required
          step={formData.type === 'POURCENTAGE' ? '0.01' : '100'}
          min="0"
        />
        <Input
          label="Seuil minimum (GNF)"
          type="number"
          value={formData.seuil_min}
          onChange={(e) => setFormData({ ...formData, seuil_min: e.target.value })}
          step="100"
          min="0"
        />
        <Input
          label="Seuil maximum (GNF)"
          type="number"
          value={formData.seuil_max}
          onChange={(e) => setFormData({ ...formData, seuil_max: e.target.value })}
          step="100"
          min="0"
          placeholder="Optionnel"
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {initialData ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default FraisFormModal
