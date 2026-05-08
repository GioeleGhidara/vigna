interface StatCardProps {
  label: string;
  value: number;
  color?: 'default' | 'emerald' | 'red' | 'amber' | 'blue';
}

const colorMap = {
  default: { border: 'border-slate-200', label: 'text-slate-500', value: 'text-slate-900' },
  emerald: { border: 'border-emerald-100', label: 'text-emerald-600', value: 'text-emerald-700' },
  red:     { border: 'border-red-100',     label: 'text-red-600',     value: 'text-red-700'     },
  amber:   { border: 'border-amber-100',   label: 'text-amber-600',   value: 'text-amber-700'   },
  blue:    { border: 'border-blue-100',    label: 'text-blue-600',    value: 'text-blue-700'    },
} as const;

export function StatCard({ label, value, color = 'default' }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white p-5 rounded-xl border shadow-sm ${c.border}`}>
      <div className={`text-sm font-medium ${c.label}`}>{label}</div>
      <div className={`text-3xl font-bold mt-1 ${c.value}`}>{value}</div>
    </div>
  );
}
