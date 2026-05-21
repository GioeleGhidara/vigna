import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapCanvas from '@/components/map/MapCanvas';
import PiantaCard from '@/components/pianta/PiantaCard';
import POIQuickMenu from '@/components/poi/POIQuickMenu';
import POIFormModal from '@/components/poi/POIFormModal';
import PiantaEditModal from '@/components/pianta/PiantaEditModal';
import FilterSidebar from '@/components/map/FilterSidebar';
import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { usePOI } from '@/hooks/usePOI';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Check, Undo2, X } from 'lucide-react';
import { calcCoords } from '@/lib/mapUtils';

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string>();
  const [repositioningId, setRepositioningId] = useState<string | null>(null);
  const [previewCoords, setPreviewCoords] = useState<{x: number, y: number}[]>([]);
  const [filtri, setFiltri] = useState<{ filare_id?: number; tipo_id?: number }>({});
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);
  const [editingPianta, setEditingPianta] = useState<any>(null);
  const [editingPOI, setEditingPOI] = useState<any>(null);
  const [colorMode, setColorMode] = useState<'variety' | 'health'>('variety');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const repoId = searchParams.get('reposition');
    if (repoId) {
      setRepositioningId(repoId);
      searchParams.delete('reposition');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { filari, isLoading: loadingFilari } = useFilari();
  const { tipi, tipiMap, isLoading: loadingTipi } = useTipiPianta();
  const { piante, isLoading: loadingPiante, updatePianta, deletePianta } = usePiante(filtri);
  const { poi, isLoading: loadingPOI, createPOI, updatePOI } = usePOI();

  const filariMap = Object.fromEntries(filari.map(f => [f.id, f]));

  const handleMapClickForReposition = (_id: string, x: number, y: number) => {
    setPreviewCoords(prev => [...prev, { x, y }]);
  };

  const confirmSaveReposition = async () => {
    if (!repositioningId || previewCoords.length === 0) {
      setRepositioningId(null);
      setPreviewCoords([]);
      return;
    }
    
    const currentPreview = previewCoords[previewCoords.length - 1];
    
    try {
      const isPOI = poi.some(p => p.id === repositioningId);
      if (isPOI) {
        await updatePOI({ id: repositioningId, data: { coord_x: currentPreview.x, coord_y: currentPreview.y } });
      } else {
        await updatePianta({ id: repositioningId, data: { coord_x: currentPreview.x, coord_y: currentPreview.y } });
      }
      setRepositioningId(null);
      setPreviewCoords([]);
      setSelectedId(undefined);
    } catch (err) {
      alert("Errore nel salvataggio della nuova posizione");
    }
  };

  const selectedPianta = piante.find(p => p.id === selectedId);
  const selectedPOI = poi.find(p => p.id === selectedId);
  const currentPreview = previewCoords.length > 0 ? previewCoords[previewCoords.length - 1] : null;

    if (loadingFilari || loadingTipi || loadingPiante || loadingPOI) return null;

    return (
      <>
      <div className="flex h-full w-full overflow-hidden bg-transparent lg:p-6 lg:pt-0 gap-10 relative">
        
        {!selectedPianta && !selectedPOI && (
          <FilterSidebar 
            filtri={filtri}
            setFiltri={setFiltri}
            colorMode={colorMode}
            setColorMode={setColorMode}
            filari={filari}
            tipi={tipi}
            onOpenPOIModal={() => setIsPOIModalOpen(true)}
            isMobileOpen={isFilterMobileOpen}
            setIsMobileOpen={setIsFilterMobileOpen}
          />
        )}

      {/* Main Map */}
      <main className="flex-1 relative lg:rounded-[2.5rem] overflow-hidden">
        <MapCanvas
          filari={filari}
          piante={piante}
          tipiMap={tipiMap}
          poi={poi}
          selectedId={selectedId}
          onSelect={setSelectedId}
          repositioningId={repositioningId}
          previewCoords={currentPreview}
          onReposition={handleMapClickForReposition}
          colorMode={colorMode}
        />
      </main>

      {/* Detail Panel: Desktop (Sidebar) vs Mobile (Bottom Sheet) for Piante */}
      <AnimatePresence>
        {selectedPianta && !repositioningId && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedId(undefined)}
              className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[70]"
            />
            
            <motion.aside 
              initial={window.innerWidth < 1024 ? { y: "100%" } : { x: 400, opacity: 0 }}
              animate={window.innerWidth < 1024 ? { y: 0 } : { x: 0, opacity: 1 }}
              exit={window.innerWidth < 1024 ? { y: "100%" } : { x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 180 }}
              className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:w-[450px] glass-panel rounded-t-[3rem] lg:rounded-[3rem] p-8 lg:p-10 z-[80] lg:z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-glass overflow-y-auto max-h-[85vh] lg:max-h-[calc(100vh-8rem)]"
            >
              {/* Mobile handle indicator */}
              <div className="lg:hidden w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              
              <PiantaCard
                pianta={selectedPianta}
                tipo={tipiMap[selectedPianta.tipo_id]}
                filareNome={filariMap[selectedPianta.filare_id]?.nome}
                filareVenditore={filariMap[selectedPianta.filare_id]?.venditore}
                coords={
                  selectedPianta.coord_x != null && selectedPianta.coord_y != null 
                    ? { x: selectedPianta.coord_x, y: selectedPianta.coord_y }
                    : (filariMap[selectedPianta.filare_id] 
                        ? calcCoords(filariMap[selectedPianta.filare_id], selectedPianta.posizione_nel_filare) 
                        : undefined)
                }
                isRepositioning={repositioningId === selectedPianta.id}
                onStartReposition={() => setRepositioningId(selectedPianta.id)}
                onCancelReposition={() => setRepositioningId(null)}
                onDelete={async () => {
                  if (confirm("Vuoi davvero eliminare questa pianta?")) {
                    await deletePianta(selectedPianta.id);
                    setSelectedId(undefined);
                  }
                }}
                onEdit={() => setEditingPianta(selectedPianta)}
                onClose={() => {
                  setSelectedId(undefined);
                  setRepositioningId(null);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* POI Quick Menu (Centered Modal) */}
      <AnimatePresence>
        {selectedPOI && !repositioningId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedId(undefined);
            }}
          >
             <POIQuickMenu 
               poi={selectedPOI}
               onClose={() => setSelectedId(undefined)}
               onMove={() => setRepositioningId(selectedPOI.id)}
               onEdit={() => {
                 setEditingPOI(selectedPOI);
                 setSelectedId(undefined);
               }}
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Banner for Repositioning */}
      <AnimatePresence>
        {repositioningId && (
          <motion.div 
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -50, opacity: 0 }}
             className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-white/10"
          >
             <span className="text-sm font-bold text-white mr-2 hidden sm:block">
               {previewCoords.length > 0 ? 'Confermare posizione?' : 'Tocca la mappa per spostare'}
             </span>
             
             {/* 1. Conferma */}
             <button 
                onClick={confirmSaveReposition}
                disabled={previewCoords.length === 0}
                className="px-4 py-2 bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
             >
               <Check size={14} /> Conferma
             </button>

             {/* 2. Indietro (Undo) */}
             <button 
                onClick={() => setPreviewCoords(prev => prev.slice(0, -1))}
                disabled={previewCoords.length === 0}
                className="px-3 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Annulla ultimo movimento"
             >
               <Undo2 size={16} />
             </button>

             {/* 3. Annulla (X) */}
             <button 
                onClick={() => {
                  setRepositioningId(null);
                  setPreviewCoords([]);
                }} 
                className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                title="Annulla"
             >
               <X size={16} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {(isPOIModalOpen || editingPOI) && (
      <POIFormModal 
        poi={editingPOI || undefined}
        onClose={() => { setIsPOIModalOpen(false); setEditingPOI(null); }}
        onSubmit={async (data) => {
          if (editingPOI) {
            await updatePOI({ id: editingPOI.id, data });
          } else {
            await createPOI(data);
          }
          setIsPOIModalOpen(false);
          setEditingPOI(null);
        }}
      />
    )}

    {editingPianta && (
      <PiantaEditModal 
        pianta={editingPianta}
        onClose={() => setEditingPianta(null)}
      />
    )}
    </>
  );
}
