import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth/hooks/useAuth'
import { useAuthStore } from '../store/authStore'

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { user } = useAuthStore()

  const menu = [
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊', section: 'PRINCIPAL' },
    { path: '/transactions', label: 'Transactions', icon: '💰', section: 'PRINCIPAL' },
    { path: '/clients', label: 'Clients', icon: '👤', section: 'GESTION' },
    { path: '/agences', label: 'Agences', icon: '🏢', section: 'GESTION' },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: '👥', section: 'GESTION' },
    { path: '/mouvements', label: 'Mouvements', icon: '💳', section: 'GESTION' },
    { path: '/frais', label: 'Frais', icon: '📈', section: 'FINANCES' },
    { path: '/audit', label: 'Audit', icon: '📋', section: 'CONTRÔLE' },
    { path: '/reports', label: 'Rapports', icon: '📊', section: 'CONTRÔLE' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'SUPERADMIN': 'Super Administrateur',
      'ADMIN': 'Administrateur',
      'RESPONSABLE': 'Responsable',
      'AGENT': 'Agent'
    }
    return roles[role] || role
  }

  const getAgencyLabel = () => {
    if (user?.role === 'SUPERADMIN') {
      return 'Toutes les agences'
    }
    if (user?.agence) {
      return user.agence.nom || `Agence ${user.agence_id}`
    }
    return 'Aucune agence'
  }

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const sections = [
    { key: 'PRINCIPAL', label: 'PRINCIPAL' },
    { key: 'GESTION', label: 'GESTION' },
    { key: 'FINANCES', label: 'FINANCES' },
    { key: 'CONTRÔLE', label: 'CONTRÔLE' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 min-h-screen border-r dark:border-gray-700 flex flex-col fixed h-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">MAKONON</h1>
          <p className="text-xs text-text-secondary">Transfert d'argent</p>
        </div>

        <div className="mb-4 px-3 py-3 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.nom || 'Utilisateur'}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{getRoleLabel(user?.role || '')}</p>
          <p className="text-xs text-text-secondary mt-1">{getAgencyLabel()}</p>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto">
          {sections.map((section) => {
            const items = menu.filter(item => item.section === section.key)
            if (items.length === 0) return null
            return (
              <div key={section.key}>
                <p className="text-xs text-text-secondary uppercase tracking-wider px-3 py-1 font-semibold">
                  {section.label}
                </p>
                {items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )
          })}
        </nav>

        <div className="border-t dark:border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm transition flex items-center gap-2"
          >
            <span>🚪</span>
            Déconnexion
          </button>
          <p className="text-xs text-text-secondary px-3 pt-2">v2.0.0 © 2026</p>
        </div>
      </aside>
      <main className="flex-1 p-6 ml-64">
        {children}
      </main>
    </div>
  )
}
