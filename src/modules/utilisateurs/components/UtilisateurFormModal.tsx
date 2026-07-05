import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { useAgences } from '../../agences/hooks/useAgences'
import type { Utilisateur } from '../types'

const utilisateurSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe minimum 6 caractères').optional().or(z.literal('')),
  role: z.string().min(1, 'Rôle requis'),
  agence_id: z.number().optional().nullable(),
  actif: z.boolean().default(true),
})

type UtilisateurFormData = z.infer<typeof utilisateurSchema>

interface UtilisateurFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UtilisateurFormData) => void
  isLoading: boolean
  initialData?: Utilisateur | null
  title?: string
}

export const UtilisateurFormModal: React.FC<UtilisateurFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  title = initialData ? "Modifier l'utilisateur" : 'Nouvel utilisateur',
}) => {
  const { data: agencesData, isLoading: agencesLoading } = useAgences({ per_page: 100 })

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
      password: '',
      role: '',
      agence_id: null,
      actif: true,
    },
  })

  const selectedRole = watch('role')

  useEffect(() => {
    if (initialData) {
      reset({
        nom: initialData.nom,
        email: initialData.email,
        password: '',
        role: initialData.role,
        agence_id: initialData.agence_id || null,
        actif: initialData.actif,
      })
    } else {
      reset({
        nom: '',
        email: '',
        password: '',
        role: '',
        agence_id: null,
        actif: true,
      })
    }
  }, [initialData, reset, isOpen])

  const agenceOptions = agencesData?.data?.map((agence) => ({
    value: String(agence.id),
    label: `${agence.nom} (${agence.code})`,
  })) || []

  const roleOptions = [
    { value: '', label: 'Sélectionner un rôle' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'RESPONSABLE', label: 'Responsable' },
    { value: 'AGENT', label: 'Agent' },
  ]

  const handleFormSubmit = (data: UtilisateurFormData) => {
    console.log('📤 Envoi du formulaire utilisateur:', data)
    const submitData = { ...data }
    if (!submitData.password) {
      delete submitData.password
    }
    onSubmit(submitData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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
            {...register('password')}
            error={errors.password?.message}
          />
          <Select
            label="Rôle"
            value={selectedRole || ''}
            onChange={(e) => {
              const value = e.target.value
              setValue('role', value)
            }}
            options={roleOptions}
            error={errors.role?.message}
          />
          {selectedRole && selectedRole !== 'SUPERADMIN' && (
            <div className="md:col-span-2">
              <Select
                label="Agence"
                value={watch('agence_id')?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('agence_id', value ? parseInt(value) : null)
                }}
                options={agenceOptions}
                error={errors.agence_id?.message}
                disabled={agencesLoading}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('actif')}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <span className="text-sm font-medium text-gray-700">Compte actif</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default UtilisateurFormModal
