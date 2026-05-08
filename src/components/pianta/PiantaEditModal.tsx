import { useState } from 'react';
import { usePiante } from '@/hooks/usePiante';
import { Button } from '@/components/ui/button';
import type { Pianta } from '@/types';

interface Props {
  pianta: Pianta;
  onClose: () => void;
}

export default function PiantaEditModal({ pianta, onClose }: Props) {
  const { updatePianta } = usePiante();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state unificato
  const [form, setForm] = useState({
    stato: pianta.stato,
    anno_impianto: pianta.anno_impianto?.toString() ?? '',
    porta_innesto: pianta.porta_innesto ?? '',
    note: pianta.note ?? '',
  });

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updatePianta({
        id: pianta.id,
        data: {
          stato: form.stato,
          anno_impianto: form.anno_impianto ? parseInt(form.anno_impianto, 10) : undefined,
          porta_innesto: form.porta_innesto.trim() || undefined,
          note: form.note.trim() || undefined,
        }
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Modifica Pianta {pianta.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stato Pianta</label>
            <select
              value={form.stato}
              onChange={(e) => set('stato', e.target.value as any)}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="attiva">🟢 Attiva</option>
              <option value="morta">🔴 Morta</option>
              <option value="ripiantata">🟡 Ripiantata</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Anno Impianto</label>
              <input
                type="number"
                value={form.anno_impianto}
                onChange={(e) => set('anno_impianto', e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                placeholder="es. 2023"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Porta Innesto</label>
              <input
                type="text"
                value={form.porta_innesto}
                onChange={(e) => set('porta_innesto', e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 text-sm"
                placeholder="es. 110 Richter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note (opzionale)</label>
            <textarea
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-md p-2 text-sm"
              placeholder="Segnala problemi, rimpiazzi futuri..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
