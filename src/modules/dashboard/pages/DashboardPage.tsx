import { useDashboardStats } from '../hooks/useDashboard'
import { useAuthStore } from '../../../store/authStore'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const { data, isLoading, isError, refetch } = useDashboardStats()

  // ✅ Récupérer les données
  const stats = data?.data || data || {}
  
  // ✅ Rôle de l'utilisateur
  const userRole = user?.role || ''
  const isSuperAdmin = userRole === 'SUPERADMIN'
  const isAdmin = userRole === 'ADMIN'
  const isResponsable = userRole === 'RESPONSABLE'
  const isAgent = userRole === 'AGENT'

  // ✅ Extraction des indicateurs selon le rôle
  const indicators = {
    total_transferts: stats.total_transferts || stats.transactions || 0,
    total_clients: stats.total_clients || stats.clients || 0,
    total_agences: stats.total_agences || stats.agences || 0,
    total_utilisateurs: stats.total_utilisateurs || stats.utilisateurs || 0,
    volume_journalier: stats.volume_journalier || stats.volume_jour || 0,
    transferts_en_attente: stats.transferts_en_attente || stats.en_attente || 0,
    frais_total: stats.frais_total || stats.frais || 0,
    transferts_jour: stats.transferts_jour || 0,
    solde_agence: stats.solde_agence || stats.solde || 0
  }

  // ✅ Déterminer quelles cartes afficher selon le rôle
  const getCards = () => {
    const baseCards = [
      { 
        label: 'Transferts', 
        value: indicators.total_transferts, 
        color: 'bg-blue-50 dark:bg-blue-900/30', 
        icon: '💰',
        description: `${indicators.transferts_jour} aujourd'hui`
      },
      { 
        label: 'Clients', 
        value: indicators.total_clients, 
        color: 'bg-green-50 dark:bg-green-900/30', 
        icon: '👤' 
      }
    ]

    // ✅ SUPERADMIN et ADMIN voient plus de données
    if (isSuperAdmin || isAdmin) {
      baseCards.push(
        { 
          label: 'Agences', 
          value: indicators.total_agences, 
          color: 'bg-purple-50 dark:bg-purple-900/30', 
          icon: '🏢' 
        },
        { 
          label: 'Utilisateurs', 
          value: indicators.total_utilisateurs, 
          color: 'bg-orange-50 dark:bg-orange-900/30', 
          icon: '👥' 
        }
      )
    }

    return baseCards
  }

  // ✅ Mini statistiques selon le rôle
  const getMiniStats = () => {
    const stats = []

    // ✅ Solde agence pour RESPONSABLE et AGENT
    if (isResponsable || isAgent) {
      stats.push({
        label: '💰 Solde agence',
        value: indicators.solde_agence,
        color: 'bg-indigo-50 dark:bg-indigo-900/30',
        format: 'currency'
      })
    }

    // ✅ Volume journalier pour tous
    stats.push({
      label: '📈 Volume journalier',
      value: indicators.volume_journalier,
      color: 'bg-emerald-50 dark:bg-emerald-900/30',
      format: 'currency'
    })

    // ✅ En attente pour tous
    stats.push({
      label: '⏳ En attente',
      value: indicators.transferts_en_attente,
      color: 'bg-yellow-50 dark:bg-yellow-900/30',
      format: 'number'
    })

    // ✅ Frais DESA pour SUPERADMIN et ADMIN
    if (isSuperAdmin || isAdmin) {
      stats.push({
        label: '📊 Frais DESA',
        value: indicators.frais_total,
        color: 'bg-rose-50 dark:bg-rose-900/30',
        format: 'currency'
      })
    }

    return stats
  }

  // ✅ Formatage des nombres
  const formatNumber = (value: number) => {
    return value?.toLocaleString() || 0
  }

  const formatCurrency = (value: number) => {
    return (value?.toLocaleString() || 0) + ' GNF'
  }

  // ✅ États de chargement/erreur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader size="lg" />
        <p className="mt-4 text-text-secondary">Chargement du tableau de bord...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-danger mb-4">❌ Erreur lors du chargement des données</p>
        <Button variant="primary" onClick={() => refetch()}>
          🔄 Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Tableau de bord
          </h1>
          <p className="text-sm text-text-secondary">
            Bonjour, {user?.nom || 'Utilisateur'} 
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {userRole}
            </span>
            {user?.agence && (
              <span className="ml-2 text-xs text-text-secondary">
                • {user.agence.nom}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-text-secondary">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            🔄 Actualiser
          </Button>
        </div>
      </div>

      {/* Cartes principales */}
      <div className={`grid ${getCards().length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        {getCards().map((card, index) => (
          <Card key={index} className={`${card.color} p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {formatNumber(card.value)}
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">{card.label}</p>
            {card.description && (
              <p className="text-xs text-text-secondary">{card.description}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Mini statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMiniStats().map((stat, index) => (
          <div key={index} className={`${stat.color} p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">{stat.label}</span>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {stat.format === 'currency' 
                  ? formatCurrency(stat.value)
                  : formatNumber(stat.value)
                }
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activité récente */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📋 Activité récente
        </h3>
        {stats.recent_activities?.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {stats.recent_activities.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description || activity.message || activity.action}
                </span>
                <span className="text-xs text-text-secondary">
                  {new Date(activity.date || activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-sm">Aucune activité récente</p>
        )}
      </Card>
    </div>
  )
}

export default DashboardPage
