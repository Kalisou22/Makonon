import React, { useState } from 'react';
import { useTransactions, useCreateTransaction } from '../hooks/useTransactions';
import { CreateTransactionModal } from '../components/CreateTransactionModal';

export const TransactionsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useTransactions(page);
  const createMutation = useCreateTransaction();

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (isError) {
    return <div className="text-red-600 py-8">Erreur de chargement des transactions</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nouveau transfert
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.content?.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {transaction.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.montant.toLocaleString()} GNF
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${transaction.statut === 'ENVOYE' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${transaction.statut === 'RETIRE' ? 'bg-green-100 text-green-800' : ''}
                    ${transaction.statut === 'ANNULE' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {transaction.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.dateEnvoi).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.statut === 'ENVOYE' && (
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => window.location.href = `/retrait/${transaction.code}`}
                    >
                      Retirer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-sm text-gray-700">
            Page {page + 1} sur {data?.totalPages || 1}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min((data?.totalPages || 1) - 1, p + 1))}
              disabled={page >= (data?.totalPages || 1) - 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};
