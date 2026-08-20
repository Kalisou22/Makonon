import { useState } from 'react'
import { useUtilisateurs, useCreateUtilisateur, useUpdateUtilisateur, useDeleteUtilisateur } from '../hooks/useUtilisateurs'
import { useAgences } from '../../agences/hooks/useAgences'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../../store/authStore'

export const UtilisateursPage = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'AGENT',
    agence_id: '',
    actif: true
  })
  
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN'
  
  const { data, refetch } = useUtilisateurs()
  const { data: agences } = useAgences()
  const createMutation = useCreateUtilisateur()
  const updateMutation = useUpdateUtilisateur()
  const deleteMutation = useDeleteUtilisateur()

  const utilisateurs = data?.data || []
  const agencesList = agences?.data || []
  
  const filtered = utilisateurs.filter((u: any) =>
    u.nom?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const roleOptions = [
    { value: 'SUPERADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'RESPONSABLE', label: 'Responsable' },
    { value: 'AGENT', label: 'Agent' }
  ]

  const handleOpenCreate = () => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    setEditingUser(null)
    setFormData({ nom: '', email: '', password: '', role: 'AGENT', agence_id: '', actif: true })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (utilisateur: any) => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    setEditingUser(utilisateur)
    setFormData({
      nom: utilisateur.nom || '',
      email: utilisateur.email || '',
      password: '',
      role: utilisateur.role || 'AGENT',
      agence_id: String(utilisateur.agence_id || ''),
      actif: utilisateur.actif !== undefined ? utilisateur.actif : true
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSend = { ...formData }
    // Si le mot de passe est vide et que c'est une modification, on ne l'envoie pas
    if (editingUser && !dataToSend.password) {
      delete (dataToSend as any).password
    }
    
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: dataToSend }, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Utilisateur modifié') }
      })
    } else {
      createMutation.mutate(dataToSend, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Utilisateur créé') }
      })
    }
  }

  const handleDelete = (id: number) => {
    if (!isAdmin) { toast.error('Accès non autorisé'); return }
    if (window.confirm('Confirmer la suppression ?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => { refetch(); toast.success('Utilisateur supprimé') }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <Button variant="primary" onClick={handleOpenCreate} disabled={!isAdmin}>
          Nouvel utilisateur
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
            <div className="text-center py-8 text-text-secondary">Aucun utilisateur</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-center">Rôle</th>
                    <th className="p-2 text-center">Statut</th>
                    {isAdmin && <th className="p-2 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u: any) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2">{u.nom}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2 text-center">{u.role}</td>
                      <td className="p-2 text-center">
                        <span className={u.actif ? 'text-green-600' : 'text-red-600'}>
                          {u.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="p-2 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="primary" onClick={() => handleOpenEdit(u)}>
                              Modifier
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label={editingUser ? 'Mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
            minLength={6}
          />
          <Select
            label="Rôle"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={roleOptions}
            required
          />
          {formData.role !== 'SUPERADMIN' && (
            <Select
              label="Agence"
              value={formData.agence_id}
              onChange={(e) => setFormData({ ...formData, agence_id: e.target.value })}
              options={[
                { value: '', label: 'Sélectionner...' },
                ...agencesList.map((a: any) => ({ value: String(a.id), label: a.nom }))
              ]}
              required
            />
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default UtilisateursPage
