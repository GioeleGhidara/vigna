import { useState } from 'react';
import { 
  Home, Droplets, Gauge, Zap, Building2, 
  X, MapPin, Trash2, Apple, Cherry, Citrus, Trees, Leaf, Flower2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { POI } from '@/types';

const ICON_OPTIONS = [
  // Infrastruttura
  { id: 'Home', icon: Home, label: 'Edificio', color: '#1e293b' },
  { id: 'Warehouse', icon: Building2, label: 'Magazzino', color: '#064e3b' },
  { id: 'Droplets', icon: Droplets, label: 'Rubinetto', color: '#2563eb' },
  { id: 'Gauge', icon: Gauge, label: 'Contatore', color: '#3b82f6' },
  { id: 'UtilityPole', icon: Zap, label: 'Palo/Centralina', color: '#d97706' },
  
  // Frutta & Natura
  { id: 'Melo', icon: Apple, label: 'Melo', color: '#ef4444' },
  { id: 'Pero', icon: Apple, label: 'Pero', color: '#a3e635' },
  { id: 'Limone', icon: Citrus, label: 'Limone', color: '#facc15' },
  { id: 'Ciliegio', icon: Cherry, label: 'Ciliegio', color: '#b91c1c' },
  { id: 'Vite', icon: Leaf, label: 'Vite', color: '#65a30d' },
  { id: 'Pesco', icon: Flower2, label: 'Pesco', color: '#fda4af' },
  { id: 'Albero', icon: Trees, label: 'Albero Gen.', color: '#166534' },
];

interface Props {
  poi: POI;
  onUpdate: (id: string, data: Partial<POI>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
  isRepositioning: boolean;
  onStartReposition: () => void;
  onCancelReposition: () => void;
}

export default function POICard({ poi, onUpdate, onDelete, onClose, isRepositioning, onStartReposition, onCancelReposition }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: poi.nome,
    tipo: poi.tipo,
    icona: poi.icona,
    descrizione: poi.descrizione || ''
  });

  const handleSave = async () => {
    await onUpdate(poi.id, editForm);
    setIsEditing(false);
  };

  const selectedIcon = ICON_OPTIONS.find(i => i.id === poi.icona) || ICON_OPTIONS[0];

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm text-3xl">
            <selectedIcon.icon size={32} style={{ color: selectedIcon.color || '#000' }} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight">{poi.nome}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{poi.tipo}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </header>

      {isRepositioning && (
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6 flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Seleziona posizione sulla mappa...</p>
          <button onClick={onCancelReposition} className="text-[10px] font-black uppercase tracking-widest text-amber-600 underline">Annulla</button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Landmark</label>
            <input 
              type="text" 
              value={editForm.nome}
              onChange={e => setEditForm({...editForm, nome: e.target.value})}
              className="w-full bg-slate-50 border-none p-4 text-sm font-bold rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
            <div className="flex gap-2">
              {(['edificio', 'infrastruttura', 'albero'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditForm({...editForm, tipo: t})}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${editForm.tipo === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icona</label>
            <div className="grid grid-cols-4 gap-2">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEditForm({...editForm, icona: opt.id})}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${editForm.icona === opt.id ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  title={opt.label}
                >
                  <opt.icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Annulla</Button>
            <Button className="flex-1 bg-slate-900" onClick={handleSave}>Salva Modifiche</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 flex-1">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-white shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
                Coords: {poi.coord_x} X, {poi.coord_y} Y
              </span>
            </div>
            {poi.descrizione && (
              <p className="text-xs text-slate-600 leading-relaxed italic">"{poi.descrizione}"</p>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <Button variant="outline" className="flex-1 rounded-2xl py-6" onClick={() => setIsEditing(true)}>Modifica</Button>
            <Button variant="outline" className="flex-1 rounded-2xl py-6" onClick={onStartReposition}>Sposta</Button>
            <Button variant="outline" className="w-14 rounded-2xl text-red-500 hover:bg-red-50 border-red-100" onClick={() => { if(confirm('Eliminare questo landmark?')) onDelete(poi.id); }}>
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
