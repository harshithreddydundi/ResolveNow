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
  FileText,
  Sparkles,
  ShieldCheck,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import { complaintService } from '../../services/complaintService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';
import { ActivityHistory } from '../../components/tickets/ActivityHistory';
import { AssignModal } from '../../components/tickets/AssignModal';
import { ResolveModal } from '../../components/tickets/ResolveModal';

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
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    department: 'Technical Support',
  });

  const handleOpenEdit = () => {
    setEditFormData({
      title: ticket?.title || '',
      description: ticket?.description || '',
      priority: ticket?.priority || 'MEDIUM',
      department: ticket?.department || 'Technical Support',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await complaintService.updateComplaint(id, editFormData);
      await loadTicketData();
      setShowEditModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticket?.ticketNumber}? This action cannot be undone.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await complaintService.deleteComplaint(id);
      navigate(-1);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleResolve = () => {
    setShowResolveModal(true);
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

  const resolveActivity = activities.find((a) => a.action === 'RESOLVED');

  const extractResolutionNotes = () => {
    if (ticket?.resolutionNotes) return ticket.resolutionNotes;
    if (resolveActivity?.description) {
      const match = resolveActivity.description.match(/Resolution notes:\s*(.*)$/i);
      if (match && match[1]) return match[1].trim();
      return resolveActivity.description.replace(/^Ticket marked as resolved\.?/i, '').trim();
    }
    return null;
  };

  const solutionText = extractResolutionNotes();
  const solverName = ticket?.resolvedBy || resolveActivity?.performedBy || ticket?.assignedAgentName || 'Support Specialist';
  const resolvedDate = ticket?.resolvedAt || resolveActivity?.timestamp;
  const isResolvedOrClosed = ticket?.status === 'RESOLVED' || ticket?.status === 'CLOSED';

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

          {/* Edit & Delete Controls (Full CRUD capability) */}
          {(isAdmin || isManager || (isCustomer && ticket.customerId === user?.id)) && (
            <Button
              onClick={handleOpenEdit}
              variant="outline"
              size="sm"
              icon={Edit3}
            >
              Edit
            </Button>
          )}

          {(isAdmin || isManager) && (
            <Button
              onClick={handleDeleteTicket}
              variant="danger"
              size="sm"
              icon={Trash2}
              loading={actionLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Target Resolution / ETA Banner for customer transparency */}
      {ticket.estimatedResolutionText && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Target Resolution Window
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {ticket.estimatedResolutionText}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
            SLA Commitment Active
          </span>
        </div>
      )}

      {/* Resolved Confirmation Banner */}
      {ticket.status === 'RESOLVED' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Issue Resolved by {solverName}
              </span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Resolution submitted on {resolvedDate ? new Date(resolvedDate).toLocaleString() : 'Today'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review the official solution below to confirm closure or request further assistance.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
            Awaiting Customer Confirmation
          </span>
        </div>
      )}

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
          {/* Official Agent Solution Card */}
          {(isResolvedOrClosed || solutionText) && (
            <Card className="border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20 space-y-4 shadow-md shadow-emerald-500/5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 dark:border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                        Official Agent Solution
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300">
                        {ticket.status === 'CLOSED' ? 'Resolved & Closed' : 'Issue Fixed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Provided by <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{solverName}</strong>
                      {resolvedDate && (
                        <span> on {new Date(resolvedDate).toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                </div>

                {ticket.status === 'RESOLVED' && (
                  <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Awaiting Customer Verification
                  </span>
                )}
              </div>

              {/* Solution Description Box */}
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-800/80 rounded-xl border border-emerald-200/90 dark:border-emerald-800/80 shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resolution Details & Explanation:</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-medium">
                  {solutionText || 'The assigned specialist has resolved this issue. Please check your service and verify.'}
                </p>
              </div>

              {/* Confirmation / Reopen Actions for Customer */}
              {ticket.status === 'RESOLVED' && (
                <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Does this solution fix your problem?
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      If satisfied, confirm closure. If the problem persists, you can reopen with details.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={handleClose}
                      variant="success"
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
                  </div>
                </div>
              )}

              {/* Closed Status Notice */}
              {ticket.status === 'CLOSED' && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Ticket verified and officially closed on{' '}
                    {ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'today'}.
                  </span>
                </div>
              )}
            </Card>
          )}

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

              {ticket.estimatedResolutionText && (
                <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold block mb-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Target Resolution (ETA)
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                    {ticket.estimatedResolutionText}
                  </span>
                  {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                    <span className="block text-[10px] text-indigo-500/80 dark:text-indigo-300/80 mt-0.5">
                      Service desk team committed resolution
                    </span>
                  )}
                </div>
              )}

              {(ticket.resolvedAt || resolvedDate) && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved by {solverName}
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-200 text-xs block">
                    {new Date(ticket.resolvedAt || resolvedDate).toLocaleString()}
                  </span>
                  {solutionText && (
                    <span className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 block italic line-clamp-2">
                      "{solutionText}"
                    </span>
                  )}
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

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveModal
          isOpen={showResolveModal}
          onClose={() => setShowResolveModal(false)}
          ticket={ticket}
          onResolved={loadTicketData}
          currentUser={user}
        />
      )}

      {/* Edit Ticket Modal (Full CRUD Update) */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Ticket #${ticket?.ticketNumber}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Priority
                </label>
                <select
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Department
                </label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Finance">Billing & Finance</option>
                  <option value="Logistics & Delivery">Logistics & Delivery</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="IT Operations">IT Operations</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={actionLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
