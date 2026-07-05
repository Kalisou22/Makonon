import React, { useState, useEffect } from 'react'
import { useTransactions, useWithdrawTransaction, useCancelTransaction, useSoldeAgence } from '../hooks/useTransactions'
import { TransactionTable } from '../components/TransactionTable'
import { CreateTransactionModal } from '../components/CreateTransactionModal'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Select } from '../../../components/ui/Select'
import { useAuthStore } from '../../../store/authStore'

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuthStore()

  const filters: any = { page, per_page: 20 }
  if (statusFilter) filters.statut = statusFilter

  const { data, isLoading, refetch } = useTransactions(filters)
  const { data: solde } = useSoldeAgence()
  const withdrawMutation = useWithdrawTransaction()
  const cancelMutation = useCancelTransaction()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleWithdraw = (code: string) => {
    if (window.confirm('Confirmer le retrait de ce transfert ?')) {
      withdrawMutation.mutate(code, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const handleCancel = (code: string) => {
    const motif = window.prompt("Motif de l'annulation :")
    if (motif !== null) {
      cancelMutation.mutate({ code, motif: motif || undefined }, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'ENVOYE', label: 'Envoyé' },
    { value: 'RETIRE', label: 'Retiré' },
    { value: 'ANNULE', label: 'Annulé' },
  ]

  // ✅ Filtrer les transactions pour l'agence de l'utilisateur
  const filteredData = data?.data?.filter((t: any) => {
    if (user?.role !== 'SUPERADMIN' && user?.agence_id) {
      return t.agence_envoi_id === user.agence_id || t.agence_retrait_id === user.agence_id
    }
    return true
  }) || []

  console.log('📊 TransactionsPage - user:', user)
  console.log('📊 TransactionsPage - filteredData:', filteredData)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Transactions</h1>
          {solde && (
            <p className="text-sm text-text-secondary">
              Solde agence : <span className="text-success font-bold">{solde.solde.toLocaleString('fr-FR')} GNF</span>
            </p>
          )}
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Nouveau transfert
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={handleSearch}
                placeholder="Rechercher un transfert..."
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full"
                options={statusOptions}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <TransactionTable
            data={filteredData}
            isLoading={isLoading}
            onWithdraw={handleWithdraw}
            onCancel={handleCancel}
            userAgenceId={user?.agence_id}
            userRole={user?.role}
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

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          refetch()
        }}
      />
    </div>
  )
}

export default TransactionsPage
