import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, Users, CheckCircle, Clock, AlertTriangle, 
  TrendingUp, RefreshCw, Award 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { authService } from '../../services/authService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ManagerAnalytics() {
  const { user } = useAuth();
  const { showToast } = useRealtime();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);

  const department = user?.department || 'Technical Support';

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptComplaints, deptAgents] = await Promise.all([
        complaintService.getComplaintsByDepartment(department),
        authService.getUsersByDepartment(department)
      ]);
      setComplaints(deptComplaints || []);
      setAgents((deptAgents || []).filter(u => u.role === 'AGENT'));
    } catch (err) {
      console.error(err);
      showToast('Failed to load department analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  // Compute status distribution
  const statusCounts = {
    OPEN: complaints.filter(c => c.status === 'OPEN').length,
    ASSIGNED: complaints.filter(c => c.status === 'ASSIGNED').length,
    IN_PROGRESS: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    RESOLVED: complaints.filter(c => c.status === 'RESOLVED').length,
    CLOSED: complaints.filter(c => c.status === 'CLOSED').length,
  };

  const statusPieData = [
    { name: 'Open', value: statusCounts.OPEN, color: '#f59e0b' },
    { name: 'Assigned', value: statusCounts.ASSIGNED, color: '#06b6d4' },
    { name: 'In Progress', value: statusCounts.IN_PROGRESS, color: '#6366f1' },
    { name: 'Resolved', value: statusCounts.RESOLVED, color: '#10b981' },
    { name: 'Closed', value: statusCounts.CLOSED, color: '#64748b' }
  ].filter(item => item.value > 0);

  // Compute workload per agent
  const agentWorkload = agents.map(agent => {
    const assignedTickets = complaints.filter(c => c.assignedAgentId === agent.id);
    const resolved = assignedTickets.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const active = assignedTickets.length - resolved;
    return {
      name: agent.name.split(' ')[0], // First name for chart clarity
      fullName: agent.name,
      active,
      resolved,
      total: assignedTickets.length
    };
  });

  const totalTickets = complaints.length;
  const resolvedTotal = statusCounts.RESOLVED + statusCounts.CLOSED;
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTotal / totalTickets) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            {department} Analytics & KPIs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Performance metrics, agent workloads, and SLA fulfillment for your department.
          </p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading} icon={RefreshCw}>
          Refresh Analytics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Department Tickets
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalTickets}</div>
          <div className="text-xs text-slate-400 mt-1">Lifetime department load</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Backlog
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {totalTickets - resolvedTotal}
          </div>
          <div className="text-xs text-slate-400 mt-1">In progress & assigned</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Resolution Efficiency
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {resolutionRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{resolvedTotal} tickets resolved</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Team Size
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {agents.length} Agents
          </div>
          <div className="text-xs text-slate-400 mt-1">Dedicated to {department}</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Workload BarChart */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Agent Workload Balance</h3>
              <p className="text-xs text-slate-500">Active vs Resolved tickets per support engineer</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {agentWorkload.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No active agent data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" name="Active Tickets" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Status Distribution PieChart */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Department Status Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution of tickets across lifecycle phases</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {statusPieData.length === 0 ? (
              <div className="text-xs text-slate-400">No ticket status data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Agent Scorecard
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Active Tickets</th>
                <th className="py-2.5 px-3">Resolved</th>
                <th className="py-2.5 px-3">Total Assigned</th>
                <th className="py-2.5 px-3 text-right">Throughput</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {agentWorkload.map((a) => {
                const completionRate = a.total > 0 ? Math.round((a.resolved / a.total) * 100) : 0;
                return (
                  <tr key={a.fullName}>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{a.fullName}</td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">{a.active}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{a.resolved}</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{a.total}</td>
                    <td className="py-3 px-3 text-right font-medium text-indigo-600">
                      {completionRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
