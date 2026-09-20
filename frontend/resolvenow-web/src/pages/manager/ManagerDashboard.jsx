import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Ticket,
  Clock,
  AlertTriangle,
  Users,
  GitPullRequest,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { assignmentService } from '../../services/assignmentService';
import { Card, StatCard } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { AssignModal } from '../../components/tickets/AssignModal';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deptTickets, setDeptTickets] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dept = user?.department || 'Technical Support';

  const loadData = async () => {
    try {
      const tickets = await complaintService.getComplaintsByDepartment(dept);
      setDeptTickets(tickets);
      const wl = await assignmentService.getWorkload();
      setWorkloads(wl);
    } catch (err) {
      console.error('Error loading manager dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dept]);

  const openCount = deptTickets.filter((t) => t.status === 'OPEN').length;
  const inProgCount = deptTickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length;
  const escalatedCount = deptTickets.filter((t) => t.status === 'ESCALATED').length;
  const criticalCount = deptTickets.filter((t) => t.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl text-white shadow-xl">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            Department Leadership Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            {dept} Command
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Manager: {user?.name || 'Department Manager'} | Workload distribution & escalation monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/manager/assignments')}
            variant="secondary"
            size="md"
            icon={GitPullRequest}
            className="bg-white text-indigo-700 hover:bg-blue-50 font-bold"
          >
            Dispatch & Routing
          </Button>
          <Button
            onClick={() => navigate('/manager/team')}
            variant="secondary"
            size="md"
            icon={Users}
            className="bg-white/20 hover:bg-white/30 text-white font-bold"
          >
            Team Workload
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Unassigned / Open"
          value={openCount}
          icon={Ticket}
          color="blue"
          change="Requires routing"
        />
        <StatCard
          title="Active In Investigation"
          value={inProgCount}
          icon={Clock}
          color="amber"
          change="Agent assigned"
        />
        <StatCard
          title="Department Escalations"
          value={escalatedCount}
          icon={AlertTriangle}
          color="rose"
          change="High SLA risk"
        />
        <StatCard
          title="Critical Severity"
          value={criticalCount}
          icon={AlertTriangle}
          color="purple"
          change="Priority queue"
        />
      </div>

      {/* Tickets Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Department Issues Queue ({deptTickets.length})
            </h3>
            <p className="text-xs text-slate-500">Live feed for {dept}</p>
          </div>
          <Button
            onClick={() => navigate('/manager/tickets')}
            variant="ghost"
            size="sm"
            className="text-indigo-600 font-semibold"
          >
            View Full List
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="pb-3 px-2">Ticket #</th>
                <th className="pb-3 px-2">Title</th>
                <th className="pb-3 px-2">Assigned Agent</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {deptTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No tickets currently in department queue.
                  </td>
                </tr>
              ) : (
                deptTickets.slice(0, 8).map((t) => (
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
                      {t.assignedAgentName || (
                        <span className="text-amber-500 font-semibold">Unassigned</span>
                      )}
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
                          setSelectedTicket(t);
                          setShowAssignModal(true);
                        }}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                      >
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showAssignModal && selectedTicket && (
        <AssignModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onAssigned={loadData}
        />
      )}
    </div>
  );
};
