import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/dashboard/StatCard';
import { TipoBar } from '@/components/dashboard/TipoBar';

export default function DashboardPage() {
  const { piante, tipi, totaleOperazioni, statoPiante, countByTipo, isLoading } = useDashboardStats();

  if (isLoading)
    return <div className="flex h-full items-center justify-center text-slate-500">Caricamento statistiche...</div>;

  const tipiConPiante = tipi.filter(t => countByTipo[t.id]);

  return (
    <div className="p-4 lg:p-8 bg-slate-50 h-full overflow-y-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Cruscotto</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Totale Piante"    value={piante.length}       />
        <StatCard label="Attive"           value={statoPiante.attiva}  color="emerald" />
        <StatCard label="Morte"            value={statoPiante.morta}   color="red"     />
        <StatCard label="Ripiantate"       value={statoPiante.ripiantata} color="amber" />
        <StatCard label="Tot. Operazioni"  value={totaleOperazioni}    color="blue"    />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Composizione Vigneto</h2>
        <div className="space-y-4">
          {tipiConPiante.map(t => (
            <TipoBar key={t.id} tipo={t} count={countByTipo[t.id]} totale={piante.length} />
          ))}
        </div>
      </div>
    </div>
  );
}
