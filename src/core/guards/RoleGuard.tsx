import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user?.role || '')) {
    if (fallback) return <>{fallback}</>
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-danger/20">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-danger mb-2">Accès refusé</h2>
          <p className="text-text-secondary">
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Rôle requis : {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default RoleGuard
