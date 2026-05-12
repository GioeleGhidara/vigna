import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { Sprout, Sparkles, AlertCircle } from 'lucide-react';
import type { PiantaInput } from '@/types';

export function PiantaBulkAdd({ onClose }: { onClose?: () => void }) {
  const qc = useQueryClient();
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const [form, setForm] = useState({
    filare_id: '',
    tipo_id: '',
    startPos: 1,
    quantita: 50,
    anno_impianto: new Date().getFullYear(),
    venditore: '',
  });

  const handleBulkInsert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filare_id || !form.tipo_id) {
      setError('Seleziona un filare e una varietà.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessCount(null);

    try {
      const filareIdNum = parseInt(form.filare_id);
      const tipoIdNum = parseInt(form.tipo_id);

      const filare = filari.find(f => f.id === filareIdNum);
      const rowPrefix = filare ? filare.nome.replace(/filare\s*/i, '').trim().toUpperCase() : 'P';

      // Generiamo l'array di payload senza il campo 'id'
      const pianteDaInserire: PiantaInput[] = Array.from(
        { length: form.quantita }, 
        (_, indice) => {
          const posizione = form.startPos + indice;
          const etichetta = `${rowPrefix}-${posizione.toString().padStart(3, '0')}`;

          return {
            filare_id: filareIdNum,
            tipo_id: tipoIdNum,
            stato: 'attiva',
            posizione_nel_filare: posizione,
            codice_etichetta: etichetta,
            anno_impianto: form.anno_impianto,
            venditore: form.venditore,
            coord_x: null,
            coord_y: null,
          };
        }
      );

      // Singola insert transazionale delegata a Supabase
      const { error: insertError } = await supabase
        .from('piante')
        .insert(pianteDaInserire);

      if (insertError) throw insertError;

      // Aggiorniamo il conteggio del filare per coerenza
      await supabase
        .from('filari')
        .update({ numero_piante: form.startPos + form.quantita - 1 })
        .eq('id', filareIdNum);

      // Invalidiamo la cache per far apparire istantaneamente le viti sulla mappa
      await qc.invalidateQueries({ queryKey: ['piante'] });
      await qc.invalidateQueries({ queryKey: ['filari'] });

      setSuccessCount(form.quantita);
      setForm(prev => ({ ...prev, startPos: prev.startPos + form.quantita }));
    } catch (err: any) {
      setError(err.message || 'Errore durante la generazione massiva.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden noise-bg border border-white p-10 space-y-8">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-800">
            <Sparkles size={20} />
            <h3 className="text-xl font-heading font-black text-slate-900">Impianto Massivo</h3>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Generazione delegata ad alte prestazioni
          </p>
        </header>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successCount !== null && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-bold">
            ✓ Impianto completato: generate ed etichettate {successCount} viti con successo!
          </div>
        )}

        <form onSubmit={handleBulkInsert} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filare</label>
              <select
                value={form.filare_id}
                onChange={e => setForm({ ...form, filare_id: e.target.value })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
              >
                <option value="">Seleziona...</option>
                {filari.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varietà</label>
              <select
                value={form.tipo_id}
                onChange={e => setForm({ ...form, tipo_id: e.target.value })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
              >
                <option value="">Seleziona...</option>
                {tipi.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pos. Iniziale</label>
              <input
                type="number"
                min="1"
                value={form.startPos}
                onChange={e => setForm({ ...form, startPos: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pos. Iniziale</label>
              <input
                type="number"
                min="1"
                value={form.startPos}
                onChange={e => setForm({ ...form, startPos: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantità</label>
              <input
                type="number"
                min="1"
                max="500"
                value={form.quantita}
                onChange={e => setForm({ ...form, quantita: parseInt(e.target.value) || 50 })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anno Impianto</label>
              <input
                type="number"
                value={form.anno_impianto}
                onChange={e => setForm({ ...form, anno_impianto: parseInt(e.target.value) || 2024 })}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Venditore / Vivaio</label>
              <input
                type="text"
                value={form.venditore}
                onChange={e => setForm({ ...form, venditore: e.target.value })}
                placeholder="es. Montina"
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <footer className="pt-2 flex gap-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-5 bg-white border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
              >
                Chiudi
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sprout size={16} />
              {isLoading ? 'Generazione in corso...' : 'Popola Filare'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
