import React from 'react';
import {
  FilePlus,
  ArrowRightCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  CheckCheck,
  User,
} from 'lucide-react';

export const ActivityHistory = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATED':
        return <FilePlus className="w-4 h-4 text-blue-500" />;
      case 'ASSIGNED':
        return <ArrowRightCircle className="w-4 h-4 text-indigo-500" />;
      case 'STATUS_CHANGED':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ESCALATED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'CLOSED':
        return <CheckCheck className="w-4 h-4 text-slate-500" />;
      case 'REOPENED':
        return <RotateCcw className="w-4 h-4 text-orange-500" />;
      default:
        return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (activities.length === 0) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
        No activity logs recorded yet.
      </p>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {activities.map((act) => (
        <div key={act.id} className="relative flex items-start gap-3">
          <div className="absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-slate-900 ring-4 ring-white dark:ring-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            {getActionIcon(act.action)}
          </div>
          <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {act.action.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400">
                {formatTimestamp(act.timestamp)}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {act.description}
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1.5">
              By: {act.performedBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityHistory;
