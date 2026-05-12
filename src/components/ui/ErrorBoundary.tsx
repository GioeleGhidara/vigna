import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px] bg-[#fcfaf7] noise-bg rounded-[2.5rem] border-2 border-dashed border-red-100 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-xl shadow-red-100">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black text-slate-900 italic">Ops, qualcosa è andato storto</h2>
            <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">
              Il vigneto digitale ha riscontrato un problema tecnico. I tuoi dati sono al sicuro.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-2xl"
          >
            <RefreshCw size={14} /> Ricarica Mappa
          </button>
          {this.state.error && (
            <pre className="text-[10px] text-red-300 font-mono bg-red-50/50 p-4 rounded-xl max-w-md overflow-auto border border-red-50">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
