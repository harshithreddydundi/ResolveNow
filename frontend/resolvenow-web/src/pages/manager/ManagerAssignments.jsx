import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Search, Filter, RefreshCw, AlertCircle, 
  ArrowUpRight, Clock, ShieldAlert, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AssignModal from '../../components/tickets/AssignModal';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { authService } from '../../services/authService';

export default function ManagerAssignments() {
  const { user } = useAuth();
  const { showToast } = useRealtime();
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

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
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department]);

  const handleOpenAssign = (ticket) => {
    setSelectedTicket(ticket);
    setIsAssignModalOpen(true);
  };

  const filteredTickets = complaints.filter(c => {
    const matchesSearch = 
      c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.assignedAgentName && c.assignedAgentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unassignedCount = complaints.filter(c => !c.assignedAgentId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Department Ticket Dispatch & Assignment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dispatch, rebalance, and reassign tickets among agents in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{department}</span>.
          </p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading} icon={RefreshCw}>
          Refresh Queue
        </Button>
      </div>

      {/* Unassigned Warning Banner */}
      {unassignedCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {unassignedCount} Ticket{unassignedCount > 1 ? 's' : ''} awaiting immediate assignment!
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-400">
                Unassigned tickets risk breaching initial response SLA targets.
              </div>
            </div>
          </div>
          <Button 
            variant="warning" 
            size="sm"
            onClick={() => setStatusFilter('OPEN')}
          >
            Filter Unassigned
          </Button>
        </div>
      )}

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket #, title, or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN (Unassigned)</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets Queue Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium text-xs">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-2 text-xs">Loading department queue...</p>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                    No tickets found in department queue.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <Link 
                        to={`/tickets/${t.id}`}
                        className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:underline block"
                      >
                        {t.ticketNumber}
                      </Link>
                      <span className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">
                        {t.title}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          t.priority === 'CRITICAL' ? 'danger' :
                          t.priority === 'HIGH' ? 'warning' :
                          t.priority === 'MEDIUM' ? 'primary' : 'neutral'
                        }
                        label={t.priority}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                          t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'success' :
                          t.status === 'IN_PROGRESS' ? 'primary' :
                          t.status === 'ASSIGNED' ? 'warning' : 'neutral'
                        }
                        label={t.status}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {t.assignedAgentName ? (
                        <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {t.assignedAgentName}
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={t.assignedAgentId ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleOpenAssign(t)}
                      >
                        {t.assignedAgentId ? 'Reassign' : 'Assign Agent'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assign Modal */}
      {selectedTicket && (
        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          ticket={selectedTicket}
          onAssigned={loadData}
        />
      )}
    </div>
  );
}
