import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { calcCoords, calcCanvasSize } from '@/lib/mapUtils';
import PiantaCircle from './PiantaCircle';
import type { Pianta, Filare, TipoPianta } from '@/types';

const GRID_SIZE = 40;
const GRID_COLOR = '#e2e8f0';
const LABEL_X = 20;
const ROW_HEIGHT = 100;
const ROW_OFFSET_Y = 50;
const LABEL_SIZE = 14;

interface Props {
  filari: Filare[];
  piante: Pianta[];
  tipiMap: Record<number, TipoPianta>;
  selectedId?: string;
  onSelect: (id: string) => void;
  repositioningId?: string | null;
  onReposition?: (id: string, x: number, y: number) => void;
}

export default function MapCanvas({ filari, piante, tipiMap, selectedId, onSelect, repositioningId, onReposition }: Props) {
  const { width, height } = calcCanvasSize(filari);
  const filariMap = Object.fromEntries(filari.map(f => [f.id, f]));

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!repositioningId || !onReposition) return;
    
    // Otteniamo le coordinate reali dell'SVG
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    
    onReposition(repositioningId, Math.round(cursorPt.x), Math.round(cursorPt.y));
  };

  return (
    <div className={`w-full h-full overflow-hidden border rounded-lg shadow-inner ${repositioningId ? 'bg-emerald-50 cursor-crosshair' : 'bg-slate-50 cursor-grab active:cursor-grabbing'}`}>
      <TransformWrapper 
        minScale={0.1} 
        maxScale={4} 
        initialScale={0.3} 
        centerOnInit
        panning={{ disabled: !!repositioningId }} // disabilita drag della mappa se in modalità riposizionamento
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <svg width={width} height={height} className="bg-transparent" onClick={handleSvgClick}>
            <defs>
              <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke={GRID_COLOR} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {filari.map(f => (
              <text
                key={f.id}
                x={LABEL_X}
                y={ROW_OFFSET_Y + f.ordine * ROW_HEIGHT}
                fontSize={LABEL_SIZE}
                fontWeight="bold"
                fill="#64748b"
                dominantBaseline="middle"
              >
                {f.nome}
              </text>
            ))}

            {piante.map(p => {
              const filare = filariMap[p.filare_id];
              if (!filare) return null;
              
              // Se la pianta ha coordinate personalizzate, usiamo quelle, altrimenti calcoliamo
              const isCustom = p.coord_x != null && p.coord_y != null;
              const calc = calcCoords(filare, p.posizione_nel_filare);
              const x = isCustom ? p.coord_x! : calc.x;
              const y = isCustom ? p.coord_y! : calc.y;

              return (
                <PiantaCircle
                  key={p.id}
                  pianta={p}
                  tipo={tipiMap[p.tipo_id]}
                  cx={x}
                  cy={y}
                  isSelected={p.id === selectedId}
                  onClick={onSelect}
                />
              );
            })}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}