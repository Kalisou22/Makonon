import { useState } from 'react'
import { useMouvements, useCreateMouvement, useDeleteMouvement, useSoldeMouvement } from '../hooks/useMouvements'
import { useAgences } from '../../agences/hooks/useAgences'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Select } from '../../../components/ui/Select'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { useAuthStore } from '../../../store/authStore'
import { toast } from 'react-hot-toast'

export const MouvementsPage = () => {
  const [page] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [motifFilter, setMotifFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'ENTREE',
    motif: 'DEPOT',
    montant: '',
    agence_id: ''
  })

  const { user } = useAuthStore()
  const { data, isLoading, refetch } = useMouvements({ 
    page, 
    per_page: 20,
    type: typeFilter || undefined,
    motif: motifFilter || undefined,
    date: dateFilter || undefined
  })
  const { data: soldeData } = useSoldeMouvement()
  const { data: agences } = useAgences()
  const createMutation = useCreateMouvement()
  const deleteMutation = useDeleteMouvement()

  // Extraction des données
  const mouvements: any[] = (data as any)?.data || []
  const agencesList: any[] = (agences as any)?.data || []
  const solde = (soldeData as any)?.data || { solde_physique: 0, solde_comptable: 0, ecart: 0 }
  
  // Filtrer par recherche
  const filtered = mouvements.filter((m: any) => {
    if (!search) return true
    const s = search.toLowerCase()
    return m.agence_nom?.toLowerCase().includes(s) ||
           m.motif?.toLowerCase().includes(s) ||
           m.utilisateur_nom?.toLowerCase().includes(s)
  })

  // Calcul des statistiques
  const stats = {
    total_entrees: mouvements.filter((m: any) => m.type === 'ENTREE').reduce((sum: number, m: any) => sum + (m.montant || 0), 0),
    total_sorties: mouvements.filter((m: any) => m.type === 'SORTIE').reduce((sum: number, m: any) => sum + (m.montant || 0), 0),
    total_envois: mouvements.filter((m: any) => m.motif === 'ENVOI').reduce((sum: number, m: any) => sum + (m.montant || 0), 0),
    total_retraits: mouvements.filter((m: any) => m.motif === 'RETRAIT').reduce((sum: number, m: any) => sum + (m.montant || 0), 0),
    total_depots: mouvements.filter((m: any) => m.motif === 'DEPOT').reduce((sum: number, m: any) => sum + (m.montant || 0), 0),
    nb_entrees: mouvements.filter((m: any) => m.type === 'ENTREE').length,
    nb_sorties: mouvements.filter((m: any) => m.type === 'SORTIE').length,
    nb_mouvements: mouvements.length,
  }

  // Vérification de cohérence
  const verifierCohérence = () => {
    const soldePhysique = solde.solde_physique || 0
    const soldeComptable = solde.solde_comptable || 0
    const ecart = solde.ecart || 0
    
    if (soldePhysique === 0 && soldeComptable === 0 && ecart === 0) {
      return { status: 'sync', message: '✅ Caisse synchronisée' }
    } else if (ecart !== 0) {
      return { status: 'warning', message: `⚠️ Écart de ${ecart.toLocaleString()} GNF` }
    }
    return { status: 'ok', message: '✅ Cohérent' }
  }

  const coherence = verifierCohérence()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.montant || !formData.motif) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    createMutation.mutate({
      ...formData,
      montant: parseFloat(formData.montant),
      agence_id: formData.agence_id ? parseInt(formData.agence_id) : undefined
    }, {
      onSuccess: () => {
        setIsModalOpen(false)
        setFormData({ type: 'ENTREE', motif: 'DEPOT', montant: '', agence_id: '' })
        refetch()
      }
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmer la suppression de ce mouvement ?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => refetch()
      })
    }
  }

  const getMotifLabel = (motif: string) => {
    const labels: Record<string, string> = {
      'ENVOI': '📤 Envoi',
      'RETRAIT': '📥 Retrait',
      'DEPOT': '💰 Dépôt',
      'AJUSTEMENT': '⚙️ Ajustement',
      'ANNULATION': '🔄 Annulation'
    }
    return labels[motif] || motif
  }

  const getTypeLabel = (type: string) => {
    return type === 'ENTREE' ? '✅ Entrée' : '❌ Sortie'
  }

  const getTypeClass = (type: string) => {
    return type === 'ENTREE' ? 'text-green-600' : 'text-red-600'
  }

  const getMotifIcon = (motif: string) => {
    const icons: Record<string, string> = {
      'ENVOI': '📤',
      'RETRAIT': '📥',
      'DEPOT': '💰',
      'AJUSTEMENT': '⚙️',
      'ANNULATION': '🔄'
    }
    return icons[motif] || '📌'
  }

  const getMotifOptions = () => {
    return [
      { value: '', label: 'Tous les motifs' },
      { value: 'ENVOI', label: '📤 Envoi (sortie)' },
      { value: 'RETRAIT', label: '📥 Retrait (sortie)' },
      { value: 'DEPOT', label: '💰 Dépôt (entrée)' },
      { value: 'AJUSTEMENT', label: '⚙️ Ajustement' },
      { value: 'ANNULATION', label: '🔄 Annulation (entrée)' }
    ]
  }

  const getTypeOptions = () => {
    return [
      { value: '', label: 'Tous les types' },
      { value: 'ENTREE', label: '✅ Entrée' },
      { value: 'SORTIE', label: '❌ Sortie' }
    ]
  }

  const formatMontant = (montant: number) => {
    return montant?.toLocaleString() || 0
  }

  if (isLoading) return <div className="p-8 text-center">Chargement des mouvements...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Mouvements de caisse</h1>
          <p className="text-sm text-text-secondary">
            Suivi des entrées et sorties de caisse
          </p>
          <p className="text-xs text-text-secondary">
            {stats.nb_mouvements} mouvements enregistrés
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouveau mouvement
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-text-secondary">Total Entrées</p>
          <p className="text-xl font-bold text-green-600">{formatMontant(stats.total_entrees)} GNF</p>
          <p className="text-xs text-text-secondary">{stats.nb_entrees} opérations</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-text-secondary">Total Sorties</p>
          <p className="text-xl font-bold text-red-600">{formatMontant(stats.total_sorties)} GNF</p>
          <p className="text-xs text-text-secondary">{stats.nb_sorties} opérations</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-text-secondary">📤 Envois</p>
          <p className="text-xl font-bold text-blue-600">{formatMontant(stats.total_envois)} GNF</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-text-secondary">📥 Retraits</p>
          <p className="text-xl font-bold text-purple-600">{formatMontant(stats.total_retraits)} GNF</p>
        </div>
      </div>

      {/* Solde */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-text-secondary">💰 Solde physique</p>
          <p className={`text-xl font-bold ${getTypeClass(solde.solde_physique >= 0 ? 'ENTREE' : 'SORTIE')}`}>
            {formatMontant(solde.solde_physique)} GNF
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <p className="text-sm text-text-secondary">📊 Solde comptable</p>
          <p className={`text-xl font-bold ${getTypeClass(solde.solde_comptable >= 0 ? 'ENTREE' : 'SORTIE')}`}>
            {formatMontant(solde.solde_comptable)} GNF
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${solde.ecart === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className="text-sm text-text-secondary">📈 Écart</p>
          <p className={`text-xl font-bold ${solde.ecart === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
            {formatMontant(solde.ecart)} GNF
            {solde.ecart === 0 ? ' ✅' : ' ⚠️'}
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${coherence.status === 'sync' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className="text-sm text-text-secondary">🔍 Statut</p>
          <p className={`text-sm font-bold ${coherence.status === 'sync' ? 'text-green-600' : 'text-yellow-600'}`}>
            {coherence.message}
          </p>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par agence, motif, utilisateur..." />
            </div>
            <div className="w-40">
              <Select
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={getTypeOptions()}
              />
            </div>
            <div className="w-48">
              <Select
                label="Motif"
                value={motifFilter}
                onChange={(e) => setMotifFilter(e.target.value)}
                options={getMotifOptions()}
              />
            </div>
            <div className="w-40">
              <Input
                label="Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => {
                setTypeFilter('')
                setMotifFilter('')
                setDateFilter('')
                setSearch('')
              }}>
                🔄 Réinitialiser
              </Button>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              Aucun mouvement trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Agence</th>
                    <th className="p-2 text-center">Type</th>
                    <th className="p-2 text-left">Motif</th>
                    <th className="p-2 text-right">Montant</th>
                    <th className="p-2 text-left">Utilisateur</th>
                    <th className="p-2 text-center">Date</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m: any) => (
                    <tr key={m.id} className="border-b dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">{m.id}</td>
                      <td className="p-2">{m.agence_nom || '-'}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${m.type === 'ENTREE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {getTypeLabel(m.type)}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="flex items-center gap-1">
                          <span>{getMotifIcon(m.motif)}</span>
                          {getMotifLabel(m.motif)}
                        </span>
                      </td>
                      <td className={`p-2 text-right font-bold ${m.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                        {m.type === 'ENTREE' ? '+' : '-'} {formatMontant(m.montant)} GNF
                      </td>
                      <td className="p-2">{m.utilisateur_nom || '-'}</td>
                      <td className="p-2 text-center text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
                      <td className="p-2 text-center">
                        <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)} isLoading={deleteMutation.isPending}>
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal de création */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau mouvement de caisse">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={getTypeOptions().filter(o => o.value !== '')}
            required
          />
          <Select
            label="Motif"
            value={formData.motif}
            onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
            options={getMotifOptions().filter(o => o.value !== '')}
            required
          />
          <Input
            label="Montant (GNF)"
            type="number"
            value={formData.montant}
            onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
            required min="1" step="100"
          />
          {user?.role === 'SUPERADMIN' && (
            <Select
              label="Agence"
              value={formData.agence_id}
              onChange={(e) => setFormData({ ...formData, agence_id: e.target.value })}
              options={[
                { value: '', label: 'Sélectionner...' },
                ...agencesList.map((a: any) => ({ value: String(a.id), label: a.nom }))
              ]}
            />
          )}
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Résumé de l'opération:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className={formData.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}>
                  {formData.type === 'ENTREE' ? '✅ Entrée' : '❌ Sortie'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Motif:</span>
                <span>{getMotifLabel(formData.motif)}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant:</span>
                <span className="font-bold">{formData.montant ? formatMontant(parseFloat(formData.montant)) : 0} GNF</span>
              </div>
              <div className="border-t pt-2 mt-2 text-xs text-text-secondary">
                {formData.type === 'ENTREE' ? '↗️ Le solde de l\'agence va augmenter' : '↘️ Le solde de l\'agence va diminuer'}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MouvementsPage
