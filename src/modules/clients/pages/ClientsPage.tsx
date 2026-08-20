import { useState } from 'react'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { toast } from 'react-hot-toast'

export const ClientsPage = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    piece_identite: '',
    numero_piece: ''
  })

  const { data, refetch } = useClients()
  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient()
  const deleteMutation = useDeleteClient()

  // ✅ Utilisation de any pour éviter les problèmes de typage
  const clients: any[] = (data as any)?.data || []
  
  const filtered = clients.filter((c: any) =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.telephone?.includes(search)
  )

  const handleOpenCreate = () => {
    setEditingClient(null)
    setFormData({ nom: '', telephone: '', email: '', piece_identite: '', numero_piece: '' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (client: any) => {
    setEditingClient(client)
    setFormData({
      nom: client.nom || '',
      telephone: client.telephone || '',
      email: client.email || '',
      piece_identite: client.piece_identite || '',
      numero_piece: client.numero_piece || ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Client modifié') }
      })
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => { setIsModalOpen(false); refetch(); toast.success('Client créé') }
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmer la suppression ?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => { refetch(); toast.success('Client supprimé') }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          Nouveau client
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
            <div className="text-center py-8 text-text-secondary">Aucun client</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Téléphone</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id} className="border-b">
                      <td className="p-2">{c.nom}</td>
                      <td className="p-2">{c.telephone}</td>
                      <td className="p-2">{c.email || '-'}</td>
                      <td className="p-2 text-center">
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="primary" onClick={() => handleOpenEdit(c)}>
                            Modifier
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Modifier le client' : 'Nouveau client'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <Input
            label="Téléphone"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Pièce d'identité"
            value={formData.piece_identite}
            onChange={(e) => setFormData({ ...formData, piece_identite: e.target.value })}
          />
          <Input
            label="Numéro de pièce"
            value={formData.numero_piece}
            onChange={(e) => setFormData({ ...formData, numero_piece: e.target.value })}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingClient ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ClientsPage
