import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapCanvas from '@/components/map/MapCanvas';
import PiantaCard from '@/components/pianta/PiantaCard';
import POICard from '@/components/poi/POICard';
import POIFormModal from '@/components/poi/POIFormModal';
import PiantaEditModal from '@/components/pianta/PiantaEditModal';
import FilterSidebar from '@/components/map/FilterSidebar';
import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { usePOI } from '@/hooks/usePOI';
import { Filter, X, Plus } from 'lucide-react';

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string>();
  const [repositioningId, setRepositioningId] = useState<string | null>(null);
  const [filtri, setFiltri] = useState<{ filare_id?: number; tipo_id?: number }>({});
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [isPOIModalOpen, setIsPOIModalOpen] = useState(false);
  const [editingPianta, setEditingPianta] = useState<any>(null);
  const [colorMode, setColorMode] = useState<'variety' | 'health'>('variety');

  const { filari, isLoading: loadingFilari } = useFilari();
  const { tipi, tipiMap, isLoading: loadingTipi } = useTipiPianta();
  const { piante, isLoading: loadingPiante, updatePianta, deletePianta } = usePiante(filtri);
  const { poi, isLoading: loadingPOI, createPOI, updatePOI, deletePOI } = usePOI();

  const filariMap = Object.fromEntries(filari.map(f => [f.id, f]));

  const handleReposition = async (id: string, x: number, y: number) => {
    try {
      const isPOI = poi.some(p => p.id === id);
      if (isPOI) {
        await updatePOI({ id, data: { coord_x: x, coord_y: y } });
      } else {
        await updatePianta({ id, data: { coord_x: x, coord_y: y } });
      }
      setRepositioningId(null);
    } catch (err) {
      alert("Errore nel riposizionamento");
    }
  };

  const selectedPianta = piante.find(p => p.id === selectedId);
  const selectedPOI = poi.find(p => p.id === selectedId);


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
          onReposition={handleReposition}
          colorMode={colorMode}
        />
      </main>

      {/* Detail Panel: Desktop (Sidebar) vs Mobile (Bottom Sheet) */}
      <AnimatePresence>
        {(selectedPianta || selectedPOI) && (
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:w-[450px] bg-white rounded-t-[3rem] lg:rounded-[3rem] p-8 lg:p-10 z-[80] lg:z-10 shadow-2xl lg:shadow-2xl border border-slate-100 overflow-y-auto max-h-[85vh] lg:max-h-none"
            >
              {/* Mobile handle indicator */}
              <div className="lg:hidden w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
              
              {selectedPianta ? (
                <PiantaCard
                  pianta={selectedPianta}
                  tipo={tipiMap[selectedPianta.tipo_id]}
                  filareNome={filariMap[selectedPianta.filare_id]?.nome}
                  filareVenditore={filariMap[selectedPianta.filare_id]?.venditore}
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
              ) : selectedPOI && (
                <POICard
                  poi={selectedPOI}
                  onUpdate={async (id, data) => await updatePOI({ id, data })}
                  onDelete={async (id) => {
                    await deletePOI(id);
                    setSelectedId(undefined);
                  }}
                  onClose={() => {
                    setSelectedId(undefined);
                    setRepositioningId(null);
                  }}
                  isRepositioning={repositioningId === selectedPOI.id}
                  onStartReposition={() => setRepositioningId(selectedPOI.id)}
                  onCancelReposition={() => setRepositioningId(null)}
                />
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>

    {isPOIModalOpen && (
      <POIFormModal 
        onClose={() => setIsPOIModalOpen(false)}
        onSubmit={async (data) => {
          await createPOI(data);
          setIsPOIModalOpen(false);
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
