import api from './api';

export const notificationService = {
  getNotificationsByUser: async (userId) => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data?.data || [];
  },

  getUnreadNotifications: async (userId) => {
    const res = await api.get(`/notifications/unread/${userId}`);
    return res.data?.data || [];
  },

  getUnreadCount: async (userId) => {
    const res = await api.get(`/notifications/unread-count/${userId}`);
    return res.data?.data?.count || 0;
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data?.data;
  },

  markAllAsRead: async (userId) => {
    const res = await api.patch(`/notifications/user/${userId}/read-all`);
    return res.data;
  },

  getNotificationById: async (id) => {
    const res = await api.get(`/notifications/${id}`);
    return res.data?.data;
  },

  updateNotification: async (id, data) => {
    const res = await api.put(`/notifications/${id}`, data);
    return res.data?.data;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },

  clearAllNotifications: async (userId) => {
    const res = await api.delete(`/notifications/user/${userId}/clear-all`);
    return res.data;
  }
};
