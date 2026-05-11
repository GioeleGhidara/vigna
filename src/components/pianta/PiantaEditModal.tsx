import { usePiante } from '@/hooks/usePiante';
import { PiantaForm } from './PiantaForm';
import type { Pianta } from '@/types';

interface Props {
  pianta: Pianta;
  onClose: () => void;
}

export default function PiantaEditModal({ pianta, onClose }: Props) {
  const { updatePianta } = usePiante();

  const handleSubmit = async (data: any) => {
    // Rimuoviamo l'ID dai dati da aggiornare (l'ID non si cambia)
    const { id, ...updateData } = data;
    await updatePianta({ id: pianta.id, data: updateData });
  };

  return (
    <PiantaForm 
      initialData={pianta} 
      onSubmit={handleSubmit} 
      onClose={onClose} 
      title={`Modifica Vite ${pianta.codice_etichetta}`}
    />
  );
}
