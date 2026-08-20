import React from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
  { path: '/transferts', label: 'Transferts', icon: '💸' },
  { path: '/clients', label: 'Clients', icon: '👤' },
  { path: '/agences', label: 'Agences', icon: '🏢' },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: '👥' },
  { path: '/mouvements', label: 'Mouvements de caisse', icon: '💰' },
  { path: '/frais', label: 'Frais', icon: '📋' },
  { path: '/reports', label: 'Rapports', icon: '📄' },
  { path: '/audit', label: 'Audit', icon: '🔍' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
