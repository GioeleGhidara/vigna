import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number;
  color?: 'default' | 'emerald' | 'red' | 'amber' | 'blue';
  icon: keyof typeof Icons;
}

const colorMap = {
  default: { text: 'text-slate-900', accent: 'bg-slate-200' },
  emerald: { text: 'text-emerald-900', accent: 'bg-emerald-200' },
  red:     { text: 'text-red-900',     accent: 'bg-red-200'     },
  amber:   { text: 'text-amber-900',   accent: 'bg-amber-200'   },
  blue:    { text: 'text-blue-900',    accent: 'bg-blue-200'    },
} as const;

export function StatCard({ label, value, color = 'default', icon }: StatCardProps) {
  const c = colorMap[color];
  const Icon = (Icons[icon] as any) || Icons.Activity;

  return (
    <motion.div 
      whileHover={{ y: -8, rotate: -1 }}
      className="premium-card p-8 group relative"
    >
      {/* Decoro artistico in background */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${c.accent}`} />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
          <Icon size={18} strokeWidth={1.5} className="text-slate-300" />
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-heading font-black tracking-tighter ${c.text}`}>
            {value}
          </span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Unità</span>
        </div>
      </div>
    </motion.div>
  );
}
