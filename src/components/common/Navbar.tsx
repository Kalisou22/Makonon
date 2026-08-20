import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">MAKONON TRANSFERT</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">{user?.nom || 'Utilisateur'}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
