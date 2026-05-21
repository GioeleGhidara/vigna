import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface AccordionSectionProps {
  id: string;
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

export function AccordionSection({ id, title, count, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="premium-card bg-white border border-slate-100 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-md">
      <button
        onClick={() => onToggle(id)}
        className="w-full px-4 sm:px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-base sm:text-xl font-heading font-black text-slate-900 uppercase tracking-tight italic truncate pr-2">
            {title}
          </h3>
          <span className="px-2.5 py-0.5 bg-slate-100 rounded-full text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
            {count}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-slate-300 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="text-slate-300 shrink-0 ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 sm:px-8 pb-8 pt-4 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-slate-50 overflow-hidden">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
