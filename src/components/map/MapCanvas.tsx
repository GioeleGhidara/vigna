import React from 'react';
import { TransformWrapper, TransformComponent, useTransformContext } from 'react-zoom-pan-pinch';
import { calcCoords, calcCanvasSize } from '@/lib/mapUtils';
import PiantaCircle from './PiantaCircle';
import {
  Home, Building2, Droplets, Gauge, Trees, Apple, Cherry, Zap, Sprout, Citrus, Flower
} from 'lucide-react';
import type { Pianta, Filare, TipoPianta, POI } from '@/types';
import { MAP_CONFIG } from '@/constants/mappa';

// Mappatura coerente al 100% con POIManager.tsx usando esclusivamente lucide-react
const ICON_MAP: Record<string, { icon: any, color: string }> = {
  Home: { icon: Home, color: '#0f172a' },
  Warehouse: { icon: Building2, color: '#064e3b' },
  Droplets: { icon: Droplets, color: '#2563eb' },
  Gauge: { icon: Gauge, color: '#3b82f6' },
  UtilityPole: { icon: Zap, color: '#ca8a04' },
  Droplet: { icon: Droplets, color: '#2563eb' },
  Sprout: { icon: Sprout, color: '#10b981' },
  Albero: { icon: Trees, color: '#059669' },
  Melo: { icon: Apple, color: '#ef4444' },
  Pero: { icon: Apple, color: '#f59e0b' },
  Limone: { icon: Citrus, color: '#eab308' },
  Ciliegio: { icon: Cherry, color: '#dc2626' },
  Banana: { icon: Trees, color: '#f59e0b' },
  Vite: { icon: Sprout, color: '#10b981' },
  Pesco: { icon: Flower, color: '#db2777' },
};

