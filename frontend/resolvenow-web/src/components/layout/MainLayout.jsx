import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';

export const MainLayout = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-[#090d16] dark:via-[#0d1527] dark:to-[#090d16] text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[600px] h-[600px] -top-40 -left-20 bg-indigo-500/15 dark:bg-indigo-600/20" />
        <div className="ambient-orb w-[550px] h-[550px] top-1/3 -right-20 bg-purple-500/15 dark:bg-purple-600/15" />
        <div className="ambient-orb w-[650px] h-[650px] -bottom-40 left-1/3 bg-sky-500/15 dark:bg-sky-600/15" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70 dark:opacity-40" />

      {/* Navigation Header */}
      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
