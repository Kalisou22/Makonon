export interface Transaction {
  id: number;
  code: string;
  montant: number;
  frais: number;
  commission: number;
  statut: 'EN_ATTENTE' | 'ENVOYE' | 'RETIRE' | 'ANNULE' | 'EXPIRE';
  date_envoi: string;
  date_retrait: string | null;
  date_annulation: string | null;
  motif_annulation: string | null;
  idempotency_key: string;
  expediteur_id: number;
  beneficiaire_id: number;
  agence_envoi_id: number;
  agence_retrait_id: number;
  utilisateur_envoi_id: number;
  utilisateur_retrait_id: number | null;
  utilisateur_annulation_id: number | null;
  expediteur?: {
    id: number;
    nom: string;
    telephone: string;
    email?: string;
  };
  beneficiaire?: {
    id: number;
    nom: string;
    telephone: string;
    email?: string;
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
    email: string;
  };
  utilisateurRetrait?: {
    id: number;
    nom: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  nom_expediteur: string;
  telephone_expediteur: string;
  nom_beneficiaire: string;
  telephone_beneficiaire: string;
  montant: number;
  agence_envoi_id: number;
  agence_destinataire_id: number;
  idempotency_key: string;
}

export interface TransactionFilters {
  statut?: 'EN_ATTENTE' | 'ENVOYE' | 'RETIRE' | 'ANNULE' | 'EXPIRE';
  page?: number;
  per_page?: number;
}

export interface SoldeAgenceResponse {
  solde: number;
  agence_id: number;
}
