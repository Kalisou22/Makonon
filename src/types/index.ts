export interface Agence {
  id: number;
  code: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  responsable?: string;
  devise: string;
  solde_cache: number;
  actif: boolean;
}

export interface Client {
  id: number;
  nom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  plafondTransaction?: number;
  dateCreation: string;
}

export interface Transaction {
  id: number;
  code: string;
  montant: number;
  frais: number;
  statut: string;
  agenceEnvoiId: number;
  agenceReceptionId: number;
  expediteurId: number;
  beneficiaireId: number;
  dateEnvoi: string;
  dateRetrait?: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
  telephone?: string;
  agenceId?: number;
  agence?: { id: number; nom: string };
  actif: boolean;
}

export interface AuditLog {
  id: number;
  utilisateurId: number;
  utilisateurNom?: string;
  action: string;
  entite: string;
  entiteId?: number;
  description?: string;
  created_at: string;
}

export interface DashboardStats {
  totalTransactions: number;
  totalClients: number;
  totalAgences: number;
  volumeTotal: number;
  transactionsAujourdhui: number;
  volumeAujourdhui: number;
  retraitsEnAttente: number;
  montantEnAttente: number;
  agencesActives: number;
}

export interface Activity {
  id: number;
  action: string;
  description: string;
  utilisateurNom: string;
  created_at: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}
