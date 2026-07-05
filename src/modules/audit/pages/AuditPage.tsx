import React, { useState } from 'react'
import { useAuditLogs } from '../hooks/useAudit'
import { AuditTable } from '../components/AuditTable'
import { AuditDetailModal } from '../components/AuditDetailModal'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'

export const AuditPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters = {
    page,
    per_page: perPage,
    ...(actionFilter && { action: actionFilter }),
  }

  const { data, isLoading, refetch } = useAuditLogs(filters)

  const handleView = (log: any) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const actionOptions = [
    { value: '', label: 'Toutes les actions' },
    { value: 'login', label: 'Connexion' },
    { value: 'logout', label: 'Déconnexion' },
    { value: 'transfert_creation', label: 'Création transfert' },
    { value: 'transfert_retrait', label: 'Retrait transfert' },
    { value: 'transfert_annulation', label: 'Annulation transfert' },
    { value: 'client_creation', label: 'Création client' },
    { value: 'client_modification', label: 'Modification client' },
    { value: 'user_creation', label: 'Création utilisateur' },
    { value: 'user_modification', label: 'Modification utilisateur' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Journal d'audit</h1>
          <p className="text-text-secondary text-sm">
            Consultez l'historique des actions effectuées
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => refetch()}>
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={handleSearch}
                placeholder="Rechercher dans l'audit..."
              />
            </div>
            <div className="w-full md:w-56">
              <Select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full"
                options={actionOptions}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <AuditTable
            data={data?.data || []}
            isLoading={isLoading}
            onView={handleView}
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

      <AuditDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedLog(null)
        }}
        log={selectedLog}
      />
    </div>
  )
}

export default AuditPage
