import { useState } from 'react';
import PiantaHeader from './PiantaHeader';
import PiantaOperazioni from './PiantaOperazioni';
import OperazioneFormModal from '../operazione/OperazioneFormModal';
import PiantaEditModal from './PiantaEditModal';
import { Button } from '@/components/ui/button';
import type { Pianta, TipoPianta } from '@/types';

interface Props {
  pianta: Pianta;
  tipo?: TipoPianta;
  onDelete: () => void;
  isRepositioning?: boolean;
  onStartReposition?: () => void;
  onCancelReposition?: () => void;
  onClose: () => void;
}

export default function PiantaCard({ pianta, tipo, onDelete, isRepositioning, onStartReposition, onCancelReposition, onClose }: Props) {
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col p-5 h-full bg-white relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
      >
        ✕
      </button>

      {isRepositioning && (
        <div className="bg-emerald-100 text-emerald-800 p-3 rounded-md mb-4 text-sm font-medium flex justify-between items-center">
          <span>Clicca sulla mappa per spostare...</span>
          <button onClick={onCancelReposition} className="underline text-emerald-600 text-xs">Annulla</button>
        </div>
      )}

      <PiantaHeader pianta={pianta} tipo={tipo} />
      
      <PiantaOperazioni piantaId={pianta.id} onAdd={() => setIsOpModalOpen(true)} />
      
      <div className="flex gap-2 mt-auto pt-6 border-t border-slate-100 flex-wrap">
        <Button size="sm" variant="outline" className="flex-1 min-w-[80px]" onClick={() => setIsEditModalOpen(true)}>Modifica</Button>
        <Button size="sm" variant="outline" className="flex-1 min-w-[80px]" onClick={onStartReposition}>Riposiziona</Button>
        <Button size="sm" variant="destructive" className="flex-1 min-w-[80px]" onClick={onDelete}>Elimina</Button>
      </div>
    </div>

    {isOpModalOpen && (
      <OperazioneFormModal 
        piantaId={pianta.id} 
        onClose={() => setIsOpModalOpen(false)} 
      />
    )}

    {isEditModalOpen && (
      <PiantaEditModal 
        pianta={pianta} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    )}
    </>
  );
}
