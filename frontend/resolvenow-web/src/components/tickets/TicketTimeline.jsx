import React from 'react';
import { Check, Clock, AlertTriangle, RotateCcw } from 'lucide-react';

export const TicketTimeline = ({ status }) => {
  const steps = [
    { key: 'OPEN', label: 'Ticket Logged' },
    { key: 'ASSIGNED', label: 'Department Assigned' },
    { key: 'IN_PROGRESS', label: 'Work In Progress' },
    { key: 'RESOLVED', label: 'Issue Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'OPEN': return 0;
      case 'ASSIGNED': return 1;
      case 'IN_PROGRESS':
      case 'WAITING_FOR_CUSTOMER':
      case 'ESCALATED': return 2;
      case 'RESOLVED': return 3;
      case 'CLOSED': return 4;
      case 'REOPENED': return 2;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      {/* Special status alert banners */}
      {status === 'ESCALATED' && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>This ticket has been ESCALATED for urgent management attention.</span>
        </div>
      )}
      {status === 'REOPENED' && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-xl text-orange-700 dark:text-orange-300 text-xs font-semibold">
          <RotateCcw className="w-4 h-4 text-orange-500" />
          <span>This ticket was REOPENED by customer. Investigation resumed.</span>
        </div>
      )}

      {/* Progress Track */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 -z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 shadow-md shadow-indigo-500/40'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-spin text-white" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] sm:max-w-none ${
                isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
