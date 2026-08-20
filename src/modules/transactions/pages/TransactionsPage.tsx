import { useState, useEffect } from 'react'
import {
  useTransactions,
  useCreateTransaction,
  useValidateTransaction,
  useCancelTransaction,
  useSoldeAgence,
  useVerifierCode
} from '../hooks/useTransactions'
import { useAgences } from '../../agences/hooks/useAgences'
import { Button } from '../../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { SearchBar } from '../../../components/ui/SearchBar'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { ClientSearch } from '../../../components/ui/ClientSearch'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { Loader } from '../../../components/ui/Loader'
import { useAuthStore } from '../../../store/authStore'
import { toast } from 'react-hot-toast'

export const TransactionsPage = () => {
  const [search, setSearch] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRetraitModalOpen, setIsRetraitModalOpen] = useState(false)
  const [isVerifierModalOpen, setIsVerifierModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [codeRetrait, setCodeRetrait] = useState('')

  const [formData, setFormData] = useState({
    expediteur_id: 0,
    expediteur_nom: '',
    beneficiaire_id: 0,
    beneficiaire_nom: '',
    montant: '',
    agence_retrait_id: ''
  })

  const { user } = useAuthStore()
  const { data, isLoading, refetch } = useTransactions()
  const { data: soldeData } = useSoldeAgence()
  const { data: agences } = useAgences()
  const createMutation = useCreateTransaction()
  const validateMutation = useValidateTransaction()
  const cancelMutation = useCancelTransaction()
  const verifierMutation = useVerifierCode()

  // ✅ FORCER le type any[] pour éviter les problèmes de typage
  const transactions: any[] = (data as any)?.data || []
  const agencesList: any[] = (agences as any)?.data || []
  const solde = (soldeData as any)?.solde || 0

  console.log('📊 Transactions extraites:', transactions.length)

  const userRole = user?.role || ''
  const userAgenceId = user?.agence_id

  // ✅ Déterminer les permissions
  const isSuperAdmin = userRole === 'SUPERADMIN'
  const canCreateTransfert = userRole === 'RESPONSABLE' || userRole === 'AGENT' || userRole === 'ADMIN'

  // ✅ Filtrer selon le rôle et la recherche
  const filtered = transactions.filter((t: any) => {
    // Recherche
    if (search) {
      const s = search.toLowerCase()
      const match = t.code?.toLowerCase().includes(s) ||
             t.expediteur_nom?.toLowerCase().includes(s) ||
             t.beneficiaire_nom?.toLowerCase().includes(s) ||
             t.expediteur?.nom?.toLowerCase().includes(s) ||
             t.beneficiaire?.nom?.toLowerCase().includes(s)
      if (!match) return false
    }
    
    // Filtrage par agence
    if (isSuperAdmin) return true
    return t.agence_envoi_id === userAgenceId || t.agence_retrait_id === userAgenceId
  })

  // ✅ Vérifier si le retrait est possible
  const canRetrait = (transaction: any) => {
    if (isSuperAdmin) return true
    return userAgenceId === transaction.agence_retrait_id
  }

  // ✅ Vérifier si l'annulation est possible
  const canAnnulation = (transaction: any) => {
    if (isSuperAdmin) return true
    return userAgenceId === transaction.agence_envoi_id
  }

  // ✅ Création d'un transfert
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAgenceId) {
      toast.error('Vous n\'avez pas d\'agence associée')
      return
    }
    if (!formData.expediteur_id || !formData.beneficiaire_id || !formData.montant || !formData.agence_retrait_id) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    createMutation.mutate({
      expediteur_id: formData.expediteur_id,
      beneficiaire_id: formData.beneficiaire_id,
      montant: parseFloat(formData.montant),
      agence_retrait_id: parseInt(formData.agence_retrait_id)
    }, {
      onSuccess: (data: any) => {
        setIsCreateModalOpen(false)
        setFormData({ expediteur_id: 0, expediteur_nom: '', beneficiaire_id: 0, beneficiaire_nom: '', montant: '', agence_retrait_id: '' })
        refetch()
        toast.success(`Transfert créé avec succès. Code: ${data.data?.code}`)
      }
    })
  }

  // ✅ Ouvrir le modal de retrait
  const handleOpenRetrait = (transaction: any) => {
    if (!canRetrait(transaction)) {
      toast.error('Vous ne pouvez pas retirer ce transfert')
      return
    }
    setSelectedTransaction(transaction)
    setIsRetraitModalOpen(true)
  }

  // ✅ Confirmer le retrait
  const handleConfirmRetrait = () => {
    if (!selectedTransaction) return
    validateMutation.mutate(selectedTransaction.id, {
      onSuccess: () => {
        setIsRetraitModalOpen(false)
        setSelectedTransaction(null)
        refetch()
        toast.success('Retrait effectué avec succès')
      }
    })
  }

  // ✅ Annuler un transfert
  const handleCancel = (id: number) => {
    if (!userAgenceId) {
      toast.error('Vous n\'avez pas d\'agence associée')
      return
    }
    const transaction = transactions.find((t: any) => t.id === id)
    if (!transaction) return
    if (!canAnnulation(transaction)) {
      toast.error('Vous ne pouvez pas annuler ce transfert')
      return
    }
    const motif = window.prompt("Motif de l'annulation :")
    if (motif !== null && motif.trim() !== '') {
      cancelMutation.mutate({ id, motif }, {
        onSuccess: () => {
          refetch()
          toast.success('Transfert annulé avec succès')
        }
      })
    }
  }

  // ✅ Vérifier un code
  const handleOpenVerifier = () => setIsVerifierModalOpen(true)

  const handleVerifierCode = () => {
    if (!codeRetrait.trim()) {
      toast.error('Veuillez entrer un code')
      return
    }
    verifierMutation.mutate(codeRetrait.trim())
  }

  // ✅ Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [refetch])

  // ✅ Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader size="lg" />
        <p className="mt-4 text-text-secondary">Chargement des transactions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-text-secondary">
            {isSuperAdmin ? '👑 Vue globale' : `Agence: ${userAgenceId || 'Aucune'}`}
            {user?.agence?.nom && ` (${user.agence.nom})`}
          </p>
          <p className="text-sm text-text-secondary">
            Solde agence : <span className="text-success font-bold">{solde?.toLocaleString() || 0} GNF</span>
          </p>
          <p className="text-xs text-text-secondary">
            {transactions.length} transfert(s) total, {filtered.length} affiché(s)
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canCreateTransfert && (
            <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              Nouveau transfert
            </Button>
          )}
          <Button variant="secondary" onClick={handleOpenVerifier}>
            Vérifier un code
          </Button>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            🔄 Actualiser
          </Button>
        </div>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex gap-4 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher par code, nom..." />
            <span className="text-sm text-text-secondary self-center">
              {filtered.length} transaction(s)
            </span>
          </div>
        </CardHeader>
        <CardBody>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              {search ? 'Aucune transaction trouvée' : 'Aucune transaction disponible'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Expéditeur</th>
                    <th className="p-2 text-left">Bénéficiaire</th>
                    <th className="p-2 text-right">Montant</th>
                    <th className="p-2 text-right">Frais</th>
                    <th className="p-2 text-center">Statut</th>
                    <th className="p-2 text-center">Date</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t: any) => {
                    const canRet = canRetrait(t) && t.statut === 'ENVOYE'
                    const canAnn = canAnnulation(t) && (t.statut === 'ENVOYE' || t.statut === 'EN_ATTENTE')
                    
                    const expediteurNom = t.expediteur_nom || t.expediteur?.nom || '-'
                    const beneficiaireNom = t.beneficiaire_nom || t.beneficiaire?.nom || '-'
                    
                    return (
                      <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-2 font-mono text-xs">{t.code}</td>
                        <td className="p-2">{expediteurNom}</td>
                        <td className="p-2">{beneficiaireNom}</td>
                        <td className="p-2 text-right font-medium">
                          {t.montant?.toLocaleString() || 0} GNF
                        </td>
                        <td className="p-2 text-right">
                          {t.frais?.toLocaleString() || 0} GNF
                        </td>
                        <td className="p-2 text-center">
                          <StatusBadge 
                            status={t.statut} 
                            variant={
                              t.statut === 'RETIRE' ? 'success' :
                              t.statut === 'ANNULE' ? 'danger' :
                              t.statut === 'ENVOYE' ? 'info' :
                              'warning'
                            } 
                          />
                        </td>
                        <td className="p-2 text-center text-xs">
                          {new Date(t.created_at || t.date_envoi).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-center">
                          <div className="flex gap-1 justify-center flex-wrap">
                            {t.statut === 'ENVOYE' && (
                              <>
                                {canRet && (
                                  <Button size="sm" variant="success" onClick={() => handleOpenRetrait(t)}>
                                    Retirer
                                  </Button>
                                )}
                                {canAnn && (
                                  <Button size="sm" variant="danger" onClick={() => handleCancel(t.id)}>
                                    Annuler
                                  </Button>
                                )}
                              </>
                            )}
                            {t.statut === 'RETIRE' && (
                              <span className="text-xs text-green-600 font-medium">✓ Retiré</span>
                            )}
                            {t.statut === 'ANNULE' && (
                              <span className="text-xs text-red-600 font-medium">✗ Annulé</span>
                            )}
                            {t.statut === 'EN_ATTENTE' && (
                              <span className="text-xs text-yellow-600 font-medium">⏳ En attente</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal de création */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nouveau transfert">
        <form onSubmit={handleCreate} className="space-y-4">
          <ClientSearch
            label="Expéditeur"
            placeholder="Rechercher un expéditeur..."
            required
            onChange={(id, nom) => setFormData({ ...formData, expediteur_id: id, expediteur_nom: nom })}
          />
          <ClientSearch
            label="Bénéficiaire"
            placeholder="Rechercher un bénéficiaire..."
            required
            onChange={(id, nom) => setFormData({ ...formData, beneficiaire_id: id, beneficiaire_nom: nom })}
          />
          <Input
            label="Montant (GNF)"
            type="number"
            value={formData.montant}
            onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
            required min="100" step="100" placeholder="100000"
          />
          <Select
            label="Agence de retrait"
            value={formData.agence_retrait_id}
            onChange={(e) => setFormData({ ...formData, agence_retrait_id: e.target.value })}
            options={[
              { value: '', label: 'Sélectionner...' },
              ...agencesList
                .filter((a: any) => a.id !== userAgenceId || isSuperAdmin)
                .map((a: any) => ({ value: String(a.id), label: `${a.code} - ${a.nom}` }))
            ]}
            required
          />
          {formData.montant && parseFloat(formData.montant) > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Résumé du transfert</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Montant:</span>
                  <span className="font-bold">{parseFloat(formData.montant).toLocaleString()} GNF</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais (estimation):</span>
                  <span className="font-bold text-blue-600">
                    {Math.round(parseFloat(formData.montant) * 0.03).toLocaleString()} GNF
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-600">
                    {(parseFloat(formData.montant) + Math.round(parseFloat(formData.montant) * 0.03)).toLocaleString()} GNF
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
              Générer le Code
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de retrait */}
      <Modal isOpen={isRetraitModalOpen} onClose={() => setIsRetraitModalOpen(false)} title="Confirmation de retrait">
        <div className="space-y-4">
          <p>⚠️ Confirmez-vous le retrait du transfert suivant ?</p>
          {selectedTransaction && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-secondary">Code:</span>
                  <p className="font-mono font-bold">{selectedTransaction.code}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Montant:</span>
                  <p className="font-bold text-green-600">{selectedTransaction.montant?.toLocaleString()} GNF</p>
                </div>
                <div>
                  <span className="text-text-secondary">Bénéficiaire:</span>
                  <p>{selectedTransaction.beneficiaire_nom || '-'}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Agence retrait:</span>
                  <p>{selectedTransaction.agence_retrait_nom || selectedTransaction.agence_retrait_id || '-'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsRetraitModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="success" type="button" onClick={handleConfirmRetrait} isLoading={validateMutation.isPending}>
              Confirmer le retrait
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal vérification code */}
      <Modal isOpen={isVerifierModalOpen} onClose={() => setIsVerifierModalOpen(false)} title="Vérifier un code">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Entrez le code du transfert pour vérifier son statut.</p>
          <Input 
            label="Code du transfert" 
            value={codeRetrait} 
            onChange={(e) => setCodeRetrait(e.target.value)} 
            placeholder="Ex: TRF-6A8450E7E5A72" 
            required 
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsVerifierModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="button" onClick={handleVerifierCode} isLoading={verifierMutation.isPending}>
              Vérifier
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TransactionsPage
