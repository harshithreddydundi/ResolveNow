import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  Building2,
  GitPullRequest,
  BarChart3,
  Bell,
  Settings,
  UserCheck,
  LifeBuoy,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, isManager, isAgent, isCustomer } = useAuth();

  const getLinks = () => {
    if (isAdmin) {
      return [
        { label: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'All Tickets', path: '/admin/tickets', icon: Ticket },
        { label: 'User Directory', path: '/admin/users', icon: Users },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Assignments', path: '/admin/assignments', icon: GitPullRequest },
        { label: 'Analytics & SLA', path: '/admin/analytics', icon: BarChart3 },
        { label: 'System Settings', path: '/admin/settings', icon: Settings },
        { label: 'Notifications', path: '/notifications', icon: Bell },
      ];
    }

    if (isManager) {
      return [
        { label: 'Manager Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
        { label: 'Dept Tickets', path: '/manager/tickets', icon: Ticket },
        { label: 'Assignments', path: '/manager/assignments', icon: GitPullRequest },
        { label: 'Team Workload', path: '/manager/team', icon: UserCheck },
        { label: 'Analytics', path: '/manager/analytics', icon: BarChart3 },
        { label: 'Notifications', path: '/notifications', icon: Bell },
      ];
    }

    if (isAgent) {
      return [
        { label: 'Agent Workspace', path: '/agent/dashboard', icon: LayoutDashboard },
        { label: 'My Assigned Queue', path: '/agent/tickets', icon: Ticket },
        { label: 'Notifications', path: '/notifications', icon: Bell },
      ];
    }

    // Default: Customer
    return [
      { label: 'Service Portal', path: '/dashboard', icon: LayoutDashboard },
      { label: 'My Tickets', path: '/tickets', icon: Ticket },
      { label: 'Create New Ticket', path: '/tickets/create', icon: PlusCircle },
      { label: 'Notifications', path: '/notifications', icon: Bell },
    ];
  };

  const links = getLinks();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="p-4">
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-primary-50 dark:from-indigo-950/40 dark:to-primary-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            {user?.department ? user.department : 'Customer Portal'}
          </p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
            {user?.name || 'Logged in user'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Support Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <NavLink
          to="/home"
          className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
        >
          <Info className="w-4 h-4" />
          <span>About Platform &amp; Team</span>
        </NavLink>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <LifeBuoy className="w-4 h-4 text-indigo-500" />
            <span>Need IT assistance?</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Internal Ext: #4400 (24/7 Desk)
          </p>
        </div>
      </div>
    </aside>
  );
};
