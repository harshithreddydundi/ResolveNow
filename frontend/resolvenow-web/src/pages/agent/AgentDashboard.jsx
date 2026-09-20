import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { Card, StatCard } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

export const AgentDashboard = () => {
  const { user } = useAuth();
  const { lastComplaintEvent } = useRealtime();
  const navigate = useNavigate();

  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAgentTickets = async () => {
    if (!user?.id) return;
    try {
      const data = await complaintService.getComplaintsByAgent(user.id);
      setAssignedTickets(data);
    } catch (err) {
      console.error('Failed to load agent tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgentTickets();
  }, [user?.id]);

  useEffect(() => {
    if (lastComplaintEvent) {
      loadAgentTickets();
    }
  }, [lastComplaintEvent]);

  const assignedCount = assignedTickets.filter((t) => t.status === 'ASSIGNED').length;
  const inProgressCount = assignedTickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedCount = assignedTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const criticalCount = assignedTickets.filter((t) => t.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-teal-700 to-indigo-800 rounded-3xl text-white shadow-xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            Agent Operational Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Welcome, {user?.name || 'Agent'}!
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1">
            Department: {user?.department || 'General IT Support'} | Dedicated Queue Management
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Assigned Queue"
          value={assignedCount}
          icon={Ticket}
          color="indigo"
          change="Pending initial review"
        />
        <StatCard
          title="Active In Progress"
          value={inProgressCount}
          icon={Clock}
          color="amber"
          change="Under active fix"
        />
        <StatCard
          title="Resolved by You"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          change="Successful resolutions"
        />
        <StatCard
          title="Critical Escalations"
          value={criticalCount}
          icon={AlertTriangle}
          color="rose"
          change="Priority attention"
        />
      </div>

      {/* Assigned Tickets Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Assigned Workload ({assignedTickets.length})
            </h3>
            <p className="text-xs text-slate-500">Tickets assigned directly to your desk</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3 px-2">Ticket #</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Customer</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {assignedTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Your assigned queue is currently clear! Excellent work.
                  </td>
                </tr>
              ) : (
                assignedTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {t.customerName}
                    </td>
                    <td className="py-3 px-2">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t.id}`);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 font-semibold"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
