import { useState } from 'react';
import { 
  Home, Building2, Droplets, Gauge, Zap, 
  Apple, Cherry, Citrus, Trees, Leaf, Flower2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { POIInput } from '@/types';

const ICON_OPTIONS = [
  // Infrastruttura
  { id: 'Home', icon: Home, label: 'Edificio' },
  { id: 'Warehouse', icon: Building2, label: 'Magazzino' },
  { id: 'Droplets', icon: Droplets, label: 'Rubinetto' },
  { id: 'Gauge', icon: Gauge, label: 'Contatore' },
  { id: 'UtilityPole', icon: Zap, label: 'Palo/Centralina' },
  
  // Frutta & Natura
  { id: 'Melo', icon: Apple, label: 'Melo' },
  { id: 'Pero', icon: Apple, label: 'Pero' },
  { id: 'Limone', icon: Citrus, label: 'Limone' },
  { id: 'Ciliegio', icon: Cherry, label: 'Ciliegio' },
  { id: 'Vite', icon: Leaf, label: 'Vite' },
  { id: 'Pesco', icon: Flower2, label: 'Pesco' },
  { id: 'Albero', icon: Trees, label: 'Albero Gen.' },
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
