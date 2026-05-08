import { useState } from 'react';
import MapCanvas from '@/components/map/MapCanvas';
import PiantaCard from '@/components/pianta/PiantaCard';
import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string>();
  const [repositioningId, setRepositioningId] = useState<string | null>(null);
  const [filtri, setFiltri] = useState<{ filare_id?: number; tipo_id?: number }>({});

  const setFiltro = <K extends keyof typeof filtri>(k: K, v: string) =>
    setFiltri(f => ({ ...f, [k]: v ? Number(v) : undefined }));

  const { filari, isLoading: loadingFilari } = useFilari();
  const { tipi, tipiMap, isLoading: loadingTipi } = useTipiPianta();
  const { piante, isLoading: loadingPiante, updatePianta, deletePianta } = usePiante(filtri);

  const handleReposition = async (id: string, x: number, y: number) => {
    try {
      await updatePianta({ id, data: { coord_x: x, coord_y: y } });
      setRepositioningId(null);
    } catch (e) {
      alert("Errore durante il salvataggio della posizione");
    }
  };

  const selectedPianta = piante.find(p => p.id === selectedId);

  if (loadingFilari || loadingTipi || loadingPiante) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><p className="text-slate-500">Caricamento vigneto...</p></div>;
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Sidebar sx: filtri */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 p-5 gap-6 shrink-0 bg-slate-50/50">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vigneto App</h1>
          <p className="text-sm text-slate-500 mt-1">Gestione e inventario piante</p>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-slate-800">Filtra per Filare</h2>
          <select 
            className="w-full p-2 text-sm border rounded-md bg-white"
            value={filtri.filare_id || ''}
            onChange={(e) => setFiltro('filare_id', e.target.value)}
          >
            <option value="">Tutti i filari</option>
            {filari.map(f => (
              <option key={f.id} value={f.id}>{f.nome} ({f.numero_piante} piante)</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-slate-800">Filtra per Tipo</h2>
          <select 
            className="w-full p-2 text-sm border rounded-md bg-white"
            value={filtri.tipo_id || ''}
            onChange={(e) => setFiltro('tipo_id', e.target.value)}
          >
            <option value="">Tutti i tipi</option>
            {tipi.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Centro: mappa */}
      <main className="flex-1 overflow-hidden p-4 relative bg-slate-100">
        <MapCanvas
          filari={filari}
          piante={piante}
          tipiMap={tipiMap}
          selectedId={selectedId}
          onSelect={setSelectedId}
          repositioningId={repositioningId}
          onReposition={handleReposition}
        />
        {/* Helper per capire che la mappa è vuota */}
        {piante.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-400 font-medium">Nessuna pianta trovata.</p>
          </div>
        )}
      </main>

      {/* Sidebar dx: dettaglio pianta */}
      {selectedPianta && (
        <aside className="hidden lg:block w-80 border-l border-slate-200 shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
          <PiantaCard
            pianta={selectedPianta}
            tipo={tipiMap[selectedPianta.tipo_id]}
            isRepositioning={repositioningId === selectedPianta.id}
            onStartReposition={() => setRepositioningId(selectedPianta.id)}
            onCancelReposition={() => setRepositioningId(null)}
            onDelete={async () => {
              if (confirm("Vuoi davvero eliminare questa pianta?")) {
                await deletePianta(selectedPianta.id);
                setSelectedId(undefined);
              }
            }}
            onClose={() => {
              setSelectedId(undefined);
              setRepositioningId(null);
            }}
          />
        </aside>
      )}
    </div>
  );
}
