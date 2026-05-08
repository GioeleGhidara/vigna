import { useState } from 'react';
import { useOperazioni } from '@/hooks/useOperazioni';
import { TIPI_OPERAZIONE } from '@/constants/operazioni';
import type { TipoOperazione } from '@/constants/operazioni';
import { Button } from '@/components/ui/button';
import type { OperazioneInput } from '@/types';

interface Props {
  piantaId: string;
  onClose: () => void;
}

export default function OperazioneFormModal({ piantaId, onClose }: Props) {
  const { createOperazione } = useOperazioni(piantaId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [tipo, setTipo] = useState<TipoOperazione>('potatura');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [descrizione, setDescrizione] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const input: OperazioneInput = {
      pianta_id: piantaId,
      tipo,
      data,
      descrizione: descrizione.trim() || undefined,
    };

    try {
      await createOperazione(input);
      onClose(); // Chiude la modale al successo
    } catch (err: any) {
      setError(err.message || "Errore durante il salvataggio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Aggiungi Operazione</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select
              required
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoOperazione)}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            >
              {TIPI_OPERAZIONE.map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrizione (opzionale)</label>
            <textarea
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Aggiungi note su prodotto usato o dettagli..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
