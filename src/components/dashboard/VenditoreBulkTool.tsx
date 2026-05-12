import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { usePiante } from '@/hooks/usePiante';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Check, AlertCircle, ArrowRight } from 'lucide-react';

const PRODUTTORI_LIST = [
  "Gallo Silvio (Stella)",
  "Vivai Donato (Cenaia PI)",
  "Pamparino Sara (Finale Ligure)",
  "Negro Carlo (Dogliani)",
  "Vivaio Revella (Quiliano)"
];

export default function VenditoreBulkTool() {
  const { filari } = useFilari();
  const qc = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [form, setForm] = useState({
    filare_id: '',
    venditore: '',
    da_pos: 1,
    a_pos: 50
  });

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filare_id || !form.venditore || isProcessing) return;

    setIsProcessing(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('piante')
        .update({ venditore: form.venditore })
        .eq('filare_id', parseInt(form.filare_id))
        .gte('posizione_nel_filare', form.da_pos)
        .lte('posizione_nel_filare', form.a_pos);

      if (error) throw error;

      await qc.invalidateQueries({ queryKey: ['piante'] });
      setStatus({ type: 'success', msg: `Aggiornate con successo le viti da ${form.da_pos} a ${form.a_pos}` });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Errore durante l\'aggiornamento massivo' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-800">
          <Package size={20} />
          <h3 className="text-xl font-heading font-black text-slate-900 italic">Assegnazione Lotti</h3>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Aggiorna il produttore per un gruppo di viti in sequenza
        </p>
      </header>

      <form onSubmit={handleBulkUpdate} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SELEZIONE FILARE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Seleziona Filare</label>
            <select
              value={form.filare_id}
              onChange={e => setForm({ ...form, filare_id: e.target.value })}
              className="w-full bg-[#fcfaf7] border border-slate-100 p-4 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
              required
            >
              <option value="">Scegli filare...</option>
              {filari.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </div>

          {/* SELEZIONE VENDITORE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Produttore / Vivaio</label>
            <input
              type="text"
              value={form.venditore}
              onChange={e => setForm({ ...form, venditore: e.target.value })}
              placeholder="Inserisci o scegli sotto..."
              className="w-full bg-[#fcfaf7] border border-slate-100 p-4 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {PRODUTTORI_LIST.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, venditore: p })}
                  className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all"
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RANGE DI POSIZIONI */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">3. Intervallo Posizioni (Posti nel Filare)</label>
          <div className="flex items-center gap-4 bg-[#fcfaf7] p-6 rounded-2xl border border-slate-50">
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Da Posto</span>
              <input
                type="number"
                value={form.da_pos}
                onChange={e => setForm({ ...form, da_pos: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-100 p-3 rounded-xl text-center font-heading font-black text-lg shadow-sm"
              />
            </div>
            <ArrowRight className="text-slate-300 mt-4" size={20} />
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">A Posto</span>
              <input
                type="number"
                value={form.a_pos}
                onChange={e => setForm({ ...form, a_pos: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-100 p-3 rounded-xl text-center font-heading font-black text-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !form.filare_id || !form.venditore}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-900 transition-all disabled:opacity-30 active:scale-[0.98]"
        >
          {isProcessing ? 'Aggiornamento in corso...' : 'Applica al Lotto'}
        </button>
      </form>
    </div>
  );
}
