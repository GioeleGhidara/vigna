import { useState } from 'react';
import { 
  ContatoreIcon, RubinettoIcon, MeloIcon, PeroIcon, UlivoIcon, MelogranoIcon,
  FicoIcon, ScalaIcon, CaminoIcon, ReteIcon, BaraccaIcon, CacoIcon,
  CiliegioIcon, FragolaIcon, AsparagoIcon, AmarenoIcon, PescoIcon,
  PrugnoIcon, AlbicoccoIcon, NespoloIcon, CancelloIcon, KiwiIcon,
  LimoneIcon, BananaIcon
} from '@/components/icons/POIIcons';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { POIInput } from '@/types';

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

interface Props {
  poi?: POIInput & { id?: string };
  onClose: () => void;
  onSubmit: (data: POIInput) => Promise<void>;
}

export default function POIFormModal({ poi, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<any>({
    nome: poi?.nome || '',
    tipo: poi?.tipo || 'infrastruttura',
    icona: poi?.icona || '',
    coord_x: poi?.coord_x ?? '',
    coord_y: poi?.coord_y ?? '',
    descrizione: poi?.descrizione || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSave = form.nome.trim() !== '' && form.icona !== '' && form.coord_x !== '' && form.coord_y !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        coord_x: Number(form.coord_x),
        coord_y: Number(form.coord_y)
      });
      onClose();
    } catch (err) {
      alert("Errore durante il salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto noise-bg border border-white">
        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-[#fcfaf7] z-10">
          <h2 className="text-2xl font-heading font-black text-slate-900 italic">Nuovo Landmark</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome</label>
            <input 
              type="text" 
              placeholder="es. Rubinetto Nord, Filare A"
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
              className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seleziona Icona (La Categoria sarà automatica)</label>
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {ICON_CATEGORIES.map(category => (
                <div key={category.label} className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">{category.label}</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {category.icons.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm({...form, icona: opt.id, tipo: category.tipo})}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${form.icona === opt.id ? 'bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600 scale-105 shadow-sm' : 'bg-white border border-slate-100 text-slate-400 hover:border-emerald-200'}`}
                      >
                        <opt.icon size={24} className={form.icona === opt.id ? 'text-emerald-700' : opt.color} />
                        <span className="text-[8px] font-black uppercase tracking-tighter text-center line-clamp-1">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-6">
            <details className="group cursor-pointer" open={form.coord_x === '' || form.coord_y === ''}>
              <summary className="text-[10px] font-black text-slate-400 uppercase tracking-widest list-none flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center group-open:bg-emerald-100 text-slate-600 group-open:text-emerald-600">+</span>
                Allineamento di Precisione (Coordinate)
              </summary>
              <div className="flex gap-4 mt-4 p-4 bg-slate-50 rounded-2xl border border-rose-100">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posizione X</label>
                  <input 
                    type="number" 
                    placeholder="Scegli dalla mappa"
                    value={form.coord_x !== '' ? Math.round(Number(form.coord_x)) : ''}
                    onChange={e => setForm({...form, coord_x: e.target.value === '' ? '' : Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 p-3 text-sm font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800 placeholder:text-slate-300 placeholder:font-normal"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posizione Y</label>
                  <input 
                    type="number" 
                    placeholder="Scegli dalla mappa"
                    value={form.coord_y !== '' ? Math.round(Number(form.coord_y)) : ''}
                    onChange={e => setForm({...form, coord_y: e.target.value === '' ? '' : Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 p-3 text-sm font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800 placeholder:text-slate-300 placeholder:font-normal"
                  />
                </div>
              </div>
              {(form.coord_x === '' || form.coord_y === '') && (
                <p className="text-[9px] font-bold text-rose-500 mt-3 text-center uppercase tracking-widest animate-pulse">
                  ⚠️ Ricordati di impostare le coordinate o riposizionare l'icona dalla mappa!
                </p>
              )}
            </details>
          </div>

          <footer className="pt-6 flex gap-4">
            <Button variant="outline" className="flex-1 py-6 rounded-3xl" onClick={onClose} type="button">Annulla</Button>
            <Button 
              className="flex-[2] py-6 rounded-3xl bg-slate-900 disabled:opacity-50" 
              type="submit" 
              disabled={!canSave || isSubmitting}
            >
              {isSubmitting ? 'Salvataggio...' : 'Crea Landmark'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
