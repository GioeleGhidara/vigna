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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filari.length} {filari.length === 1 ? 'Filare' : 'Filari'}
          </span>
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-2xs shrink-0"
          >
            <Wand2 size={12} /> Mago Filare
          </button>
        </div>
      </div>

      {isWizardOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl">
            <button
              type="button"
              onClick={() => setIsWizardOpen(false)}
              className="absolute -top-10 right-0 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <FilareWizard onFinish={() => setIsWizardOpen(false)} />
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {filari.map(f => (
          <div
            key={`filare-row-${f.id}`}
            className="p-3 sm:p-5 rounded-2xl border border-slate-100 bg-white shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 transition-all"
          >
            {editingId === f.id ? (
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome Filare"
                    onChange={e => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                    className="p-2 sm:p-3 text-xs sm:text-sm border-b border-slate-200 outline-none font-bold flex-1 bg-transparent"
                  />
                  <input
                    type="number"
                    value={editForm.ordine}
                    onChange={e => setEditForm(prev => ({ ...prev, ordine: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full sm:w-20 p-2 sm:p-3 text-xs sm:text-sm border-b border-slate-200 outline-none font-bold text-center bg-transparent"
                    placeholder="Ordine"
                  />
                </div>

                <div className="flex flex-col gap-2 bg-[#fcfaf7] p-3 sm:p-4 rounded-xl border border-slate-50 min-w-0">
                  <input
                    type="text"
                    value={editForm.venditore}
                    placeholder="Produttore (es. Montina)"
                    onChange={e => setEditForm(prev => ({ ...prev, venditore: e.target.value }))}
                    className="p-1.5 text-xs bg-transparent border-b border-slate-200 outline-none font-mono uppercase tracking-widest text-slate-600"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {PRODUTTORI_LIST.map((p, idx) => (
                      <button
                        key={`prod-edit-${f.id}-${idx}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, venditore: p }))}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold uppercase text-slate-500 hover:border-emerald-500 hover:text-emerald-800 transition-all active:scale-95 truncate max-w-full"
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
                    className="p-1.5 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600 mt-1"
                  />

                  <input
                    type="text"
                    value={editForm.note}
                    placeholder="Note aggiuntive..."
                    onChange={e => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                    className="p-1.5 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleUpdate(f.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Check size={14} /> Salva
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-2.5 sm:gap-4 flex-1 min-w-0">
                  <GripVertical size={16} className="text-slate-300 cursor-ns-resize mt-1 shrink-0 hidden sm:block" />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 border border-slate-100">
                    #{f.ordine}
                  </div>
                  <div className="flex flex-col space-y-1 flex-1 min-w-0">
                    <span className="font-bold text-sm sm:text-base text-slate-800 truncate block">{f.nome}</span>
                    {f.venditore && (
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block w-fit truncate max-w-full">
                        Origine: {f.venditore}
                      </span>
                    )}
                    {f.descrizione && (
                      <p className="text-xs text-slate-500 font-medium pt-0.5 truncate block">{f.descrizione}</p>
                    )}
                    {f.note && (
                      <p className="text-[10px] sm:text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100 mt-1 font-medium break-words">
                        Nota: {f.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => startEdit(f)}
                    className="p-2 sm:p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFilare(f.id)}
                    className="p-2 sm:p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* SEZIONE AGGIUNTA */}
        <div className="p-4 sm:p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-[#fcfaf7] flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-emerald-800 shrink-0" />
            <input
              type="text"
              placeholder="Nome nuovo filare (es. Filare Z)..."
              value={newFilare.nome}
              onChange={e => setNewFilare(prev => ({ ...prev, nome: e.target.value }))}
              className="flex-1 bg-white border border-slate-100 p-2 sm:p-3 rounded-xl text-xs sm:text-sm outline-none font-bold shadow-2xs focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="flex flex-col gap-2.5 pl-0 sm:pl-6 min-w-0">
            <div className="flex flex-wrap gap-1.5">
              {PRODUTTORI_LIST.map((p, idx) => (
                <button
                  key={`prod-new-${idx}`}
                  type="button"
                  onClick={() => setNewFilare(prev => ({ ...prev, venditore: p }))}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:border-emerald-500 hover:text-emerald-800 transition-all active:scale-95 truncate max-w-full"
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
              className="bg-white border border-slate-100 p-2 sm:p-3 rounded-xl text-xs outline-none font-mono uppercase tracking-widest text-slate-600 shadow-2xs focus:ring-2 focus:ring-emerald-800"
            />

            <input
              type="text"
              placeholder="Descrizione (es. Terrazzamento alto)..."
              value={newFilare.descrizione}
              onChange={e => setNewFilare(prev => ({ ...prev, descrizione: e.target.value }))}
              className="bg-white border border-slate-100 p-2 sm:p-3 rounded-xl text-xs outline-none text-slate-600 shadow-2xs focus:ring-2 focus:ring-emerald-800"
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newFilare.nome.trim() || isProcessing}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-emerald-900 transition-colors shadow-2xs"
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