import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../modules/auth/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/transactions', label: 'Transactions', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/agences', label: 'Agences', roles: ['SUPERADMIN', 'ADMIN'] },
    { path: '/clients', label: 'Clients', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT'] },
    { path: '/utilisateurs', label: 'Utilisateurs', roles: ['SUPERADMIN', 'ADMIN'] },
    { path: '/audit', label: 'Journal', roles: ['SUPERADMIN', 'ADMIN', 'RESPONSABLE'] },
  ];

  const visibleLinks = navLinks.filter(link => link.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold">
              MAKONON TRANSFERT
            </Link>
            <span className="text-sm opacity-75">
              {user?.agenceId ? `Agence #${user.agenceId}` : 'Siège'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.nom} ({user?.role})</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-lg min-h-[calc(100vh-64px)] p-4">
          <ul className="space-y-1">
            {visibleLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`
                    block px-4 py-2 rounded-lg transition-colors
                    ${isActive(link.path)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
