import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, GitPullRequest, ChevronLeft, ChevronRight } from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { authService } from '../../services/authService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { AssignModal } from '../../components/tickets/AssignModal';

export const AllTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    authService.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (department) params.department = department;

      const res = await complaintService.getComplaints(params);
      setTickets(res?.content || []);
      setTotalPages(res?.totalPages || 1);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page, status, priority, department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    loadTickets();
  };

  const handleDelete = async (id, ticketNum) => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticketNum}?`)) {
      return;
    }
    try {
      await complaintService.deleteComplaint(id);
      loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Global Ticket Management
          </h1>
          <p className="text-xs text-slate-500">
            Search, filter, route, and supervise all {totalElements} complaints across departments
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <Card className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket #, title, customer, or agent..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Status select */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="REOPENED">REOPENED</option>
            </select>

            {/* Priority select */}
            <select
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            {/* Department select */}
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(0); }}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <Button type="submit" variant="primary" size="sm">
              Apply Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Table */}
      <Card>
        {tickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="No tickets match the search query and selected filter options."
          />
        ) : (
          <>
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
                    <th className="pb-3 px-2">Created</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {tickets.map((t) => (
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
                        {t.assignedAgentName || <span className="text-amber-500 font-bold">Unassigned</span>}
                      </td>
                      <td className="py-3 px-2">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-2 text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                            setShowAssignModal(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition"
                          title="Assign ticket"
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id, t.ticketNumber);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition"
                          title="Delete ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>
                Page {page + 1} of {totalPages} ({totalElements} tickets)
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  icon={ChevronLeft}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {showAssignModal && selectedTicket && (
        <AssignModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          onAssigned={loadTickets}
        />
      )}
    </div>
  );
};
