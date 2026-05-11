export interface TipoPianta {
  id: number;
  nome: string;
  colore_hex: string;
  descrizione?: string;
}

export interface Filare {
  id: number;
  nome: string;
  ordine: number;           // per posizionamento mappa
  descrizione?: string;
  numero_piante: number;
  note?: string;
  venditore?: string;
}

export interface Pianta {
  id: string;               // "A-1"
  filare_id: number;
  posizione_nel_filare: number;
  tipo_id: number;
  tipo?: TipoPianta;        // join opzionale
  eta_anni?: number;
  anno_impianto?: number;
  porta_innesto?: string;
  note?: string;
  stato: 'attiva' | 'morta' | 'ripiantata';
  coord_x?: number;
  coord_y?: number;
  venditore?: string;
}

export interface Operazione {
  id: number;
  pianta_id: string;
  tipo: string;
  data: string;             // ISO date string
  descrizione?: string;
  note_aggiuntive?: string;
  foto_url?: string;
}

export interface POI {
  id: string;
  nome: string;
  tipo: 'infrastruttura' | 'albero' | 'edificio';
  icona: string;
  coord_x: number;
  coord_y: number;
  descrizione?: string;
}

export type PiantaInput = Omit<Pianta, 'id' | 'tipo'>;
export type OperazioneInput = Omit<Operazione, 'id'>;
export type POIInput = Omit<POI, 'id'>;
