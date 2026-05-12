/**
 * Registro centrale delle costanti del vigneto.
 * Modificando questi valori qui, verranno aggiornati in tutta l'applicazione.
 */

export const PRODUTTORI_LIST = [
  "Gallo Silvio (Stella)",
  "Vivai Donato (Cenaia PI)",
  "Pamparino Sara (Finale Ligure)",
  "Negro Carlo (Dogliani)",
  "Vivaio Revella (Quiliano)"
];

export const STATI_PIANTA = [
  { id: 'attiva', label: 'In Salute', color: 'emerald' },
  { id: 'morta', label: 'Morta / Da Rimpiazzare', color: 'red' },
  { id: 'ripiantata', label: 'Nuovo Innesto', color: 'blue' },
];

export const ANNO_CORRENTE = new Date().getFullYear();
