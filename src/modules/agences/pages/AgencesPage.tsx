import { useState } from 'react'
import { useAgences, useCreateAgence, useUpdateAgence, useDeleteAgence } from '../hooks/useAgences'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../../store/authStore'

export const AgencesPage = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgence, setEditingAgence] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    telephone: '',
    email: '',
    responsable: '',
    adresse: '',
    actif: true
  })
  
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN'
  
  const { data, refetch } = useAgences()
  const createMutation = useCreateAgence()
  const updateMutation = useUpdateAgence()
  const deleteMutation = useDeleteAgence()

  const agences = data?.data || []
  const filtered = agences.filter((a: any) =>
    a.nom?.toLowerCase().includes(search.toLowerCase()) ||
    a.code?.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenCreate = () => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    setEditingAgence(null)
    setFormData({ code: '', nom: '', telephone: '', email: '', responsable: '', adresse: '', actif: true })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (agence: any) => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    setEditingAgence(agence)
    setFormData({
      code: agence.code || '',
      nom: agence.nom || '',
      telephone: agence.telephone || '',
      email: agence.email || '',
      responsable: agence.responsable || '',
      adresse: agence.adresse || '',
      actif: agence.actif !== undefined ? agence.actif : true
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAgence) {
      updateMutation.mutate({ id: editingAgence.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Agence modifiée') }
      })
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Agence créée') }
      })
    }
  }

  const handleDelete = (id: number) => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    if (window.confirm('Confirmer la suppression ?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => { refetch(); toast.success('Agence supprimée') }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agences</h1>
        <Button variant="primary" onClick={handleOpenCreate} disabled={!isAdmin}>
          Nouvelle agence
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher..." />
            <Button variant="secondary" size="sm" onClick={() => refetch()}>Actualiser</Button>
          </div>
        </CardHeader>
        <CardBody>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">Aucune agence</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Responsable</th>
                    <th className="p-2 text-right">Solde</th>
                    <th className="p-2 text-center">Statut</th>
                    {isAdmin && <th className="p-2 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a: any) => (
                    <tr key={a.id} className="border-b">
                      <td className="p-2 font-mono text-xs">{a.code}</td>
                      <td className="p-2">{a.nom}</td>
                      <td className="p-2">{a.responsable || '-'}</td>
                      <td className="p-2 text-right">{a.solde_cache?.toLocaleString() || 0} GNF</td>
                      <td className="p-2 text-center">
                        <span className={a.actif ? 'text-green-600' : 'text-red-600'}>
                          {a.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="p-2 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="primary" onClick={() => handleOpenEdit(a)}>
                              Modifier
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(a.id)}>
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAgence ? 'Modifier l\'agence' : 'Nouvelle agence'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <Input
            label="Téléphone"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Responsable"
            value={formData.responsable}
            onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
          />
          <Input
            label="Adresse"
            value={formData.adresse}
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingAgence ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AgencesPage
