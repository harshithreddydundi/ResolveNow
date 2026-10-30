import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Server,
  ShieldCheck,
  Zap,
  Activity,
  GitBranch,
  Layers,
  Database,
  Users,
  Headphones,
  Briefcase,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Clock,
  Bell,
  Lock,
  Compass,
  Copy,
  Check,
  Award,
  BookOpen,
  LayoutDashboard,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';

export const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'DEPARTMENT_MANAGER':
        return '/manager/dashboard';
      case 'AGENT':
        return '/agent/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Pre-seeded Credentials
  const credentials = [
    { role: 'ADMIN', name: 'System Administrator', email: 'admin@resolvenow.com', pass: 'Admin@123', dept: 'Administration', badge: 'Superuser' },
    { role: 'DEPARTMENT_MANAGER', name: 'Sarah Jenkins', email: 'manager.tech@resolvenow.com', pass: 'Manager@123', dept: 'Technical Support', badge: 'Tech Lead' },
    { role: 'DEPARTMENT_MANAGER', name: 'David Miller', email: 'manager.billing@resolvenow.com', pass: 'Manager@123', dept: 'Billing & Finance', badge: 'Billing Lead' },
    { role: 'AGENT', name: 'Alex Rivera', email: 'agent.tech1@resolvenow.com', pass: 'Agent@123', dept: 'Technical Support', badge: 'Agent' },
    { role: 'AGENT', name: 'Emily Zhao', email: 'agent.tech2@resolvenow.com', pass: 'Agent@123', dept: 'Technical Support', badge: 'Agent' },
    { role: 'AGENT', name: 'Marcus Vance', email: 'agent.billing1@resolvenow.com', pass: 'Agent@123', dept: 'Billing & Finance', badge: 'Agent' },
    { role: 'AGENT', name: 'Chloe Bennett', email: 'agent.service1@resolvenow.com', pass: 'Agent@123', dept: 'Customer Service', badge: 'Agent' },
    { role: 'AGENT', name: 'Liam Cooper', email: 'agent.facility1@resolvenow.com', pass: 'Agent@123', dept: 'Facility', badge: 'Agent' },
    { role: 'CUSTOMER', name: 'Alice Morgan', email: 'customer1@resolvenow.com', pass: 'Customer@123', dept: 'Customer Portal', badge: 'Customer' },
    { role: 'CUSTOMER', name: 'Robert Hughes', email: 'customer2@resolvenow.com', pass: 'Customer@123', dept: 'Customer Portal', badge: 'Customer' }
  ];

  // Microservices List
  const microservices = [
    {
      name: 'Eureka Discovery Mesh',
      port: '8761',
      tech: 'Spring Cloud Netflix Eureka',
      desc: 'Central heartbeat registry orchestrating automated dynamic microservice discovery and health ping checks.',
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      tag: 'Service Mesh'
    },
    {
      name: 'Reactive API Gateway',
      port: '8080',
      tech: 'Spring Cloud Gateway Netty',
      desc: 'Non-blocking high-throughput edge router handling dynamic service routing, security headers, and CORS unification.',
      color: 'from-indigo-500/20 to-indigo-600/10',
      border: 'border-indigo-500/30',
      tag: 'Edge Ingress'
    },
    {
      name: 'Auth Service',
      port: '8081',
      tech: 'Spring Security, JJWT 0.13, JPA',
      desc: 'Stateless JWT issuance, BCrypt password hashing, RBAC token verification, and 4-tier role authorization.',
      color: 'from-rose-500/20 to-rose-600/10',
      border: 'border-rose-500/30',
      tag: 'Security & RBAC'
    },
    {
      name: 'Complaint Service',
      port: '8082',
      tech: 'Spring Web, JPA, SSE Emitter',
      desc: 'Enforces strict ticket finite state machine, immutable audit histories, SLA calculation, and global SSE broadcasting.',
      color: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      tag: 'Core Engine'
    },
    {
      name: 'Assignment Service',
      port: '8083',
      tech: 'Spring Web, JPA, RestClient',
      desc: 'Department workload tracking, agent rebalancing heuristics, and reassignment audit logging.',
      color: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      tag: 'Load Balancer'
    },
    {
      name: 'Notification Service',
      port: '8084',
      tech: 'Spring Web, JPA, User SSE',
      desc: 'Event-driven real-time push alerts to user browser sessions via Server-Sent Events with unread counters.',
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      tag: 'Push Alerts'
    }
  ];

  // Portals breakdown
  const portals = [
    {
      role: 'System Administrator (ADMIN)',
      icon: ShieldCheck,
      color: 'rose',
      title: 'Cluster Command Center',
      description: 'Global authority over the distributed system. Real-time microservice mesh monitoring, user registry management, department staffing allocation, and executive analytics.',
      features: ['Cluster Health & Eureka Service Inspection', 'User Directory & Role Provisioning', 'Executive SLA Velocity & Recharts Analytics', 'Department Configuration & Assignments']
    },
    {
      role: 'Department Manager',
      icon: Briefcase,
      color: 'purple',
      title: 'Department Operations Command',
      description: 'Oversees 1 of the 4 core departments (Technical Support, Billing & Finance, Customer Service, Facility). Balances team workload and reassigns tickets in real-time.',
      features: ['Real-Time Department Ticket Triage', '1-Click Reassignment Modal', 'Live Agent Workload Balancing Charts', 'SLA Breach Monitoring & Escalation Dispatch']
    },
    {
      role: 'Support Agent (Tech Agent)',
      icon: Headphones,
      color: 'teal',
      title: 'Agent Workspace',
      description: 'Dedicated workbench for support engineers to claim, diagnose, update, and resolve incidents with instant state transitions and activity remarks.',
      features: ['Personal Assigned Ticket Queue', 'State Machine Step Controller (START WORK, RESOLVE)', 'Escalation Dispatcher with Audit Logging', 'Push Notification Bell for New Assignments']
    },
    {
      role: 'Customer / User',
      icon: Users,
      color: 'indigo',
      title: 'Self-Service Grievance Portal',
      description: 'Intuitive grievance submission interface with category selectors, priority tagging, interactive timeline progress bars, and resolution confirmation.',
      features: ['Quick 2-Step Ticket Submission Form', 'Interactive Progress Milestone Tracker', 'Ticket Reopen & Verification Workflow', 'Live Status Advance Push Notifications']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[700px] h-[700px] -top-40 -left-40 bg-indigo-500/15 dark:bg-indigo-600/15 blur-3xl rounded-full" />
        <div className="ambient-orb w-[600px] h-[600px] top-1/3 -right-32 bg-purple-500/15 dark:bg-purple-600/15 blur-3xl rounded-full" />
        <div className="ambient-orb w-[800px] h-[800px] -bottom-48 left-1/4 bg-teal-500/10 dark:bg-teal-600/15 blur-3xl rounded-full" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-60 dark:opacity-30" />

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-primary-400 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-primary-600 to-indigo-800 dark:from-indigo-400 dark:to-primary-300 bg-clip-text text-transparent">
                    RESOLVENOW
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    ENTERPRISE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Resolve faster. Serve better.
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <a href="#overview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Overview</a>
              <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Microservices Mesh</a>
              <a href="#statemachine" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Lifecycle State Machine</a>
              <a href="#portals" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Role Portals</a>
              <a href="#team" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Developers</a>
              <a href="#credentials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Demo Access</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Go to Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-500 hover:to-primary-500 text-white shadow-md shadow-indigo-500/25 transition flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ENTERPRISE SERVICE DESK & ISSUE ESCALATION SYSTEM • V1.0 PRODUCTION</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight"
        >
          High-Performance Incident Escalation &amp;{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-primary-500 to-indigo-700 dark:from-indigo-400 dark:via-primary-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Real-Time Service Mesh
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl sm:text-2xl font-bold italic text-indigo-600 dark:text-indigo-400"
        >
          "Resolve faster. Serve better."
        </motion.p>

        {/* Detailed Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
        >
          ResolveNow is an enterprise-grade full-stack platform engineered to automate incident intake, cross-departmental SLA triage, mathematical lifecycle state transitions, and real-time push notifications across distributed business units. Built on <strong>Java 21 LTS</strong>, <strong>Spring Boot 4.0.7</strong>, <strong>Spring Cloud 2025</strong>, and <strong>React 19 (Pure JSX)</strong> with <strong>PostgreSQL 17</strong>.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-500 hover:to-primary-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>Launch Live Portals (Sign In)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-md flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Create Account (All 4 Roles)</span>
          </Link>

          <a
            href="#team"
            className="px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-sm border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Meet Developers</span>
          </a>
        </motion.div>

        {/* Live Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-extrabold text-2xl">
              <CheckCircle2 className="w-6 h-6" />
              <span>22 / 22</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Automated Tests Passed (100%)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-indigo-500 font-extrabold text-2xl">
              <Server className="w-6 h-6" />
              <span>5 Mesh</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Active Microservices
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-purple-500 font-extrabold text-2xl">
              <Zap className="w-6 h-6" />
              <span>Zero-Lag</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Dual SSE Stream Engine
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-blue-500 font-extrabold text-2xl">
              <Database className="w-6 h-6" />
              <span>PostgreSQL 17</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Enterprise Relational Storage
            </p>
          </div>
        </motion.div>
      </section>

      {/* CORE CAPABILITIES / PILLARS SECTION */}
      <section id="overview" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Architectural Highlights
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Engineered for High-Velocity Service Desk Operations
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Everything modern enterprises demand: strict SLAs, proactive triage, immutable audit trails, and zero-polling real-time updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Strict Finite State Machine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ticket lifecycles transition strictly through valid business states: <code>OPEN</code> &rarr; <code>ASSIGNED</code> &rarr; <code>IN_PROGRESS</code> &rarr; <code>RESOLVED</code> &rarr; <code>CLOSED</code>. Illegal transitions like skipping resolution are blocked with HTTP 400 Bad Request.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Dual Real-Time SSE Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dual Server-Sent Events architecture: A global event bus (<code>/api/complaints/stream</code>) broadcasts state changes to supervisors, while individual push streams (<code>/api/notifications/stream/&#123;userId&#125;</code>) alert agents and customers immediately.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Stateless JJWT 0.13 &amp; RBAC
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Secure authentication via HMAC-SHA256 tokens and BCrypt encryption. Built-in granular Role-Based Access Control protecting endpoints across Customer, Support Agent, Department Manager, and System Administrator.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Department SLA Triage &amp; Risk
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamic SLA calculations calculate expected resolution targets based on priority (Urgent: 4h, High: 12h, Medium: 24h, Low: 48h). Managers are alerted to impending breaches for rapid dispatch.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              4 Core Department Queues
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dedicated isolated workflows for <strong>Technical Support</strong>, <strong>Billing &amp; Finance</strong>, <strong>Customer Service</strong>, and <strong>Facility</strong>, with specialized managers balancing live workload queues.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Immutable Audit Logging
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every status advance, note, assignment change, or escalation records an indelible audit timestamp with actor identification, providing 100% compliance transparency.
            </p>
          </div>
        </div>
      </section>

      {/* MICROSERVICES MESH ARCHITECTURE SECTION */}
      <section id="architecture" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Service Mesh Topology
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Distributed Microservices Architecture
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Fully decoupled services communicating through Spring Cloud Gateway with service discovery by Netflix Eureka.
          </p>
        </div>

        {/* Microservices Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {microservices.map((svc) => (
            <div
              key={svc.name}
              className={`p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border ${svc.border} shadow-lg hover:shadow-xl transition-all flex flex-col`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {svc.tag}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                  Port :{svc.port}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {svc.name}
              </h3>
              <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                {svc.tech}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                {svc.desc}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Swagger Docs:</span>
                <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                  :{svc.port}/swagger-ui.html
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TICKET LIFECYCLE & STATE MACHINE SECTION */}
      <section id="statemachine" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Incident State Machine
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Deterministic Ticket Lifecycle Transitions
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Tickets advance through discrete lifecycle stages strictly validated by the backend engine.
          </p>
        </div>

        {/* State machine visual cards */}
        <div className="p-8 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center mb-8">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mb-2" />
              <h4 className="font-extrabold text-xs text-amber-700 dark:text-amber-300">1. OPEN</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Logged by customer, awaits agent triage</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mb-2" />
              <h4 className="font-extrabold text-xs text-blue-700 dark:text-blue-300">2. ASSIGNED</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Allocated to a designated support agent</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mb-2" />
              <h4 className="font-extrabold text-xs text-indigo-700 dark:text-indigo-300">3. IN_PROGRESS</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Agent is actively diagnosing & fixing</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mb-2" />
              <h4 className="font-extrabold text-xs text-emerald-700 dark:text-emerald-300">4. RESOLVED</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Remedy deployed, customer confirms</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600">
              <span className="inline-block w-3 h-3 rounded-full bg-slate-500 mb-2" />
              <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">5. CLOSED</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Final closure with archived history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
              <h5 className="font-bold text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Exception Branch: ESCALATED</span>
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                If an agent encounters critical technical or SLA obstacles, tickets are flagged as <code>ESCALATED</code>, paging the Department Manager for emergency rebalancing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
              <h5 className="font-bold text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                <span>Customer Verification: REOPENED</span>
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                If the resolved ticket does not meet customer satisfaction, the customer can trigger <code>REOPENED</code>, moving the ticket back to <code>IN_PROGRESS</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ENTERPRISE ROLE PORTALS SECTION */}
      <section id="portals" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Multi-Tier Role Architecture
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Dedicated Command Centers for Every Stakeholder
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Full enterprise separation of duties across all 4 operational tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {portal.role}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                      {portal.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {portal.description}
                </p>

                <div className="space-y-2 mb-6 mt-auto">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Core Capabilities:
                  </p>
                  {portal.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Sign In to this Portal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    Register Account &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ★ DEVELOPERS & ENGINEERING TEAM SPOTLIGHT SECTION ★ */}
      <section id="team" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span>PROJECT CREATORS &amp; CORE ARCHITECTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Meet the Engineering Team
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            ResolveNow was conceptualized, architected, and engineered from the ground up by the following developers:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Member 1: Sriram Kousik Sripathi */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-gradient-to-br from-white via-white to-indigo-50/40 dark:from-slate-800/90 dark:via-slate-800/90 dark:to-indigo-950/30 backdrop-blur-xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-primary-500 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-500/30 shrink-0">
                SK
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Sriram Kousik Sripathi
                </h3>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Lead Developer &bull; Microservices Architect
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Distributed Systems &bull; Backend
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
              Spearheaded the architectural design of the ResolveNow microservices mesh, Netflix Eureka dynamic discovery, Spring Cloud API Gateway reactive ingress, stateless JJWT security pipeline, and PostgreSQL 17 relational schemas.
            </p>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/80 mt-auto">
              <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Contributions:
              </p>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>Distributed Microservices Mesh with Spring Cloud &amp; Eureka</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>API Gateway Netty Ingress, CORS Unification &amp; Routing</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>JJWT 0.13 Token Security, BCrypt Hashing &amp; RBAC Filters</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>PostgreSQL 17 JPA Repositories &amp; 22/22 Automated Tests</span>
              </div>
            </div>
          </motion.div>

          {/* Member 2: Harshith Reddy Dundi */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-gradient-to-br from-white via-white to-purple-50/40 dark:from-slate-800/90 dark:via-slate-800/90 dark:to-purple-950/30 backdrop-blur-xl border border-purple-200/80 dark:border-purple-900/60 shadow-xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-purple-500/30 shrink-0">
                HR
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Harshith Reddy Dundi
                </h3>
                <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Lead Developer &bull; UI &amp; Systems Architect
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Frontend Engineering &bull; Real-Time SSE
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
              Spearheaded the React 19 / JSX frontend design system, interactive Recharts SLA analytics, Server-Sent Events (SSE) live event streaming subscriptions, and complaint state machine validation workflows.
            </p>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/80 mt-auto">
              <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Contributions:
              </p>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <span>React 19 Enterprise Pure JSX Architecture with Tailwind &amp; Framer</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <span>Dual Server-Sent Events (SSE) Live Notification Pipeline</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <span>Ticket Lifecycle State Machine Validation &amp; Audit Logging</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <span>Department Workload Balancing &amp; Executive Dashboards</span>
              </div>
            </div>
          </motion.div>

          {/* Member 3: Nallapu Santosh Reddy */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="p-7 rounded-3xl bg-gradient-to-br from-white via-white to-teal-50/40 dark:from-slate-800/90 dark:via-slate-800/90 dark:to-teal-950/30 backdrop-blur-xl border border-teal-200/80 dark:border-teal-900/60 shadow-xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-teal-500/30 shrink-0">
                SR
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Nallapu Santosh Reddy
                </h3>
                <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Lead Developer &bull; Cloud &amp; QA Engineer
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Data Systems &bull; Test Automation
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
              Spearheaded data persistence optimization in PostgreSQL 17, assignment load balancing heuristics, event notification delivery pipelines, and comprehensive integration testing across the microservice mesh.
            </p>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/80 mt-auto">
              <p className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Contributions:
              </p>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>PostgreSQL 17 Relational Schema, Indexing &amp; Data Initializers</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>Assignment Service Load Distribution &amp; Workload Balancing</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>Notification Service Event-Driven Delivery &amp; User Alert Emitters</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <span>End-to-End Test Suite Automation &amp; Service Resilience Verification</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Joint Collaboration Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Verified Engineering Milestone: 100% Test Pass Rate
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All 7 modules compiled, tested, and validated with zero runtime regressions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              BUILD SUCCESS (22/22 Tests)
            </span>
          </div>
        </div>
      </section>

      {/* PRE-SEEDED DEMO CREDENTIALS SECTION */}
      <section id="credentials" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Interactive Evaluation
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Pre-Seeded Test Credentials
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Test accounts pre-populated in PostgreSQL across all 4 system roles. Click any email to copy!
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-xl max-w-5xl mx-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Role</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Name</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Email (Click to Copy)</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Password</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Department</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {credentials.map((c) => (
                <tr key={c.email} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopy(c.email)}
                      className="inline-flex items-center gap-1.5 font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>{c.email}</span>
                      {copiedEmail === c.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{c.pass}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{c.dept}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/login"
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition shadow-sm"
                    >
                      Login &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 py-12 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary-500 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  RESOLVENOW ENTERPRISE
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Resolve faster. Serve better.
                </p>
              </div>
            </div>

            <div className="text-center md:text-right text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Designed &amp; Developed by <strong className="text-indigo-600 dark:text-indigo-400">Sriram Kousik Sripathi</strong>, <strong className="text-purple-600 dark:text-purple-400">Harshith Reddy Dundi</strong> &amp; <strong className="text-teal-600 dark:text-teal-400">Nallapu Santosh Reddy</strong>
              </p>
              <p className="text-[11px]">
                Java 21 LTS &bull; Spring Boot 4.0.7 &bull; Spring Cloud &bull; React 19 JSX &bull; PostgreSQL 17
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
