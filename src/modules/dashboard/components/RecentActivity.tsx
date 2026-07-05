import React from 'react'
import { Card, CardHeader, CardBody } from '../../../components/ui/Card'
import { Loader } from '../../../components/ui/Loader'

interface Activity {
  id: number
  type: string
  description: string
  user: string
  date: string
}

interface RecentActivityProps {
  activities?: Activity[]
  isLoading?: boolean
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        </CardBody>
      </Card>
    )
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      transfert: '💰',
      client: '👤',
      user: '👥',
      agence: '🏢',
      login: '🔐',
      default: '📌',
    }
    return icons[type] || icons.default
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-text-secondary text-center py-6 text-sm">
              Aucune activité récente
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
              >
                <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.description}</p>
                  <p className="text-xs text-text-secondary">
                    Par {activity.user} • {new Date(activity.date).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default RecentActivity
