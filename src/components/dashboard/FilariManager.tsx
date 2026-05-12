import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus, Trash2, Edit2, Check, GripVertical,
  Wand2, ArrowRight, AlertCircle,
} from 'lucide-react';
import type { Filare } from '@/types';
import { PRODUTTORI_LIST } from '@/constants/registry';


export default function FilariManager() {
  const qc = useQueryClient();
  const { filari, updateFilare, deleteFilare } = useFilari();
  const { tipi } = useTipiPianta();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Stato di navigazione del modulo di creazione integrato
  const [creationMode, setCreationMode] = useState<'simple' | 'advanced'>('simple');

  // Stato globale condiviso per il nuovo filare
  const [rowName, setRowName] = useState('');
  const [totalPiante, setTotalPiante] = useState<number>(50);
  const [tipoId, setTipoId] = useState('');
  const [descrizione, setDescrizione] = useState('');

  // Sotto-stato specifico per la Modalità Semplice (Un singolo produttore)
  const [singleVenditore, setSingleVenditore] = useState('');

  // Sotto-stato specifico per la Modalità Avanzata (Lotti misti)
  const [assignments, setAssignments] = useState<{ venditore: string, count: number }[]>([]);
  const [currentVenditore, setCurrentVenditore] = useState('');
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Form di edit per i filari esistenti nella lista
  const [editForm, setEditForm] = useState({
    nome: '',
    ordine: 0,
    venditore: '',
    descrizione: '',
    note: ''
  });

  // Calcoli dinamici per i lotti avanzati
  const assignedSoFar = assignments.reduce((sum, a) => sum + a.count, 0);
  const remaining = (totalPiante || 0) - assignedSoFar;

  const handleAddAssignment = () => {
    if (!currentVenditore.trim() || currentCount <= 0 || currentCount > remaining) return;
    setAssignments(prev => [...prev, { venditore: currentVenditore.trim(), count: currentCount }]);
    setCurrentVenditore('');
    setCurrentCount(0);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  // Logica Transazionale Unificata di Inserimento
  const handleIntegratedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowName.trim() || isProcessing) return;

    // Controlli di sicurezza specifici per la modalità attiva
    if (creationMode === 'simple' && totalPiante > 0 && !tipoId) {
      setStatus({ type: 'error', msg: 'Seleziona una varietà d\'uva per l\'impianto delle viti.' });
      return;
    }
    if (creationMode === 'advanced') {
      if (!tipoId) {
        setStatus({ type: 'error', msg: 'Seleziona una varietà d\'uva per configurare i lotti.' });
        return;
      }
      if (remaining !== 0) {
        setStatus({ type: 'error', msg: `Assegna esattamente tutte le ${totalPiante} viti prima di procedere.` });
        return;
      }
      if (assignments.length === 0) {
        setStatus({ type: 'error', msg: 'Aggiungi almeno un lotto di produttore.' });
        return;
      }
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      // 1. Calcolo del prossimo ordine ed esecuzione della Insert per il Filare
      const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
      const targetVenditore = creationMode === 'simple' ? singleVenditore.trim() : 'Misto (Lotti)';
      const targetPianteCount = totalPiante || 0;

      const { data: newRow, error: rowError } = await supabase
        .from('filari')
        .insert({
          nome: rowName.trim(),
          ordine: nextOrder,
          venditore: targetVenditore,
          descrizione: descrizione.trim(),
          numero_piante: targetPianteCount
        })
        .select()
        .single();

      if (rowError) throw rowError;

      // 2. Se è specificato un quantitativo di piante, procediamo all'inserimento transazionale delle viti
      if (targetPianteCount > 0 && tipoId) {
        const rowPrefix = rowName.replace(/filare\s*/i, '').trim().toUpperCase();
        const tipoIdNum = parseInt(tipoId, 10);
        let currentPos = 1;
        const payloadPiante = [];

        if (creationMode === 'simple') {
          // Generazione sequenziale per il singolo lotto
          for (let p = 1; p <= targetPianteCount; p++) {
            payloadPiante.push({
              filare_id: newRow.id,
              tipo_id: tipoIdNum,
              posizione_nel_filare: p,
              codice_etichetta: `${rowPrefix}-${String(p).padStart(3, '0')}`,
              venditore: targetVenditore,
              stato: 'attiva'
            });
          }
        } else {
          // Generazione ricalcolata in base alla frammentazione dei lotti del Mago
          for (const lot of assignments) {
            for (let i = 0; i < lot.count; i++) {
              const pos = currentPos + i;
              payloadPiante.push({
                filare_id: newRow.id,
                tipo_id: tipoIdNum,
                posizione_nel_filare: pos,
                codice_etichetta: `${rowPrefix}-${String(pos).padStart(3, '0')}`,
                venditore: lot.venditore,
                stato: 'attiva'
              });
            }
            currentPos += lot.count;
          }
        }

        // Singolo push di rete per l'intero array di viti
        const { error: pianteError } = await supabase.from('piante').insert(payloadPiante);
        if (pianteError) throw pianteError;
      }

      // 3. Esecuzione globale di refetch per riallineare istantaneamente il DOM e il Canvas SVG
      await qc.invalidateQueries({ queryKey: ['filari'], refetchType: 'all' });
      await qc.invalidateQueries({ queryKey: ['piante'], refetchType: 'all' });

      setStatus({ type: 'success', msg: `Filare "${rowName.trim()}" creato e popolato correttamente.` });

      // Reset completo dello stato di input
      setRowName('');
      setTotalPiante(50);
      setTipoId('');
      setDescrizione('');
      setSingleVenditore('');
      setAssignments([]);
      setCurrentVenditore('');
      setCurrentCount(0);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Si è verificato un errore durante il salvataggio della struttura.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Funzioni di supporto alla lista per le modifiche rapide
  const startEdit = (f: Filare) => {
    setEditingId(f.id);
    setEditForm({
      nome: f.nome,
      ordine: f.ordine,
      venditore: f.venditore || '',
      descrizione: f.descrizione || '',
      note: f.note || ''
    });
  };

  const handleUpdate = async (id: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateFilare({
        id,
        data: {
          ...editForm,
          nome: editForm.nome.trim(),
          venditore: editForm.venditore.trim()
        }
      });
      setEditingId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Intestazione del Modulo */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {filari.length} {filari.length === 1 ? 'Filare' : 'Filari'}
        </span>
      </div>

      {/* Riquadro di feedback globale */}
      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${status.type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
          : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
          <AlertCircle size={16} className="shrink-0" />
          <span>{status.msg}</span>
        </div>
      )}

      {/* SEZIONE 1: L'INSERITORE INTEGRATO UNIFICATO */}
      <div className="rounded-[2rem] border border-slate-200 bg-[#fcfaf7] overflow-hidden shadow-sm">

        {/* Selettore di modalità integrato in testata */}
        <div className="flex bg-slate-100/70 p-2 border-b border-slate-200/60">
          <button
            type="button"
            onClick={() => { setCreationMode('simple'); setStatus(null); }}
            className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${creationMode === 'simple'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Plus size={16} className={creationMode === 'simple' ? 'text-emerald-700' : ''} />
            Creazione Standard
          </button>
          <button
            type="button"
            onClick={() => { setCreationMode('advanced'); setStatus(null); }}
            className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${creationMode === 'advanced'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Wand2 size={16} className={creationMode === 'advanced' ? 'text-indigo-700' : ''} />
            Mago a Lotti (Avanzato)
          </button>
        </div>

        {/* Corpo Unificato del Modulo */}
        <form onSubmit={handleIntegratedSubmit} className="p-6 md:p-8 space-y-6">

          {/* Campi condivisi di base */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0" />
              <input
                type="text"
                placeholder="Nome Filare (es. Filare A)..."
                value={rowName}
                onChange={e => setRowName(e.target.value)}
                className="flex-1 bg-white border border-slate-100 p-4 rounded-2xl text-sm outline-none font-bold shadow-sm focus:ring-2 focus:ring-emerald-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  Numero Viti Previste
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="Totale Piante"
                  value={totalPiante || ''}
                  onChange={e => setTotalPiante(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-slate-100 p-3.5 rounded-xl text-sm outline-none font-mono font-bold shadow-sm focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  Varietà d'Uva
                </label>
                <select
                  value={tipoId}
                  onChange={e => setTipoId(e.target.value)}
                  className="w-full bg-white border border-slate-100 p-3.5 rounded-xl text-sm outline-none font-bold shadow-sm focus:ring-2 focus:ring-emerald-800 appearance-none"
                  required={totalPiante > 0}
                >
                  <option value="">Seleziona varietà...</option>
                  {tipi.map(t => (
                    <option key={`tipo-opt-${t.id}`} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Descrizione topografica facoltativa (es. Terrazzamento esposto a sud)..."
              value={descrizione}
              onChange={e => setDescrizione(e.target.value)}
              className="w-full bg-white border border-slate-100 p-3.5 rounded-xl text-xs outline-none text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Sotto-Sezione Condizionale: Modalità Semplice */}
          {creationMode === 'simple' ? (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                Produttore / Vivaio di Origine (Unico per la fila)
              </label>

              {/* Suggerimenti veloci */}
              <div className="flex flex-wrap gap-2">
                {PRODUTTORI_LIST.map((p, idx) => (
                  <button
                    key={`prod-btn-smp-${idx}`}
                    type="button"
                    onClick={() => setSingleVenditore(p)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-emerald-600 hover:text-emerald-800 transition-all active:scale-95 shadow-2xs"
                  >
                    {p.split(' ')[0]}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Digita vivaio o seleziona sopra..."
                value={singleVenditore}
                onChange={e => setSingleVenditore(e.target.value)}
                className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs outline-none font-mono uppercase tracking-widest text-slate-600 shadow-sm focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          ) : (
            /* Sotto-Sezione Condizionale: Modalità Avanzata a Lotti (Mago Integrato) */
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
              <header className="flex justify-between items-end bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-950 block">Ripartizione Lotti di Vivaio</span>
                  <p className="text-[10px] font-medium text-slate-500">
                    Assegna sequenzialmente le viti in base al produttore
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-3xl font-heading font-black block transition-colors ${remaining === 0 ? 'text-emerald-600' : remaining < 0 ? 'text-red-600' : 'text-indigo-600'
                    }`}>
                    {remaining}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                    Viti Residue
                  </span>
                </div>
              </header>

              {/* Inseritore singolo lotto */}
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {PRODUTTORI_LIST.map((p, idx) => (
                    <button
                      key={`prod-btn-adv-${idx}`}
                      type="button"
                      onClick={() => setCurrentVenditore(p)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-md text-[9px] font-bold uppercase tracking-wide text-slate-500 hover:bg-indigo-50 transition-colors"
                    >
                      {p.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="Nome Produttore..."
                    value={currentVenditore}
                    onChange={e => setCurrentVenditore(e.target.value)}
                    className="flex-[2] bg-[#fcfaf7] border border-slate-150 p-2.5 rounded-xl text-xs outline-none font-bold"
                  />
                  <input
                    type="number"
                    min="1"
                    max={remaining > 0 ? remaining : 1}
                    placeholder="Q.tà"
                    value={currentCount || ''}
                    onChange={e => setCurrentCount(parseInt(e.target.value, 10) || 0)}
                    className="flex-1 bg-[#fcfaf7] border border-slate-150 p-2.5 rounded-xl text-xs outline-none font-bold text-center"
                  />
                  <button
                    type="button"
                    onClick={handleAddAssignment}
                    disabled={!currentVenditore.trim() || currentCount <= 0 || currentCount > remaining}
                    className="px-4 bg-indigo-900 text-white rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-indigo-950 transition-colors shrink-0"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>

              {/* Lista lotti in transito */}
              {assignments.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {assignments.map((lot, index) => (
                    <div key={`lot-item-${index}`} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 text-xs font-bold">
                      <span className="text-slate-700 truncate pr-2">◆ {lot.venditore}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md font-mono">
                          {lot.count} viti
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignment(index)}
                          className="text-slate-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pulsantiera di Invio */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isProcessing || !rowName.trim() || (creationMode === 'advanced' && remaining !== 0)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-950 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                'Elaborazione transazione...'
              ) : creationMode === 'simple' ? (
                <>Conferma Impianto Standard <ArrowRight size={16} /></>
              ) : (
                <>Salva Struttura e Lotti <Check size={16} /></>
              )}
            </button>
          </div>
        </form>
      </div>


      {/* SEZIONE 2: LA LISTA DEI FILARI ESISTENTI */}
      <div className="space-y-4 pt-4">
        {filari.map(f => (
          <div
            key={`filare-row-${f.id}`}
            className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start justify-between group transition-all"
          >
            {editingId === f.id ? (
              /* Modalità Edit sul singolo record */
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome Filare"
                    onChange={e => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                    className="p-3 text-sm border-b border-slate-200 outline-none font-bold flex-1 bg-transparent"
                  />
                  <input
                    type="number"
                    value={editForm.ordine}
                    onChange={e => setEditForm(prev => ({ ...prev, ordine: parseInt(e.target.value, 10) || 0 }))}
                    className="w-20 p-3 text-sm border-b border-slate-200 outline-none font-bold text-center bg-transparent"
                    placeholder="Ordine"
                  />
                </div>

                <div className="flex flex-col gap-2 bg-[#fcfaf7] p-4 rounded-xl border border-slate-50">
                  <input
                    type="text"
                    value={editForm.venditore}
                    placeholder="Produttore di Origine"
                    onChange={e => setEditForm(prev => ({ ...prev, venditore: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none font-mono uppercase tracking-widest text-slate-600"
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {PRODUTTORI_LIST.map((p, idx) => (
                      <button
                        key={`prod-edit-${f.id}-${idx}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, venditore: p }))}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase text-slate-500 hover:border-emerald-500 hover:text-emerald-800 transition-all active:scale-95"
                      >
                        {p.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={editForm.descrizione}
                    placeholder="Descrizione facoltativa..."
                    onChange={e => setEditForm(prev => ({ ...prev, descrizione: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600 mt-2"
                  />

                  <input
                    type="text"
                    value={editForm.note}
                    placeholder="Note aggiuntive..."
                    onChange={e => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                    className="p-2 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleUpdate(f.id)}
                    className="px-5 py-2.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check size={16} /> Salva
                  </button>
                </div>
              </div>
            ) : (
              /* Modalità Lettura Standard */
              <>
                <div className="flex items-start gap-4 flex-1">
                  <GripVertical size={18} className="text-slate-300 cursor-ns-resize mt-1 shrink-0" />
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 border border-slate-100">
                    #{f.ordine}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base text-slate-800">{f.nome}</span>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {f.numero_piante || 0} viti
                      </span>
                    </div>
                    {f.venditore && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block w-fit">
                        Origine: {f.venditore}
                      </span>
                    )}
                    {f.descrizione && (
                      <p className="text-xs text-slate-500 font-medium pt-1">{f.descrizione}</p>
                    )}
                    {f.note && (
                      <p className="text-[11px] text-amber-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100 mt-2 font-medium">
                        Nota: {f.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(f)}
                    className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFilare(f.id)}
                    className="p-3 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}