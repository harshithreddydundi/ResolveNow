import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

// Public Home / Landing Page
import { HomePage } from '../pages/home/HomePage';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Unauthorized } from '../pages/auth/Unauthorized';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { CustomerTickets } from '../pages/customer/CustomerTickets';
import { CreateTicket } from '../pages/customer/CreateTicket';
import { TicketDetail } from '../pages/customer/TicketDetail';

// Agent Pages
import { AgentDashboard } from '../pages/agent/AgentDashboard';
import { AgentTickets } from '../pages/agent/AgentTickets';

// Manager Pages
import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { DepartmentTickets } from '../pages/manager/DepartmentTickets';
import { TeamWorkload } from '../pages/manager/TeamWorkload';
import ManagerAssignments from '../pages/manager/ManagerAssignments';
import ManagerAnalytics from '../pages/manager/ManagerAnalytics';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AllTickets } from '../pages/admin/AllTickets';
import UserManagement from '../pages/admin/UserManagement';
import DepartmentManagement from '../pages/admin/DepartmentManagement';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Shared Pages
import NotificationsPage from '../pages/shared/NotificationsPage';
import ProfilePage from '../pages/shared/ProfilePage';

// Root Dispatcher based on authenticated user's role
const RoleHomeRedirect = () => {
  const { user, isAdmin, isManager, isAgent } = useAuth();
  
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (isManager) return <Navigate to="/manager/dashboard" replace />;
  if (isAgent) return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<HomePage />} />

      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Authenticated Application Layout */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/portal" element={<RoleHomeRedirect />} />
        <Route path="/app" element={<RoleHomeRedirect />} />

        {/* Customer Portal */}
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/tickets" element={<CustomerTickets />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/tickets" element={<CustomerTickets />} />
        <Route path="/customer/create-ticket" element={<CreateTicket />} />

        {/* Support Agent Workspace */}
        <Route 
          path="/agent/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
              <AgentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent/tickets" 
          element={
            <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
              <AgentTickets />
            </ProtectedRoute>
          } 
        />

        {/* Department Manager Portal */}
        <Route 
          path="/manager/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/tickets" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <DepartmentTickets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/assignments" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <ManagerAssignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/team" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <TeamWorkload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/workload" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <TeamWorkload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/analytics" 
          element={
            <ProtectedRoute allowedRoles={['DEPARTMENT_MANAGER', 'ADMIN']}>
              <ManagerAnalytics />
            </ProtectedRoute>
          } 
        />

        {/* System Administration Command Center */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tickets" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AllTickets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/departments" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DepartmentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/assignments" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManagerAssignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />

        {/* Shared Authenticated Routes */}
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
