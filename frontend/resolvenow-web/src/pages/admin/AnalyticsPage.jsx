import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle, 
  RefreshCw, Filter, ArrowUpRight, ArrowDownRight, Layers, ShieldAlert 
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import StatusPieChart from '../../components/charts/StatusPieChart';
import PriorityBarChart from '../../components/charts/PriorityBarChart';
import { complaintService } from '../../services/complaintService';
import { useRealtime } from '../../context/RealtimeContext';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { showToast } = useRealtime();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [sumData, compData] = await Promise.all([
        complaintService.getAnalyticsSummary(),
        complaintService.getComplaints({ size: 100 })
      ]);
      setSummary(sumData);
      setComplaints(compData?.content || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load system analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Department distribution
  const deptDataMap = {};
  complaints.forEach(c => {
    const dept = c.department || 'General';
    if (!deptDataMap[dept]) {
      deptDataMap[dept] = { department: dept, total: 0, resolved: 0, open: 0 };
    }
    deptDataMap[dept].total += 1;
    if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
      deptDataMap[dept].resolved += 1;
    } else {
      deptDataMap[dept].open += 1;
    }
  });
  const deptChartData = Object.values(deptDataMap);

  // Mock trend data for ticket flow over past 7 days
  const weeklyTrends = [
    { day: 'Mon', created: 8, resolved: 6 },
    { day: 'Tue', created: 12, resolved: 9 },
    { day: 'Wed', created: 15, resolved: 14 },
    { day: 'Thu', created: 10, resolved: 11 },
    { day: 'Fri', created: 18, resolved: 16 },
    { day: 'Sat', created: 6, resolved: 8 },
    { day: 'Sun', created: 4, resolved: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Executive Service Desk Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time telemetry, SLA compliance, department throughput, and operational metrics.
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} disabled={loading} icon={RefreshCw}>
          Refresh Metrics
        </Button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Ingested Tickets
            </span>
            <span className="flex items-center text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +14% vs last wk
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {summary?.totalComplaints || complaints.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across all enterprise channels</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Backlog
            </span>
            <span className="flex items-center text-xs text-amber-600 font-medium">
              Needs triage
            </span>
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {(summary?.byStatus?.OPEN || 0) + (summary?.byStatus?.ASSIGNED || 0) + (summary?.byStatus?.IN_PROGRESS || 0)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary?.byStatus?.OPEN || 0} Open • {summary?.byStatus?.IN_PROGRESS || 0} In Progress
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Resolution Rate
            </span>
            <span className="flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-0.5" />
              Optimal
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {complaints.length > 0 
              ? Math.round((((summary?.byStatus?.RESOLVED || 0) + (summary?.byStatus?.CLOSED || 0)) / complaints.length) * 100)
              : 88}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Target SLA adherence: &gt; 90%</div>
        </Card>

        <Card className="p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Critical Escalations
            </span>
            <span className="flex items-center text-xs text-rose-600 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 mr-0.5" />
              High Priority
            </span>
          </div>
          <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            {(summary?.byPriority?.CRITICAL || 0) + (summary?.byPriority?.HIGH || 0)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {summary?.byPriority?.CRITICAL || 0} Critical • {summary?.byPriority?.HIGH || 0} High
          </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume & Resolution Velocity */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Ticket Velocity Trend</h3>
              <p className="text-xs text-slate-500">Inflow vs Resolved tickets over the past 7 days</p>
            </div>
            <Badge variant="primary" label="7 Days" size="sm" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="created" name="New Tickets" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Volume Comparison */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Department Throughput</h3>
              <p className="text-xs text-slate-500">Open backlog vs resolved tickets per unit</p>
            </div>
            <Badge variant="neutral" label="By Unit" size="sm" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" name="Open" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Breakdown Donuts & Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusPieChart byStatus={summary?.byStatus} />
        <PriorityBarChart byPriority={summary?.byPriority} />
      </div>

      {/* SLA Compliance Table */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Department SLA Benchmarks</h3>
            <p className="text-xs text-slate-500">Standard targets and current performance</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Target First Response</th>
                <th className="py-2.5 px-3">Target Resolution</th>
                <th className="py-2.5 px-3">Actual Mean Time</th>
                <th className="py-2.5 px-3">Compliance Rate</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <tr>
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">Technical Support</td>
                <td className="py-3 px-3 text-slate-500">&lt; 15 mins</td>
                <td className="py-3 px-3 text-slate-500">&lt; 4 hours</td>
                <td className="py-3 px-3 font-semibold text-indigo-600">2.8 hrs</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">96.2%</span>
                    <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '96.2%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right"><Badge variant="success" label="Optimal" size="sm" /></td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">Billing & Finance</td>
                <td className="py-3 px-3 text-slate-500">&lt; 30 mins</td>
                <td className="py-3 px-3 text-slate-500">&lt; 8 hours</td>
                <td className="py-3 px-3 font-semibold text-indigo-600">5.1 hrs</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">92.4%</span>
                    <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '92.4%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right"><Badge variant="success" label="Optimal" size="sm" /></td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">Logistics & Delivery</td>
                <td className="py-3 px-3 text-slate-500">&lt; 20 mins</td>
                <td className="py-3 px-3 text-slate-500">&lt; 6 hours</td>
                <td className="py-3 px-3 font-semibold text-indigo-600">4.5 hrs</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">89.1%</span>
                    <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '89.1%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right"><Badge variant="warning" label="Warning" size="sm" /></td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">Customer Support</td>
                <td className="py-3 px-3 text-slate-500">&lt; 10 mins</td>
                <td className="py-3 px-3 text-slate-500">&lt; 2 hours</td>
                <td className="py-3 px-3 font-semibold text-indigo-600">1.2 hrs</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">98.5%</span>
                    <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '98.5%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right"><Badge variant="success" label="Optimal" size="sm" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
