import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'DEPARTMENT_MANAGER':
          navigate('/manager/dashboard');
          break;
        case 'AGENT':
          navigate('/agent/dashboard');
          break;
        case 'CUSTOMER':
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (e, p) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-[#090d16] dark:via-[#0d1527] dark:to-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[650px] h-[650px] -top-32 -left-24 bg-indigo-500/20 dark:bg-indigo-600/20" />
        <div className="ambient-orb w-[600px] h-[600px] top-1/2 -right-32 bg-purple-500/15 dark:bg-purple-600/15" />
        <div className="ambient-orb w-[700px] h-[700px] -bottom-48 left-1/4 bg-teal-500/15 dark:bg-teal-600/15" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70 dark:opacity-40" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </Link>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Enterprise Portal
          </span>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-primary-400 text-white shadow-xl shadow-indigo-500/25 mb-4"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          RESOLVENOW
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enterprise Issue Escalation & Service Desk
        </p>
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
          "Resolve faster. Serve better."
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@resolvenow.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md shadow-indigo-500/25 mt-2"
            >
              Sign In to Service Desk
            </Button>
          </form>

          {/* 1-Click Test Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 text-center">
              1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickFill('admin@resolvenow.com', 'Admin@123')}
                className="px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="block font-bold text-slate-800 dark:text-slate-200">Admin</span>
                <span className="text-[10px] text-slate-400">admin@resolvenow.com</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('manager.tech@resolvenow.com', 'Manager@123')}
                className="px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="block font-bold text-slate-800 dark:text-slate-200">Dept Manager</span>
                <span className="text-[10px] text-slate-400">manager.tech@...</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('agent.tech1@resolvenow.com', 'Agent@123')}
                className="px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="block font-bold text-slate-800 dark:text-slate-200">Tech Agent</span>
                <span className="text-[10px] text-slate-400">agent.tech1@...</span>
              </button>
              <button
                type="button"
                onClick={() => quickFill('customer1@resolvenow.com', 'Customer@123')}
                className="px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="block font-bold text-slate-800 dark:text-slate-200">Customer</span>
                <span className="text-[10px] text-slate-400">customer1@...</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create Customer Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
