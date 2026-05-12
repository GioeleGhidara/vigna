import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowRight, Check, Trash2, Sparkles } from 'lucide-react';
import { PRODUTTORI_LIST } from '@/constants/registry';

export default function FilareWizard({ onFinish }: { onFinish: () => void }) {
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  const qc = useQueryClient();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dati Filare
  const [rowName, setRowName] = useState('');
  const [totalPiante, setTotalPiante] = useState(50);
  const [tipoId, setTipoId] = useState('');

  // Gestione Lotti (Produttori)
  const [assignments, setAssignments] = useState<{venditore: string, count: number}[]>([]);
  const [currentVenditore, setCurrentVenditore] = useState('');
  const [currentCount, setCurrentCount] = useState(0);

  const assignedSoFar = assignments.reduce((sum, a) => sum + a.count, 0);
  const remaining = totalPiante - assignedSoFar;

  const addAssignment = () => {
    if (!currentVenditore || currentCount <= 0 || currentCount > remaining) return;
    setAssignments([...assignments, { venditore: currentVenditore, count: currentCount }]);
    setCurrentVenditore('');
    setCurrentCount(0);
  };

  const removeAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (remaining !== 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      // 1. Crea il Filare
      const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
      const { data: newRow, error: rowError } = await supabase
        .from('filari')
        .insert({ nome: rowName, ordine: nextOrder, numero_piante: totalPiante })
        .select()
        .single();

      if (rowError) throw rowError;

      // 2. Crea le Piante per ogni lotto
      let currentPos = 1;
      const rowPrefix = rowName.replace(/filare\s*/i, '').trim().toUpperCase();

      for (const lot of assignments) {
        const pianteToInsert = Array.from({ length: lot.count }).map((_, i) => ({
          filare_id: newRow.id,
          tipo_id: parseInt(tipoId),
          posizione_nel_filare: currentPos + i,
          codice_etichetta: `${rowPrefix}-${String(currentPos + i).padStart(3, '0')}`,
          venditore: lot.venditore,
          stato: 'attiva'
        }));
        
        const { error: pError } = await supabase.from('piante').insert(pianteToInsert);
        if (pError) throw pError;
        currentPos += lot.count;
      }

      await qc.invalidateQueries({ queryKey: ['filari'] });
      await qc.invalidateQueries({ queryKey: ['piante'] });
      onFinish();
    } catch (err) {
      console.error(err);
      alert("Errore durante la creazione del filare");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden noise-bg border border-white p-10 space-y-8 animate-in zoom-in duration-300">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-800">
          <Sparkles size={20} />
          <h3 className="text-xl font-heading font-black text-slate-900 italic">Mago del Filare</h3>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {step === 1 ? 'Passaggio 1: Struttura Base' : 'Passaggio 2: Distribuzione Lotti'}
        </p>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Filare</label>
            <input 
              placeholder="es. Filare A" 
              className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              value={rowName} onChange={e => setRowName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Totale Viti</label>
              <input 
                type="number" placeholder="es. 50" 
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                value={totalPiante}
                onChange={e => setTotalPiante(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varietà</label>
              <select 
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
                value={tipoId} onChange={e => setTipoId(e.target.value)}
              >
                <option value="">Seleziona...</option>
                {tipi.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          </div>

          <footer className="pt-4">
            <button 
              disabled={!rowName || totalPiante <= 0 || !tipoId}
              onClick={() => setStep(2)}
              className="w-full py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-900 transition-all disabled:opacity-20"
            >
              Configura Lotti <ArrowRight size={18} />
            </button>
          </footer>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <header className="flex justify-between items-center bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest">Disponibilità</h4>
              <p className="text-[10px] font-bold text-emerald-600">Conteggio viti rimanenti</p>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-heading font-black ${remaining === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>{remaining}</span>
            </div>
          </header>

          <div className="space-y-4 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Produttore / Vivaio</label>
              <input 
              placeholder="es. Montina" 
              className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-800"
              value={currentVenditore} onChange={e => setCurrentVenditore(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {PRODUTTORI_LIST.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentVenditore(p)}
                  className="px-2 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500 hover:text-emerald-700 transition-all"
                >
                  {p.split(' ')[0]}
                </button>
              ))}
            </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantità</label>
                <input 
                  type="number" placeholder="es. 20" 
                  className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-800"
                  value={currentCount || ''} onChange={e => setCurrentCount(parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                onClick={addAssignment}
                disabled={!currentVenditore || currentCount <= 0 || currentCount > remaining}
                className="px-8 mt-6 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-20"
              >
                Aggiungi
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {assignments.map((a, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-50 rounded-2xl shadow-sm animate-in fade-in slide-in-from-left-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{a.venditore}</span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{a.count} viti</span>
                </div>
                <button 
                  onClick={() => removeAssignment(i)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <footer className="pt-4 flex gap-4">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-5 bg-white border border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Indietro
            </button>
            <button 
              disabled={remaining !== 0 || isProcessing}
              onClick={handleComplete}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-950 transition-all disabled:opacity-10 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {isProcessing ? 'Creazione...' : 'Crea Filare'}
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