// Sotto-componente isolato: ascolta lo zoom SOLO per i POI/Alberi (~30 elementi totali)
// Rimosso 'selectedId' destrutturato per eliminare l'errore di variabile dichiarata ma non utilizzata
function DynamicPOILayers({
  poi, onSelect
}: {
  poi: POI[]; selectedId?: string; onSelect: (id: string) => void;
}) {
  const { state } = useTransformContext();
  const scale = state.scale;

  const isBirdseyeView = scale < 0.2;
  const isDetailView = scale > 0.7;

  return (
    <g id="poi-layers">
      {poi.map(item => {
        const config = ICON_MAP[item.icona] || { icon: Trees, color: '#059669' };
        const isEdificio = item.tipo === 'edificio';
        const isAlbero = item.tipo === 'albero';

        const baseSize = isEdificio ? 40 : (isAlbero ? 30 : 24);
        const currentSize = Math.min(80, baseSize / scale);

        return (
          <g
            key={item.id}
            transform={`translate(${item.coord_x}, ${item.coord_y})`}
            className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.id);
            }}
          >
            {isBirdseyeView ? (
              <circle r={8 / scale} fill={config.color} />
            ) : (
              <>
                {isEdificio && (
                  <rect
                    x={-currentSize * 0.25}
                    y={-currentSize * 0.25}
                    width={currentSize * 1.5}
                    height={currentSize * 1.5}
                    rx={8 / scale}
                    fill="#fcfaf7"
                    stroke="#e2e8f0"
                    strokeWidth={1 / scale}
                    className="shadow-md"
                  />
                )}

                <g transform={`translate(${-currentSize / 2}, ${-currentSize / 2})`}>
                  <config.icon size={currentSize} color={config.color} strokeWidth={2} />
                </g>

                {isDetailView && (
                  <text
                    x={isEdificio ? currentSize * 1.2 : 0}
                    y={isEdificio ? currentSize * 0.5 : currentSize * 0.7 + 10}
                    textAnchor={isEdificio ? 'start' : 'middle'}
                    style={{ fontSize: `${Math.min(20, 11 / scale)}px` }}
                    className="font-bold fill-slate-800 pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] uppercase tracking-tighter"
                  >
                    {item.nome}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

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
  const { width: vWidth, height: vHeight } = calcCanvasSize(filari, poi);
  const width = vWidth + 200;
  const height = vHeight + 200;
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
    <div className={`w-full h-full overflow-hidden border border-slate-100 rounded-[2.5rem] shadow-2xl transition-all duration-1000 noise-bg ${repositioningId ? 'bg-emerald-50/80 cursor-crosshair' : 'bg-[#fcfaf7] cursor-grab active:cursor-grabbing'}`}>
      <TransformWrapper
        minScale={0.3}
        maxScale={12}
        initialScale={1.2}
        centerOnInit
        panning={{
          disabled: !!repositioningId,
          velocityDisabled: false
        }}
        // RICALIBRAZIONE ROTELLINA / TOUCHPAD:
        // Riduciamo drasticamente l'incremento (step) e disattiviamo l'attivazione a scatti (smoothStep)
        wheel={{
          step: 0.015,     // Valore ultra-ridotto per forzare passaggi millimetrici
          smoothStep: 0.005 // Smorza la curva di accelerazione del tocco
        } as any}
        // Disattiviamo l'animazione di transizione fissa per la rotellina, 
        // lasciando che lo zoom segua esattamente il movimento fisico delle tue dita
        zoomAnimation={{
          disabled: true
        }}
        doubleClick={{ disabled: true }}
        onTransform={(ref) => {
          const scale = ref.state.scale;
          const container = document.getElementById('map-container');
          if (!container) return;
          if (scale < 0.2) {
            container.setAttribute('data-lod', 'birdseye');
          } else if (scale > 0.7) {
            container.setAttribute('data-lod', 'detail');
          } else {
            container.setAttribute('data-lod', 'medium');
          }
        }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <svg
            id="map-container"
            data-lod="medium"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="bg-transparent max-w-none select-none"
            onClick={handleSvgClick}
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            {/* STILE INTEGRATO PER IL LOD PASSIVO */}
            <style>{`
              /* Transizione morbida per le etichette delle viti */
              .vite-label {
                opacity: 0;
                transition: opacity 0.2s ease;
              }
              /* In modalità dettaglio (zoom ravvicinato), mostra le etichette */
              [data-lod="detail"] .vite-label {
                opacity: 1;
              }
              /* In modalità birdseye (zoom aereo estremo), nascondi completamente il blocco viti per massimizzare gli FPS */
              [data-lod="birdseye"] #vigneto-viti {
                display: none;
              }
            `}</style>

            <defs>
              <linearGradient id="rowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>

            <g id="aree-naturali">
              <path d={`M 0,0 L ${width},0 L ${width},80 Q ${width * 0.75},180 ${width * 0.5},120 T 0,200 Z`} fill="#047857" opacity="0.06" />
              <path d={`M 0,${height - 80} Q ${width * 0.3},${height - 180} ${width * 0.7},${height - 120} T ${width},${height - 150} L ${width},${height} L 0,${height} Z`} fill="#0369a1" opacity="0.05" />
            </g>

            {/* STRUTTURA: Filari Lineari Geometrici */}
            <g id="vigneto-struttura">
              <text x={MAP_CONFIG.MARGIN_LEFT - 50} y={MAP_CONFIG.MARGIN_TOP - 60} className="font-heading font-black text-8xl text-slate-900 uppercase tracking-tighter opacity-[0.03] pointer-events-none select-none">
                Fojachini
              </text>
              {filari.map(f => {
                const isSelected = filariMap[selectedId || '']?.id === f.id;
                const y = MAP_CONFIG.MARGIN_TOP + f.ordine * MAP_CONFIG.SPACING_Y;
                const endX = MAP_CONFIG.MARGIN_LEFT + (f.numero_piante || 20) * MAP_CONFIG.SPACING_X;

                return (
                  <g key={f.id}>
                    {isSelected && (
                      <rect x={MAP_CONFIG.MARGIN_LEFT - 40} y={y - 40} width={endX - MAP_CONFIG.MARGIN_LEFT + 80} height={80} fill="url(#rowGradient)" rx={16} />
                    )}
                    <line x1={MAP_CONFIG.MARGIN_LEFT - 40} y1={y} x2={endX + 40} y2={y} stroke={isSelected ? '#fbbf24' : '#042f2e'} strokeWidth={isSelected ? 2.5 : 1} strokeDasharray={isSelected ? "0" : "5,10"} opacity={isSelected ? 1 : 0.25} strokeLinecap="round" />
                    <text x={MAP_CONFIG.MARGIN_LEFT - 60} y={y} fontSize={22} fontFamily="Montserrat, sans-serif" fontWeight={isSelected ? "900" : "700"} fill={isSelected ? "#fbbf24" : "#0f766e"} dominantBaseline="middle" textAnchor="end" className="select-none cursor-pointer hover:opacity-80" onClick={() => onSelect(f.id.toString())}>
                      {f.nome.replace(/filare\s*/i, '')}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* LIVELLO 3: Il Vigneto */}
            <g id="vigneto-viti">
              {piante.map(p => {
                const filare = filariMap[p.filare_id];
                if (!filare) return null;
                const isCustom = p.coord_x != null && p.coord_y != null;
                const coords = calcCoords(filare, p.posizione_nel_filare);
                const x = isCustom ? p.coord_x! : coords.x;
                const y = isCustom ? p.coord_y! : coords.y;

                return (
                  <PiantaCircle
                    key={p.id}
                    pianta={p}
                    tipo={tipiMap[p.tipo_id]}
                    cx={x}
                    cy={y}
                    isSelected={p.id === selectedId}
                    onClick={onSelect}
                    colorMode={colorMode}
                  />
                );
              })}
            </g>

            {/* LIVELLI 4 e 5: Alberi e POI */}
            <DynamicPOILayers
              poi={poi}
              selectedId={selectedId}
              onSelect={onSelect}
            />

          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}