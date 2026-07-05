import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from './core/api/queryClient'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { DashboardPage } from './modules/dashboard/pages/DashboardPage'
import { TransactionsPage } from './modules/transactions/pages/TransactionsPage'
import { AgencesPage } from './modules/agences/pages/AgencesPage'
import { ClientsPage } from './modules/clients/pages/ClientsPage'
import { UtilisateursPage } from './modules/utilisateurs/pages/UtilisateursPage'
import { AuditPage } from './modules/audit/pages/AuditPage'
import { MouvementsPage } from './modules/mouvements/pages/MouvementsPage'
import { RoleGuard } from './core/guards/RoleGuard'
import { Layout } from './layouts/Layout'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT']}>
                <Layout>
                  <DashboardPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/transactions"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT']}>
                <Layout>
                  <TransactionsPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/mouvements"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'RESPONSABLE']}>
                <Layout>
                  <MouvementsPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/agences"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
                <Layout>
                  <AgencesPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/clients"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'RESPONSABLE', 'AGENT']}>
                <Layout>
                  <ClientsPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/utilisateurs"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
                <Layout>
                  <UtilisateursPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route
            path="/audit"
            element={
              <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN', 'RESPONSABLE']}>
                <Layout>
                  <AuditPage />
                </Layout>
              </RoleGuard>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
