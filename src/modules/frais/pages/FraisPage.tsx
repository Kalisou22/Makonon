import { useState } from 'react'
import { useFrais, useFraisConfiguration, useDeleteFrais, useDesactiverFrais } from '../hooks/useFrais'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'

export const FraisPage = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading, refetch } = useFrais()
  const { data: configActive } = useFraisConfiguration()
  const deleteMutation = useDeleteFrais()
  const desactiverMutation = useDesactiverFrais()

  const fraisData = data?.data || []
  
  const filtered = fraisData.filter((f: any) =>
    f.nom?.toLowerCase().includes(search.toLowerCase()) ||
    f.type?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (window.confirm('Confirmer la suppression ?')) {
      deleteMutation.mutate(id, { onSuccess: () => refetch() })
    }
  }

  const handleDesactiver = (id: number) => {
    if (window.confirm('Confirmer la désactivation ?')) {
      desactiverMutation.mutate(id, { onSuccess: () => refetch() })
    }
  }

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Frais</h1>
        <Button variant="primary">Nouvelle configuration</Button>
      </div>

      {configActive?.data && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Configuration active</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-text-secondary">Nom</span>
                <p className="font-medium">{configActive.data.nom}</p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">Type</span>
                <p className="font-medium">{configActive.data.type}</p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">Valeur</span>
                <p className="font-bold text-primary">
                  {configActive.data.type === 'POURCENTAGE' 
                    ? `${configActive.data.valeur}%` 
                    : `${configActive.data.valeur.toLocaleString()} GNF`}
                </p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">Statut</span>
                <span className="text-green-600 font-medium">Actif</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Toutes les configurations</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="p-1 border rounded text-sm"
              />
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              Aucune configuration de frais
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Nom</th>
                  <th className="p-2 text-center">Type</th>
                  <th className="p-2 text-right">Valeur</th>
                  <th className="p-2 text-center">Statut</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: any) => (
                  <tr key={f.id} className="border-b">
                    <td className="p-2 font-medium">{f.nom}</td>
                    <td className="p-2 text-center">{f.type}</td>
                    <td className="p-2 text-right font-bold">
                      {f.type === 'POURCENTAGE' ? `${f.valeur}%` : `${f.valeur.toLocaleString()} GNF`}
                    </td>
                    <td className="p-2 text-center">
                      <span className={f.actif ? 'text-green-600' : 'text-red-600'}>
                        {f.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="primary">Modifier</Button>
                        {f.actif && (
                          <Button size="sm" variant="warning" onClick={() => handleDesactiver(f.id)}>
                            Désactiver
                          </Button>
                        )}
                        <Button size="sm" variant="danger" onClick={() => handleDelete(f.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default FraisPage
