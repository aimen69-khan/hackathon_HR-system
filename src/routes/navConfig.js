import { BarChart3, Bell, Building2, CalendarCheck, CalendarDays, FileText, LayoutDashboard, Megaphone, ScrollText, Settings, UserCircle, Users, Wallet } from 'lucide-react';

const item = (label, icon, path) => ({ label, icon, path });
const dash = item('Dashboard', LayoutDashboard, 'dashboard');
const common = [item('Announcements', Megaphone, 'announcements'), item('Notifications', Bell, 'notifications')];
const settings = item('Settings', Settings, 'settings');

export const NAV = {
  admin: [dash, item('Organization', Building2, 'organization'), item('Employees', Users, 'employees'), item('Attendance', CalendarCheck, 'attendance'), item('Leave', CalendarDays, 'leave'), item('Payroll', Wallet, 'payroll'), item('Analytics', BarChart3, 'analytics'), ...common, item('Audit Log', ScrollText, 'audit'), settings],
  hr: [dash, item('Employees', Users, 'employees'), item('Attendance', CalendarCheck, 'attendance'), item('Leave', CalendarDays, 'leave'), item('Payroll', Wallet, 'payroll'), item('Analytics', BarChart3, 'analytics'), ...common, settings],
  employee: [dash, item('My Profile', UserCircle, 'profile'), item('My Attendance', CalendarCheck, 'attendance'), item('My Leave', CalendarDays, 'leave'), item('My Payslips', FileText, 'payslips'), ...common, settings],
};
export const ROLE_LABEL = { admin: 'Admin', hr: 'HR', employee: 'Employee' };
