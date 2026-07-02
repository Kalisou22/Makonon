import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

// Ajouter CardBody comme composant séparé
export const CardBody: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};

// Ajouter CardHeader comme composant séparé
export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}>{children}</div>;
};

// Ajouter CardFooter comme composant séparé
export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`}>{children}</div>;
};

// Export par défaut
export default Card;
