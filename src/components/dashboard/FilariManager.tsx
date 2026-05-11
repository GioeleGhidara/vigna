import { useFilari } from '@/hooks/useFilari';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';

const PRODUTTORI_LIST = [
  "Gallo Silvio (Stella)",
  "Vivai Donato (Cenaia PI)",
  "Pamparino Sara (Finale Ligure)",
  "Negro Carlo (Dogliani)",
  "Vivaio Revella (Quiliano)"
];

export function FilariManager() {
  const { filari, createFilare, updateFilare, deleteFilare } = useFilari();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFilare, setNewFilare] = useState({ nome: '', ordine: 0, venditore: '' });
  const [editForm, setEditForm] = useState({ nome: '', ordine: 0, venditore: '' });

  const handleCreate = async () => {
    if (!newFilare.nome) return;
    const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
    await createFilare({ ...newFilare, ordine: nextOrder });
    setNewFilare({ nome: '', ordine: 0, venditore: '' });
  };

  const startEdit = (f: any) => {
    setEditingId(f.id);
    setEditForm({ nome: f.nome, ordine: f.ordine, venditore: f.venditore || '' });
  };

  const handleUpdate = async (id: number) => {
    await updateFilare({ id, data: editForm });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filari.length} Filari</span>
      </div>

      <div className="space-y-3">
        {filari.map(f => (
          <div key={f.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between group">
            {editingId === f.id ? (
              <div className="flex-1 flex gap-3 items-center">
                <div className="flex flex-col flex-1">
                  <input 
                    type="text" 
                    value={editForm.nome} 
                    placeholder="Nome"
                    onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                    className="p-2 text-sm border-b border-slate-200 outline-none font-bold"
                  />
                  <input 
                    type="text" 
                    value={editForm.venditore} 
                    placeholder="Produttore (es. Montina)"
                    onChange={e => setEditForm({ ...editForm, venditore: e.target.value })}
                    className="p-2 text-[10px] border-b border-slate-100 outline-none font-mono uppercase tracking-widest text-slate-400"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {PRODUTTORI_LIST.map(p => (
                      <button
                        key={p}
                        onClick={() => setEditForm({ ...editForm, venditore: p })}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-bold uppercase text-slate-400 hover:bg-white hover:border-emerald-500 transition-all"
                      >
                        {p.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number" 
                  value={editForm.ordine} 
                  onChange={e => setEditForm({ ...editForm, ordine: parseInt(e.target.value) })}
                  className="w-16 p-2 text-sm border-b border-slate-200 outline-none font-bold text-center"
                />
                <button onClick={() => handleUpdate(f.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check size={16}/></button>
                <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><X size={16}/></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <GripVertical size={16} className="text-slate-200 cursor-ns-resize" />
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">#{f.ordine}</div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{f.nome}</span>
                    {f.venditore && <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Origine: {f.venditore}</span>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(f)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={() => deleteFilare(f.id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Plus size={18} className="text-slate-300 ml-2" />
            <input 
              type="text" 
              placeholder="Nome nuovo filare (es. Filare Z)..." 
              value={newFilare.nome}
              onChange={e => setNewFilare({ ...newFilare, nome: e.target.value })}
              className="flex-1 bg-transparent p-2 text-sm outline-none font-bold"
            />
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {PRODUTTORI_LIST.map(p => (
              <button
                key={p}
                onClick={() => setNewFilare({ ...newFilare, venditore: p })}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500 hover:text-emerald-700 transition-all"
              >
                {p.split(' ')[0]} {/* Mostra solo il cognome per brevità */}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pl-8">
            <input 
              type="text" 
              placeholder="Produttore/Venditore (es. Montina)..." 
              value={newFilare.venditore}
              onChange={e => setNewFilare({ ...newFilare, venditore: e.target.value })}
              className="flex-1 bg-transparent p-2 text-[11px] outline-none font-mono uppercase tracking-widest text-slate-400"
            />
            <button 
              onClick={handleCreate}
              disabled={!newFilare.nome}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-emerald-800 transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
