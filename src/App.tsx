import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './core/api/queryClient';
import Layout from './layouts/Layout';
import LoginPage from './modules/auth/pages/LoginPage';
import { DashboardPage } from './modules/dashboard/pages/DashboardPage';
import { TransactionsPage } from './modules/transactions/pages/TransactionsPage';
import { ClientsPage } from './modules/clients/pages/ClientsPage';
import { AgencesPage } from './modules/agences/pages/AgencesPage';
import { UtilisateursPage } from './modules/utilisateurs/pages/UtilisateursPage';
import { MouvementsPage } from './modules/mouvements/pages/MouvementsPage';
import { FraisPage } from './modules/frais/pages/FraisPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import { TransferReportPage } from './modules/reports/pages/TransferReportPage';
import { FeesReportPage } from './modules/reports/pages/FeesReportPage';
import { AuditPage } from './modules/audit/pages/AuditPage';
import { ProtectedRoute } from './core/guards/ProtectedRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transferts" element={<TransactionsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="agences" element={<AgencesPage />} />
            <Route path="utilisateurs" element={<UtilisateursPage />} />
            <Route path="mouvements" element={<MouvementsPage />} />
            <Route path="frais" element={<FraisPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/transfers" element={<TransferReportPage />} />
            <Route path="reports/fees" element={<FeesReportPage />} />
            <Route path="audit" element={<AuditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
