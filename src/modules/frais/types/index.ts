export interface FraisConfiguration {
  id: number;
  nom: string;
  description: string | null;
  type: 'FIXE' | 'POURCENTAGE' | 'ECHELONNE';
  valeur: number;
  seuil_min: number | null;
  seuil_max: number | null;
  actif: boolean;
  date_debut: string;
  date_fin: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface FraisHistorique {
  id: number;
  frais_configuration_id: number | null;
  transfert_id: number | null;
  montant_initial: number;
  montant_frais: number;
  type_frais: string;
  date_application: string;
  configuration?: FraisConfiguration;
  transfert?: any;
}

export interface FraisCalculResult {
  frais: number;
  commission: number;
  taux: number;
  config_utilisee: {
    id: number;
    nom: string;
    type: string;
  } | null;
}

export interface FraisResponse {
  success: boolean;
  data: FraisConfiguration[];
}

export interface FraisSingleResponse {
  success: boolean;
  data: FraisConfiguration;
}

export interface FraisCalculResponse {
  success: boolean;
  data: FraisCalculResult;
}
