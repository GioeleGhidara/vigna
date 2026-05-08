import type { TipoPianta } from '@/types';

interface Props { tipo: TipoPianta; count: number; totale: number; }

export function TipoBar({ tipo, count, totale }: Props) {
  const perc = totale > 0 ? Math.round((count / totale) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: tipo.colore_hex }} />
      <div className="w-36 font-medium text-slate-700 truncate" title={tipo.nome}>{tipo.nome}</div>
      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${perc}%`, backgroundColor: tipo.colore_hex }}
        />
      </div>
      <div className="w-16 text-right text-sm text-slate-500">{count} pz</div>
      <div className="w-12 text-right text-sm font-semibold text-slate-700">{perc}%</div>
    </div>
  );
}
