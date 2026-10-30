import React, { useState } from 'react';
import { CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { complaintService } from '../../services/complaintService';

export const ResolveModal = ({ isOpen, onClose, ticket, onResolved, currentUser }) => {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please provide resolution notes detailing how the issue was fixed.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await complaintService.resolveTicket(
        ticket.id,
        currentUser?.name || 'Agent',
        remarks.trim()
      );
      if (onResolved) {
        await onResolved();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to resolve ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Ticket & Notify Customer" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Ticket Summary Card */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {ticket.ticketNumber}
            </span>
            <span className="text-slate-500">Customer: <strong className="text-slate-700 dark:text-slate-300">{ticket.customerName}</strong></span>
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {ticket.title}
          </p>

          {ticket.estimatedResolutionText && (
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 text-indigo-600 dark:text-indigo-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Target ETA: {ticket.estimatedResolutionText}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            Resolution Notes / Customer Explanation <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Explain the root cause and steps taken to resolve the issue. This update will be sent directly to the customer."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <span className="block text-[11px] text-slate-400 mt-1">
            The customer will receive an immediate push alert and email with these resolution notes.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            size="sm"
            icon={CheckCircle2}
            loading={loading}
          >
            Confirm & Mark Resolved
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResolveModal;
