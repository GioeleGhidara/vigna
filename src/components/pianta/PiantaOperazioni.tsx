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
    <div className="space-y-3 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Ultime Operazioni</h3>
        <button 
          onClick={onAdd}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded"
        >
          + Aggiungi
        </button>
      </div>
      
      <div className="space-y-1">
        {operazioni.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nessuna operazione registrata.</p>
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
