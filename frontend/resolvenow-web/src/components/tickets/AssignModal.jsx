import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { authService } from '../../services/authService';
import { assignmentService } from '../../services/assignmentService';

export const AssignModal = ({ isOpen, onClose, ticket, onAssigned }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [workloads, setWorkloads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, ticket]);

  const loadData = async () => {
    try {
      const depts = await authService.getDepartments();
      setDepartments(depts);
      const initialDept = ticket?.department || depts[0] || 'Technical Support';
      setSelectedDept(initialDept);

      const allAgents = await authService.getUsersByRole('AGENT');
      setAgents(allAgents);

      const wl = await assignmentService.getWorkload();
      setWorkloads(wl);
    } catch (err) {
      console.error('Failed to load assignment options:', err);
    }
  };

  const handleDeptChange = (dept) => {
    setSelectedDept(dept);
    setSelectedAgentId('');
  };

  const filteredAgents = agents.filter(
    (a) => !selectedDept || a.department === selectedDept || !a.department
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const chosenAgent = agents.find((a) => a.id.toString() === selectedAgentId.toString());

      await assignmentService.reassignTicket(ticket.id, {
        newDepartment: selectedDept,
        newAgentId: chosenAgent ? chosenAgent.id : null,
        newAgentName: chosenAgent ? chosenAgent.name : null,
        remarks: remarks || 'Assigned via dispatch dashboard',
        reassignedBy: 'Manager',
      });

      if (onAssigned) onAssigned();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAgentWorkloadCount = (agentId) => {
    const item = workloads.find((w) => w.agentId === agentId);
    return item ? item.activeTickets : 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Ticket #${ticket?.ticketNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => handleDeptChange(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Assign Specialist Agent
          </label>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Unassigned (Department Queue) --</option>
            {filteredAgents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.department || 'General'}) - Active: {getAgentWorkloadCount(ag.id)} tickets
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Assignment Remarks / Notes
          </label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Reason for routing or special instructions for the agent..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Save Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignModal;

