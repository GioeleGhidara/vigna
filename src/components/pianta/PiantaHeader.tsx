import type { Pianta, TipoPianta } from '@/types';

const STATO_BADGE: Record<Pianta['stato'], string> = {
  attiva: 'bg-emerald-100 text-emerald-800',
  morta: 'bg-red-100 text-red-800',
  ripiantata: 'bg-amber-100 text-amber-800',
};

interface Props { 
  pianta: Pianta; 
  tipo?: TipoPianta;
}

export default function PiantaHeader({ pianta, tipo }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">{pianta.id}</span>
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ background: tipo?.colore_hex ?? '#ccc' }}
        />
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATO_BADGE[pianta.stato]}`}>
          {pianta.stato}
        </span>
      </div>
      <p className="text-sm text-slate-500">{tipo?.nome ?? 'Tipo sconosciuto'}</p>
      {pianta.anno_impianto && (
        <p className="text-xs text-slate-400">
          Impianto: {pianta.anno_impianto} ({new Date().getFullYear() - pianta.anno_impianto} anni)
        </p>
      )}
      {pianta.porta_innesto && (
        <p className="text-xs text-slate-400">Portinnesto: {pianta.porta_innesto}</p>
      )}
    </div>
  );
}
