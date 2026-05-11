import type { TipoPianta } from '@/types';
import { motion } from 'framer-motion';

interface Props { tipo: TipoPianta; count: number; totale: number; }

export function TipoBar({ tipo, count, totale }: Props) {
  const perc = totale > 0 ? Math.round((count / totale) * 100) : 0;
  
  return (
    <div className="group space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: tipo.colore_hex }} />
          <span className="font-bold text-slate-700 text-sm">{tipo.nome}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-400">{count} viti</span>
          <span className="text-sm font-black text-slate-800 w-10 text-right">{perc}%</span>
        </div>
      </div>
      
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${perc}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full shadow-lg"
          style={{ backgroundColor: tipo.colore_hex }}
        />
      </div>
    </div>
  );
}
