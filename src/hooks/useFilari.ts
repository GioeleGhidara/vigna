import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Filare } from '@/types';

export const useFilari = () => {
  const { data: filari = [], isLoading } = useQuery({
    queryKey: ['filari'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filari')
        .select('*')
        .order('ordine');
      if (error) throw error;
      return data as Filare[];
    },
    staleTime: Infinity,   // i filari cambiano molto raramente
  });

  return { filari, isLoading };
};
