import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { calcCoords, calcCanvasSize } from '@/lib/mapUtils';
import PiantaCircle from './PiantaCircle';
import { 
  IconHome, IconDroplet, IconGauge, IconAerialLift, IconBuildingWarehouse, 
  IconApple, IconCherry, IconLemon, IconBanana, IconPlant, IconLeaf, IconFlower
} from '@tabler/icons-react';
import type { Pianta, Filare, TipoPianta, POI } from '@/types';

const ICON_MAP: Record<string, { icon: any, isEmoji: boolean }> = {
  // Infrastruttura (Tabler)
  Home: { icon: IconHome, isEmoji: false },
  Warehouse: { icon: IconBuildingWarehouse, isEmoji: false },
  Droplets: { icon: IconDroplet, isEmoji: false },
  Gauge: { icon: IconGauge, isEmoji: false },
  UtilityPole: { icon: IconAerialLift, isEmoji: false },
  Droplet: { icon: IconDroplet, isEmoji: false },
  Sprout: { icon: IconPlant, isEmoji: false },

  // Frutta (Tabler)
  Melo: { icon: IconApple, isEmoji: false },
  Pero: { icon: IconApple, isEmoji: false },
  Limone: { icon: IconLemon, isEmoji: false },
  Ciliegio: { icon: IconCherry, isEmoji: false },
  Banana: { icon: IconBanana, isEmoji: false },
  Vite: { icon: IconLeaf, isEmoji: false },
  Pesco: { icon: IconFlower, isEmoji: false },
  Albero: { icon: IconPlant, isEmoji: false },
};

const ROW_HEIGHT = 120;
const ROW_OFFSET_Y = 200; 
const LABEL_X = 150;

interface Props {
  filari: Filare[];
  piante: Pianta[];
  tipiMap: Record<number, TipoPianta>;
  poi: POI[];
  selectedId?: string;
  onSelect: (id: string) => void;
  repositioningId?: string | null;
  onReposition?: (id: string, x: number, y: number) => void;
  colorMode?: 'variety' | 'health';
}

