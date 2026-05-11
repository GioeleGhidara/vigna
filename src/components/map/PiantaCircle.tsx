import { memo } from 'react';
import { IconApple, IconCherry, IconLemon, IconBanana, IconPlant, IconLeaf, IconFlower } from '@tabler/icons-react';
import type { Pianta, TipoPianta } from '@/types';

const FRUIT_ICON_MAP: Record<string, any> = {
  melo: IconApple,
  pero: IconApple,
  ciliegio: IconCherry,
  limone: IconLemon,
  banana: IconBanana,
  pesco: IconFlower,
  albicocco: IconFlower,
  susino: IconPlant,
  frutto: IconPlant
};

interface Props {
  pianta: Pianta;
  tipo?: TipoPianta;
  cx: number;
  cy: number;
  isSelected: boolean;
  onClick: (id: string) => void;
  colorMode?: 'variety' | 'health';
}

function PiantaCircle({ pianta, tipo, cx, cy, isSelected, onClick, colorMode = 'variety' }: Props) {
  const isMorta = pianta.stato === 'morta';
  const isRipiantata = pianta.stato === 'ripiantata';

  const varietyColor = tipo?.colore_hex || '#cbd5e1';
  const healthColor = isMorta ? '#ef4444' : (isRipiantata ? '#f59e0b' : '#10b981');
  const color = colorMode === 'health' ? healthColor : varietyColor;

  // Cerca se il nome del tipo corrisponde a un frutto conosciuto
  const nomeBasso = tipo?.nome.toLowerCase() || '';
  const FruitIcon = Object.entries(FRUIT_ICON_MAP).find(([key]) => nomeBasso.includes(key))?.[1];

  return (
    <g
      className="cursor-pointer transition-transform duration-200 hover:scale-150 origin-center"
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(pianta.id);
      }}
    >
      {/* Glow for selection */}
      {isSelected && (
        <circle cx={cx} cy={cy} r={FruitIcon ? 18 : 12} fill={color} fillOpacity={0.2} />
      )}
      
      {FruitIcon ? (
        <g transform={`translate(${cx - 12}, ${cy - 12})`}>
          <FruitIcon 
            size={24} 
            color={isMorta ? '#ef4444' : color} 
            strokeWidth={isSelected ? 2.5 : 1.5}
            className={isMorta ? 'opacity-40' : ''}
          />
        </g>
      ) : (
        <circle
          cx={cx} cy={cy}
          r={isSelected ? 8 : 6}
          fill={isMorta ? 'transparent' : color}
          stroke={isMorta ? '#ef4444' : (isRipiantata ? '#f59e0b' : 'white')}
          strokeWidth={isMorta || isRipiantata ? 2 : 1.5}
          strokeDasharray={isMorta ? "2,2" : "0"}
          className="transition-all duration-200"
        />
      )}
      
      {/* Dead cross icon */}
      {isMorta && (
        <g>
          <line x1={cx-4} y1={cy-4} x2={cx+4} y2={cy+4} stroke="#ef4444" strokeWidth="2" />
          <line x1={cx+4} y1={cy-4} x2={cx-4} y2={cy+4} stroke="#ef4444" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

export default memo(PiantaCircle);
