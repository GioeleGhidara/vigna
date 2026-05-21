import { usePiante } from '@/hooks/usePiante';
import { useFilari } from '@/hooks/useFilari';
import { useTipiPianta } from '@/hooks/useTipiPianta';
import { useOperazioni } from '@/hooks/useOperazioni';
import { usePOI } from '@/hooks/usePOI';
import { useState, useMemo } from 'react';
import { BarChart3, Settings2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { TipoBar } from '@/components/dashboard/TipoBar';
import TipiManager from '@/components/dashboard/TipiManager';
import FilariManager from '@/components/dashboard/FilariManager';
import POIManager from '@/components/dashboard/POIManager';
import VenditoreBulkTool from '@/components/dashboard/VenditoreBulkTool';
import { AccordionSection } from '@/components/ui/Accordion';

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

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#fcfaf7] pb-24">
      {/* Container ottimizzato per schermi piccoli: p-4 base, si allarga in lg */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12 space-y-8 lg:space-y-16 overflow-hidden">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-4">
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'}`}
              >
                <BarChart3 size={14} /> Statistiche
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manage' ? 'bg-emerald-900 text-white shadow-md' : 'bg-white border border-slate-100 text-slate-400 hover:text-emerald-900'}`}
              >
                <Settings2 size={14} /> Modellazione
              </button>
            </div>
            <h1 className="text-4xl sm:text-6xl font-heading font-black text-slate-900 tracking-tight leading-none uppercase">
              Controllo <span className="text-emerald-800 font-light text-2xl sm:text-5xl block sm:inline">{activeTab === 'stats' ? 'Dati' : 'Vigneto'}</span>
            </h1>
          </div>

          {activeTab === 'stats' && (
            <div className="flex flex-col items-start md:items-end">
              <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">{piante.length}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Viti Totali</span>
            </div>
          )}
        </header>

        {activeTab === 'stats' ? (
          <div className="space-y-8 lg:space-y-16 animate-in fade-in duration-500">
            {/* Griglia a 2 colonne su mobile per mantenere proporzioni leggibili */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
              <StatCard label="Attive" value={statoPiante.attiva} color="emerald" icon="Leaf" />
              <StatCard label="Morte" value={statoPiante.morta} color="red" icon="Wind" />
              <StatCard label="Rimpiazzi" value={statoPiante.ripiantata} color="amber" icon="RotateCcw" />
              <StatCard label="Interventi" value={operazioni.length} color="blue" icon="Activity" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
              <div className="lg:col-span-2 premium-card p-5 sm:p-10 bg-white overflow-hidden">
                <div className="flex items-center justify-between mb-6 lg:mb-12">
                  <h2 className="text-lg sm:text-2xl font-heading font-black text-slate-900 truncate pr-2">Varietà d'Uva</h2>
                  <div className="h-px flex-1 mx-4 bg-slate-100 hidden sm:block" />
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Distribuzione</span>
                </div>
                {piante.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium text-xs sm:text-sm">
                    Nessuna vite mappata. Passa alla scheda "Modellazione".
                  </div>
                ) : (
                  <div className="space-y-6 sm:space-y-10">
                    {tipiConPiante.map(t => (
                      <TipoBar key={t.id} tipo={t} count={countByTipo[t.id]} totale={piante.length} />
                    ))}
                  </div>
                )}
              </div>

              <div className="premium-card p-6 sm:p-10 bg-slate-900 text-white flex flex-col justify-between min-h-[250px] sm:min-h-[300px]">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-xl font-serif italic text-emerald-400">Suggerimento</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {piante.length === 0 ? (
                      "Il tuo gemello digitale è pronto. Popola i filari per ricevere analisi predittive."
                    ) : (
                      `Sulla base dei dati attuali, il ${Math.round((statoPiante.morta / piante.length) * 100)}% del vigneto richiede attenzione.`
                    )}
                  </p>
                </div>
                <button
                  disabled={piante.length === 0}
                  className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Esporta PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <AccordionSection id="filari" title="Struttura Filari" count={filari.length} isOpen={openAccordion === 'filari'} onToggle={toggleAccordion}>
              <FilariManager />
            </AccordionSection>

            <AccordionSection id="tipi" title="Varietà d'Uva" count={tipi.length} isOpen={openAccordion === 'tipi'} onToggle={toggleAccordion}>
              <TipiManager />
            </AccordionSection>

            <AccordionSection id="poi" title="Punti di Interesse" count={poi.length} isOpen={openAccordion === 'poi'} onToggle={toggleAccordion}>
              <POIManager />
            </AccordionSection>

            <AccordionSection id="bulk" title="Assegnazione Lotti" count={1} isOpen={openAccordion === 'bulk'} onToggle={toggleAccordion}>
              <VenditoreBulkTool />
            </AccordionSection>
          </div>
        )}
      </div>
    </div>
  );
}