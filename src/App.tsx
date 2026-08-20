import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './core/api/queryClient'
import Layout from './layouts/Layout'
import LoginPage from './modules/auth/pages/LoginPage'
import DashboardPage from './modules/dashboard/pages/DashboardPage'
import TransactionsPage from './modules/transactions/pages/TransactionsPage'
import ClientsPage from './modules/clients/pages/ClientsPage'
import AgencesPage from './modules/agences/pages/AgencesPage'
import UtilisateursPage from './modules/utilisateurs/pages/UtilisateursPage'
import AuditPage from './modules/audit/pages/AuditPage'
import MouvementsPage from './modules/mouvements/pages/MouvementsPage'
import FraisPage from './modules/frais/pages/FraisPage'
import ReportsPage from './modules/reports/pages/ReportsPage'
import TransferReportPage from './modules/reports/pages/TransferReportPage'
import FeesReportPage from './modules/reports/pages/FeesReportPage'
import { useAuth } from './modules/auth/hooks/useAuth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 4000, 
            style: { 
              background: '#363636', 
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              style: { background: '#10B981', color: '#fff' },
            },
            error: {
              style: { background: '#EF4444', color: '#fff' },
              duration: 6000,
            },
          }} 
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Layout><TransactionsPage /></Layout></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Layout><ClientsPage /></Layout></ProtectedRoute>} />
          <Route path="/agences" element={<ProtectedRoute><Layout><AgencesPage /></Layout></ProtectedRoute>} />
          <Route path="/utilisateurs" element={<ProtectedRoute><Layout><UtilisateursPage /></Layout></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><Layout><AuditPage /></Layout></ProtectedRoute>} />
          <Route path="/mouvements" element={<ProtectedRoute><Layout><MouvementsPage /></Layout></ProtectedRoute>} />
          <Route path="/frais" element={<ProtectedRoute><Layout><FraisPage /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />
          <Route path="/reports/transfers" element={<ProtectedRoute><Layout><TransferReportPage /></Layout></ProtectedRoute>} />
          <Route path="/reports/fees" element={<ProtectedRoute><Layout><FeesReportPage /></Layout></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout><Navigate to="/dashboard" replace /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
