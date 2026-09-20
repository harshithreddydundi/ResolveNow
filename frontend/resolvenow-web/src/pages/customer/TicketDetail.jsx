import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building,
  User,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  GitPullRequest,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';
import { ActivityHistory } from '../../components/tickets/ActivityHistory';
import { AssignModal } from '../../components/tickets/AssignModal';

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isManager, isAgent, isCustomer } = useAuth();
  const { lastComplaintEvent } = useRealtime();

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const loadTicketData = async () => {
    try {
      const data = await complaintService.getComplaintById(id);
      setTicket(data);
      const acts = await complaintService.getActivities(id);
      setActivities(acts);
    } catch (err) {
      console.error('Failed to load ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
  }, [id]);

  // Real-time refresh when complaint event occurs
  useEffect(() => {
    if (lastComplaintEvent && lastComplaintEvent.data?.id?.toString() === id.toString()) {
      loadTicketData();
    }
  }, [lastComplaintEvent, id]);

  const handleStatusChange = async (newStatus, remarks = '') => {
    setActionLoading(true);
    try {
      await complaintService.updateStatus(id, newStatus, remarks, user?.name || 'Staff');
      await loadTicketData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    const notes = prompt('Enter resolution notes:');
    if (notes === null) return;
    setActionLoading(true);
    try {
      await complaintService.resolveTicket(id, user?.name || 'Agent', notes || 'Resolved by agent');
      await loadTicketData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return;
    setActionLoading(true);
    try {
      await complaintService.closeTicket(id, user?.name || 'Customer', 'Closed by customer confirmation');
      await loadTicketData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopen = async () => {
    const reason = prompt('Please explain why the issue is being reopened:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await complaintService.reopenTicket(id, user?.name || 'Customer', reason);
      await loadTicketData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async () => {
    const reason = prompt('Enter justification for escalation:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await complaintService.escalateTicket(id, {
        reason,
        targetDepartment: ticket.department,
        escalatedBy: user?.name || 'Manager',
      });
      await loadTicketData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Ticket not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header with back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {ticket.ticketNumber}
              </span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        {/* Role-specific Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Manager / Admin Assign button */}
          {(isAdmin || isManager) && (
            <>
              <Button
                onClick={() => setShowAssignModal(true)}
                variant="outline"
                size="sm"
                icon={GitPullRequest}
              >
                Assign / Reassign
              </Button>
              {ticket.status !== 'ESCALATED' && (
                <Button
                  onClick={handleEscalate}
                  variant="danger"
                  size="sm"
                  icon={AlertTriangle}
                  loading={actionLoading}
                >
                  Escalate
                </Button>
              )}
            </>
          )}

          {/* Agent status controls */}
          {(isAgent || isAdmin || isManager) && (
            <>
              {ticket.status === 'ASSIGNED' && (
                <Button
                  onClick={() => handleStatusChange('IN_PROGRESS', 'Agent commenced investigation')}
                  variant="primary"
                  size="sm"
                  icon={Clock}
                  loading={actionLoading}
                >
                  Start Working
                </Button>
              )}
              {ticket.status === 'IN_PROGRESS' && (
                <>
                  <Button
                    onClick={() => handleStatusChange('WAITING_FOR_CUSTOMER', 'Requested customer feedback')}
                    variant="secondary"
                    size="sm"
                    loading={actionLoading}
                  >
                    Wait for Customer
                  </Button>
                  <Button
                    onClick={handleResolve}
                    variant="success"
                    size="sm"
                    icon={CheckCircle2}
                    loading={actionLoading}
                  >
                    Mark Resolved
                  </Button>
                </>
              )}
            </>
          )}

          {/* Customer controls */}
          {ticket.status === 'RESOLVED' && (
            <>
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                icon={CheckCircle2}
                loading={actionLoading}
              >
                Confirm & Close
              </Button>
              <Button
                onClick={handleReopen}
                variant="danger"
                size="sm"
                icon={RotateCcw}
                loading={actionLoading}
              >
                Reopen Ticket
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <Card className="p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Resolution Lifecycle
        </h3>
        <TicketTimeline status={ticket.status} />
      </Card>

      {/* Main Grid: Details & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Grievance Details
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>
          </Card>

          {/* Activity History Audit Trail */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Activity Audit History ({activities.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Real-time synchronized
              </span>
            </div>
            <ActivityHistory activities={activities} />
          </Card>
        </div>

        {/* Right Col: Metadata Box */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Ticket Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  {ticket.department || 'Unassigned'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Specialist</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  {ticket.assignedAgentName || 'Awaiting Agent Assignment'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Logged By (Customer)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {ticket.customerName} ({ticket.customerEmail || 'No email'})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {ticket.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Submission Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>

              {ticket.resolvedAt && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Resolved Date</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {new Date(ticket.resolvedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {ticket.closedAt && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Closed Date</span>
                  <span className="font-semibold text-slate-500">
                    {new Date(ticket.closedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          ticket={ticket}
          onAssigned={loadTicketData}
        />
      )}
    </div>
  );
};
