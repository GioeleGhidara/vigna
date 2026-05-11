import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { POI, POIInput } from '@/types';

const QUERY_KEY = 'poi';

export const usePOI = () => {
  const qc = useQueryClient();

  const { data: poi = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('punti_interesse')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data as POI[];
    },
  });

  const { mutateAsync: createPOI } = useMutation({
    mutationFn: (data: POIInput) => supabase.from('punti_interesse').insert(data).throwOnError(),
    onMutate: async (newPOI) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<POI[]>([QUERY_KEY]);
      qc.setQueryData<POI[]>([QUERY_KEY], old => [...(old || []), { ...newPOI, id: Math.random().toString() } as POI]);
      return { previous };
    },
    onError: (err, variables, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: updatePOI } = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<POI> }) => 
      supabase.from('punti_interesse').update(data).eq('id', id).throwOnError(),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<POI[]>([QUERY_KEY]);
      qc.setQueryData<POI[]>([QUERY_KEY], old => old?.map(p => p.id === id ? { ...p, ...data } : p));
      return { previous };
    },
    onError: (err, variables, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: deletePOI } = useMutation({
    mutationFn: (id: string) => supabase.from('punti_interesse').delete().eq('id', id).throwOnError(),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<POI[]>([QUERY_KEY]);
      qc.setQueryData<POI[]>([QUERY_KEY], old => old?.filter(p => p.id !== id));
      return { previous };
    },
    onError: (err, id, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { poi, isLoading, createPOI, updatePOI, deletePOI };
};
