import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapCanvas from '@/components/map/MapCanvas';
import PiantaCard from '@/components/pianta/PiantaCard';
import POICard from '@/components/poi/POICard';
import POIFormModal from '@/components/poi/POIFormModal';
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
  const [colorMode, setColorMode] = useState<'variety' | 'health'>('variety');

  const { filari, isLoading: loadingFilari } = useFilari();
  const { tipi, tipiMap, isLoading: loadingTipi } = useTipiPianta();
  const { piante, isLoading: loadingPiante, updatePianta, deletePianta } = usePiante(filtri);
  const { poi, isLoading: loadingPOI, updatePOI, deletePOI } = usePOI();

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

  const setFiltro = <K extends keyof typeof filtri>(k: K, v: string) => {
    setFiltri(prev => ({ ...prev, [k]: v === "" ? undefined : parseInt(v) }));
  };

  if (loadingFilari || loadingTipi || loadingPiante || loadingPOI) return null;

  const FilterContent = () => (
    <div className="space-y-8">
      <header className="flex justify-end items-start lg:hidden">
        <button className="p-2" onClick={() => setIsFilterMobileOpen(false)}>
          <X size={20} className="text-slate-400" />
        </button>
      </header>

      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visualizzazione</label>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setColorMode('variety')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${colorMode === 'variety' ? 'bg-white text-slate-900 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Varietà
            </button>
            <button 
              onClick={() => setColorMode('health')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${colorMode === 'health' ? 'bg-white text-emerald-900 shadow-sm scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Salute
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filtra Filare</label>
          <select 
            className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-800 outline-none appearance-none cursor-pointer"
            value={filtri.filare_id || ''}
            onChange={(e) => { setFiltro('filare_id', e.target.value); if (window.innerWidth < 1024) setIsFilterMobileOpen(false); }}
          >
            <option value="">Tutti i Filari</option>
            {filari.map(f => (
              <option key={f.id} value={f.id}>{f.nome.replace(/filare\s*/i, '')}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Varietà</label>
          <select 
            className="w-full bg-white border border-slate-100 p-4 text-sm font-bold rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-800 outline-none appearance-none cursor-pointer"
            value={filtri.tipo_id || ''}
            onChange={(e) => { setFiltro('tipo_id', e.target.value); if (window.innerWidth < 1024) setIsFilterMobileOpen(false); }}
          >
            <option value="">Tutte le Varietà</option>
            {tipi.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
        <div className="pt-4">
          <button 
            onClick={() => setIsPOIModalOpen(true)}
            className="w-full py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
          >
            <Plus size={14} className="text-emerald-800" /> Aggiungi Landmark
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <div className="flex h-full w-full overflow-hidden bg-transparent lg:p-6 lg:pt-0 gap-10 relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 py-8 gap-12 shrink-0">
        <FilterContent />
      </aside>

      {/* Mobile Floating Filter Button */}
      {!selectedPianta && (
        <button 
          onClick={() => setIsFilterMobileOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        >
          <Filter size={24} />
        </button>
      )}

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#fcfaf7] rounded-t-[3rem] p-8 z-[80] shadow-2xl"
            >
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                  onClose={() => {
                    setSelectedId(undefined);
                    setRepositioningId(null);
                  }}
                />
              ) : selectedPOI && (
                <POICard
                  poi={selectedPOI}
                  onUpdate={updatePOI}
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
    </>
  );
}
