import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { StatCard, Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { StatusPieChart } from '../../components/charts/StatusPieChart';
import { PriorityBarChart } from '../../components/charts/PriorityBarChart';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { lastComplaintEvent } = useRealtime();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomerTickets = async () => {
    if (!user?.id) return;
    try {
      const data = await complaintService.getComplaintsByCustomer(user.id);
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerTickets();
  }, [user?.id]);

  // Auto refresh when SSE event arrives
  useEffect(() => {
    if (lastComplaintEvent) {
      loadCustomerTickets();
    }
  }, [lastComplaintEvent]);

  // Derived statistics
  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const criticalCount = tickets.filter((t) => t.priority === 'CRITICAL').length;

  const statusDistribution = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const priorityDistribution = tickets.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-600 to-primary-700 rounded-3xl text-white shadow-xl shadow-indigo-500/10">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            Customer Self-Service Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Good day, {user?.name || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
            Track grievances, submit technical inquiries, and receive live progress alerts directly from our specialist teams.
          </p>
        </div>
        <Button
          onClick={() => navigate('/tickets/create')}
          variant="secondary"
          size="md"
          icon={PlusCircle}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold shrink-0 shadow-lg"
        >
          Create New Ticket
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={openCount}
          icon={Ticket}
          color="blue"
          change="Pending initial triage"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={Clock}
          color="amber"
          change="Under active investigation"
        />
        <StatCard
          title="Resolved Tickets"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          change="Completed resolution"
        />
        <StatCard
          title="Critical Issues"
          value={criticalCount}
          icon={AlertTriangle}
          color="rose"
          change="Expedited SLA queue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ticket Status Breakdown
              </h3>
              <p className="text-xs text-slate-500">Live distribution of your logged issues</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <StatusPieChart data={statusDistribution} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Priority Distribution
              </h3>
              <p className="text-xs text-slate-500">Breakdown across severity tiers</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <PriorityBarChart data={priorityDistribution} />
        </Card>
      </div>

      {/* Recent Tickets Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Grievances & Tickets
            </h3>
            <p className="text-xs text-slate-500">Your latest submitted requests</p>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All ({tickets.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3 px-2">Ticket #</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No tickets found. Submit your first issue using the button above.
                  </td>
                </tr>
              ) : (
                tickets.slice(0, 6).map((t) => (
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
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                      {t.department || 'General'}
                    </td>
                    <td className="py-3 px-2">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t.id}`);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600"
                      >
                        Details
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
