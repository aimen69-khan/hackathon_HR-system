import { API_URL } from '../config/api.js';

export const demoUsers = [
  { id: 1, email: 'admin@hcm.test', role: 'admin' },
  { id: 2, email: 'hr@hcm.test', role: 'hr' },
  { id: 3, email: 'employee@hcm.test', role: 'employee' },
];
export const DEMO_PASSWORD = 'password123';

function normalizeUser(u) {
  if (!u) return u;
  return {
    ...u,
    id: u.id || u._id,
    employeeId: u.employeeCode || u.employeeId || null,
    employeeCode: u.employeeCode || null,
    department: u.department || null,
  };
}

export async function login(email, password, remember = true) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.toLowerCase(), password }),
  });
  if (!res.ok) {
    let msg = 'Login failed';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  const user = normalizeUser(data.user);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('token', data.token);
  storage.setItem('user', JSON.stringify(user));
  return { token: data.token, user };
}

export async function logout() {
  ['token', 'user'].forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}

export async function register(email, password, name, role = 'employee') {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.toLowerCase(), password, name, role }),
  });
  if (!res.ok) {
    let msg = 'Registration failed';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getCurrentUser() {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
