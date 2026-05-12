import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { PRODUTTORI_LIST } from '@/constants/registry';


export default function VenditoreBulkTool() {
  const { filari } = useFilari();
  const qc = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Manteniamo i campi numerici come stringhe nello stato per evitare salti di cursore durante la digitazione
  const [form, setForm] = useState({
    filare_id: '',
    venditore: '',
    da_pos: '1',
    a_pos: '50'
  });

  // Calcolo di validazione incrociata
  const daPosNum = parseInt(form.da_pos, 10);
  const aPosNum = parseInt(form.a_pos, 10);
  const isRangeValid = !isNaN(daPosNum) && !isNaN(aPosNum) && daPosNum <= aPosNum && daPosNum > 0;

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filare_id || !form.venditore || !isRangeValid || isProcessing) return;

    setIsProcessing(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('piante')
        .update({ venditore: form.venditore.trim() })
        .eq('filare_id', parseInt(form.filare_id, 10))
        .gte('posizione_nel_filare', daPosNum)
        .lte('posizione_nel_filare', aPosNum);

      if (error) throw error;

      await qc.invalidateQueries({ queryKey: ['piante'] });
      setStatus({
        type: 'success',
        msg: `Aggiornate con successo le viti dal posto ${daPosNum} al ${aPosNum}.`
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        msg: err.message || 'Si è verificato un errore durante l\'assegnazione massiva.'
      });
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              1. Seleziona Filare
            </label>
            <select
              value={form.filare_id}
              onChange={e => setForm(prev => ({ ...prev, filare_id: e.target.value }))}
              className="w-full bg-[#fcfaf7] border border-slate-100 p-4 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
              required
            >
              <option value="">Scegli filare...</option>
              {filari.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

          {/* SELEZIONE VENDITORE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              2. Produttore / Vivaio
            </label>
            <input
              type="text"
              value={form.venditore}
              onChange={e => setForm(prev => ({ ...prev, venditore: e.target.value }))}
              placeholder="Inserisci o scegli sotto..."
              className="w-full bg-[#fcfaf7] border border-slate-100 p-4 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {PRODUTTORI_LIST.map((p, idx) => (
                <button
                  key={`prod-bulk-${idx}`}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, venditore: p }))}
                  className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all active:scale-95"
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RANGE DI POSIZIONI CONTROLLATO */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              3. Intervallo Posizioni (Posti nel Filare)
            </label>
            {!isRangeValid && form.da_pos && form.a_pos && (
              <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider animate-pulse">
                Intervallo non valido
              </span>
            )}
          </div>

          <div className={`flex items-center gap-4 bg-[#fcfaf7] p-6 rounded-2xl border transition-colors ${isRangeValid ? 'border-slate-50' : 'border-red-100 bg-red-50/20'}`}>
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase block text-center">Da Posto</span>
              <input
                type="number"
                min="1"
                value={form.da_pos}
                onChange={e => setForm(prev => ({ ...prev, da_pos: e.target.value }))}
                className="w-full bg-white border border-slate-100 p-3 rounded-xl text-center font-heading font-black text-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <ArrowRight className="text-slate-300 mt-4 shrink-0" size={20} />
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase block text-center">A Posto</span>
              <input
                type="number"
                min="1"
                value={form.a_pos}
                onChange={e => setForm(prev => ({ ...prev, a_pos: e.target.value }))}
                className="w-full bg-white border border-slate-100 p-3 rounded-xl text-center font-heading font-black text-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          </div>
        </div>

        {/* FEEDBACK TRANSAZIONE */}
        {status && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
            {status.type === 'success' ? <Check size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
            <span>{status.msg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !form.filare_id || !form.venditore || !isRangeValid}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-900 transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Applicazione al lotto in corso...' : 'Applica al Lotto'}
        </button>
      </form>
    </div>
  );
}