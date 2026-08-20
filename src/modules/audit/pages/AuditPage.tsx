import { useState } from 'react'
import { useAuditLogs } from '../hooks/useAudit'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody } from '../../../components/ui/Card'

export const AuditPage = () => {
  const [page] = useState(1)
  const { data, isLoading, refetch } = useAuditLogs({ page, per_page: 20 })
  
  const logs = data?.data || []

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Journal d'audit</h1>
        <Button variant="secondary" size="sm" onClick={() => refetch()}>Actualiser</Button>
      </div>
      <Card>
        <CardBody>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">Aucun log d'audit</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100"><tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Utilisateur</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Description</th>
              </tr></thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-2 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="p-2">{log.utilisateur_nom || 'Système'}</td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default AuditPage
