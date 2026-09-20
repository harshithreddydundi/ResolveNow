import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export const StartupAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  const bootPhases = [
    { text: 'Booting ResolveNow Microservice Mesh...', icon: Zap },
    { text: 'Connecting Eureka Service Registry & Discovery...', icon: Activity },
    { text: 'Synchronizing Real-Time SLA Dispatch Engine...', icon: Sparkles },
    { text: 'Validating Security Keys & Role Authorization...', icon: ShieldCheck },
    { text: 'Enterprise Service Desk Ready.', icon: CheckCircle2 },
  ];

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDismissing(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 350);
          return 100;
        }

        const increment = prev < 40 ? 4 : prev < 75 ? 6 : 8;
        const next = Math.min(100, prev + increment);

        // Update boot phase text
        if (next < 25) setPhaseIndex(0);
        else if (next < 50) setPhaseIndex(1);
        else if (next < 75) setPhaseIndex(2);
        else if (next < 95) setPhaseIndex(3);
        else setPhaseIndex(4);

        return next;
      });
    }, 65);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsDismissing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  const CurrentIcon = bootPhases[phaseIndex].icon;

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          key="startup-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070a13] text-white overflow-hidden select-none"
        >
          {/* Ambient Glowing Aurora Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[600px] h-[600px] -top-32 -left-20 bg-indigo-600/30 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[550px] h-[550px] -bottom-20 -right-20 bg-purple-600/25 rounded-full blur-[110px]"
            />
            <div className="absolute w-[450px] h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500/20 rounded-full blur-[90px]" />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          {/* Skip button in top right */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleSkip}
            className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all group"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* Main Content Centerpiece */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
            {/* Logo with Orbital Tech Rings */}
            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
              {/* Outer Pulsing Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-indigo-500/40"
              />

              {/* Middle Counter-Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-teal-400/30"
              />

              {/* Glowing Ambient Core */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    '0 0 30px rgba(99, 102, 241, 0.4)',
                    '0 0 60px rgba(99, 102, 241, 0.7)',
                    '0 0 30px rgba(99, 102, 241, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 text-white shadow-2xl shadow-indigo-500/50"
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
            </div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1.5 mb-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  RESOLVENOW
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-xs font-medium tracking-wide text-slate-400">
                Enterprise Issue Escalation & Service Desk
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-2.5 p-0.5 mb-4 shadow-inner overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 shadow-md shadow-indigo-500/50"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              />
            </div>

            {/* Progress Percentage & Status Telemetry */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CurrentIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-tight text-slate-300 truncate max-w-[260px]">
                  {bootPhases[phaseIndex].text}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-400 shrink-0">
                {progress}%
              </span>
            </div>

            {/* Micro Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[11px] font-semibold text-slate-500 mt-8 tracking-wider uppercase"
            >
              Resolve faster. Serve better.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupAnimation;
