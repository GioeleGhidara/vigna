import type { Operazione } from '@/types';

interface Props {
  operazione: Operazione;
  onDelete?: () => void;
}

export default function OperazioneItem({ operazione: op, onDelete }: Props) {
  const data = new Date(op.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm group relative hover:shadow-md transition-all">
      <div className="flex flex-col items-center justify-center bg-slate-50 px-3 py-2 rounded-xl min-w-[60px]">
        <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">
          {new Date(op.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
        </span>
        <span className="text-[8px] font-mono font-bold text-slate-300">
          {new Date(op.data).getFullYear()}
        </span>
      </div>
      
      <div className="flex-1 pr-8">
        <span className="text-xs font-heading font-black capitalize text-slate-900 tracking-tight">{op.tipo}</span>
        {op.descrizione && <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1 line-clamp-2">{op.descrizione}</p>}
      </div>
      
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          ✕
        </button>
      )}
    </div>
  );
}
