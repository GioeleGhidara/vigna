import { usePOI } from '@/hooks/usePOI';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Search, MapPin } from 'lucide-react';
import {
  ContatoreIcon, RubinettoIcon, MeloIcon, PeroIcon, UlivoIcon, MelogranoIcon,
  FicoIcon, ScalaIcon, CaminoIcon, ReteIcon, BaraccaIcon, CacoIcon,
  CiliegioIcon, FragolaIcon, AsparagoIcon, AmarenoIcon, PescoIcon,
  PrugnoIcon, AlbicoccoIcon, NespoloIcon, CancelloIcon, KiwiIcon,
  LimoneIcon, BananaIcon, UnknownIcon
} from '@/components/icons/POIIcons';

const ICON_CATEGORIES = [
  {
    tipo: 'infrastruttura',
    label: 'Infrastrutture',
    icons: [
      { id: 'Contatore', icon: ContatoreIcon, label: 'Contatore', color: 'text-blue-500' },
      { id: 'Rubinetto', icon: RubinettoIcon, label: 'Rubinetto', color: 'text-blue-600' },
      { id: 'Scala', icon: ScalaIcon, label: 'Scala', color: 'text-amber-900' },
      { id: 'Rete', icon: ReteIcon, label: 'Rete', color: 'text-slate-500' },
      { id: 'Cancello', icon: CancelloIcon, label: 'Cancello', color: 'text-slate-800' },
    ]
  },
  {
    tipo: 'edificio',
    label: 'Edifici',
    icons: [
      { id: 'Baracca', icon: BaraccaIcon, label: 'Baracca', color: 'text-slate-900' },
      { id: 'Camino', icon: CaminoIcon, label: 'Camino', color: 'text-slate-600' },
    ]
  },
  {
    tipo: 'albero',
    label: 'Alberi da Frutta',
    icons: [
      { id: 'Melo', icon: MeloIcon, label: 'Melo', color: 'text-red-500' },
      { id: 'Pero', icon: PeroIcon, label: 'Pero', color: 'text-amber-500' },
      { id: 'Ciliegio', icon: CiliegioIcon, label: 'Ciliegio', color: 'text-red-600' },
      { id: 'Pesco', icon: PescoIcon, label: 'Pesco', color: 'text-pink-500' },
      { id: 'Prugno', icon: PrugnoIcon, label: 'Prugno', color: 'text-purple-600' },
      { id: 'Albicocco', icon: AlbicoccoIcon, label: 'Albicocco', color: 'text-orange-500' },
    ]
  },
  {
    tipo: 'albero',
    label: 'Altre Piante e Frutti',
    icons: [
      { id: 'Ulivo', icon: UlivoIcon, label: 'Ulivo', color: 'text-emerald-700' },
      { id: 'Fico', icon: FicoIcon, label: 'Fico', color: 'text-indigo-800' },
      { id: 'Caco', icon: CacoIcon, label: 'Caco', color: 'text-orange-600' },
      { id: 'Melograno', icon: MelogranoIcon, label: 'Melograno', color: 'text-rose-700' },
      { id: 'Nespolo', icon: NespoloIcon, label: 'Nespolo', color: 'text-amber-600' },
      { id: 'Fragola', icon: FragolaIcon, label: 'Fragola', color: 'text-rose-600' },
      { id: 'Asparago', icon: AsparagoIcon, label: 'Asparago', color: 'text-emerald-800' },
      { id: 'Amareno', icon: AmarenoIcon, label: 'Amareno', color: 'text-rose-900' },
      { id: 'Kiwi', icon: KiwiIcon, label: 'Kiwi', color: 'text-lime-600' },
      { id: 'Limone', icon: LimoneIcon, label: 'Limone', color: 'text-yellow-500' },
      { id: 'Banana', icon: BananaIcon, label: 'Banana', color: 'text-yellow-400' },
    ]
  }
];

