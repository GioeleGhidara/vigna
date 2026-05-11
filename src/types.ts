export interface TipoPianta {
  id: number;
  nome: string;
  colore_hex: string;
  descrizione?: string;
}

export interface Filare {
  id: number;
  nome: string;
  ordine: number;
  numero_piante: number;
  descrizione?: string;
  note?: string;
  venditore?: string;
}

export interface Pianta {
  id: string; // UUID generato automaticamente da Supabase
  filare_id: number;
  tipo_id: number;
  stato: 'attiva' | 'morta' | 'ripiantata';
  posizione_nel_filare: number;
  codice_etichetta: string; // Codice human-readable da campo (es. "F1-001")
  eta_anni?: number;
  anno_impianto?: number;
  porta_innesto?: string;
  note?: string;
  coord_x?: number | null;
  coord_y?: number | null;
  venditore?: string;
  tipo?: TipoPianta;
}

export interface PiantaInput {
  filare_id: number;
  tipo_id: number;
  stato: 'attiva' | 'morta' | 'ripiantata';
  posizione_nel_filare: number;
  codice_etichetta: string;
  eta_anni?: number;
  anno_impianto?: number;
  porta_innesto?: string;
  note?: string;
  coord_x?: number | null;
  coord_y?: number | null;
  venditore?: string;
}

export interface Operazione {
  id: number;
  pianta_id: string;
  tipo: string;
  data: string; // ISO date string
  descrizione?: string;
  note_aggiuntive?: string;
  foto_url?: string;
}

export type OperazioneInput = Omit<Operazione, 'id'>;

export interface POI {
  id: string;
  nome: string;
  tipo: 'albero' | 'edificio' | 'infrastruttura' | 'altro';
  icona: string;
  coord_x: number;
  coord_y: number;
  descrizione?: string;
}

export interface POIInput extends Omit<POI, 'id'> {}
