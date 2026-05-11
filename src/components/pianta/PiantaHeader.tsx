import type { Pianta, TipoPianta } from '@/types';
import { MapPin, Calendar, Activity } from 'lucide-react';

const STATO_BADGE: Record<Pianta['stato'], string> = {
  attiva: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  morta: 'bg-red-500/10 text-red-600 border-red-500/20',
  ripiantata: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

interface Props { 
  pianta: Pianta; 
  tipo?: TipoPianta;
  filareNome?: string;
  filareVenditore?: string;
}

export default function PiantaHeader({ pianta, tipo, filareNome, filareVenditore }: Props) {
  return (
    <div className="space-y-4">
      {/* Top Section with Row Context */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
          <MapPin size={12} className="text-emerald-400" />
          {filareNome?.replace(/filare\s*/i, '') || '??'}
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-widest border ${STATO_BADGE[pianta.stato]}`}>
          {pianta.stato}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-slate-900">{pianta.id}</h2>
          <div
            className="w-4 h-4 rounded-full shadow-lg border-2 border-white"
            style={{ background: tipo?.colore_hex ?? '#ccc' }}
          />
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Activity size={14} />
          {tipo?.nome ?? 'Varietà non definita'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {pianta.anno_impianto && (
          <div className="flex flex-col p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Impianto</span>
            <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
              <Calendar size={12} className="text-slate-400" />
              {pianta.anno_impianto}
            </div>
          </div>
        )}
        {pianta.porta_innesto && (
          <div className="flex flex-col p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Portinnesto</span>
            <span className="text-slate-700 font-bold text-sm truncate">{pianta.porta_innesto}</span>
          </div>
        )}
        {(pianta.venditore || filareVenditore) && (
          <div className="col-span-2 flex flex-col p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Origine / Vivaio</span>
            <span className="text-emerald-900 font-black text-sm truncate">
              {pianta.venditore || filareVenditore}
              {pianta.venditore && filareVenditore && pianta.venditore !== filareVenditore && (
                <span className="ml-2 text-[9px] font-medium text-emerald-600 opacity-60">(Sostituzione)</span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