export default function POIManager() {
  const { poi, createPOI, updatePOI, deletePOI, clearAllPOI, isLoading } = usePOI();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [newPOI, setNewPOI] = useState<{
    nome: string;
    tipo: 'infrastruttura' | 'edificio' | 'albero' | 'altro';
    icona: string;
    coord_x: number | '';
    coord_y: number | '';
  }>({
    nome: '',
    tipo: 'infrastruttura',
    icona: '',
    coord_x: '',
    coord_y: '',
  });

  const filteredPOI = poi.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const canSave = newPOI.nome.trim() !== '' && newPOI.icona !== '' && newPOI.coord_x !== '' && newPOI.coord_y !== '';

  const handleCreateOrUpdate = async () => {
    if (!canSave) return;
    const payload = {
      ...newPOI,
      coord_x: Number(newPOI.coord_x),
      coord_y: Number(newPOI.coord_y),
    };
    if (editingId) {
      await updatePOI({ id: editingId, data: payload });
    } else {
      await createPOI(payload);
    }
    setIsAdding(false);
    setEditingId(null);
    setNewPOI({ nome: '', tipo: 'infrastruttura', icona: '', coord_x: '', coord_y: '' });
  };

  const handleEdit = (p: any) => {
    setNewPOI({ nome: p.nome, tipo: p.tipo, icona: p.icona, coord_x: p.coord_x, coord_y: p.coord_y });
    setEditingId(p.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewPOI({ nome: '', tipo: 'infrastruttura', icona: '', coord_x: '', coord_y: '' });
  };

  const handleSpostaSullaMappa = () => {
    if (editingId) {
      navigate(`/?reposition=${editingId}`);
    }
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
        {filteredPOI.map(p => {
          const flatIcons = ICON_CATEGORIES.flatMap(c => c.icons);
          const opt = flatIcons.find(o => o.id === p.icona) || { id: 'Unknown', icon: UnknownIcon, label: 'Sconosciuto', color: 'text-red-600' };
          return (
            <div key={p.id} onClick={() => handleEdit(p)} className="p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${opt.color} group-hover:bg-emerald-50 transition-colors`}>
                  <opt.icon size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{p.nome}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.icona} • {Math.round(p.coord_x)}, {Math.round(p.coord_y)}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deletePOI(p.id); }}
                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal Aggiunta */}
      {isAdding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto noise-bg border border-white">
            <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-[#fcfaf7] z-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-heading font-black text-slate-900 italic">{editingId ? 'Modifica Punto' : 'Nuovo Punto'}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posizionamento in Mappa</p>
              </div>
              <button onClick={handleCancel} className="p-3 hover:bg-slate-100 rounded-full">✕</button>
            </header>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Punto</label>
                  <input
                    type="text"
                    value={newPOI.nome}
                    onChange={e => setNewPOI({ ...newPOI, nome: e.target.value })}
                    className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="es. Melo del Nonno"
                  />
                </div>
              </div>

              <div className="space-y-6 border-t border-slate-100 pt-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleziona Icona (La Categoria sarà automatica)</label>
                <div className="space-y-6">
                  {ICON_CATEGORIES.map(category => (
                    <div key={category.label} className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">{category.label}</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {category.icons.map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setNewPOI({ ...newPOI, icona: opt.id, tipo: category.tipo as any })}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${newPOI.icona === opt.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' : 'bg-white border-slate-100 hover:border-emerald-200'}`}
                          >
                            <opt.icon size={20} className={newPOI.icona === opt.id ? 'text-white' : opt.color} />
                            <span className="text-[8px] font-black uppercase tracking-tighter text-center">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-6">
                <details className="group cursor-pointer">
                  <summary className="text-[10px] font-black text-slate-400 uppercase tracking-widest list-none flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center group-open:bg-emerald-100 text-slate-600 group-open:text-emerald-600">+</span>
                    Allineamento di Precisione (Coordinate)
                  </summary>
                  <div className="flex gap-4 mt-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posizione X</label>
                      <input 
                        type="number" 
                        value={newPOI.coord_x !== '' ? Math.round(Number(newPOI.coord_x)) : ''}
                        onChange={e => setNewPOI({...newPOI, coord_x: e.target.value === '' ? '' : Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 p-3 text-sm font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posizione Y</label>
                      <input 
                        type="number" 
                        value={newPOI.coord_y !== '' ? Math.round(Number(newPOI.coord_y)) : ''}
                        onChange={e => setNewPOI({...newPOI, coord_y: e.target.value === '' ? '' : Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 p-3 text-sm font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800"
                      />
                    </div>
                  </div>
                </details>
              </div>

              <footer className="flex gap-4">
                {editingId && (
                  <button onClick={handleSpostaSullaMappa} className="flex-[1.5] py-5 bg-amber-50 text-amber-700 border border-amber-200 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2">
                    <MapPin size={16} /> Sposta
                  </button>
                )}
                <button onClick={handleCancel} className="flex-[1] py-5 bg-white border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400">Annulla</button>
                <button 
                  onClick={handleCreateOrUpdate} 
                  disabled={!canSave}
                  className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Salva Modifiche' : 'Salva Punto'}
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
