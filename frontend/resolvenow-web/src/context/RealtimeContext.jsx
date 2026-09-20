import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';
import { API_BASE_URL } from '../services/api';

const RealtimeContext = createContext(null);

export const RealtimeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [lastComplaintEvent, setLastComplaintEvent] = useState(null);

  const [isConnected, setIsConnected] = useState(false);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const showToast = useCallback((msgOrObj, type = 'info') => {
    if (typeof msgOrObj === 'string') {
      addToast({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message: msgOrObj,
        type: type,
      });
    } else if (msgOrObj && typeof msgOrObj === 'object') {
      addToast(msgOrObj);
    }
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchUnread = useCallback(async () => {
    if (!user?.id) return;
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
      const list = await notificationService.getNotificationsByUser(user.id);
      setNotifications(list);
    } catch (e) {
      console.warn('Could not fetch unread notifications:', e.message);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUnread();
    }
  }, [isAuthenticated, user?.id, fetchUnread]);

  // Connect to SSE streams
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let userEventSource = null;
    let complaintEventSource = null;

    try {
      // 1. User notifications SSE stream
      userEventSource = new EventSource(`${API_BASE_URL}/notifications/stream/${user.id}`);

      userEventSource.onopen = () => {
        setIsConnected(true);
      };

      userEventSource.onerror = () => {
        setIsConnected(false);
      };

      userEventSource.addEventListener('NEW_NOTIFICATION', (event) => {
        try {
          setIsConnected(true);
          const data = JSON.parse(event.data);
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
          addToast({
            title: data.title || 'New Notification',
            message: data.message,
            type: data.type || 'INFO',
          });
        } catch (err) {
          console.error('Error parsing SSE notification event:', err);
        }
      });

      // 2. Global Complaint lifecycle SSE stream
      complaintEventSource = new EventSource(`${API_BASE_URL}/complaints/stream`);

      complaintEventSource.onopen = () => {
        setIsConnected(true);
      };

      const handleComplaintUpdate = (event) => {
        try {
          setIsConnected(true);
          const data = JSON.parse(event.data);
          setLastComplaintEvent({ type: event.type, data, timestamp: Date.now() });
        } catch (err) {
          console.error('Error parsing SSE complaint event:', err);
        }
      };

      complaintEventSource.addEventListener('TICKET_CREATED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_STATUS_CHANGED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_ASSIGNED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_ESCALATED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_RESOLVED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_CLOSED', handleComplaintUpdate);
      complaintEventSource.addEventListener('TICKET_REOPENED', handleComplaintUpdate);
    } catch (err) {
      console.warn('SSE connection initialization error:', err);
      setIsConnected(false);
    }

    return () => {
      if (userEventSource) userEventSource.close();
      if (complaintEventSource) complaintEventSource.close();
      setIsConnected(false);
    };
  }, [isAuthenticated, user?.id, addToast]);

  return (
    <RealtimeContext.Provider
      value={{
        unreadCount,
        notifications,
        toasts,
        addToast,
        showToast,
        removeToast,
        isConnected,
        lastComplaintEvent,
        refreshNotifications: fetchUnread,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
