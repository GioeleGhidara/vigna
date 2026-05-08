import { MAP_CONFIG } from '@/constants/mappa';
import type { Filare } from '@/types';

const { MARGIN_LEFT, MARGIN_TOP, SPACING_X, SPACING_Y } = MAP_CONFIG;

// Usa filare.ordine (dal DB) invece dell'indice array — robusto
export const calcCoords = (filare: Filare, posizione: number) => ({
  x: MARGIN_LEFT + posizione * SPACING_X,
  y: MARGIN_TOP + filare.ordine * SPACING_Y,
});

export const calcCanvasSize = (filari: Filare[]) => {
  if (filari.length === 0) return { width: MAP_CONFIG.CANVAS_WIDTH, height: MAP_CONFIG.CANVAS_HEIGHT };
  
  return {
    width: Math.max(...filari.map(f => MARGIN_LEFT + f.numero_piante * SPACING_X + 100)),
    height: MARGIN_TOP + filari.length * SPACING_Y + 100,
  };
};
