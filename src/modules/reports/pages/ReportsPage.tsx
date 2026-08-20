import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export const ReportsPage: React.FC = () => {
  const reportModules = [
    {
      title: 'Transferts',
      description: 'Consulter les rapports détaillés des transferts',
      path: '/reports/transfers',
      icon: '📊'
    },
    {
      title: 'Frais',
      description: 'Analyser les frais perçus par période',
      path: '/reports/fees',
      icon: '💰'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rapports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportModules.map((module) => (
          <Card key={module.path} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl mb-3">{module.icon}</div>
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{module.description}</p>
              </div>
              <Link to={module.path}>
                <Button variant="primary" size="sm">
                  Accéder →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
