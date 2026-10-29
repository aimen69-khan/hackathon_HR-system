const tone = {
  Active: 'ok', Present: 'ok', Approved: 'ok', Finalized: 'ok', Paid: 'ok', Valid: 'ok',
  Late: 'warn', Pending: 'warn', Draft: 'warn', 'On probation': 'warn', 'Half day': 'info', 'Missing checkout': 'warn', Reviewed: 'info', 'On leave': 'info',
  Absent: 'bad', Rejected: 'bad', Resigned: 'bad', Invalid: 'bad', Inactive: 'bad',
};
export default function StatusBadge({ status }) {
  return <span className={`badge ${tone[status] || ''}`}>{status}</span>;
}
