import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { Plus, Trash2, Edit2, Check, GripVertical, Wand2, X } from 'lucide-react';
import type { Filare } from '@/types';
import FilareWizard from './FilareWizard';
import { PRODUTTORI_LIST } from '@/constants/registry';


export default function FilariManager() {
  const { filari, createFilare, updateFilare, deleteFilare } = useFilari();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

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
    if (!newFilare.nome.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
      await createFilare({
        ...newFilare,
        nome: newFilare.nome.trim(),
        venditore: newFilare.venditore.trim(),
        ordine: nextOrder
      });
      setNewFilare({ nome: '', ordine: 0, venditore: '', descrizione: '', note: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Tipizzazione esplicita per impedire disallineamenti di parametri
  const startEdit = (f: Filare) => {
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
      await updateFilare({
        id,
        data: {
          ...editForm,
          nome: editForm.nome.trim(),
          venditore: editForm.venditore.trim()
        }
      });
      setEditingId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filari.length} {filari.length === 1 ? 'Filare' : 'Filari'}
          </span>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
          >
            <Wand2 size={12} /> Mago Filare
          </button>
        </div>
      </div>

      {isWizardOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl">
            <button 
              onClick={() => setIsWizardOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <FilareWizard onFinish={() => setIsWizardOpen(false)} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filari.map(f => (
          <div
            key={`filare-row-${f.id}`}
            className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start justify-between group transition-all"
          >
            {editingId === f.id ? (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome Filare"
                    onChange={e => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                    className="p-3 text-sm border-b border-slate-200 outline-none font-bold flex-1 bg-transparent"
                  />
                  <input
                    type="number"
                    value={editForm.ordine}
                    onChange={e => setEditForm(prev => ({ ...prev, ordine: parseInt(e.target.value, 10) || 0 }))}
                    className="w-20 p-3 text-sm border-b border-slate-200 outline-none font-bold text-center bg-transparent"
                    placeholder="Ordine"
                  />
                </div>

                <div className="flex flex-col gap-2 bg-[#fcfaf7] p-4 rounded-xl border border-slate-50">
                  <input
                    type="text"
                    value={editForm.venditore}
                    placeholder="Produttore (es. Montina)"
                    onChange={e => setEditForm(prev => ({ ...prev, venditore: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none font-mono uppercase tracking-widest text-slate-600"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PRODUTTORI_LIST.map((p, idx) => (
                      <button
                        key={`prod-edit-${f.id}-${idx}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, venditore: p }))}
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
                    onChange={e => setEditForm(prev => ({ ...prev, descrizione: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600 mt-2"
                  />

                  <input
                    type="text"
                    value={editForm.note}
                    placeholder="Note aggiuntive..."
                    onChange={e => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
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
                  <GripVertical size={18} className="text-slate-300 cursor-ns-resize mt-1 shrink-0" />
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

                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(f)}
                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
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

        {/* SEZIONE AGGIUNTA */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-[#fcfaf7] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-emerald-800 shrink-0" />
            <input
              type="text"
              placeholder="Nome nuovo filare (es. Filare Z)..."
              value={newFilare.nome}
              onChange={e => setNewFilare(prev => ({ ...prev, nome: e.target.value }))}
              className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-sm outline-none font-bold shadow-sm focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="flex flex-col gap-3 pl-8">
            <div className="flex flex-wrap gap-2">
              {PRODUTTORI_LIST.map((p, idx) => (
                <button
                  key={`prod-new-${idx}`}
                  type="button"
                  onClick={() => setNewFilare(prev => ({ ...prev, venditore: p }))}
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
              onChange={e => setNewFilare(prev => ({ ...prev, venditore: e.target.value }))}
              className="bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none font-mono uppercase tracking-widest text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
            />

            <input
              type="text"
              placeholder="Descrizione (es. Terrazzamento alto)..."
              value={newFilare.descrizione}
              onChange={e => setNewFilare(prev => ({ ...prev, descrizione: e.target.value }))}
              className="bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newFilare.nome.trim() || isProcessing}
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