import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  Users,
  Headphones,
  Briefcase,
  Building2,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    department: 'Technical Support',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Technical Support',
    'Billing & Finance',
    'Customer Service',
    'Facility',
  ];

  const roleOptions = [
    {
      id: 'CUSTOMER',
      title: 'Customer / User',
      icon: Users,
      badge: 'Standard Access',
      description: 'Report, monitor, and manage your service issues and grievances.',
      highlight: 'Individual portal access',
      color: 'indigo'
    },
    {
      id: 'AGENT',
      title: 'Support Agent',
      icon: Headphones,
      badge: 'Tech Specialist',
      description: 'Investigate, diagnose, and resolve tickets assigned to your department.',
      highlight: 'Shared departmental queue',
      color: 'teal'
    },
    {
      id: 'DEPARTMENT_MANAGER',
      title: 'Department Manager',
      icon: Briefcase,
      badge: '4 Core Departments',
      description: 'Oversee department queues, SLA dispatch, workload balancing, and escalations.',
      highlight: 'Manage department team & queue',
      color: 'purple'
    },
    {
      id: 'ADMIN',
      title: 'System Administrator',
      icon: ShieldCheck,
      badge: 'Superuser Oversight',
      description: 'Full enterprise control, microservice mesh monitoring, user registry, and analytics.',
      highlight: 'Global administrative privileges',
      color: 'rose'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      role: roleId,
      department: roleId === 'CUSTOMER' ? '' : (roleId === 'ADMIN' ? 'Administration' : (prev.department || 'Technical Support'))
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.role === 'CUSTOMER' ? null : (formData.role === 'ADMIN' ? 'Administration' : formData.department),
      };

      const user = await register(payload);

      // Smart redirection based on role
      switch (user?.role) {
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
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-[#090d16] dark:via-[#0d1527] dark:to-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Ambient Glowing Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[650px] h-[650px] -top-32 -left-24 bg-indigo-500/20 dark:bg-indigo-600/20" />
        <div className="ambient-orb w-[600px] h-[600px] top-1/2 -right-32 bg-purple-500/15 dark:bg-purple-600/15" />
        <div className="ambient-orb w-[700px] h-[700px] -bottom-48 left-1/4 bg-teal-500/15 dark:bg-teal-600/15" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70 dark:opacity-40" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-4xl text-center">
        <div className="flex items-center justify-between mb-4 px-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </Link>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Enterprise RBAC System
          </span>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-primary-400 text-white shadow-xl shadow-indigo-500/25 mb-3"
        >
          <Sparkles className="w-7 h-7" />
        </motion.div>

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Create Your ResolveNow Account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Enterprise Issue Escalation & Service Desk Platform
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-4xl px-2 sm:px-0"
      >
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Step 1: Role Selection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Which role are you creating account for?
                </label>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Step 1 of 2: Select Access Tier (4 Roles Available)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.role === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleRoleSelect(opt.id)}
                      className={`relative flex flex-col p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                              : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {opt.title}
                      </h4>

                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 w-fit">
                        {opt.badge}
                      </span>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {opt.description}
                      </p>

                      <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-auto pt-2 flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{opt.highlight}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Selection (Conditional for Agent & Manager) */}
            <AnimatePresence>
              {(formData.role === 'AGENT' || formData.role === 'DEPARTMENT_MANAGER') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2"
                >
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Assign to Department Queue
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                    {formData.role === 'AGENT'
                      ? '✓ Unlimited Tech & Support Agents can register for this department to share the workload.'
                      : '✓ 1 of the 4 department leadership queues (Technical Support, Billing, Service, Facility).'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: User Information Fields */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Step 2 of 2: Profile & Security Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane.doe@resolvenow.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1-555-0199"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-lg shadow-indigo-500/25 mt-4"
              icon={ArrowRight}
            >
              Complete Account Creation
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            Already have an enterprise account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
