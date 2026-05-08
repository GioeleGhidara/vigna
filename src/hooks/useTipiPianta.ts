import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { TipoPianta } from '@/types';

export const useTipiPianta = () => {
  const { data: tipi = [], isLoading } = useQuery({
    queryKey: ['tipi_pianta'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tipi_pianta').select('*');
      if (error) throw error;
      return data as TipoPianta[];
    },
    staleTime: Infinity,
  });

  // Lookup map per rendering super veloce in mappa: tipoId -> TipoPianta
  const tipiMap = Object.fromEntries(tipi.map(t => [t.id, t]));

  return { tipi, tipiMap, isLoading };
};
