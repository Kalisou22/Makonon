import React, { useState } from 'react'
import { useMouvements, useCreateMouvement, useDeleteMouvement, useSoldeMouvement } from '../hooks/useMouvements'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { Table } from '../../../components/ui/Table'
import { Select } from '../../../components/ui/Select'
import { Input } from '../../../components/ui/Input'
import { SearchBar } from '../../../components/ui/SearchBar'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Loader } from '../../../components/ui/Loader'
import { MOTIFS, TYPES } from '../constants'
import { useAuthStore } from '../../../store/authStore'
import { useAgences } from '../../agences/hooks/useAgences'
import type { MouvementCaisse } from '../types'

export const MouvementsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')
  const [motifFilter, setMotifFilter] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Formulaires
  const [formType, setFormType] = useState<'ENTREE' | 'SORTIE'>('ENTREE')
  const [formMotif, setFormMotif] = useState('')
  const [formMontant, setFormMontant] = useState('')
  const [formAgenceId, setFormAgenceId] = useState<number | null>(null)

  const { user } = useAuthStore()
  const { data: agences } = useAgences({ per_page: 100 })

  // Récupérer l'agence par défaut (celle de l'utilisateur ou la première)
  const defaultAgenceId = user?.agence_id || agences?.data?.[0]?.id || null

  const filters: any = { page, per_page: 20 }
  if (typeFilter) filters.type = typeFilter
  if (motifFilter) filters.motif = motifFilter

  const { data, isLoading } = useMouvements(filters)
  const { data: solde, isLoading: soldeLoading } = useSoldeMouvement(
    user?.role === 'SUPERADMIN' ? formAgenceId || defaultAgenceId || undefined : user?.agence_id || undefined
  )
  const createMutation = useCreateMouvement()
  const deleteMutation = useDeleteMouvement()

  const mouvements = data?.data || []
  console.log('📊 Mouvements:', mouvements)

  const handleCreate = () => {
    if (!formMotif || !formMontant || !formAgenceId) {
      alert('Veuillez remplir tous les champs')
      return
    }

    createMutation.mutate({
      type: formType,
      motif: formMotif,
      montant: parseFloat(formMontant),
      agence_id: formAgenceId,
    }, {
      onSuccess: () => {
        setShowForm(false)
        setFormMotif('')
        setFormMontant('')
      }
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmer la suppression de ce mouvement ?')) {
      deleteMutation.mutate(id)
    }
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatMontant = (montant: number) => {
    return montant?.toLocaleString('fr-FR') + ' GNF' || '0 GNF'
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (item: MouvementCaisse) => <span className="text-sm">{item.id}</span>,
      align: 'center' as const,
    },
    {
      key: 'agence_nom',
      header: 'Agence',
      render: (item: MouvementCaisse) => <span className="font-medium">{item.agence_nom}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: MouvementCaisse) => (
        <StatusBadge
          status={item.type}
          variant={item.type === 'ENTREE' ? 'success' : 'danger'}
        />
      ),
      align: 'center' as const,
    },
    {
      key: 'motif',
      header: 'Motif',
      render: (item: MouvementCaisse) => {
        const motif = MOTIFS.find(m => m.value === item.motif)
        return <span>{motif?.label || item.motif}</span>
      },
    },
    {
      key: 'montant',
      header: 'Montant',
      render: (item: MouvementCaisse) => (
        <span className={item.type === 'ENTREE' ? 'text-success font-bold' : 'text-danger font-bold'}>
          {item.type === 'ENTREE' ? '+' : '-'} {formatMontant(item.montant)}
        </span>
      ),
      align: 'right' as const,
    },
    {
      key: 'utilisateur_nom',
      header: 'Utilisateur',
      render: (item: MouvementCaisse) => <span>{item.utilisateur_nom}</span>,
    },
    {
      key: 'date_mouvement',
      header: 'Date',
      render: (item: MouvementCaisse) => <span>{formatDate(item.date_mouvement)}</span>,
      align: 'center' as const,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: MouvementCaisse) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(item.id)}
        >
          Supprimer
        </Button>
      ),
      align: 'center' as const,
    },
  ]

  // Motifs disponibles pour le formulaire
  const motifOptions = MOTIFS.map(m => ({ value: m.value, label: m.label }))
  const typeOptions = TYPES.map(m => ({ value: m.value, label: m.label }))

  // Options d'agences pour SUPERADMIN
  const agenceOptions = agences?.data?.map((a: any) => ({
    value: String(a.id),
    label: `${a.code} - ${a.nom}`,
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mouvements de Caisse</h1>
          {solde && (
            <p className="text-sm text-text-secondary">
              Solde physique : <span className="font-bold text-primary">{formatMontant(solde.solde_physique)}</span>
              {' | '}
              Solde comptable : <span className="font-bold text-primary">{formatMontant(solde.solde_comptable)}</span>
              {solde.ecart !== 0 && (
                <span className={`ml-2 text-sm ${solde.ecart > 0 ? 'text-success' : 'text-danger'}`}>
                  (Écart: {formatMontant(solde.ecart)})
                </span>
              )}
            </p>
          )}
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Fermer' : 'Nouveau mouvement'}
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <Card variant="default" className="p-4 border border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Select
                label="Type"
                value={formType}
                onChange={(e) => setFormType(e.target.value as 'ENTREE' | 'SORTIE')}
                options={typeOptions}
              />
            </div>
            <div>
              <Select
                label="Motif"
                value={formMotif}
                onChange={(e) => setFormMotif(e.target.value)}
                options={motifOptions}
              />
            </div>
            <div>
              <Input
                label="Montant (GNF)"
                type="number"
                value={formMontant}
                onChange={(e) => setFormMontant(e.target.value)}
                placeholder="0"
                min="1"
                step="100"
              />
            </div>
            {user?.role === 'SUPERADMIN' && (
              <div>
                <Select
                  label="Agence"
                  value={formAgenceId?.toString() || ''}
                  onChange={(e) => setFormAgenceId(parseInt(e.target.value))}
                  options={agenceOptions}
                />
              </div>
            )}
            <div className="flex items-end">
              <Button
                variant="success"
                className="w-full"
                onClick={handleCreate}
                isLoading={createMutation.isPending}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-48">
              <Select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                options={[{ value: '', label: 'Tous les types' }, ...typeOptions]}
              />
            </div>
            <div className="w-full md:w-56">
              <Select
                value={motifFilter}
                onChange={(e) => { setMotifFilter(e.target.value); setPage(1) }}
                options={[{ value: '', label: 'Tous les motifs' }, ...motifOptions]}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={() => { setTypeFilter(''); setMotifFilter(''); setPage(1) }}>
              Réinitialiser
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            data={mouvements}
            isLoading={isLoading}
            emptyMessage="Aucun mouvement de caisse"
          />

          {data && data.last_page > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
              <span className="text-sm text-text-secondary">
                Page {data.current_page} sur {data.last_page}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.current_page <= 1}
                  onClick={() => setPage(data.current_page - 1)}
                >
                  Précédent
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.current_page >= data.last_page}
                  onClick={() => setPage(data.current_page + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default MouvementsPage
