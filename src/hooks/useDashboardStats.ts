import { usePiante } from './usePiante';
import { useTipiPianta } from './useTipiPianta';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useDashboardStats() {
  const { piante, isLoading: loadingPiante } = usePiante();
  const { tipi, isLoading: loadingTipi } = useTipiPianta();

  const { data: totaleOperazioni = 0, isLoading: loadingOp } = useQuery({
    queryKey: ['totale_operazioni'],
    queryFn: async () => {
      const { count } = await supabase
        .from('operazioni')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const statoPiante = piante.reduce(
    (acc, p) => { acc[p.stato]++; return acc; },
    { attiva: 0, morta: 0, ripiantata: 0 }
  );

  const countByTipo = piante.reduce((acc, p) => {
    acc[p.tipo_id] = (acc[p.tipo_id] ?? 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    piante,
    tipi,
    totaleOperazioni,
    statoPiante,
    countByTipo,
    isLoading: loadingPiante || loadingTipi || loadingOp,
  };
}
