import { useState } from 'react';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { MapPin, List, ChevronRight } from 'lucide-react';
import type { Pianta } from '@/types';
import { STATI_PIANTA, PRODUTTORI_LIST, ANNO_CORRENTE } from '@/constants/registry';

interface Props {
  initialData?: Partial<Pianta>;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  title: string;
}

export function PiantaForm({ initialData, onSubmit, onClose, title }: Props) {
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    codice_etichetta: initialData?.codice_etichetta ?? '',
    filare_id: initialData?.filare_id ?? (filari[0]?.id || 0),
    tipo_id: initialData?.tipo_id ?? (tipi[0]?.id || 0),
    stato: initialData?.stato ?? 'attiva',
    posizione_nel_filare: initialData?.posizione_nel_filare ?? 1,
    coord_x: initialData?.coord_x ?? null,
    coord_y: initialData?.coord_y ?? null,
    anno_impianto: initialData?.anno_impianto ?? ANNO_CORRENTE,
    porta_innesto: initialData?.porta_innesto ?? '',
    note: initialData?.note ?? '',
    venditore: initialData?.venditore ?? '',
  });

  const [placementMode, setPlacementMode] = useState<'line' | 'free'>(
    initialData?.coord_x != null ? 'free' : 'line'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalData = {
        ...form,
        // Puliamo i campi in base alla modalità
        posizione_nel_filare: placementMode === 'line' ? form.posizione_nel_filare : null,
        coord_x: placementMode === 'free' ? form.coord_x : null,
        coord_y: placementMode === 'free' ? form.coord_y : null,
      };
      await onSubmit(finalData);
      onClose();
    } catch (err) {
      alert("Errore durante il salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#fcfaf7] rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden noise-bg border border-white">
        
        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-black text-slate-900 italic">{title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anagrafica Vite</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Codice & Filare */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Codice Etichetta (Campo)</label>
                <input 
                  type="text" 
                  value={form.codice_etichetta}
                  onChange={e => setForm({...form, codice_etichetta: e.target.value})}
                  className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 uppercase"
                  placeholder="es. F1-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filare di appartenenza</label>
                <select 
                  value={form.filare_id}
                  onChange={e => setForm({...form, filare_id: parseInt(e.target.value)})}
                  className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
                >
                  {filari.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </div>
            </div>

            {/* Varietà & Stato */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varietà d'Uva</label>
                <select 
                  value={form.tipo_id}
                  onChange={e => setForm({...form, tipo_id: parseInt(e.target.value)})}
                  className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800 appearance-none"
                >
                  {tipi.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stato della Salute</label>
                <div className="flex gap-2">
                  {STATI_PIANTA.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm({...form, stato: s.id as any})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${form.stato === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                    >
                      {s.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Positioning System */}
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-heading font-black text-slate-900">Sistema di Posizionamento</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setPlacementMode('line')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${placementMode === 'line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  <List size={12} /> In Linea
                </button>
                <button 
                  type="button"
                  onClick={() => setPlacementMode('free')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${placementMode === 'free' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  <MapPin size={12} /> Libera
                </button>
              </div>
            </header>

            <div className="bg-white/50 p-8 rounded-[2rem] border border-slate-50 shadow-inner">
              {placementMode === 'line' ? (
                <div className="flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordine nel filare</label>
                    <input 
                      type="number" 
                      value={form.posizione_nel_filare || ''}
                      onChange={e => setForm({...form, posizione_nel_filare: parseInt(e.target.value)})}
                      className="w-full bg-white border border-slate-100 p-4 text-xl font-heading font-black rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                      placeholder="es. 12"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800">
                    <ChevronRight size={24} />
                  </div>
                  <div className="flex-1 text-xs text-slate-400 font-medium leading-relaxed">
                    La posizione verrà calcolata automaticamente sulla riga del filare selezionato.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coord. X</label>
                    <input 
                      type="number" 
                      value={form.coord_x || ''}
                      onChange={e => setForm({...form, coord_x: parseInt(e.target.value)})}
                      className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coord. Y</label>
                    <input 
                      type="number" 
                      value={form.coord_y || ''}
                      onChange={e => setForm({...form, coord_y: parseInt(e.target.value)})}
                      className="w-full bg-white border border-slate-100 p-4 text-sm font-mono font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dati Tecnici */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anno Impianto</label>
              <input 
                type="number" 
                value={form.anno_impianto || ''}
                onChange={e => setForm({...form, anno_impianto: parseInt(e.target.value)})}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portainnesto</label>
              <input 
                type="text" 
                value={form.porta_innesto}
                onChange={e => setForm({...form, porta_innesto: e.target.value})}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                placeholder="es. 1103 P."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Produttore / Vivaio (Specifica per questa pianta)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRODUTTORI_LIST.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({...form, venditore: p})}
                    className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500 hover:text-emerald-700 transition-all"
                  >
                    {p.split(' ')[0]}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                value={form.venditore || ''}
                onChange={e => setForm({...form, venditore: e.target.value})}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                placeholder="Lascia vuoto per usare il produttore del filare..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annotazioni</label>
              <textarea 
                value={form.note}
                onChange={e => setForm({...form, note: e.target.value})}
                rows={3}
                className="w-full bg-white border border-slate-100 p-4 text-sm font-medium rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-800"
                placeholder="Aggiungi dettagli extra..."
              />
            </div>
          </div>

          <footer className="pt-8 flex gap-4">
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
              className="flex-[2] py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-900 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Salvataggio...' : 'Conferma Dati'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
