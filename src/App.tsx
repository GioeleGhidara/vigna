import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';

function App() {
  const [currentView, setCurrentView] = useState<'map' | 'dashboard'>('map');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
        {/* Top Navigation */}
        <header className="bg-slate-900 text-white h-14 flex items-center px-4 shrink-0 shadow-md z-20">
          <div className="font-bold text-lg text-emerald-400 mr-8 hidden sm:block">🍷 Vigneto App</div>
          <nav className="flex gap-2">
            <button 
              onClick={() => setCurrentView('map')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${currentView === 'map' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              Mappa
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              Dashboard
            </button>
          </nav>
        </header>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'map' ? <HomePage /> : <DashboardPage />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
