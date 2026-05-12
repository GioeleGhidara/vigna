import React, { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus, Trash2, Edit2, Check, GripVertical,
  Wand2, ArrowRight, AlertCircle
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

  // Stato per scambiare la modalità del form integrato: standard vs mago a lotti
  const [creationMode, setCreationMode] = useState<'simple' | 'advanced'>('simple');

  // Campi condivisi per la creazione
  const [rowName, setRowName] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [totalPiante, setTotalPiante] = useState<number>(50);
  const [tipoId, setTipoId] = useState('');

  // Sotto-stato: Creazione Semplice (Produttore unico globale)
  const [singleVenditore, setSingleVenditore] = useState('');

  // Sotto-stato: Mago a Lotti Avanzato
  const [assignments, setAssignments] = useState<{ venditore: string, count: number }[]>([]);
  const [currentVenditore, setCurrentVenditore] = useState('');
  const [currentCount, setCurrentCount] = useState<number>(0);

  // Form di modifica per le righe esistenti
  const [editForm, setEditForm] = useState({
    nome: '',
    ordine: 0,
    venditore: '',
    descrizione: '',
    note: ''
  });

  // Calcolo in tempo reale delle viti residue per il Mago
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

  // Logica di invio unificata (gestisce sia la modalità semplice che a lotti)
  const handleIntegratedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rowName.trim() || isProcessing) return;

    const targetPianteCount = totalPiante || 0;

    // Validazioni di sicurezza
    if (targetPianteCount > 0 && !tipoId) {
      setStatus({ type: 'error', msg: 'Seleziona una varietà d\'uva per le viti.' });
      return;
    }
    if (creationMode === 'advanced') {
      if (remaining !== 0) {
        setStatus({ type: 'error', msg: `Assegna esattamente tutte le ${targetPianteCount} viti residue prima di salvare.` });
        return;
      }
      if (assignments.length === 0) {
        setStatus({ type: 'error', msg: 'Aggiungi almeno un lotto vivaio.' });
        return;
      }
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      // 1. Inserimento della struttura del Filare
      const nextOrder = filari.length > 0 ? Math.max(...filari.map(f => f.ordine)) + 1 : 0;
      const targetVenditore = creationMode === 'simple' ? singleVenditore.trim() : 'Misto (Lotti)';

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

      // 2. Popolamento automatico e istantaneo delle viti
      if (targetPianteCount > 0 && tipoId) {
        const rowPrefix = rowName.replace(/filare\s*/i, '').trim().toUpperCase();
        const tipoIdNum = parseInt(tipoId, 10);
        const payloadPiante = [];
        let currentPos = 1;

        if (creationMode === 'simple') {
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

        const { error: pianteError } = await supabase.from('piante').insert(payloadPiante);
        if (pianteError) throw pianteError;
      }

      // 3. Sincronizzazione della cache
      await qc.invalidateQueries({ queryKey: ['filari'], refetchType: 'all' });
      await qc.invalidateQueries({ queryKey: ['piante'], refetchType: 'all' });

      setStatus({ type: 'success', msg: `Filare "${rowName.trim()}" registrato con successo.` });

      // Reset dei campi
      setRowName('');
      setDescrizione('');
      setTotalPiante(50);
      setTipoId('');
      setSingleVenditore('');
      setAssignments([]);
      setCurrentVenditore('');
      setCurrentCount(0);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Errore durante la transazione.' });
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">

      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-serif italic text-slate-800">Struttura Filari</h3>
        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {filari.length} {filari.length === 1 ? 'Filare' : 'Filari'}
        </span>
      </div>

      {status && (
        <div className={`p-3 sm:p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
          }`}>
          <AlertCircle size={16} className="shrink-0" />
          <span className="min-w-0 break-words">{status.msg}</span>
        </div>
      )}

      {/* MODULO CREAZIONE INTEGRATO UNIFICATO */}
      <div className="rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-[#fcfaf7] overflow-hidden shadow-2xs">

        {/* Switcher Tab Compatto */}
        <div className="flex bg-slate-100/80 p-1.5 sm:p-2 border-b border-slate-200/60 gap-1">
          <button
            type="button"
            onClick={() => { setCreationMode('simple'); setStatus(null); }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all flex items-center justify-center gap-1.5 ${creationMode === 'simple' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Plus size={14} className={creationMode === 'simple' ? 'text-emerald-700' : ''} />
            <span className="truncate">Standard</span>
          </button>
          <button
            type="button"
            onClick={() => { setCreationMode('advanced'); setStatus(null); }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all flex items-center justify-center gap-1.5 ${creationMode === 'advanced' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            <Wand2 size={14} className={creationMode === 'advanced' ? 'text-indigo-700' : ''} />
            <span className="truncate">Mago a Lotti</span>
          </button>
        </div>

        {/* Form di Inserimento */}
        <form onSubmit={handleIntegratedSubmit} className="p-4 sm:p-6 space-y-4">

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome Filare (es. Filare A)..."
              value={rowName}
              onChange={e => setRowName(e.target.value)}
              className="w-full bg-white border border-slate-100 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm outline-none font-bold shadow-2xs focus:ring-2 focus:ring-emerald-800"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  Numero Viti
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="Totale Piante"
                  value={totalPiante || ''}
                  onChange={e => setTotalPiante(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-slate-100 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm outline-none font-mono font-bold shadow-2xs focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  Varietà d'Uva
                </label>
                <select
                  value={tipoId}
                  onChange={e => setTipoId(e.target.value)}
                  className="w-full bg-white border border-slate-100 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm outline-none font-bold shadow-2xs focus:ring-2 focus:ring-emerald-800 appearance-none"
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
              placeholder="Descrizione facoltativa..."
              value={descrizione}
              onChange={e => setDescrizione(e.target.value)}
              className="w-full bg-white border border-slate-100 p-2.5 sm:p-3 rounded-xl text-xs outline-none text-slate-600 shadow-2xs focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Sotto-sezione: Creazione Semplice */}
          {creationMode === 'simple' ? (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                Produttore / Vivaio (Unico)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRODUTTORI_LIST.map((p, idx) => (
                  <button
                    key={`prod-btn-smp-${idx}`}
                    type="button"
                    onClick={() => setSingleVenditore(p)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold uppercase text-slate-500 hover:border-emerald-600 hover:text-emerald-800 transition-all active:scale-95 truncate max-w-full shadow-2xs"
                  >
                    {p.split(' ')[0]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Digita vivaio..."
                value={singleVenditore}
                onChange={e => setSingleVenditore(e.target.value)}
                className="w-full bg-white border border-slate-100 p-2.5 rounded-xl text-xs outline-none font-mono uppercase tracking-widest text-slate-600 shadow-2xs focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          ) : (
            /* Sotto-sezione: Mago a Lotti Avanzato */
            <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in duration-300">
              <div className="flex justify-between items-center bg-indigo-50/60 p-3 sm:p-4 rounded-xl border border-indigo-100 gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-indigo-950 block truncate">Ripartizione Lotti</span>
                  <span className="text-[9px] text-slate-500 block truncate">Assegna le viti per produttore</span>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xl sm:text-2xl font-heading font-black block leading-none ${remaining === 0 ? 'text-emerald-600' : remaining < 0 ? 'text-red-600' : 'text-indigo-600'
                    }`}>
                    {remaining}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-slate-400 block">Residue</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs space-y-2.5">
                <div className="flex flex-wrap gap-1">
                  {PRODUTTORI_LIST.map((p, idx) => (
                    <button
                      key={`prod-btn-adv-${idx}`}
                      type="button"
                      onClick={() => setCurrentVenditore(p)}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] sm:text-[9px] font-bold uppercase text-slate-500 hover:bg-indigo-50 transition-colors truncate max-w-full"
                    >
                      {p.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Vivaio..."
                    value={currentVenditore}
                    onChange={e => setCurrentVenditore(e.target.value)}
                    className="flex-1 bg-[#fcfaf7] border border-slate-150 p-2 rounded-lg text-xs outline-none font-bold"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={remaining > 0 ? remaining : 1}
                      placeholder="Q.tà"
                      value={currentCount || ''}
                      onChange={e => setCurrentCount(parseInt(e.target.value, 10) || 0)}
                      className="w-20 bg-[#fcfaf7] border border-slate-150 p-2 rounded-lg text-xs outline-none font-bold text-center"
                    />
                    <button
                      type="button"
                      onClick={handleAddAssignment}
                      disabled={!currentVenditore.trim() || currentCount <= 0 || currentCount > remaining}
                      className="flex-1 sm:flex-none px-4 bg-indigo-900 text-white rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-indigo-950 transition-colors"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              </div>

              {assignments.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {assignments.map((lot, index) => (
                    <div key={`lot-item-${index}`} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs font-bold gap-2">
                      <span className="text-slate-700 truncate flex-1 min-w-0">◆ {lot.venditore}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-800 rounded font-mono text-[10px]">
                          {lot.count} viti
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignment(index)}
                          className="text-slate-300 hover:text-red-600 transition-colors p-0.5"
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

          <button
            type="submit"
            disabled={isProcessing || !rowName.trim() || (creationMode === 'advanced' && remaining !== 0)}
            className="w-full py-3 sm:py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-emerald-950 transition-all disabled:opacity-30 active:scale-98 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Elaborazione...' : creationMode === 'simple' ? <>Conferma Impianto <ArrowRight size={14} /></> : <>Salva Filare a Lotti <Check size={14} /></>}
          </button>
        </form>
      </div>

      {/* LISTA FILARI ESISTENTI */}
      <div className="space-y-3">
        {filari.map(f => (
          <div
            key={`filare-row-${f.id}`}
            className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 transition-all"
          >
            {editingId === f.id ? (
              <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={editForm.nome}
                    placeholder="Nome Filare"
                    onChange={e => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                    className="p-2 text-xs sm:text-sm border-b border-slate-200 outline-none font-bold flex-1 bg-transparent"
                  />
                  <input
                    type="number"
                    value={editForm.ordine}
                    onChange={e => setEditForm(prev => ({ ...prev, ordine: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full sm:w-16 p-2 text-xs sm:text-sm border-b border-slate-200 outline-none font-bold text-center bg-transparent"
                    placeholder="Ordine"
                  />
                </div>

                <div className="flex flex-col gap-1.5 bg-[#fcfaf7] p-2.5 rounded-lg border border-slate-50 min-w-0">
                  <input
                    type="text"
                    value={editForm.venditore}
                    placeholder="Produttore di Origine"
                    onChange={e => setEditForm(prev => ({ ...prev, venditore: e.target.value }))}
                    className="p-1 text-xs bg-transparent border-b border-slate-200 outline-none font-mono uppercase tracking-widest text-slate-600"
                  />
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {PRODUTTORI_LIST.map((p, idx) => (
                      <button
                        key={`prod-edit-${f.id}-${idx}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, venditore: p }))}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-bold uppercase text-slate-500 hover:border-emerald-500 transition-all truncate max-w-full"
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
                    className="p-1 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600 mt-1"
                  />

                  <input
                    type="text"
                    value={editForm.note}
                    placeholder="Note..."
                    onChange={e => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                    className="p-1 text-xs bg-transparent border-b border-slate-200 outline-none text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleUpdate(f.id)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Check size={14} /> Salva
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                  <GripVertical size={16} className="text-slate-300 cursor-ns-resize mt-1 shrink-0 hidden sm:block" />
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-500 shrink-0 border border-slate-100">
                    #{f.ordine}
                  </div>
                  <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">{f.nome}</span>
                      <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 shrink-0">
                        {f.numero_piante || 0} viti
                      </span>
                    </div>
                    {f.venditore && (
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded inline-block w-fit truncate max-w-full">
                        Origine: {f.venditore}
                      </span>
                    )}
                    {f.descrizione && (
                      <p className="text-[11px] text-slate-500 font-medium truncate block">{f.descrizione}</p>
                    )}
                    {f.note && (
                      <p className="text-[10px] text-amber-800 bg-amber-50/50 p-1.5 rounded border border-amber-100 mt-0.5 font-medium break-words">
                        Nota: {f.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => startEdit(f)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFilare(f.id)}
                    className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
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