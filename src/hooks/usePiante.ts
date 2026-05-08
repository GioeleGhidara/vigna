import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Pianta, PiantaInput } from '@/types';

const QUERY_KEY = 'piante';

export const usePiante = (filtri?: { filare_id?: number; tipo_id?: number }) => {
  const qc = useQueryClient();

  const { data: piante = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY, filtri],
    queryFn: async () => {
      // Eseguiamo il fetch delle piante con la join alla tabella dei tipi
      let q = supabase.from('piante').select('*, tipo:tipi_pianta(*)');
      
      if (filtri?.filare_id) q = q.eq('filare_id', filtri.filare_id);
      if (filtri?.tipo_id) q = q.eq('tipo_id', filtri.tipo_id);
      
      const { data, error } = await q;
      if (error) throw error;
      return data as Pianta[];
    },
  });

  const { mutateAsync: createPianta } = useMutation({
    mutationFn: (data: PiantaInput) =>
      supabase.from('piante').insert(data).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: updatePianta } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pianta> }) =>
      supabase.from('piante').update(data).eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: deletePianta } = useMutation({
    mutationFn: (id: string) =>
      supabase.from('piante').delete().eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { piante, isLoading, createPianta, updatePianta, deletePianta };
};
