export const notificationsByRole = {
  employee: [
    { id: 'n1', text: 'Your leave request was approved.', time: '2h ago', read: false },
    { id: 'n2', text: 'Your payslip for September is available.', time: 'Yesterday', read: false },
    { id: 'n3', text: 'Your attendance correction was rejected.', time: '2 days ago', read: true },
    { id: 'n4', text: 'New company announcement: Q4 town hall.', time: '3 days ago', read: true },
  ],
  hr: [
    { id: 'n1', text: '3 leave requests are waiting for approval.', time: '1h ago', read: false },
    { id: 'n2', text: '2 attendance corrections need review.', time: '4h ago', read: false },
    { id: 'n3', text: 'October payroll draft is ready to review.', time: 'Yesterday', read: true },
  ],
  admin: [
    { id: 'n1', text: 'September payroll was finalized.', time: '3h ago', read: false },
    { id: 'n2', text: 'HR user Asad Hussain was deactivated.', time: 'Yesterday', read: false },
    { id: 'n3', text: 'New company announcement published.', time: '2 days ago', read: true },
  ],
};
