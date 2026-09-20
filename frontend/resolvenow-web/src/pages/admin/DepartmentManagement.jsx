import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, CheckCircle, Clock, AlertTriangle, ArrowRight, 
  ShieldCheck, RefreshCw, Briefcase, Plus 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { authService } from '../../services/authService';
import { complaintService } from '../../services/complaintService';
import { useRealtime } from '../../context/RealtimeContext';

export default function DepartmentManagement() {
  const { showToast } = useRealtime();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const departmentsList = [
    { name: 'Technical Support', code: 'TECH', description: 'Hardware, software bugs, API integration, and system connectivity issues.' },
    { name: 'Billing & Finance', code: 'FIN', description: 'Invoices, payment gateway errors, chargebacks, and refund escalations.' },
    { name: 'Logistics & Delivery', code: 'LOG', description: 'Order tracking, warehouse distribution, dispatch delay, and shipment damages.' },
    { name: 'Customer Support', code: 'CS', description: 'General service inquiries, customer onboarding, feedback, and basic triage.' },
    { name: 'IT Operations', code: 'OPS', description: 'Internal infrastructure, server reliability, VPN access, and corporate security.' },
    { name: 'Product Management', code: 'PROD', description: 'Feature requests, UX enhancements, and system behavior feedback.' }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, compData] = await Promise.all([
        authService.getAllUsers(),
        complaintService.getComplaints({ size: 100 })
      ]);
      setUsers(userData || []);
      setComplaints(compData?.content || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load department data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDeptStats = (deptName) => {
    const deptUsers = users.filter(u => u.department === deptName);
    const managers = deptUsers.filter(u => u.role === 'DEPARTMENT_MANAGER');
    const agents = deptUsers.filter(u => u.role === 'AGENT');
    const deptComplaints = complaints.filter(c => c.department === deptName);
    const openTickets = deptComplaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED');
    const resolvedTickets = deptComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');

    return {
      manager: managers[0]?.name || 'Unassigned',
      managerEmail: managers[0]?.email || '',
      agentsCount: agents.length,
      agents,
      totalTickets: deptComplaints.length,
      openTickets: openTickets.length,
      resolvedTickets: resolvedTickets.length,
      resolutionRate: deptComplaints.length > 0 
        ? Math.round((resolvedTickets.length / deptComplaints.length) * 100) 
        : 100
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Department & Team Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor organizational units, department leadership, agent staffing, and resolution capacity.
          </p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading} icon={RefreshCw}>
          Refresh Overview
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Departments</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{departmentsList.length} Units</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Support Agents</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {users.filter(u => u.role === 'AGENT').length} Staff
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department Managers</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {users.filter(u => u.role === 'DEPARTMENT_MANAGER').length} Leads
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg SLA Compliance</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.8%</div>
        </Card>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentsList.map((dept, index) => {
          const stats = getDeptStats(dept.name);
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {dept.code}
                    </span>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {dept.description}
                </p>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      Department Lead:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {stats.manager}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      Assigned Agents:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {stats.agentsCount} agents
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Open Workload:
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {stats.openTickets} tickets
                    </span>
                  </div>

                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Resolution Rate</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{stats.resolutionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${stats.resolutionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={ArrowRight}
                    onClick={() => {
                      setSelectedDept({ ...dept, ...stats });
                      setIsModalOpen(true);
                    }}
                  >
                    View Team Members
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Department Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDept ? `${selectedDept.name} Roster` : 'Department Details'}
      >
        {selectedDept && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">Department Lead</div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white mt-0.5">
                {selectedDept.manager}
              </div>
              <div className="text-xs text-slate-500">{selectedDept.managerEmail}</div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Active Staff Members ({selectedDept.agents.length})
              </h4>
              {selectedDept.agents.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-4 text-center">
                  No dedicated agents assigned to this department yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedDept.agents.map((agent) => (
                    <div 
                      key={agent.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{agent.name}</div>
                        <div className="text-slate-500 text-[11px]">{agent.email}</div>
                      </div>
                      <Badge variant="primary" label="Support Agent" size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
