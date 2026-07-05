import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useAuth } from '../modules/auth/hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/dashboard', label: 'TABLEAU DE BORD', icon: '📊', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/transactions', label: 'TRANSACTIONS', icon: '💰', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/mouvements', label: 'MOUVEMENTS', icon: '💳', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE'] },
    { path: '/clients', label: 'CLIENTS', icon: '👤', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/agences', label: 'AGENCES', icon: '🏢', roles: ['SUPERADMIN', 'ADMIN'] },
    { path: '/utilisateurs', label: 'UTILISATEURS', icon: '👥', roles: ['SUPERADMIN', 'ADMIN'] },
    { path: '/audit', label: 'JOURNAL', icon: '📋', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE'] },
  ]

  const visibleLinks = navLinks.filter(link => link.roles.includes(user?.role || ''))

  return (
    <div className="min-h-screen bg-bg flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 min-h-screen bg-[#222D32] flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="py-6 text-center border-b border-[#3A4A52]">
          <h1 className="text-[#0078C8] text-xl font-black tracking-wider">
            MAKONON
          </h1>
          <p className="text-[#8A9BA5] text-xs font-medium tracking-widest">
            TRANSFERT
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                ${isActive(link.path)
                  ? 'bg-[#0078C8] text-white shadow-lg'
                  : 'text-[#C8D6DD] hover:bg-[#3A4A52] hover:text-white'
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-[#3A4A52]">
          <div className="text-xs text-[#8A9BA5] text-center">
            v2.0.0 © 2026
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* ===== HEADER ===== */}
        <header className="bg-gradient-to-r from-primary to-primary-light text-white shadow-lg">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium opacity-75">
                {user?.agenceId ? `Agence #${user.agenceId}` : 'Siège'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {user?.nom} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="bg-[#D33333] hover:bg-[#B42828] px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
