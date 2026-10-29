export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  let res;
  try {
    res = await fetch(url, { headers: getHeaders(), ...options });
  } catch {
    throw new Error('Cannot reach the server. Start backend: cd backend && npm start');
  }
  if (!res.ok) {
    let msg = `API Error: ${res.status}`;
    try {
      const body = await res.json();
      msg = body.error || body.message || msg;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
};
