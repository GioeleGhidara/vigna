import {
  X, MapPin, Calendar, Tag, Trash2, Move, AlertTriangle,
  CheckCircle2, PlusCircle, HelpCircle
} from 'lucide-react';
import type { Pianta, TipoPianta } from '@/types';

interface Props {
  pianta: Pianta;
  tipo?: TipoPianta;
  filareNome?: string;
  filareVenditore?: string;
  isRepositioning: boolean;
  onStartReposition: () => void;
  onCancelReposition: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function PiantaCard({
  pianta,
  tipo,
  filareNome,
  filareVenditore,
  isRepositioning,
  onStartReposition,
  onCancelReposition,
  onDelete,
  onClose
}: Props) {

  // Mappatura visiva degli stati
  const statusConfig = {
    attiva: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'In Salute' },
    morta: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', label: 'Morta / Da Rimpiazzare' },
    ripiantata: { icon: PlusCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Nuovo Innesto' },
  };

  const status = statusConfig[pianta.stato] || { icon: HelpCircle, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Stato Ignoto' };

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">

      {/* HEADER: Identità della Pianta */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
            <status.icon size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
          </div>
          <h2 className="text-4xl font-heading font-black text-slate-900 tracking-tighter italic">
            {pianta.codice_etichetta || `Vite P${pianta.posizione_nel_filare}`}
          </h2>
          <p className="text-sm font-medium text-slate-400">
            {tipo?.nome || 'Varietà non specificata'} • {filareNome || 'Filare Ignoto'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-300 hover:text-slate-900"
        >
          <X size={24} />
        </button>
      </header>

      {/* BODY: Dettagli Tecnici */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-[#fcfaf7] border border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Impianto</span>
          </div>
          <p className="text-xl font-bold text-slate-800">
            {pianta.anno_impianto || 'N/D'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#fcfaf7] border border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Tag size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Posizione</span>
          </div>
          <p className="text-xl font-bold text-slate-800">
            {pianta.posizione_nel_filare ? `Posto ${pianta.posizione_nel_filare}` : 'Libera'}
          </p>
        </div>
      </div>

      {/* INFO VENDITORE (Se presente) */}
      {filareVenditore && (
        <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30">
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Origine / Vivaio</h4>
          <p className="text-sm font-bold text-emerald-900">{filareVenditore}</p>
        </div>
      )}

      {/* AZIONI: Gestione in Campo */}
      <div className="space-y-3 pt-4">
        <button
          onClick={isRepositioning ? onCancelReposition : onStartReposition}
          className={`w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isRepositioning
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-white border border-slate-100 text-slate-900 hover:shadow-md'
            }`}
        >
          <Move size={16} />
          {isRepositioning ? 'Annulla Spostamento' : 'Sposta in Mappa'}
        </button>

        <button
          onClick={onDelete}
          className="w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
        >
          <Trash2 size={16} />
          Elimina Vite
        </button>
      </div>

      {/* FOOTER: Dati di Sistema (UUID) */}
      <footer className="pt-6 border-t border-slate-50 flex items-center gap-3 text-slate-300">
        <MapPin size={12} />
        <span className="text-[9px] font-mono font-medium tracking-tight">
          SISTEMA ID: {pianta.id}
        </span>
      </footer>
    </div>
  );
}