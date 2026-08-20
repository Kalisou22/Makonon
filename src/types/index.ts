// ============================================
// TYPES ALIGNÉS AVEC LE BACKEND
// ============================================

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
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  nom: string;
  telephone: string;
  email?: string;
  piece_identite?: string;
  numero_piece?: string;
  agence_id?: number;
  agence?: Agence;
  created_at?: string;
  updated_at?: string;
}

export interface Transfert {
  id: number;
  code: string;
  reference?: string;
  idempotency_key?: string;
  retrait_key?: string;
  expediteur_id: number;
  beneficiaire_id: number;
  agence_envoi_id: number;
  agence_retrait_id?: number;
  utilisateur_envoi_id: number;
  utilisateur_retrait_id?: number;
  utilisateur_annulation_id?: number;
  montant: number;
  frais: number;
  commission: number;
  total: number;
  telephone_destinataire?: string;
  nom_destinataire?: string;
  statut: 'EN_ATTENTE' | 'ENVOYE' | 'RETIRE' | 'ANNULE' | 'EXPIRE';
  date_emission?: string;
  date_envoi?: string;
  date_retrait?: string;
  date_annulation?: string;
  motif_annulation?: string;
  created_at?: string;
  updated_at?: string;
  expediteur?: Client;
  beneficiaire?: Client;
  agenceEnvoi?: Agence;
  agenceRetrait?: Agence;
  utilisateurEnvoi?: User;
  utilisateurRetrait?: User;
  utilisateurAnnulation?: User;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'RESPONSABLE' | 'AGENT';
  agence_id?: number | null;
  agence?: Agence;
  telephone?: string;
  actif: boolean;
  daily_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Caisse {
  id: number;
  agence_id: number;
  solde_physique: number;
  solde_comptable: number;
  agence?: Agence;
  created_at?: string;
  updated_at?: string;
}

export interface MouvementCaisse {
  id: number;
  caisse_id: number;
  type: 'ENTREE' | 'SORTIE';
  motif: 'ENVOI' | 'RETRAIT' | 'DEPOT' | 'AJUSTEMENT' | 'ANNULATION';
  montant: number;
  reference?: string;
  utilisateur_id: number;
  transfert_id?: number | null;
  created_at?: string;
  updated_at?: string;
  caisse?: Caisse;
  utilisateur?: User;
  transfert?: Transfert;
}

export interface Ledger {
  id: number;
  agence_id: number;
  transfert_id?: number | null;
  type: 'DEBIT' | 'CREDIT';
  nature: 'ENVOI' | 'RECEPTION' | 'RETRAIT' | 'FRAIS' | 'COMMISSION' | 'COMPENSATION' | 'AJUSTEMENT' | 'ANNULATION' | 'ANNULATION_RETRAIT' | 'DEPOT_INITIAL' | 'TRANSFERT_EMIS' | 'TRANSFERT_RECU' | 'ENGAGEMENT';
  montant: number;
  solde_avant: number;
  solde_apres: number;
  utilisateur_id: number;
  reference: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  agence?: Agence;
  transfert?: Transfert;
  utilisateur?: User;
}

export interface Engagement {
  id: number;
  transfert_id: number;
  agence_id: number;
  montant: number;
  statut: 'ENGAGE' | 'RETIRE' | 'ANNULE';
  created_at?: string;
  updated_at?: string;
  transfert?: Transfert;
  agence?: Agence;
}

export interface Compensation {
  id: number;
  agence_id: number;
  montant: number;
  type: string;
  statut: string;
  date_compensation: string;
  created_at?: string;
  updated_at?: string;
  agence?: Agence;
}

export interface AuditLog {
  id: number;
  utilisateur_id?: number | null;
  action: string;
  entite: string;
  entite_id?: number | null;
  old_data?: any;
  new_data?: any;
  ip?: string;
  created_at?: string;
  utilisateur?: User;
}

export interface FraisConfiguration {
  id: number;
  nom: string;
  description?: string;
  type: 'FIXE' | 'POURCENTAGE' | 'ECHELONNE';
  valeur: number;
  seuil_min?: number;
  seuil_max?: number;
  actif: boolean;
  date_debut: string;
  date_fin?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
