import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { get, set, del } from 'idb-keyval';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000, // 1 ora di cache valida
      gcTime: 1000 * 60 * 60 * 24, // Mantieni in memoria per 24 ore
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Persister personalizzato usando idb-keyval per IndexedDB
const idbPersister = {
  persistClient: async (client: any) => {
    await set('vigna-query-cache', client);
  },
  restoreClient: async () => {
    return await get('vigna-query-cache');
  },
  removeClient: async () => {
    await del('vigna-query-cache');
  },
};

persistQueryClient({
  queryClient,
  persister: idbPersister as any,
  maxAge: 1000 * 60 * 60 * 24, // 24 ore
});

