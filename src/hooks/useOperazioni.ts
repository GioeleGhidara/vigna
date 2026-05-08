import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Operazione, OperazioneInput } from '@/types';

export const useOperazioni = (piantaId?: string) => {
  const qc = useQueryClient();
  const queryKey = ['operazioni', piantaId];

  const { data: operazioni = [], isLoading } = useQuery({
    queryKey,
    enabled: !!piantaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operazioni')
        .select('*')
        .eq('pianta_id', piantaId!)
        .order('data', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Operazione[];
    },
  });

  const { mutateAsync: createOperazione } = useMutation({
    mutationFn: (data: OperazioneInput) =>
      supabase.from('operazioni').insert(data).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: deleteOperazione } = useMutation({
    mutationFn: (id: number) =>
      supabase.from('operazioni').delete().eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const { mutateAsync: updateOperazione } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OperazioneInput> }) =>
      supabase.from('operazioni').update(data).eq('id', id).throwOnError(),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return { operazioni, isLoading, createOperazione, deleteOperazione, updateOperazione };
};
