// Organization setup data. Replace with API responses later (see services/).
export const departments = [
  { id: 'd1', name: 'Engineering', head: 'Hamza Siddiqui', active: true },
  { id: 'd2', name: 'Human Resources', head: 'Bilal Ahmed', active: true },
  { id: 'd3', name: 'Finance', head: 'Sana Qureshi', active: true },
  { id: 'd4', name: 'Sales', head: 'Usman Malik', active: true },
  { id: 'd5', name: 'Marketing', head: 'Noor Sheikh', active: true },
  { id: 'd6', name: 'Operations', head: 'Imran Hussain', active: true },
  { id: 'd7', name: 'Support', head: 'Rabia Khan', active: true },
];

export const designations = [
  ['Engineering', 'Software Engineer', 'Engineering Manager'],
  ['Human Resources', 'HR Executive', 'HR Manager'],
  ['Finance', 'Accountant', 'Finance Manager'],
  ['Sales', 'Sales Executive', 'Sales Lead'],
  ['Marketing', 'Content Strategist', 'Marketing Manager'],
  ['Operations', 'Operations Analyst', 'Operations Lead'],
  ['Support', 'Support Agent', 'Support Lead'],
].flatMap(([department, ...names], i) =>
  names.map((name, j) => ({ id: `g${i * 2 + j + 1}`, name, department, active: true }))
);

export const leaveTypes = [
  { id: 'l1', name: 'Annual', quota: 20, paid: 'Paid', active: true },
  { id: 'l2', name: 'Sick', quota: 10, paid: 'Paid', active: true },
  { id: 'l3', name: 'Casual', quota: 8, paid: 'Paid', active: true },
  { id: 'l4', name: 'Unpaid', quota: 0, paid: 'Unpaid', active: true },
];

export const holidays = [
  { id: 'h1', name: 'Eid Milad-un-Nabi', date: '2026-08-26' },
  { id: 'h2', name: 'Iqbal Day', date: '2026-11-09' },
  { id: 'h3', name: "Quaid-e-Azam's Birthday", date: '2026-12-25' },
  { id: 'h4', name: 'Kashmir Solidarity Day', date: '2027-02-05' },
];

export const hrUsers = [
  { id: 'u2', name: 'Bilal Ahmed', email: 'hr@hcm.test', department: 'Human Resources', active: true },
  { id: 'u5', name: 'Mehwish Sheikh', email: 'mehwish@hcm.test', department: 'Human Resources', active: true },
  { id: 'u6', name: 'Asad Hussain', email: 'asad@hcm.test', department: 'Human Resources', active: false },
];

export const companySettings = {
  companyName: 'Northwind Technologies',
  officeStart: '09:00',
  officeEnd: '18:00',
  graceMinutes: 15,
  weekend: 'Saturday, Sunday',
  officeLocation: 'Plot 12, Shahrah-e-Faisal, Karachi',
  radiusMeters: 150,
};
