import { MapPin, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { POI } from '@/types';

interface Props {
  poi: POI;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
}

export default function POIQuickMenu({ poi, onEdit, onMove, onClose }: Props) {
  return (
    <div className="bg-[#fcfaf7] rounded-[2rem] p-6 shadow-2xl border border-slate-100 max-w-[300px] w-full mx-auto relative noise-bg animate-in zoom-in-95 duration-200">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors">
        <X size={16}/>
      </button>
      
      <div className="text-center mb-6 mt-2">
        <h3 className="text-2xl font-heading font-black text-slate-900 leading-tight">{poi.nome}</h3>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{poi.tipo}</p>
        <div className="mt-3 flex justify-center">
          <span className="text-[9px] font-mono font-black tracking-widest bg-slate-100 text-slate-400 px-2 py-1 rounded-md">
            X: {Math.round(poi.coord_x)} | Y: {Math.round(poi.coord_y)}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button onClick={onMove} className="w-full bg-slate-900 text-white rounded-2xl py-6 shadow-xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest font-black">
          <MapPin size={16} className="mr-2" /> Sposta
        </Button>
        <Button onClick={onEdit} variant="outline" className="w-full rounded-2xl py-6 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs uppercase tracking-widest font-black">
          <Edit3 size={16} className="mr-2" /> Modifica
        </Button>
      </div>
    </div>
  );
}
