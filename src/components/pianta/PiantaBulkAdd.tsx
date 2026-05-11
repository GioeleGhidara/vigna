import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { Layers } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSubmit: (piante: any[]) => Promise<void>;
}

export function PiantaBulkAdd({ onClose, onSubmit }: Props) {
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    filare_id: filari[0]?.id || 0,
    tipo_id: tipi[0]?.id || 0,
    prefix: 'VIG-',
    start: 1,
    count: 10,
    anno_impianto: new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.count <= 0) return alert("Inserisci una quantità valida");
    if (form.count > 100) return alert("Massimo 100 viti per volta");
    
    setIsSubmitting(true);
    
    const piante = [];
    for (let i = 0; i < form.count; i++) {
      const pos = form.start + i;
      piante.push({
        id: `${form.prefix}${pos.toString().padStart(3, '0')}`,
        filare_id: form.filare_id,
        tipo_id: form.tipo_id,
        posizione_nel_filare: pos,
        stato: 'attiva',
        anno_impianto: form.anno_impianto,
      });
    }

    try {
      await onSubmit(piante);
      onClose();
    } catch (err: any) {
      console.error("Bulk Add Error:", err);
      const msg = err.code === '23505' 
        ? "Errore: Uno o più codici (ID) esistono già nel sistema. Cambia prefisso o numero di inizio."
        : "Errore durante la creazione multipla. Riprova più tardi.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden noise-bg border border-white">
        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-black text-slate-900 italic flex items-center gap-3">
              <Layers className="text-emerald-800" /> Creazione in Serie
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modellazione Rapida Filare</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filare Target</label>
              <select 
                value={form.filare_id}
                onChange={e => setForm({...form, filare_id: parseInt(e.target.value)})}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
              >
                {filari.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varietà Comune</label>
              <select 
                value={form.tipo_id}
                onChange={e => setForm({...form, tipo_id: parseInt(e.target.value)})}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
              >
                {tipi.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">Prefisso ID</label>
                <input 
                  type="text" 
                  value={form.prefix}
                  onChange={e => setForm({...form, prefix: e.target.value})}
                  className="w-full bg-white border border-emerald-100 p-3 text-sm font-mono font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">Pos. Inizio</label>
                <input 
                  type="number" 
                  value={form.start}
                  onChange={e => setForm({...form, start: parseInt(e.target.value)})}
                  className="w-full bg-white border border-emerald-100 p-3 text-sm font-mono font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">Quantità</label>
                <input 
                  type="number" 
                  value={form.count}
                  onChange={e => setForm({...form, count: parseInt(e.target.value)})}
                  className="w-full bg-white border border-emerald-100 p-3 text-sm font-mono font-bold rounded-xl outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>
            </div>
            <p className="text-[10px] text-emerald-700/60 font-medium italic">
              Verranno create {form.count} viti dal codice {form.prefix}{form.start.toString().padStart(3, '0')} al {form.prefix}{(form.start + form.count - 1).toString().padStart(3, '0')}.
            </p>
          </div>

          <footer className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-5 bg-white border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
            >
              Annulla
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] py-5 bg-emerald-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-800 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creazione in corso...' : 'Crea Serie'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
