import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { TipoPianta } from '@/types';

const QUERY_KEY = 'tipi_pianta';

export const useTipiPianta = () => {
  const qc = useQueryClient();

  const { data: tipi = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase.from('tipi_pianta').select('*');
      if (error) throw error;
      return data as TipoPianta[];
    },
    staleTime: Infinity,
  });

  const tipiMap = Object.fromEntries(tipi.map((t) => [t.id, t]));

  const { mutateAsync: createTipo } = useMutation({
    mutationFn: (data: Partial<TipoPianta>) => 
      supabase.from('tipi_pianta').insert(data).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: updateTipo } = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<TipoPianta> }) => 
      supabase.from('tipi_pianta').update(data).eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: deleteTipo } = useMutation({
    mutationFn: (id: number) => 
      supabase.from('tipi_pianta').delete().eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { tipi, tipiMap, isLoading, createTipo, updateTipo, deleteTipo };
};
