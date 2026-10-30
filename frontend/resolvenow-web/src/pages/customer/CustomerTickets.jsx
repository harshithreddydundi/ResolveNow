import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, PlusCircle, Filter, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const loadTickets = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await complaintService.getComplaintsByCustomer(user.id);
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.department?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statuses = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            My Service Tickets
          </h1>
          <p className="text-xs text-slate-500">
            View, filter, and track lifecycle resolution of your submitted issues
          </p>
        </div>
        <Button
          onClick={() => navigate('/tickets/create')}
          variant="primary"
          size="md"
          icon={PlusCircle}
        >
          Create New Ticket
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket #, title, or dept..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Ticket Table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="You don't have any tickets matching your search or filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="pb-3 px-2">Ticket #</th>
                  <th className="pb-3 px-2">Title</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Department</th>
                  <th className="pb-3 px-2">Priority</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2">Target Resolution</th>
                  <th className="pb-3 px-2">Created</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {t.category}
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                      {t.department || 'General'}
                    </td>
                    <td className="py-3.5 px-2">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3.5 px-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3.5 px-2">
                      {t.status === 'RESOLVED' || t.status === 'CLOSED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resolved
                        </span>
                      ) : t.estimatedResolutionText ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[140px]">{t.estimatedResolutionText}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">TBD</span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${t.id}`);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
