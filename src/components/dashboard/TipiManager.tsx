import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function TipiManager() {
  const { tipi, createTipo, updateTipo, deleteTipo } = useTipiPianta();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newTipo, setNewTipo] = useState({
    nome: '',
    colore_hex: '#10b981',
    descrizione: ''
  });

  const [editForm, setEditForm] = useState({
    nome: '',
    colore_hex: '',
    descrizione: ''
  });

  const handleCreate = async () => {
    if (!newTipo.nome || isProcessing) return;
    setIsProcessing(true);
    try {
      await createTipo(newTipo);
      setNewTipo({ nome: '', colore_hex: '#10b981', descrizione: '' });
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditForm({
      nome: t.nome,
      colore_hex: t.colore_hex,
      descrizione: t.descrizione || ''
    });
  };

  const handleUpdate = async (id: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateTipo({ id, data: editForm });
      setEditingId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Varietà d'Uva</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tipi.length} Tipi</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tipi.map(t => (
          <div key={t.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start justify-between group transition-all">
            {editingId === t.id ? (
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome varietà"
                    onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                    className="flex-1 p-3 text-sm border-b border-slate-200 outline-none font-bold bg-transparent"
                  />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                    <input
                      type="color"
                      value={editForm.colore_hex}
                      onChange={e => setEditForm({ ...editForm, colore_hex: e.target.value })}
                      className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={editForm.descrizione}
                  placeholder="Descrizione (es. Uva bacca nera)..."
                  onChange={e => setEditForm({ ...editForm, descrizione: e.target.value })}
                  className="p-2 text-xs border-b border-slate-100 outline-none text-slate-600 font-medium bg-transparent"
                />

                <div className="flex justify-end gap-1 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleUpdate(t.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check size={14} /> Salva
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-5 h-5 rounded-full shadow-md shrink-0 mt-0.5 border border-white"
                    style={{ backgroundColor: t.colore_hex }}
                  />
                  <div className="flex flex-col space-y-1">
                    <span className="font-bold text-sm text-slate-800">{t.nome}</span>
                    {t.descrizione && (
                      <span className="text-xs text-slate-500 font-medium">{t.descrizione}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteTipo(t.id)}
                    className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New */}
        <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-[#fcfaf7] flex flex-col gap-3 justify-between">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Nuova varietà (es. Barbera)..."
              value={newTipo.nome}
              onChange={e => setNewTipo({ ...newTipo, nome: e.target.value })}
              className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-sm outline-none font-bold shadow-sm focus:ring-2 focus:ring-emerald-800"
            />
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
              <input
                type="color"
                value={newTipo.colore_hex}
                onChange={e => setNewTipo({ ...newTipo, colore_hex: e.target.value })}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none"
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Descrizione facoltativa..."
            value={newTipo.descrizione}
            onChange={e => setNewTipo({ ...newTipo, descrizione: e.target.value })}
            className="bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none text-slate-600 font-medium shadow-sm focus:ring-2 focus:ring-emerald-800"
          />

          <div className="flex justify-end pt-1">
            <button
              onClick={handleCreate}
              disabled={!newTipo.nome || isProcessing}
              className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-900 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 transition-colors shadow-sm flex items-center gap-1"
            >
              <Plus size={16} /> Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}