import { MAP_CONFIG } from '@/constants/mappa';
import type { Pianta, TipoPianta } from '@/types';

interface Props {
  pianta: Pianta;
  tipo: TipoPianta | undefined;
  cx: number;
  cy: number;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function PiantaCircle({ pianta, tipo, cx, cy, isSelected, onClick }: Props) {
  const fill = tipo?.colore_hex ?? '#6B7280';
  const opacity = pianta.stato === 'morta' ? 0.3 : 1;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={MAP_CONFIG.CIRCLE_RADIUS}
      fill={fill}
      fillOpacity={opacity}
      stroke={isSelected ? '#F59E0B' : '#fff'}
      strokeWidth={isSelected ? 3 : 1}
      style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
      onClick={(e) => {
        // Previene la propagazione se serve
        e.stopPropagation();
        onClick(pianta.id);
      }}
    >
      <title>{pianta.id} — {tipo?.nome ?? 'Sconosciuto'}</title>
    </circle>
  );
}
