import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function TipiManager() {
  const { tipi, createTipo, updateTipo, deleteTipo } = useTipiPianta();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTipo, setNewTipo] = useState({ nome: '', colore_hex: '#10b981' });
  const [editForm, setEditForm] = useState({ nome: '', colore_hex: '' });

  const handleCreate = async () => {
    if (!newTipo.nome) return;
    await createTipo(newTipo);
    setNewTipo({ nome: '', colore_hex: '#10b981' });
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditForm({ nome: t.nome, colore_hex: t.colore_hex });
  };

  const handleUpdate = async (id: number) => {
    await updateTipo({ id, data: editForm });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Varietà d'Uva</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tipi.length} Tipi</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tipi.map(t => (
          <div key={t.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between group">
            {editingId === t.id ? (
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  value={editForm.nome} 
                  onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                  className="flex-1 p-2 text-sm border-b border-slate-200 outline-none font-bold"
                />
                <input 
                  type="color" 
                  value={editForm.colore_hex} 
                  onChange={e => setEditForm({ ...editForm, colore_hex: e.target.value })}
                  className="w-8 h-8 rounded-full border-none cursor-pointer"
                />
                <button onClick={() => handleUpdate(t.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check size={16}/></button>
                <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><X size={16}/></button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: t.colore_hex }} />
                  <span className="font-bold text-slate-700">{t.nome}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg"><Edit2 size={14}/></button>
                  <button onClick={() => deleteTipo(t.id)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Add New */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Nuova varietà..." 
            value={newTipo.nome}
            onChange={e => setNewTipo({ ...newTipo, nome: e.target.value })}
            className="flex-1 bg-transparent p-2 text-sm outline-none font-medium"
          />
          <input 
            type="color" 
            value={newTipo.colore_hex}
            onChange={e => setNewTipo({ ...newTipo, colore_hex: e.target.value })}
            className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
          />
          <button 
            onClick={handleCreate}
            disabled={!newTipo.nome}
            className="p-2 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-emerald-800 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
