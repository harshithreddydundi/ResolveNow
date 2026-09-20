import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-[#090d16] dark:via-[#0d1527] dark:to-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[500px] h-[500px] -top-20 -left-20 bg-rose-500/15 dark:bg-rose-600/15" />
        <div className="ambient-orb w-[500px] h-[500px] -bottom-20 -right-20 bg-indigo-500/15 dark:bg-indigo-600/15" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70 dark:opacity-40" />

      <div className="relative z-10 max-w-md w-full text-center p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl">
        <div className="inline-flex p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-4 shadow-inner">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6 leading-relaxed">
          Your current enterprise role does not have permission to access this module or departmental queue.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="md"
            icon={ArrowLeft}
            className="w-full"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="md"
            icon={Home}
            className="w-full shadow-md shadow-indigo-500/20"
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
