import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useState } from 'react';
import { Trash2, Edit2, MapPin, List, Plus, Search, Layers } from 'lucide-react';
import { PiantaForm } from '@/components/pianta/PiantaForm';
import { PiantaBulkAdd } from '@/components/pianta/PiantaBulkAdd';
import PiantaEditModal from '@/components/pianta/PiantaEditModal';
import type { Pianta } from '@/types';

export function PianteManager() {
  const { piante, createPianta, deletePianta } = usePiante();
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [editingPianta, setEditingPianta] = useState<Pianta | null>(null);

  const filteredPiante = piante.filter(p => 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    filari.find(f => f.id === p.filare_id)?.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: any) => {
    await createPianta(data);
    setIsAdding(false);
  };

  const handleBulkCreate = async (pianteList: any[]) => {
    // Inseriamo in serie (Supabase insert accetta array)
    for (const p of pianteList) {
      await createPianta(p);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-black text-slate-800">Inventario Viti</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestione anagrafica e posizionamento</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Cerca per ID o Filare..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-800 shadow-sm w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsBulkAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95"
          >
            <Layers size={16} /> Serie
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
          >
            <Plus size={16} /> Nuova Vite
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="premium-card bg-white overflow-x-auto shadow-xl border border-slate-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Filare</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Varietà</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stato</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posizione</th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPiante.map(p => {
              const filare = filari.find(f => f.id === p.filare_id);
              const tipo = tipi.find(t => t.id === p.tipo_id);
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-mono font-black text-slate-900 text-sm tracking-tight">{p.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filare?.nome || '??'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: tipo?.colore_hex }} />
                      <span className="text-sm font-bold text-slate-600">{tipo?.nome}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border ${
                      p.stato === 'attiva' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      p.stato === 'morta' ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {p.stato}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      {p.coord_x != null ? (
                        <>
                          <MapPin size={12} className="text-emerald-600" />
                          <span className="text-slate-500 font-mono">Mappa: {p.coord_x}, {p.coord_y}</span>
                        </>
                      ) : (
                        <>
                          <List size={12} className="text-slate-300" />
                          <span>Posizione {p.posizione_nel_filare}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingPianta(p)}
                        className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => { if(confirm(`Eliminare la vite ${p.id}?`)) deletePianta(p.id) }}
                        className="p-2 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-600 transition-all active:scale-90"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isBulkAdding && (
        <PiantaBulkAdd 
          onSubmit={handleBulkCreate}
          onClose={() => setIsBulkAdding(false)}
        />
      )}

      {isAdding && (
        <PiantaForm 
          title="Nuova Vite"
          onSubmit={handleCreate}
          onClose={() => setIsAdding(false)}
        />
      )}

      {editingPianta && (
        <PiantaEditModal 
          pianta={editingPianta}
          onClose={() => setEditingPianta(null)}
        />
      )}
    </div>
  );
}
