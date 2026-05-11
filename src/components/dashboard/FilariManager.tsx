import { useFilari } from '@/hooks/useFilari';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, GripVertical } from 'lucide-react';

const PRODUTTORI_LIST = [
  "Gallo Silvio (Stella)",
  "Vivai Donato (Cenaia PI)",
  "Pamparino Sara (Finale Ligure)",
  "Negro Carlo (Dogliani)",
  "Vivaio Revella (Quiliano)"
];

export default function FilariManager() {
  const { filari, createFilare, updateFilare, deleteFilare } = useFilari();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newFilare, setNewFilare] = useState({
    nome: '',
    ordine: 0,
    venditore: '',
    descrizione: '',
    note: ''
  });

  const [editForm, setEditForm] = useState({
    nome: '',
    ordine: 0,
    venditore: '',
    descrizione: '',
    note: ''
  });

  const handleCreate = async () => {
    if (!newFilare.nome || isProcessing) return;
    setIsProcessing(true);
    try {
      const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
      await createFilare({ ...newFilare, ordine: nextOrder });
      setNewFilare({ nome: '', ordine: 0, venditore: '', descrizione: '', note: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (f: any) => {
    setEditingId(f.id);
    setEditForm({
      nome: f.nome,
      ordine: f.ordine,
      venditore: f.venditore || '',
      descrizione: f.descrizione || '',
      note: f.note || ''
    });
  };

  const handleUpdate = async (id: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateFilare({ id, data: editForm });
      setEditingId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filari.length} Filari</span>
      </div>

      <div className="space-y-4">
        {filari.map(f => (
          <div key={f.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start justify-between group transition-all">
            {editingId === f.id ? (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome"
                    onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                    className="p-3 text-sm border-b border-slate-200 outline-none font-bold flex-1"
                  />
                  <input
                    type="number"
                    value={editForm.ordine}
                    onChange={e => setEditForm({ ...editForm, ordine: parseInt(e.target.value) || 0 })}
                    className="w-20 p-3 text-sm border-b border-slate-200 outline-none font-bold text-center"
                    placeholder="Ordine"
                  />
                </div>

                <div className="flex flex-col gap-2 bg-[#fcfaf7] p-4 rounded-xl border border-slate-50">
                  <input
                    type="text"
                    value={editForm.venditore}
                    placeholder="Produttore (es. Montina)"
                    onChange={e => setEditForm({ ...editForm, venditore: e.target.value })}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none font-mono uppercase tracking-widest text-slate-600"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PRODUTTORI_LIST.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, venditore: p })}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase text-slate-500 hover:border-emerald-500 hover:text-emerald-800 transition-all active:scale-95"
                      >
                        {p.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={editForm.descrizione}
                    placeholder="Descrizione facoltativa..."
                    onChange={e => setEditForm({ ...editForm, descrizione: e.target.value })}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600 mt-2"
                  />

                  <input
                    type="text"
                    value={editForm.note}
                    placeholder="Note aggiuntive..."
                    onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleUpdate(f.id)}
                    className="px-5 py-2.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check size={16} /> Salva
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4 flex-1">
                  <GripVertical size={18} className="text-slate-300 cursor-ns-resize mt-1" />
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 border border-slate-100">
                    #{f.ordine}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="font-bold text-base text-slate-800">{f.nome}</span>
                    {f.venditore && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block w-fit">
                        Origine: {f.venditore}
                      </span>
                    )}
                    {f.descrizione && (
                      <p className="text-xs text-slate-500 font-medium pt-1">{f.descrizione}</p>
                    )}
                    {f.note && (
                      <p className="text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100 mt-2 font-medium">
                        Nota: {f.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rimosso il div errato e ripristinata la gerarchia flessibile */}
                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-center">
                  <button
                    onClick={() => startEdit(f)}
                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteFilare(f.id)}
                    className="p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-[#fcfaf7] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-emerald-800 shrink-0" />
            <input
              type="text"
              placeholder="Nome nuovo filare (es. Filare Z)..."
              value={newFilare.nome}
              onChange={e => setNewFilare({ ...newFilare, nome: e.target.value })}
              className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-sm outline-none font-bold shadow-sm focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="flex flex-col gap-3 pl-8">
            <div className="flex flex-wrap gap-2">
              {PRODUTTORI_LIST.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewFilare({ ...newFilare, venditore: p })}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-emerald-500 hover:text-emerald-800 transition-all active:scale-95"
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Produttore/Venditore (es. Montina)..."
              value={newFilare.venditore}
              onChange={e => setNewFilare({ ...newFilare, venditore: e.target.value })}
              className="bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none font-mono uppercase tracking-widest text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
            />

            <input
              type="text"
              placeholder="Descrizione (es. Terrazzamento alto)..."
              value={newFilare.descrizione}
              onChange={e => setNewFilare({ ...newFilare, descrizione: e.target.value })}
              className="bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreate}
                disabled={!newFilare.nome || isProcessing}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-emerald-900 transition-colors shadow-md"
              >
                Aggiungi Filare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}