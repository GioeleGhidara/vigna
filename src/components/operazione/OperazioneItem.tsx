import type { Operazione } from '@/types';

interface Props {
  operazione: Operazione;
  onDelete?: () => void;
}

export default function OperazioneItem({ operazione: op, onDelete }: Props) {
  const data = new Date(op.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex gap-3 text-sm border-l-2 border-slate-200 pl-3 py-1 group relative">
      <span className="text-slate-400 whitespace-nowrap text-xs mt-0.5 w-14">{data}</span>
      <div className="flex-1 pr-6">
        <span className="font-medium capitalize text-slate-700">{op.tipo}</span>
        {op.descrizione && <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{op.descrizione}</p>}
      </div>
      {onDelete && (
        <button 
          onClick={onDelete}
          className="absolute right-0 top-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Elimina"
        >
          ✕
        </button>
      )}
    </div>
  );
}
