import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, logoutAll, isLoggingOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter de tous les appareils ?')) {
      await logoutAll();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">MAKONON TRANSFERT</h1>
      </div>
      <div className="flex items-center space-x-4 relative">
        <span className="text-sm text-gray-600">
          {user?.nom || 'Utilisateur'}
          <span className="ml-2 text-xs text-gray-400">
            ({user?.role || 'N/A'})
          </span>
        </span>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
        >
          {user?.nom?.charAt(0) || 'U'}
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoggingOut ? 'Déconnexion...' : '🔓 Déconnexion'}
            </button>
            <button
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              🔐 Déconnexion globale
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
