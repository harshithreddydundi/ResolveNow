import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, ShieldCheck, Activity } from 'lucide-react';
import { assignmentService } from '../../services/assignmentService';
import { Card } from '../../components/common/Card';

export const TeamWorkload = () => {
  const [workloads, setWorkloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assignmentService.getWorkload()
      .then(setWorkloads)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">LOW LOAD</span>;
      case 'OPTIMAL':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">OPTIMAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">HIGH LOAD</span>;
      case 'OVERLOADED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse">OVERLOADED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Agent Workload & Dispatch Balancing
        </h1>
        <p className="text-xs text-slate-500">
          Real-time workload distribution to prevent agent burnout and maintain contractual SLA commitments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workloads.map((agent) => {
          const percentage = Math.min((agent.activeTickets / 10) * 100, 100);

          return (
            <Card key={agent.agentId} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {agent.agentName}
                  </h3>
                  <p className="text-xs text-slate-500">{agent.department}</p>
                </div>
                {getStatusBadge(agent.workloadStatus)}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Active Grievances:</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                    {agent.activeTickets} tickets
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      agent.activeTickets > 6
                        ? 'bg-rose-500'
                        : agent.activeTickets > 3
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 min</span>
                  <span>Capacity Threshold: 10</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  Live balanced
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  ID: #{agent.agentId}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
