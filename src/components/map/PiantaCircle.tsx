import { memo } from 'react';
import type { Pianta, TipoPianta } from '@/types';

interface Props {
  pianta: Pianta;
  tipo?: TipoPianta;
  cx: number;
  cy: number;
  isSelected: boolean;
  onClick: (id: string) => void;
  colorMode: 'variety' | 'health';
}

function PiantaCircle({
  pianta, tipo, cx, cy, isSelected, onClick, colorMode
}: Props) {
  const isMorta = pianta.stato === 'morta';
  const isRipiantata = pianta.stato === 'ripiantata';

  // 1. Colorazione Premium basata sulla modalità selezionata
  const varietyColor = tipo?.colore_hex || '#10b981';
  const healthColor = isMorta ? '#ef4444' : (isRipiantata ? '#3b82f6' : '#10b981');
  const fillColor = colorMode === 'health' ? healthColor : varietyColor;

  // 2. Raggio dinamico solo per la selezione
  const currentRadius = isSelected ? 12 : 8;

  // 3. LOGICA ETICHETTA: Priorità al codice human-readable (es. VIG-001)
  // Se per qualche motivo manca, facciamo fallback sulla posizione nel filare
  const displayLabel = pianta.codice_etichetta || `P${pianta.posizione_nel_filare}`;

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      className="cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation();
        onClick(pianta.id); // L'ID tecnico (UUID) resta usato per le operazioni di selezione
      }}
    >
      {/* AREA DI TOCCO OTTIMIZZATA (Hitbox invisibile da 48px) */}
      <circle
        r={24}
        fill="transparent"
        className="pointer-events-auto"
      />

      {/* Feedback Selezione */}
      {isSelected && (
        <circle
          r={currentRadius + 6}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
          className="animate-pulse"
        />
      )}

      {/* Punto Vite */}
      <circle
        r={currentRadius}
        fill={isMorta ? 'transparent' : fillColor}
        stroke={isSelected ? '#ffffff' : (isMorta ? '#ef4444' : '#042f2e')}
        strokeWidth={isSelected ? 2 : (isMorta ? 2 : 1)}
        strokeDasharray={isMorta ? "2,2" : "0"}
        className="transition-all duration-200 group-hover:opacity-80"
      />

      {/* Simbolo morte (X rossa minimale) */}
      {isMorta && (
        <g className="pointer-events-none">
          <line x1={-4} y1={-4} x2={4} y2={4} stroke="#ef4444" strokeWidth="2" />
          <line x1={4} y1={-4} x2={-4} y2={4} stroke="#ef4444" strokeWidth="2" />
        </g>
      )}

      {/* ETICHETTA TECNICA: Visibile solo in LOD "detail" grazie al CSS in MapCanvas */}
      <text
        y={-(currentRadius + 10)}
        textAnchor="middle"
        fontSize={10}
        // Utilizziamo JetBrains Mono per un feeling tecnico e preciso
        className="vite-label font-mono font-bold fill-slate-900 pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
      >
        {displayLabel}
      </text>
    </g>
  );
}

export default memo(PiantaCircle);