import api from './api';

export const complaintService = {
  createComplaint: async (complaintData) => {
    const res = await api.post('/complaints', complaintData);
    return res.data?.data;
  },

  getComplaints: async (params = {}) => {
    const res = await api.get('/complaints', { params });
    return res.data?.data;
  },

  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data?.data;
  },

  getComplaintByTicketNumber: async (ticketNumber) => {
    const res = await api.get(`/complaints/ticket/${ticketNumber}`);
    return res.data?.data;
  },

  getComplaintsByCustomer: async (customerId) => {
    const res = await api.get(`/complaints/customer/${customerId}`);
    return res.data?.data || [];
  },

  getComplaintsByAgent: async (agentId) => {
    const res = await api.get(`/complaints/agent/${agentId}`);
    return res.data?.data || [];
  },

  getComplaintsByDepartment: async (dept) => {
    const res = await api.get(`/complaints/department/${encodeURIComponent(dept)}`);
    return res.data?.data || [];
  },

  updateComplaint: async (id, data) => {
    const res = await api.put(`/complaints/${id}`, data);
    return res.data?.data;
  },

  updateStatus: async (id, status, remarks = '', updatedBy = '') => {
    const res = await api.patch(`/complaints/${id}/status`, { status, remarks, updatedBy });
    return res.data?.data;
  },

  updatePriority: async (id, priority, remarks = '', updatedBy = '') => {
    const res = await api.patch(`/complaints/${id}/priority`, { priority, remarks, updatedBy });
    return res.data?.data;
  },

  assignTicket: async (id, payload) => {
    const res = await api.patch(`/complaints/${id}/assign`, payload);
    return res.data?.data;
  },

  escalateTicket: async (id, payload) => {
    const res = await api.patch(`/complaints/${id}/escalate`, payload);
    return res.data?.data;
  },

  resolveTicket: async (id, resolvedBy, remarks) => {
    const res = await api.patch(`/complaints/${id}/resolve`, { resolvedBy, remarks });
    return res.data?.data;
  },

  closeTicket: async (id, closedBy, remarks) => {
    const res = await api.patch(`/complaints/${id}/close`, { closedBy, remarks });
    return res.data?.data;
  },

  reopenTicket: async (id, reopenedBy, reason) => {
    const res = await api.patch(`/complaints/${id}/reopen`, { reopenedBy, reason });
    return res.data?.data;
  },

  getActivities: async (id) => {
    const res = await api.get(`/complaints/${id}/activities`);
    return res.data?.data || [];
  },

  getAnalyticsSummary: async () => {
    const res = await api.get('/complaints/analytics/summary');
    return res.data?.data;
  },

  deleteComplaint: async (id) => {
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  }
};
