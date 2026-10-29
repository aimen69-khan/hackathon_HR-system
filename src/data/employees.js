import { departments, designations } from './departments.js';

const people = [
  ['Ayesha', 'F'], ['Bilal', 'M'], ['Sara', 'F'], ['Hamza', 'M'], ['Fatima', 'F'], ['Usman', 'M'],
  ['Zainab', 'F'], ['Ali', 'M'], ['Maryam', 'F'], ['Omar', 'M'], ['Hina', 'F'], ['Daniyal', 'M'],
  ['Noor', 'F'], ['Imran', 'M'], ['Sana', 'F'], ['Talha', 'M'], ['Iqra', 'F'], ['Faisal', 'M'],
  ['Rabia', 'F'], ['Kamran', 'M'], ['Mehwish', 'F'], ['Asad', 'M'], ['Laiba', 'F'], ['Junaid', 'M'],
];
const surnames = ['Raza', 'Ahmed', 'Khan', 'Siddiqui', 'Malik', 'Sheikh', 'Qureshi', 'Hussain'];

export const employees = Array.from({ length: 48 }, (_, i) => {
  const [first, gender] = people[i % people.length];
  const department = departments[i % departments.length].name;
  const options = designations.filter((d) => d.department === department);
  const joined = new Date(Date.UTC(2019 + (i % 7), (i * 5) % 12, 1 + ((i * 3) % 27)));
  const name = `${first} ${surnames[(i * 3 + 1) % surnames.length]}`;
  return {
    id: `EMP-${1001 + i}`,
    name,
    email: `${first.toLowerCase()}.${1001 + i}@northwind.test`,
    phone: `+92 300 ${String(1000000 + i * 7919).slice(0, 7)}`,
    address: `House ${10 + i}, Block ${(i % 9) + 1}, Karachi`,
    department,
    designation: options[i % options.length].name,
    status: i % 11 === 10 ? 'Resigned' : i % 7 === 3 ? 'On probation' : 'Active',
    joiningDate: joined.toISOString().slice(0, 10),
    salary: 90000 + ((i * 7919) % 12) * 15000,
    gender: gender === 'F' ? 'Female' : 'Male',
    employmentType: i % 9 === 0 ? 'Contract' : 'Full-time',
    manager: departments[i % departments.length].head,
  };
});

export const CURRENT_EMPLOYEE_ID = 'EMP-1005';
export const CURRENT_HR_ID = 'EMP-1002';
export const csvSample = `code,name,email,department,designation,joiningDate,salary
EMP-2001,Hassan Ali,hassan@northwind.test,Engineering,Software Engineer,2026-09-01,120000
EMP-2002,Amna Tariq,amna@northwind.test,Finance,Accountant,2026-09-15,95000
EMP-2003,,bad-email,Marketing,Content Strategist,2026-09-20,88000
EMP-2004,Zeeshan Ali,zeeshan@northwind.test,Space Travel,Pilot,2026-10-01,150000`;
