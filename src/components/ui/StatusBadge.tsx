import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusMap: Record<string, { label: string; variant: string }> = {
    ENVOYE: { label: 'ENVOYÉ', variant: 'bg-yellow-100 text-yellow-800' },
    RETIRE: { label: 'RETIRÉ', variant: 'bg-green-100 text-green-800' },
    ANNULE: { label: 'ANNULÉ', variant: 'bg-red-100 text-red-800' },
    EN_ATTENTE: { label: 'EN ATTENTE', variant: 'bg-gray-100 text-gray-800' },
    SUCCES: { label: 'SUCCÈS', variant: 'bg-green-100 text-green-800' },
    ECHEC: { label: 'ÉCHEC', variant: 'bg-red-100 text-red-800' },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const { label, variant } = statusMap[status] || { 
    label: status, 
    variant: 'bg-gray-100 text-gray-800' 
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${variant}`}>
      {label}
    </span>
  );
};
