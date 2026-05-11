import { useState } from 'react';
import { 
  IconHome, IconDroplet, IconGauge, IconAerialLift, IconBuildingWarehouse, 
  IconX, IconApple, IconCherry, IconLemon, IconBanana, IconPlant, IconLeaf, IconFlower
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { POIInput } from '@/types';

const ICON_OPTIONS = [
  // Infrastruttura (Tabler)
  { id: 'Home', icon: IconHome, label: 'Edificio', isEmoji: false },
  { id: 'Warehouse', icon: IconBuildingWarehouse, label: 'Magazzino', isEmoji: false },
  { id: 'Droplets', icon: IconDroplet, label: 'Rubinetto', isEmoji: false },
  { id: 'Gauge', icon: IconGauge, label: 'Contatore', isEmoji: false },
  { id: 'UtilityPole', icon: IconAerialLift, label: 'Palo/Centralina', isEmoji: false },
  
  // Frutta (Tabler)
  { id: 'Melo', icon: IconApple, label: 'Melo', isEmoji: false },
  { id: 'Pero', icon: IconApple, label: 'Pero', isEmoji: false },
  { id: 'Limone', icon: IconLemon, label: 'Limone', isEmoji: false },
  { id: 'Ciliegio', icon: IconCherry, label: 'Ciliegio', isEmoji: false },
  { id: 'Banana', icon: IconBanana, label: 'Banana', isEmoji: false },
  { id: 'Vite', icon: IconLeaf, label: 'Vite', isEmoji: false },
  { id: 'Pesco', icon: IconFlower, label: 'Pesco', isEmoji: false },
  { id: 'Albero', icon: IconPlant, label: 'Albero Gen.', isEmoji: false },
];

interface Props {
  onClose: () => void;
  onSubmit: (data: POIInput) => Promise<void>;
}

export default function POIFormModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState<POIInput>({
    nome: '',
    tipo: 'infrastruttura',
    icona: 'Home',
    coord_x: 500,
    coord_y: 500,
    descrizione: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) return alert("Inserisci un nome");
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      alert("Errore durante il salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden noise-bg border border-white">
        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-heading font-black text-slate-900 italic">Nuovo Landmark</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">✕</button>
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

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
            <div className="flex gap-2">
              {(['edificio', 'infrastruttura', 'albero'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({...form, tipo: t})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.tipo === t ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icona Rappresentativa</label>
            <div className="grid grid-cols-4 gap-3 p-4 bg-white border border-slate-100 rounded-[2rem]">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setForm({...form, icona: opt.id})}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${form.icona === opt.id ? 'bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  <opt.icon size={24} />
                </button>
              ))}
            </div>
          </div>

          <footer className="pt-6 flex gap-4">
            <Button variant="outline" className="flex-1 py-6 rounded-3xl" onClick={onClose} type="button">Annulla</Button>
            <Button className="flex-[2] py-6 rounded-3xl bg-slate-900" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvataggio...' : 'Crea Landmark'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
