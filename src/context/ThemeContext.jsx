import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('hcm.theme') || 'light');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('hcm.theme', theme); }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
