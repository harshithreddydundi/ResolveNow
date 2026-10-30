import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FilePlus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { authService } from '../../services/authService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    department: 'Technical Support',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState(null);

  useEffect(() => {
    authService.getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-suggest department based on category
      if (name === 'category') {
        switch (value) {
          case 'TECHNICAL': next.department = 'Technical Support'; break;
          case 'BILLING': next.department = 'Billing & Finance'; break;
          case 'ACCOUNT': next.department = 'Account Management'; break;
          case 'SERVICE': next.department = 'Customer Service'; break;
          case 'FACILITY': next.department = 'Facility'; break;
          default: next.department = 'Customer Service'; break;
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        customerId: user?.id || 1,
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || 'customer@resolvenow.com',
      };

      const result = await complaintService.createComplaint(payload);
      setCreatedTicket(result);
    } catch (err) {
      setError(err.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Log Grievance / Service Request
        </h1>
        <p className="text-xs text-slate-500">
          Submit an issue ticket to our enterprise automated escalation engine
        </p>
      </div>

      <AnimatePresence mode="wait">
        {createdTicket ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl p-8 text-center shadow-xl space-y-6"
          >
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Ticket Created Successfully
              </span>
              <h2 className="text-3xl font-mono font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {createdTicket.ticketNumber}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                Your ticket has been registered, auto-routed to{' '}
                <strong className="text-slate-800 dark:text-slate-200">{createdTicket.department}</strong>,
                and an email alert has been dispatched.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Issue Title:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                  {createdTicket.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {createdTicket.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {createdTicket.status}
                </span>
              </div>
              {createdTicket.estimatedResolutionText && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-indigo-600 dark:text-indigo-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Target Resolution:
                  </span>
                  <span>{createdTicket.estimatedResolutionText}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setCreatedTicket(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'TECHNICAL',
                    priority: 'MEDIUM',
                    department: 'Technical Support',
                  });
                }}
              >
                Log Another Issue
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                onClick={() => navigate(`/tickets/${createdTicket.id}`)}
              >
                View Ticket Details
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Ticket Subject / Summary *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    minLength={5}
                    maxLength={200}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Database connection pool exhaustion during peak hours"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Issue Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="TECHNICAL">TECHNICAL</option>
                      <option value="BILLING">BILLING</option>
                      <option value="ACCOUNT">ACCOUNT</option>
                      <option value="SERVICE">SERVICE</option>
                      <option value="FACILITY">FACILITY</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Severity / Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="LOW">LOW - Minor inconvenience</option>
                      <option value="MEDIUM">MEDIUM - Standard inquiry</option>
                      <option value="HIGH">HIGH - Urgent system impact</option>
                      <option value="CRITICAL">CRITICAL - Outage / Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Comprehensive Description *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.description.length} / 4000 characters
                    </span>
                  </div>
                  <textarea
                    rows="5"
                    name="description"
                    required
                    minLength={10}
                    maxLength={4000}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide specific error codes, reproduction steps, affected systems, or invoice reference numbers..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Auto-escalation rules apply upon submission</span>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    icon={FilePlus}
                  >
                    Submit Grievance
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
