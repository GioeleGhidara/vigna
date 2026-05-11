import { usePOI } from '@/hooks/usePOI';
import { useState } from 'react';
import { Trash2, MapPin, Plus, Search, Home, Droplets, Gauge, Trees, Building2, Apple, Cherry } from 'lucide-react';
import type { POI } from '@/types';

const ICON_OPTIONS = [
  { id: 'Home', label: 'Casa/Villa', icon: Home, color: 'text-slate-900' },
  { id: 'Warehouse', label: 'Magazzino', icon: Building2, color: 'text-emerald-900' },
  { id: 'Droplets', label: 'Punto Acqua', icon: Droplets, color: 'text-blue-600' },
  { id: 'Gauge', label: 'Pozzo/Pompa', icon: Gauge, color: 'text-blue-500' },
  { id: 'Albero', label: 'Albero Generico', icon: Trees, color: 'text-emerald-600' },
  { id: 'Melo', label: 'Melo', icon: Apple, color: 'text-red-500' },
  { id: 'Pero', label: 'Pero', icon: Apple, color: 'text-amber-500' },
  { id: 'Ciliegio', label: 'Ciliegio', icon: Cherry, color: 'text-red-600' },
];

export default function POIManager() {
  const { poi, createPOI, deletePOI, clearAllPOI, isLoading } = usePOI();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newPOI, setNewPOI] = useState({
    nome: '',
    tipo: 'altro' as const,
    icona: 'Albero',
    coord_x: 500,
    coord_y: 500,
  });

  const filteredPOI = poi.filter(p => 
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newPOI.nome) return;
    await createPOI(newPOI);
    setIsAdding(false);
    setNewPOI({ nome: '', tipo: 'altro', icona: 'Albero', coord_x: 500, coord_y: 500 });
  };

  const handleClearAll = async () => {
    if (confirm("Sei sicuro di voler eliminare TUTTI i punti di interesse dalla mappa?")) {
      await clearAllPOI();
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Caricamento Punti...</div>;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-black text-slate-800">Punti di Interesse</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alberi, Edifici e Infrastrutture</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Cerca punto..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-800 shadow-sm w-full md:w-64"
            />
          </div>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
          >
            <Trash2 size={16} /> Pulisci Mappa
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
          >
            <Plus size={16} /> Nuovo Punto
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPOI.map(p => (
          <div key={p.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <MapPin size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{p.nome}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.icona} • {p.coord_x}, {p.coord_y}</span>
              </div>
            </div>
            <button 
              onClick={() => deletePOI(p.id)}
              className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Aggiunta */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden noise-bg border border-white">
            <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-heading font-black text-slate-900 italic">Nuovo Punto</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posizionamento in Mappa</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-slate-100 rounded-full">✕</button>
            </header>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Punto</label>
                  <input 
                    type="text" 
                    value={newPOI.nome}
                    onChange={e => setNewPOI({...newPOI, nome: e.target.value})}
                    className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="es. Melo del Nonno"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
                  <select 
                    value={newPOI.tipo}
                    onChange={e => setNewPOI({...newPOI, tipo: e.target.value as any})}
                    className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
                  >
                    <option value="albero">Albero</option>
                    <option value="edificio">Edificio</option>
                    <option value="infrastruttura">Infrastruttura</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleziona Icona</label>
                <div className="grid grid-cols-4 gap-4">
                  {ICON_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setNewPOI({...newPOI, icona: opt.id})}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${newPOI.icona === opt.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' : 'bg-white border-slate-100 hover:border-emerald-200'}`}
                    >
                      <opt.icon size={20} className={newPOI.icona === opt.id ? 'text-white' : opt.color} />
                      <span className="text-[8px] font-black uppercase tracking-tighter">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coord. X</label>
                  <input 
                    type="number" 
                    value={newPOI.coord_x}
                    onChange={e => setNewPOI({...newPOI, coord_x: parseInt(e.target.value)})}
                    className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coord. Y</label>
                  <input 
                    type="number" 
                    value={newPOI.coord_y}
                    onChange={e => setNewPOI({...newPOI, coord_y: parseInt(e.target.value)})}
                    className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl"
                  />
                </div>
              </div>

              <footer className="flex gap-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-5 bg-white border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400">Annulla</button>
                <button onClick={handleCreate} className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-900 transition-all">Salva Punto</button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
