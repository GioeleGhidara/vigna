import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Filare } from '@/types';

const QUERY_KEY = 'filari';

export const useFilari = () => {
  const qc = useQueryClient();

  const { data: filari = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filari')
        .select('*')
        .order('ordine');
      if (error) throw error;
      return data as Filare[];
    },
    staleTime: Infinity,
  });

  const { mutateAsync: createFilare } = useMutation({
    mutationFn: async (data: Partial<Filare>) => {
      await supabase.from('filari').insert(data).throwOnError();
    },
    onMutate: async (newFilare) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Filare[]>([QUERY_KEY]);
      qc.setQueryData<Filare[]>([QUERY_KEY], old => [...(old || []), { ...newFilare, id: Math.random() } as Filare]);
      return { previous };
    },
    onError: (_err, _newFilare, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: updateFilare } = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Filare> }) => {
      await supabase.from('filari').update(data).eq('id', id).throwOnError();
    },
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Filare[]>([QUERY_KEY]);
      qc.setQueryData<Filare[]>([QUERY_KEY], old => 
        old?.map(f => f.id === id ? { ...f, ...data } : f)
      );
      return { previous };
    },
    onError: (_err, _variables, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: deleteFilare } = useMutation({
    mutationFn: async (id: number) => {
      await supabase.from('filari').delete().eq('id', id).throwOnError();
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = qc.getQueryData<Filare[]>([QUERY_KEY]);
      qc.setQueryData<Filare[]>([QUERY_KEY], old => old?.filter(f => f.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => qc.setQueryData([QUERY_KEY], context?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { filari, isLoading, createFilare, updateFilare, deleteFilare };
};
