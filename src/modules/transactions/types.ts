export interface Transaction {
  id: number;
  code: string;
  reference: string | null;
  idempotency_key: string | null;
  retrait_key: string;
  expediteur_id: number;
  beneficiaire_id: number;
  agence_envoi_id: number;
  agence_retrait_id: number | null;
  utilisateur_envoi_id: number;
  utilisateur_retrait_id: number | null;
  montant: string;
  total: string;
  telephone_destinataire: string | null;
  nom_destinataire: string | null;
  frais: string;
  commission: string;
  statut: 'EN_ATTENTE' | 'ENVOYE' | 'RETIRE' | 'ANNULE' | 'EXPIRE';
  date_emission: string | null;
  date_envoi: string;
  date_retrait: string | null;
  date_annulation: string | null;
  motif_annulation: string | null;
  utilisateur_annulation_id: number | null;
  created_at: string;
  updated_at: string;
  expediteur?: {
    id: number;
    nom: string;
    telephone: string;
  };
  beneficiaire?: {
    id: number;
    nom: string;
    telephone: string;
  };
  agenceEnvoi?: {
    id: number;
    code: string;
    nom: string;
  };
  agenceRetrait?: {
    id: number;
    code: string;
    nom: string;
  };
  utilisateurEnvoi?: {
    id: number;
    nom: string;
  };
  utilisateurRetrait?: {
    id: number;
    nom: string;
  };
}

export interface TransactionFormData {
  expediteur_id: number;
  beneficiaire_id: number;
  montant: number;
  agence_retrait_id: number;
  telephone_destinataire?: string;
  nom_destinataire?: string;
  reference?: string;
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  data: Transaction;
}

export interface TransactionListResponse {
  success: boolean;
  data: Transaction[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
