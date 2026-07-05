import React, { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { useCreateTransaction } from '../hooks/useTransactions'
import { useAgencyStore } from '../../../store/agencyStore'
import { useAgences } from '../../agences/hooks/useAgences'
import { useAuthStore } from '../../../store/authStore'

interface CreateTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom_expediteur: '',
    telephone_expediteur: '',
    nom_beneficiaire: '',
    telephone_beneficiaire: '',
    montant: '',
    agence_destinataire_id: '',
  })

  const { agencyId } = useAgencyStore()
  const { user } = useAuthStore()
  const createMutation = useCreateTransaction()
  const { data: agences, isLoading: agencesLoading, refetch } = useAgences({ per_page: 100 })

  // ✅ Récupérer l'agence de l'utilisateur
  const userAgenceId = user?.agence_id || agencyId

  useEffect(() => {
    if (isOpen) {
      refetch()
    }
  }, [isOpen, refetch])

  // ✅ Filtrer les agences disponibles (exclure l'agence de l'utilisateur)
  const agenceOptions = agences?.data
    ?.filter((agence: any) => {
      return agence.id !== userAgenceId
    })
    ?.map((agence: any) => ({
      value: String(agence.id),
      label: `${agence.code} - ${agence.nom}`
    })) || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agence_destinataire_id) {
      alert('Veuillez sélectionner une agence de destination')
      return
    }

    const idempotency_key = `trf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    createMutation.mutate(
      {
        nom_expediteur: formData.nom_expediteur,
        telephone_expediteur: formData.telephone_expediteur,
        nom_beneficiaire: formData.nom_beneficiaire,
        telephone_beneficiaire: formData.telephone_beneficiaire,
        montant: parseFloat(formData.montant),
        agence_envoi_id: userAgenceId || 0,
        agence_destinataire_id: parseInt(formData.agence_destinataire_id),
        idempotency_key,
      },
      {
        onSuccess: () => {
          setFormData({
            nom_expediteur: '',
            telephone_expediteur: '',
            nom_beneficiaire: '',
            telephone_beneficiaire: '',
            montant: '',
            agence_destinataire_id: '',
          })
          onClose()
        },
      }
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Transfert" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom expéditeur"
            name="nom_expediteur"
            value={formData.nom_expediteur}
            onChange={handleChange}
            required
            placeholder="Nom de l'expéditeur"
          />
          <Input
            label="Téléphone expéditeur"
            name="telephone_expediteur"
            value={formData.telephone_expediteur}
            onChange={handleChange}
            required
            placeholder="Téléphone"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom bénéficiaire"
            name="nom_beneficiaire"
            value={formData.nom_beneficiaire}
            onChange={handleChange}
            required
            placeholder="Nom du bénéficiaire"
          />
          <Input
            label="Téléphone bénéficiaire"
            name="telephone_beneficiaire"
            value={formData.telephone_beneficiaire}
            onChange={handleChange}
            required
            placeholder="Téléphone"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Montant (GNF)"
            name="montant"
            type="number"
            value={formData.montant}
            onChange={handleChange}
            required
            min="100"
            step="100"
            placeholder="0"
          />
          <Select
            label="Agence destination"
            name="agence_destinataire_id"
            value={formData.agence_destinataire_id}
            onChange={handleChange}
            required
            options={agenceOptions}
            disabled={agencesLoading || agenceOptions.length === 0}
          />
        </div>

        <div className="text-sm text-text-secondary bg-filter-bg p-3 rounded-lg">
          Agence d'envoi : <span className="font-semibold text-primary">{userAgenceId || 'Non définie'}</span>
          {user?.role === 'SUPERADMIN' && (
            <span className="ml-2 text-xs text-warning">(SUPERADMIN - vous pouvez envoyer depuis n'importe quelle agence)</span>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
            Créer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateTransactionModal
