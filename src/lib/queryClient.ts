import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
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

// Persister Asincrono dedicato per IndexedDB (idb-keyval)
const asyncPersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get(key),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
  key: 'vigna-query-cache',
});

persistQueryClient({
  queryClient,
  persister: asyncPersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 ore
});
