import React, { useState } from 'react';
import {
  Scissors, Droplets, Leaf, Wine, Eye, Link2,
  Check, X, Sparkles, AlertCircle
} from 'lucide-react';

// 1. Configurazioni visive ed ergonomiche per le operazioni principali
const TIPI_OPERAZIONE = [
  { id: 'Potatura', label: 'Potatura', icon: Scissors, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'Trattamento', label: 'Trattamento', icon: Droplets, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'Gestione Verde', label: 'Gestione Verde', icon: Leaf, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'Legatura', label: 'Legatura', icon: Link2, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'Vendemmia', label: 'Vendemmia', icon: Wine, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'Controllo', label: 'Controllo', icon: Eye, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
];

// 2. Suggerimenti rapidi contestuali per azzerare la digitazione manuale
const SUGGERIMENTI_PRODOTTI: Record<string, string[]> = {
  'Potatura': ['Guyot', 'Cordone Speronato', 'Pulizia secco', 'Spollonatura'],
  'Trattamento': ['Rame e Zolfo', 'Zolfo bagnabile', 'Induttore di resistenza', 'Trattamento biologico'],
  'Gestione Verde': ['Cimatura', 'Sfogliatura zona grappolo', 'Scacchiatura', 'Diradamento grappoli'],
  'Legatura': ['Legatura tralci', 'Sostituzione fili', 'Manutenzione pali'],
  'Vendemmia': ['Raccolta manuale box', 'Selezione grappoli', 'Vendemmia tardiva'],
  'Controllo': ['Monitoraggio oidio/peronospora', 'Controllo stress idrico', 'Campionamento maturazione']
};

interface Props {
  piantaId: string;
  onClose: () => void;
  onSubmit: (data: {
    pianta_id: string;
    tipo: string;
    data: string;
    descrizione: string;
    note_aggiuntive: string;
    foto_url: string;
  }) => Promise<void>;
}

export default function OperazioneFormModal({ piantaId, onClose, onSubmit }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inizializziamo il form con valori di default robusti
  const [form, setForm] = useState({
    tipo: 'Trattamento',
    data: new Date().toISOString().split('T')[0],
    descrizione: '',
    note_aggiuntive: '',
    foto_url: ''
  });

  // Impostazione rapida per le date "Oggi" e "Ieri"
  const handleQuickDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    setForm(prev => ({ ...prev, data: d.toISOString().split('T')[0] }));
  };

  // Aggiunta rapida dei tag suggeriti alla descrizione
  const handleAddSuggestion = (tag: string) => {
    setForm(prev => ({
      ...prev,
      descrizione: prev.descrizione ? `${prev.descrizione}, ${tag}` : tag
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tipo || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      await onSubmit({
        pianta_id: piantaId,
        tipo: form.tipo,
        data: form.data,
        descrizione: form.descrizione.trim(),
        note_aggiuntive: form.note_aggiuntive.trim(),
        foto_url: form.foto_url.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio dell’operazione.');
      setIsProcessing(false);
    }
  };

  const suggerimentiAttuali = SUGGERIMENTI_PRODOTTI[form.tipo] || [];

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#fcfaf7] w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800">
              <Sparkles size={18} />
              <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight italic">Nuovo Intervento</h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Registrazione rapida da campo
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* BODY (Scorrevole) */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1">

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SEZIONE 1: Tipo di Intervento (Griglia ad alta accessibilità) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
              1. Seleziona Attività
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIPI_OPERAZIONE.map(opt => {
                const isSelected = form.tipo === opt.id;
                const Icona = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, tipo: opt.id }))}
                    className={`p-4 rounded-2xl border flex flex-col items-start gap-3 transition-all min-h-[80px] justify-between active:scale-95 ${isSelected
                        ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900'
                        : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200'
                      }`}
                  >
                    <div className={`p-2 rounded-xl ${opt.bg} ${opt.color}`}>
                      <Icona size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 tracking-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEZIONE 2: Data Intervento (Pulsanti rapidi Oggi/Ieri) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
              2. Data Esecuzione
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={form.data}
                onChange={e => setForm(prev => ({ ...prev, data: e.target.value }))}
                className="flex-1 bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 h-14"
              />
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors h-14 shrink-0"
              >
                Oggi
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(-1)}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors h-14 shrink-0"
              >
                Ieri
              </button>
            </div>
          </div>

          {/* SEZIONE 3: Descrizione e Suggerimenti Rapidi */}
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                3. Dettagli / Prodotti
              </label>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Tocca per aggiungere
              </span>
            </div>

            {/* Pillole contestuali in base all'attività scelta */}
            {suggerimentiAttuali.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {suggerimentiAttuali.map(sugg => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => handleAddSuggestion(sugg)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-800 transition-all active:scale-95 shadow-sm"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Inserisci note aggiuntive, dosaggi o descrizioni..."
              value={form.descrizione}
              onChange={e => setForm(prev => ({ ...prev, descrizione: e.target.value }))}
              className="w-full bg-white border border-slate-100 p-4 text-sm font-medium rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 resize-none"
            />
          </div>

          {/* FOOTER AZIONI */}
          <footer className="pt-4 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors h-14"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-950 transition-all disabled:opacity-50 flex items-center justify-center gap-2 h-14"
            >
              <Check size={18} />
              {isProcessing ? 'Registrazione...' : 'Salva Operazione'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}