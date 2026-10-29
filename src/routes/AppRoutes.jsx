import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Login from '../pages/auth/Login.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import Organization from '../pages/admin/Organization.jsx';
import AuditLog from '../pages/admin/AuditLog.jsx';
import HRDashboard from '../pages/hr/HRDashboard.jsx';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard.jsx';
import Employees from '../pages/shared/Employees.jsx';
import EmployeeDetail from '../pages/shared/EmployeeDetail.jsx';
import Attendance from '../pages/shared/Attendance.jsx';
import Leave from '../pages/shared/Leave.jsx';
import Payroll from '../pages/shared/Payroll.jsx';
import Payslips from '../pages/employee/Payslips.jsx';
import Analytics from '../pages/shared/Analytics.jsx';
import Announcements from '../pages/shared/Announcements.jsx';
import Notifications from '../pages/shared/Notifications.jsx';
import Settings from '../pages/shared/Settings.jsx';
import NotFound from '../pages/shared/NotFound.jsx';

const shared = [['announcements', <Announcements />], ['notifications', <Notifications />], ['settings', <Settings />]];
const roleRoutes = {
  admin: [['dashboard', <AdminDashboard />], ['organization', <Organization />], ['employees', <Employees />], ['employees/:id', <EmployeeDetail />], ['attendance', <Attendance />], ['leave', <Leave />], ['payroll', <Payroll />], ['analytics', <Analytics />], ['audit', <AuditLog />]],
  hr: [['dashboard', <HRDashboard />], ['employees', <Employees />], ['employees/:id', <EmployeeDetail />], ['attendance', <Attendance />], ['leave', <Leave />], ['payroll', <Payroll />], ['analytics', <Analytics />]],
  employee: [['dashboard', <EmployeeDashboard />], ['profile', <EmployeeDetail self />], ['attendance', <Attendance />], ['leave', <Leave />], ['payslips', <Payslips />]],
};

export default function AppRoutes() {
  const { user } = useAuth();
  const { state } = useLocation();
  const back = user && state?.from?.startsWith(`/${user.role}/`) ? state.from : user && `/${user.role}/dashboard`;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={back} replace /> : <Login />} />
      {Object.entries(roleRoutes).map(([role, list]) => (
        <Route key={role} path={`/${role}`} element={<ProtectedRoute role={role} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {[...list, ...shared].map(([path, el]) => <Route key={path} path={path} element={el} />)}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      ))}
      <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />} />
      <Route path="*" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
