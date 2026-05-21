import { Filter, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TipoPianta, Filare } from '@/types';

interface Props {
  filtri: { filare_id?: number; tipo_id?: number };
  setFiltri: React.Dispatch<React.SetStateAction<{ filare_id?: number; tipo_id?: number }>>;
  colorMode: 'variety' | 'health';
  setColorMode: (mode: 'variety' | 'health') => void;
  filari: Filare[];
  tipi: TipoPianta[];
  onOpenPOIModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function FilterSidebar({
  filtri,
  setFiltri,
  colorMode,
  setColorMode,
  filari,
  tipi,
  onOpenPOIModal,
  isMobileOpen,
  setIsMobileOpen
}: Props) {

  const setFiltro = <K extends keyof typeof filtri>(k: K, v: string) => {
    setFiltri(prev => ({ ...prev, [k]: v === "" ? undefined : parseInt(v) }));
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <header className="flex justify-end items-start lg:hidden">
        <button className="p-2" onClick={() => setIsMobileOpen(false)}>
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
            onChange={(e) => { setFiltro('filare_id', e.target.value); if (window.innerWidth < 1024) setIsMobileOpen(false); }}
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
            onChange={(e) => { setFiltro('tipo_id', e.target.value); if (window.innerWidth < 1024) setIsMobileOpen(false); }}
          >
            <option value="">Tutte le Varietà</option>
            {tipi.map(t => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>
        <div className="pt-4">
          <button 
            onClick={onOpenPOIModal}
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 py-8 px-6 gap-12 shrink-0 glass-panel h-fit mt-6">
        <FilterContent />
      </aside>

      {/* Mobile Floating Filter Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
      >
        <Filter size={24} />
      </button>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 180 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel rounded-t-[3rem] p-8 z-[80] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-b-0"
            >
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
