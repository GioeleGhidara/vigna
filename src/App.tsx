import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import InventarioPage from '@/pages/InventarioPage';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Menu, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'inventory'>('map');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleView = (view: 'map' | 'dashboard' | 'inventory') => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fcfaf7] noise-bg">
        {/* Responsive Boutique Header */}
        <header className="h-20 lg:h-24 flex items-center justify-between px-6 lg:px-12 shrink-0 z-50 border-b border-slate-100 bg-[#fcfaf7]/80 backdrop-blur-md lg:bg-transparent">
          <div className="flex items-baseline gap-3 lg:gap-4">
            <h1 className="text-xl lg:text-3xl font-heading font-black text-slate-900 tracking-tighter">
              Vigna <span className="font-light text-emerald-800">Fojachini</span>
            </h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-12">
            <button 
              onClick={() => setCurrentView('map')}
              className={`relative py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${currentView === 'map' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              Mappa
              {currentView === 'map' && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}
            </button>
            <button 
              onClick={() => setCurrentView('inventory')}
              className={`relative py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${currentView === 'inventory' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              Inventario
              {currentView === 'inventory' && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`relative py-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ${currentView === 'dashboard' ? 'text-slate-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              Dashboard
              {currentView === 'dashboard' && <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-800" />}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-[#fcfaf7] z-[60] flex flex-col p-8 gap-8 animate-in fade-in slide-in-from-top-4">
            <button 
              onClick={() => toggleView('map')}
              className={`text-4xl font-serif italic ${currentView === 'map' ? 'text-slate-900 font-black' : 'text-slate-300'}`}
            >
              Mappa
            </button>
            <button 
              onClick={() => toggleView('inventory')}
              className={`text-4xl font-serif italic ${currentView === 'inventory' ? 'text-slate-900 font-black' : 'text-slate-300'}`}
            >
              Inventario
            </button>
            <button 
              onClick={() => toggleView('dashboard')}
              className={`text-4xl font-serif italic ${currentView === 'dashboard' ? 'text-slate-900 font-black' : 'text-slate-300'}`}
            >
              Dashboard
            </button>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-hidden relative">
          <ErrorBoundary>
            {currentView === 'map' ? <HomePage /> : currentView === 'inventory' ? <InventarioPage /> : <DashboardPage />}
          </ErrorBoundary>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
