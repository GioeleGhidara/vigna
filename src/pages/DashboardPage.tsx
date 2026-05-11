import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useOperazioni } from '@/hooks/useOperazioni';
import { usePOI } from '@/hooks/usePOI';
import { useState, useMemo } from 'react';
import { BarChart3, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TipoBar } from '@/components/dashboard/TipoBar';
import TipiManager from '@/components/dashboard/TipiManager';
import FilariManager from '@/components/dashboard/FilariManager';
import POIManager from '@/components/dashboard/POIManager';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'manage'>('stats');
  const [openAccordion, setOpenAccordion] = useState<string | null>('filari');
  
  const { piante, isLoading: isLoadingPiante } = usePiante();
  const { filari } = useFilari();
  const { tipi } = useTipiPianta();
  const { poi } = usePOI();
  const { operazioni } = useOperazioni();

  const statoPiante = useMemo(() => {
    return piante.reduce(
      (acc: Record<string, number>, p) => { 
        acc[p.stato] = (acc[p.stato] || 0) + 1;
        return acc; 
      },
      { attiva: 0, morta: 0, ripiantata: 0 }
    );
  }, [piante]);

  const countByTipo = useMemo(() => {
    return piante.reduce((acc: Record<string, number>, p) => {
      acc[p.tipo_id] = (acc[p.tipo_id] || 0) + 1;
      return acc;
    }, {});
  }, [piante]);

  if (isLoadingPiante)
    return (
      <div className="flex h-full items-center justify-center bg-[#fcfaf7]">
        <div className="w-16 h-16 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );

  const tipiConPiante = tipi.filter(t => countByTipo[t.id]);

  const AccordionSection = ({ id, title, count, children }: { id: string, title: string, count: number, children: React.ReactNode }) => {
    const isOpen = openAccordion === id;
    return (
      <div className="premium-card bg-white border border-slate-100 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md">
        <button 
          onClick={() => setOpenAccordion(isOpen ? null : id)}
          className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-heading font-black text-slate-900 uppercase tracking-tight italic">{title}</h3>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{count} {count === 1 ? 'Elemento' : 'Elementi'}</span>
          </div>
          {isOpen ? <ChevronUp className="text-slate-300" /> : <ChevronDown className="text-slate-300" />}
        </button>
        {isOpen && (
          <div className="px-8 pb-10 pt-4 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-slate-50">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#fcfaf7] pb-24">
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-16">
        
        {/* Header con Switch Tab */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-200 pb-12">
          <div className="space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'}`}
              >
                <BarChart3 size={14} /> Statistiche
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-emerald-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:text-emerald-900'}`}
              >
                <Settings2 size={14} /> Modellazione
              </button>
            </div>
            <h1 className="text-6xl font-heading font-black text-slate-900 tracking-tight leading-none uppercase">
              Controllo <span className="text-emerald-800 font-light text-3xl md:text-5xl">{activeTab === 'stats' ? 'Dati' : 'Vigneto'}</span>
            </h1>
          </div>
          
          {activeTab === 'stats' && (
            <div className="flex flex-col items-end">
              <span className="text-3xl font-heading font-black text-slate-900">{piante.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Viti Totali</span>
            </div>
          )}
        </header>

        {activeTab === 'stats' ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              <StatCard label="Piante Attive" value={statoPiante.attiva} color="emerald" icon="Leaf" />
              <StatCard label="Piante Morte" value={statoPiante.morta} color="red" icon="Wind" />
              <StatCard label="Rimpiazzi" value={statoPiante.ripiantata} color="amber" icon="RotateCcw" />
              <StatCard label="Operazioni" value={operazioni.length} color="blue" icon="Trello" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 premium-card p-6 lg:p-10 bg-white">
                <div className="flex items-center justify-between mb-8 lg:mb-12">
                  <h2 className="text-xl lg:text-2xl font-heading font-black text-slate-900">Varietà d'Uva</h2>
                  <div className="h-px flex-1 mx-4 lg:mx-8 bg-slate-100 hidden md:block" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribuzione</span>
                </div>
                <div className="space-y-8 lg:space-y-10">
                  {tipiConPiante.map(t => (
                    <TipoBar key={t.id} tipo={t} count={countByTipo[t.id]} totale={piante.length} />
                  ))}
                </div>
              </div>

              <div className="premium-card p-8 lg:p-10 bg-slate-900 text-white flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <h3 className="text-lg lg:text-xl font-serif italic text-emerald-400">Suggerimento</h3>
                  <p className="text-slate-400 text-xs lg:text-sm leading-relaxed font-medium">
                    Sulla base dei dati attuali, il {Math.round((statoPiante.morta / (piante.length || 1)) * 100)}% del vigneto richiede attenzione immediata.
                  </p>
                </div>
                <button className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Esporta PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AccordionSection id="filari" title="Struttura Filari" count={filari.length}>
              <FilariManager />
            </AccordionSection>
            
            <AccordionSection id="tipi" title="Varietà d'Uva" count={tipi.length}>
              <TipiManager />
            </AccordionSection>
            
            <AccordionSection id="poi" title="Punti di Interesse" count={poi.length}>
              <POIManager />
            </AccordionSection>
          </div>
        )}
      </div>
    </div>
  );
}
