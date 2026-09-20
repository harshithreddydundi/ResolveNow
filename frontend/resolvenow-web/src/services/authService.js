import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data?.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data?.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data?.data;
  },

  getAllUsers: async () => {
    const res = await api.get('/auth/users');
    return res.data?.data || [];
  },

  getUserById: async (id) => {
    const res = await api.get(`/auth/users/${id}`);
    return res.data?.data;
  },

  getUsersByRole: async (role) => {
    const res = await api.get(`/auth/users/role/${role}`);
    return res.data?.data || [];
  },

  getUsersByDepartment: async (dept) => {
    const res = await api.get(`/auth/users/department/${encodeURIComponent(dept)}`);
    return res.data?.data || [];
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/auth/users/${id}`, data);
    return res.data?.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/auth/users/${id}`);
    return res.data;
  },

  getDepartments: async () => {
    const res = await api.get('/auth/departments');
    return res.data?.data || [];
  }
};
