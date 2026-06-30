import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../modules/auth/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold">
              MAKONON TRANSFERT
            </Link>
            <span className="text-sm opacity-75">{user?.agenceId ? `Agence #${user.agenceId}` : 'Siège'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.nom} ({user?.role})</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg min-h-[calc(100vh-64px)] p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/transactions" className="block px-4 py-2 rounded hover:bg-gray-100">
                Transactions
              </Link>
            </li>
            {['SUPERADMIN', 'ADMIN'].includes(user?.role || '') && (
              <>
                <li>
                  <Link to="/agences" className="block px-4 py-2 rounded hover:bg-gray-100">
                    Agences
                  </Link>
                </li>
                <li>
                  <Link to="/utilisateurs" className="block px-4 py-2 rounded hover:bg-gray-100">
                    Utilisateurs
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/clients" className="block px-4 py-2 rounded hover:bg-gray-100">
                Clients
              </Link>
            </li>
            <li>
              <Link to="/audit" className="block px-4 py-2 rounded hover:bg-gray-100">
                Journal
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
