/**
 * Registro centrale delle costanti del vigneto.
 * Aggrega i dati dai file specifici in src/data.
 */

import { VENDOR_NAMES } from '../data/vendors';

export { VENDORS, VENDOR_NAMES as PRODUTTORI_LIST } from '../data/vendors';
export { GRAPE_VARIETIES } from '../data/grapes';
export { LANDMARK_TYPES, PREDEFINED_POIS } from '../data/landmarks';

export const STATI_PIANTA = [
  { id: 'attiva', label: 'In Salute', color: 'emerald' },
  { id: 'morta', label: 'Morta / Da Rimpiazzare', color: 'red' },
  { id: 'ripiantata', label: 'Nuovo Innesto', color: 'blue' },
];

export const ANNO_CORRENTE = new Date().getFullYear();
