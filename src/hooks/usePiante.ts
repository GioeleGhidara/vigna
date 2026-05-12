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
    mutationFn: async (data: PiantaInput) => {
      await supabase.from('piante').insert(data).throwOnError();
    },
    onMutate: async (newPianta) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Pianta[]>([QUERY_KEY, filtri]);
      qc.setQueryData<Pianta[]>([QUERY_KEY, filtri], old => [...(old || []), newPianta as Pianta]);
      return { previous };
    },
    onError: (_err, _newPianta, context) => qc.setQueryData([QUERY_KEY, filtri], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: updatePianta } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Pianta> }) => {
      await supabase.from('piante').update(data).eq('id', id).throwOnError();
    },
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Pianta[]>([QUERY_KEY, filtri]);
      qc.setQueryData<Pianta[]>([QUERY_KEY, filtri], old => 
        old?.map(p => p.id === id ? { ...p, ...data } : p)
      );
      return { previous };
    },
    onError: (_err, _variables, context) => qc.setQueryData([QUERY_KEY, filtri], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: deletePianta } = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('piante').delete().eq('id', id).throwOnError();
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Pianta[]>([QUERY_KEY, filtri]);
      qc.setQueryData<Pianta[]>([QUERY_KEY, filtri], old => old?.filter(p => p.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => qc.setQueryData([QUERY_KEY, filtri], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { piante, isLoading, createPianta, updatePianta, deletePianta };
};
