import { CloudSun, Droplets, MapPin, Trees, Warehouse, Zap } from 'lucide-react';

export const LANDMARK_TYPES = [
  { id: 'sensor', label: 'Sensore IoT', icon: Zap, color: 'blue' },
  { id: 'station', label: 'Stazione Meteo', icon: CloudSun, color: 'orange' },
  { id: 'water', label: 'Irrigazione', icon: Droplets, color: 'cyan' },
  { id: 'ulivo', label: 'Ulivo', icon: Trees, color: 'olive' },
  { id: 'building', label: 'Capanno / Magazzino', icon: Warehouse, color: 'slate' },
  { id: 'access', label: 'Punto Accesso', icon: MapPin, color: 'emerald' }
];

export const PREDEFINED_POIS = [
  { nome: 'Centralina Meteo Nord', categoria: 'station', icon: 'CloudSun' },
  { nome: 'Pozzo Principale', categoria: 'water', icon: 'Droplets' },
  { nome: 'Ingresso Strada', categoria: 'access', icon: 'MapPin' },
  { nome: 'Vasca Raccolta', categoria: 'water', icon: 'Droplets' }
];
