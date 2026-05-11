import { useOperazioni } from '@/hooks/useOperazioni';
import OperazioneItem from '@/components/operazione/OperazioneItem';

interface Props { 
  piantaId: string; 
  onAdd: () => void;
}

const MAX_OPS_VISIBLE = 5;

export default function PiantaOperazioni({ piantaId, onAdd }: Props) {
  const { operazioni, isLoading, deleteOperazione } = useOperazioni(piantaId);

  const handleDelete = async (id: number) => {
    if (confirm("Vuoi davvero eliminare questa operazione?")) {
      await deleteOperazione(id);
    }
  };

  if (isLoading) return <p className="text-sm text-slate-400">Caricamento operazioni...</p>;

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between border-b border-slate-50 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-heading font-black text-slate-900 uppercase tracking-widest">Diario Clinico</h3>
          <p className="text-[10px] text-slate-400 font-medium italic">Storico degli interventi e trattamenti</p>
        </div>
        <button 
          onClick={onAdd}
          className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
        >
          + Nuova Nota
        </button>
      </div>
      
      <div className="space-y-3">
        {operazioni.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Nessun evento registrato</p>
          </div>
        ) : (
          operazioni.slice(0, MAX_OPS_VISIBLE).map(op => (
            <OperazioneItem 
              key={op.id} 
              operazione={op} 
              onDelete={() => handleDelete(op.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
