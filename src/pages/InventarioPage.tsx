import PianteManager from '@/components/dashboard/PianteManager';

export default function InventarioPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#fcfaf7] pb-24">
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
        <header className="space-y-4 border-b border-slate-200 pb-12">
          <h1 className="text-6xl font-heading font-black text-slate-900 tracking-tight leading-none uppercase">
            Inventario <span className="text-emerald-800 font-light text-3xl md:text-5xl">Viti</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl">
            Gestione completa dell'anagrafica delle piante, monitoraggio dello stato di salute e posizionamento nei filari.
          </p>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <PianteManager />
        </div>
      </div>
    </div>
  );
}
