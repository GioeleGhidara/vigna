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
  red: { text: 'text-red-900', accent: 'bg-red-200' },
  amber: { text: 'text-amber-900', accent: 'bg-amber-200' },
  blue: { text: 'text-blue-900', accent: 'bg-blue-200' },
} as const;

export function StatCard({ label, value, color = 'default', icon }: StatCardProps) {
  const c = colorMap[color];
  const Icon = (Icons[icon] as any) || Icons.Activity;

  return (
    <motion.div
      whileHover={{ y: -4, rotate: -0.5 }}
      className="premium-card p-4 sm:p-8 group relative overflow-hidden flex flex-col justify-between min-h-[110px] sm:min-h-[140px]"
    >
      <div className={`absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${c.accent}`} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 truncate pr-1">
          {label}
        </span>
        <Icon size={16} strokeWidth={1.5} className="text-slate-300 shrink-0 hidden sm:block" />
      </div>

      <div className="relative z-10 flex items-baseline gap-1 pt-2">
        <span className={`text-2xl sm:text-5xl font-heading font-black tracking-tighter truncate ${c.text}`}>
          {value}
        </span>
        <span className="text-[9px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest hidden sm:inline">
          Unità
        </span>
      </div>
    </motion.div>
  );
}