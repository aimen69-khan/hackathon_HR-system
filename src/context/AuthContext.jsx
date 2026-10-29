import { createContext, useContext, useState } from 'react';
import * as auth from '../services/authService.js';

const AuthContext = createContext(null);
const KEY = 'hcm.session';
const TOKEN_KEY = 'token';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY)); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);
  const login = async (email, password, remember) => {
    const { user: u, token } = await auth.login(email, password);
    const store = remember ? localStorage : sessionStorage;
    store.setItem(KEY, JSON.stringify(u));
    store.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };
  const logout = () => { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
