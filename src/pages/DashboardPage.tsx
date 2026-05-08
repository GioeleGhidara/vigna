import { usePiante } from '@/hooks/usePiante';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { piante, isLoading: loadingPiante } = usePiante();
  const { tipi, isLoading: loadingTipi } = useTipiPianta();

  const { data: totaleOperazioni = 0 } = useQuery({
    queryKey: ['totale_operazioni'],
    queryFn: async () => {
      const { count } = await supabase.from('operazioni').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  if (loadingPiante || loadingTipi) {
    return <div className="p-8 text-slate-500 flex justify-center items-center h-full">Caricamento statistiche...</div>;
  }

  const attive = piante.filter(p => p.stato === 'attiva').length;
  const morte = piante.filter(p => p.stato === 'morta').length;
  const ripiantate = piante.filter(p => p.stato === 'ripiantata').length;

  const countByTipo = piante.reduce((acc, p) => {
    acc[p.tipo_id] = (acc[p.tipo_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="p-4 lg:p-8 bg-slate-50 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cruscotto Statistiche</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Totale Piante</div>
          <div className="text-3xl font-bold text-slate-900 mt-1">{piante.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-sm text-emerald-600 font-medium">Piante Attive</div>
          <div className="text-3xl font-bold text-emerald-700 mt-1">{attive}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm">
          <div className="text-sm text-red-600 font-medium">Da Ripiantare (Morte)</div>
          <div className="text-3xl font-bold text-red-700 mt-1">{morte}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-sm text-blue-600 font-medium">Totale Operazioni</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">{totaleOperazioni}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Composizione Vigneto</h2>
        <div className="space-y-4">
          {tipi.map(t => {
            const count = countByTipo[t.id] || 0;
            if (count === 0) return null;
            
            const perc = piante.length > 0 ? Math.round((count / piante.length) * 100) : 0;
            return (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full shadow-inner shrink-0" style={{ backgroundColor: t.colore_hex }} />
                <div className="w-32 sm:w-40 font-medium text-slate-700 truncate" title={t.nome}>{t.nome}</div>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${perc}%`, backgroundColor: t.colore_hex }} />
                </div>
                <div className="w-16 text-right text-sm text-slate-500">{count} pz</div>
                <div className="w-12 text-right text-sm font-semibold text-slate-700">{perc}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