export default function MapCanvas({ filari, piante, tipiMap, poi, selectedId, onSelect, repositioningId, onReposition, colorMode = 'variety' }: Props) {
  const { width: vWidth, height: vHeight } = calcCanvasSize(filari);
  
  const width = vWidth + 600;
  const height = vHeight + 600;

  const filariMap = Object.fromEntries(filari.map(f => [f.id, f]));
  
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!repositioningId || !onReposition) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    
    const cursorPt = pt.matrixTransform(ctm.inverse());
    onReposition(repositioningId, Math.round(cursorPt.x), Math.round(cursorPt.y));
  };

  return (
    <div className={`w-full h-full overflow-hidden border-0 rounded-[2.5rem] shadow-2xl transition-all duration-1000 noise-bg ${repositioningId ? 'bg-emerald-950/60 cursor-crosshair' : 'bg-[#042f2e] cursor-grab active:cursor-grabbing'}`}>
      <TransformWrapper 
        minScale={0.05} 
        maxScale={4} 
        initialScale={0.25} 
        centerOnInit
        panning={{ disabled: !!repositioningId }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full bg-transparent" 
            onClick={handleSvgClick} 
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              <linearGradient id="rowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* --- LIVELLO 1: Aree Naturali --- */}
            <g id="aree-naturali">
              <polygon points={`0,0 ${width},0 ${width},150 0,300`} fill="#064e3b" opacity="0.15" />
              <rect x={width - 400} y={height - 400} width="400" height="400" fill="#eab308" opacity="0.05" />
            </g>

            {/* --- LIVELLO 2: Confini e Fiume --- */}
            <g id="confini">
              <path 
                d={`M 0,${height - 100} Q ${width/2},${height - 300} ${width},${height - 150}`} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="40" 
                opacity="0.15" 
                strokeLinecap="round"
              />
              <polyline 
                points={`50,100 50,${height-50} ${width-50},${height-50}`} 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="2" 
                strokeDasharray="10,15" 
                opacity="0.3"
              />
            </g>

            {/* --- LIVELLO 3: Il Vigneto --- */}
            <g id="vigneto">
              <text x="150" y="100" className="font-heading font-black text-8xl text-slate-100 uppercase tracking-tighter opacity-10 pointer-events-none">
                Fojachini
              </text>

              {filari.map(f => {
                const isSelected = filariMap[selectedId || '']?.id === f.id;
                const y = ROW_OFFSET_Y + f.ordine * ROW_HEIGHT;
                
                return (
                  <g key={f.id}>
                    {isSelected && (
                      <rect x={0} y={y - 55} width={width} height={110} fill="url(#rowGradient)" />
                    )}
                    <line 
                      x1={LABEL_X + 100} y1={y} x2={width - 200} y2={y} 
                      stroke={isSelected ? '#fbbf24' : '#064e3b'} 
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      strokeDasharray={isSelected ? "0" : "5,15"}
                    />
                    <text
                      x={LABEL_X} y={y} fontSize={28}
                      fontFamily="Montserrat, sans-serif" fontWeight={isSelected ? "900" : "700"}
                      fill={isSelected ? "#fbbf24" : "#115e59"} dominantBaseline="middle"
                    >
                      {f.nome.replace(/filare\s*/i, '')}
                    </text>
                  </g>
                );
              })}

              {piante.map(p => {
                const filare = filariMap[p.filare_id];
                if (!filare) return null;
                const isCustom = p.coord_x != null && p.coord_y != null;
                const calc = calcCoords(filare, p.posizione_nel_filare);
                const x = (isCustom ? p.coord_x! : calc.x) + (LABEL_X - 180);
                const y = (isCustom ? p.coord_y! : calc.y) + (ROW_OFFSET_Y - 80);

                return (
                  <PiantaCircle
                    key={p.id} pianta={p} tipo={tipiMap[p.tipo_id]}
                    cx={x} cy={y} isSelected={p.id === selectedId}
                    onClick={onSelect} colorMode={colorMode}
                  />
                );
              })}
            </g>

            {/* --- LIVELLO 4: Frutteto (Dinamico) --- */}
            <g id="frutteto">
              {poi.filter(p => p.tipo === 'albero').map(tree => {
                const config = ICON_MAP[tree.icona] || { icon: '🌳', isEmoji: true };
                return (
                  <g key={tree.id} transform={`translate(${tree.coord_x}, ${tree.coord_y})`} className="opacity-80 hover:opacity-100 transition-all cursor-pointer" onClick={() => onSelect(tree.id)}>
                    {config.isEmoji ? (
                      <text fontSize={32} dominantBaseline="middle" textAnchor="middle">{config.icon as string}</text>
                    ) : (
                      <config.icon size={30} color="#10b981" strokeWidth={1} />
                    )}
                    <text y="45" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-200 uppercase tracking-tighter">
                      {tree.nome}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* --- LIVELLO 5: Punti di Interesse (Dinamici) --- */}
            <g id="poi">
              {poi.filter(p => p.tipo !== 'albero').map(item => {
                const config = ICON_MAP[item.icona] || { icon: Home, isEmoji: false };
                const isEdificio = item.tipo === 'edificio';
                const color = item.tipo === 'infrastruttura' ? '#3b82f6' : '#064e3b';
                
                return (
                  <g key={item.id} transform={`translate(${item.coord_x}, ${item.coord_y})`} className="opacity-80 hover:opacity-100 transition-all cursor-pointer" onClick={() => onSelect(item.id)}>
                    {isEdificio && <rect x="-10" y="-10" width="60" height="60" rx="20" fill="#fcfaf7" className="shadow-2xl" />}
                    {config.isEmoji ? (
                      <text fontSize={isEdificio ? 40 : 24} dominantBaseline="middle">{config.icon as string}</text>
                    ) : (
                      <config.icon size={isEdificio ? 40 : 24} color={color} strokeWidth={2} />
                    )}
                    <text x={isEdificio ? 60 : 35} y={isEdificio ? 25 : 15} className={`font-heading font-black text-xs uppercase tracking-widest ${isEdificio ? 'fill-slate-100' : 'fill-slate-300 opacity-60'}`}>
                      {item.nome}
                    </text>
                  </g>
                );
              })}
            </g>

          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}