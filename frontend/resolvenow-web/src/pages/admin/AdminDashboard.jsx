import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  GitPullRequest,
  BarChart3,
  Timer,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { Card, StatCard } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { StatusPieChart } from '../../components/charts/StatusPieChart';
import { PriorityBarChart } from '../../components/charts/PriorityBarChart';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const s = await complaintService.getAnalyticsSummary();
      setSummary(s);

      const page = await complaintService.getComplaints({ page: 0, size: 8 });
      setRecentTickets(page?.content || []);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl text-white shadow-2xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
            Enterprise Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            ResolveNow Executive Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time cross-service telemetry, ticket lifecycle dispatch, and SLA enforcement
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate('/admin/tickets')}
            variant="secondary"
            size="md"
            icon={Ticket}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
          >
            All Tickets
          </Button>
          <Button
            onClick={() => navigate('/admin/users')}
            variant="outline"
            size="md"
            icon={Users}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Directory
          </Button>
          <Button
            onClick={() => navigate('/admin/analytics')}
            variant="outline"
            size="md"
            icon={BarChart3}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Full Analytics
          </Button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={summary?.totalTickets ?? '...'}
          icon={Ticket}
          color="indigo"
          change="Across all enterprise departments"
        />
        <StatCard
          title="Critical Severities"
          value={summary?.criticalTickets ?? '...'}
          icon={AlertTriangle}
          color="rose"
          change="Urgent SLA queue"
        />
        <StatCard
          title="In Investigation"
          value={summary?.inProgressTickets ?? '...'}
          icon={Clock}
          color="amber"
          change="Assigned to specialist agents"
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${summary?.avgResolutionTimeHours ?? '4.2'} hrs`}
          icon={Timer}
          color="emerald"
          change="Contractual target: < 8.0 hrs"
        />
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ticket Status Distribution
              </h3>
              <p className="text-xs text-slate-500">Real-time status proportions</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <StatusPieChart data={summary?.byStatus} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Severity & Priority Allocation
              </h3>
              <p className="text-xs text-slate-500">Breakdown from Low to Critical</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <PriorityBarChart data={summary?.byPriority} />
        </Card>
      </div>

      {/* Recent Enterprise Tickets */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Global Ticket Stream
            </h3>
            <p className="text-xs text-slate-500">Most recent grievances across all business units</p>
          </div>
          <Button
            onClick={() => navigate('/admin/tickets')}
            variant="ghost"
            size="sm"
            className="text-indigo-600 font-semibold"
          >
            Manage All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3 px-2">Ticket #</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Customer</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Agent</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentTickets.map((t) => (
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
                  <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                    {t.department || 'General'}
                  </td>
                  <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                    {t.assignedAgentName || <span className="text-amber-500 font-semibold">Unassigned</span>}
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
                      Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
