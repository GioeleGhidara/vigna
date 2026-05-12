import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Il Code Splitting nativo: importiamo le pagine solo quando servono
const HomePage = lazy(() => import('@/pages/HomePage'));
const InventarioPage = lazy(() => import('@/pages/InventarioPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Stile attivo per i link di navigazione
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${
      isActive ? 'text-slate-900' : 'text-slate-300 hover:text-slate-500'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fcfaf7] noise-bg">
          
          {/* Responsive Boutique Header ottimizzato per mobile */}
          <header className="h-auto min-h-[5rem] lg:h-24 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3 shrink-0 z-[100] border-b border-slate-100 bg-[#fcfaf7]/80 backdrop-blur-md lg:bg-transparent">
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-heading font-black text-slate-900 tracking-tighter leading-tight">
                Vigna <span className="font-light text-emerald-800 block sm:inline">Fojachini</span>
              </h1>
            </div>
            
            {/* Navigazione Desktop */}
            <nav className="hidden lg:flex gap-12">
              <NavLink to="/" className={navLinkClass}>
                {({ isActive }) => (
                  <>Mappa {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}</>
                )}
              </NavLink>
              <NavLink to="/inventario" className={navLinkClass}>
                {({ isActive }) => (
                  <>Inventario {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}</>
                )}
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                {({ isActive }) => (
                  <>Dashboard {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}</>
                )}
              </NavLink>
            </nav>

            <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={closeMenu}
                  className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"
                />
                <motion.div 
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="lg:hidden fixed top-0 right-0 bottom-0 w-[80vw] bg-[#fcfaf7] z-[90] p-10 flex flex-col gap-8 shadow-2xl"
                >
                  <div className="pt-20 flex flex-col gap-6 text-right">
                    <NavLink to="/" onClick={closeMenu} className="text-2xl font-heading font-black uppercase tracking-tight italic">Mappa</NavLink>
                    <NavLink to="/inventario" onClick={closeMenu} className="text-2xl font-heading font-black uppercase tracking-tight italic">Inventario</NavLink>
                    <NavLink to="/dashboard" onClick={closeMenu} className="text-2xl font-heading font-black uppercase tracking-tight italic">Dashboard</NavLink>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Area di rendering dinamica spezzata in Chunk leggeri */}
          <div className="flex-1 overflow-hidden relative">
            <ErrorBoundary>
              {/* Suspense mostra un mini-loader mentre il browser scarica il JS della pagina richiesta */}
              <Suspense fallback={
                <div className="flex h-full items-center justify-center bg-[#fcfaf7]">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-slate-200 border-t-emerald-800 rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Caricamento modulo...</span>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/inventario" element={<InventarioPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>

        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
