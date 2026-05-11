import { MAP_CONFIG } from '@/constants/mappa';
import type { Filare, POI } from '@/types';

const { MARGIN_LEFT, MARGIN_TOP, SPACING_X, SPACING_Y } = MAP_CONFIG;

export const calcCoords = (filare: Filare, posizione: number) => ({
  x: MARGIN_LEFT + posizione * SPACING_X,
  y: MARGIN_TOP + filare.ordine * SPACING_Y,
});

export const calcCanvasSize = (filari: Filare[], poi: POI[] = []) => {
  const baseWidth = filari.length > 0 
    ? Math.max(...filari.map(f => MARGIN_LEFT + f.numero_piante * SPACING_X + 250))
    : MAP_CONFIG.CANVAS_WIDTH;
    
  const baseHeight = filari.length > 0
    ? MARGIN_TOP + filari.length * SPACING_Y + 200
    : MAP_CONFIG.CANVAS_HEIGHT;

  // Se ci sono POI fuori dai margini dei filari, estendiamo il canvas
  const maxPoiX = poi.length > 0 ? Math.max(...poi.map(p => p.coord_x + 100)) : 0;
  const maxPoiY = poi.length > 0 ? Math.max(...poi.map(p => p.coord_y + 100)) : 0;

  return {
    width: Math.max(baseWidth, maxPoiX),
    height: Math.max(baseHeight, maxPoiY),
  };
};
