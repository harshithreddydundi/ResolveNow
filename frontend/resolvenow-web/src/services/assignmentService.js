import api from './api';

export const assignmentService = {
  assignTicket: async (complaintId, data) => {
    const res = await api.post(`/assignments/${complaintId}/assign`, data);
    return res.data?.data;
  },

  createAssignment: async (data) => {
    const res = await api.post('/assignments', data);
    return res.data?.data;
  },

  getAllAssignments: async () => {
    const res = await api.get('/assignments');
    return res.data?.data || [];
  },

  getAssignmentByComplaint: async (complaintId) => {
    const res = await api.get(`/assignments/complaint/${complaintId}`);
    return res.data?.data;
  },

  getAssignmentsByAgent: async (agentId) => {
    const res = await api.get(`/assignments/agent/${agentId}`);
    return res.data?.data || [];
  },

  getAssignmentsByDepartment: async (dept) => {
    const res = await api.get(`/assignments/department/${encodeURIComponent(dept)}`);
    return res.data?.data || [];
  },

  reassignTicket: async (complaintId, data) => {
    const res = await api.post(`/assignments/${complaintId}/reassign`, data);
    return res.data?.data;
  },

  escalateAssignment: async (complaintId, data) => {
    const res = await api.post(`/assignments/${complaintId}/escalate`, data);
    return res.data?.data;
  },

  getHistory: async (complaintId) => {
    const res = await api.get(`/assignments/history/${complaintId}`);
    return res.data?.data || [];
  },

  getWorkload: async () => {
    const res = await api.get('/assignments/workload');
    return res.data?.data || [];
  }
};
